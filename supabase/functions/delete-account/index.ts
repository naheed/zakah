import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_ANON_KEY") ?? "",
            {
                global: {
                    headers: { Authorization: req.headers.get("Authorization")! },
                },
            }
        );

        // 1. Get the user from the authorization header
        // We trust this because the Auth header is verified by Supabase Edge Runtime
        const {
            data: { user },
            error: userError,
        } = await supabaseClient.auth.getUser();

        if (userError || !user) {
            console.error("User validation failed:", userError);
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        console.log(`Request to delete account for user: ${user.id}`);

        // 2. Initialize Admin Client to perform deletion
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 3. Clean up user data (admin client bypasses RLS)
        // We delete in order of dependencies (shares -> calculations -> profile -> auth)

        console.log("Cleaning up user data...");

        // 0. Clean up Assets (Manual Cascade)
        // 1. Get portfolios to find accounts
        const { data: portfolios } = await supabaseAdmin.from('portfolios').select('id').eq('user_id', user.id);
        const portfolioIds = portfolios?.map(p => p.id) || [];

        if (portfolioIds.length > 0) {
            // 2. Get accounts
            const { data: accounts } = await supabaseAdmin.from('asset_accounts').select('id').in('portfolio_id', portfolioIds);
            const accountIds = accounts?.map(a => a.id) || [];

            if (accountIds.length > 0) {
                // 3. Get snapshots
                const { data: snapshots } = await supabaseAdmin.from('asset_snapshots').select('id').in('account_id', accountIds);
                const snapshotIds = snapshots?.map(s => s.id) || [];

                if (snapshotIds.length > 0) {
                    // 4. Delete line items
                    await supabaseAdmin.from('asset_line_items').delete().in('snapshot_id', snapshotIds);
                    // 5. Delete snapshots
                    await supabaseAdmin.from('asset_snapshots').delete().in('id', snapshotIds);
                }
                // 6. Delete accounts
                await supabaseAdmin.from('asset_accounts').delete().in('id', accountIds);
            }
            // 7. Delete portfolios
            await supabaseAdmin.from('portfolios').delete().in('id', portfolioIds);
        }

        // Delete shares
        await supabaseAdmin.from('zakat_calculation_shares').delete().eq('owner_id', user.id);

        // Delete calculations
        await supabaseAdmin.from('zakat_calculations').delete().eq('user_id', user.id);

        // Delete profile
        await supabaseAdmin.from('profiles').delete().eq('user_id', user.id);

        // 4. Delete the user from Auth
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
            user.id
        );

        if (deleteError) {
            console.error("Error deleting user:", deleteError);
            throw deleteError;
        }

        console.log(`Successfully deleted user ${user.id}`);

        return new Response(
            JSON.stringify({ success: true, message: "Account deleted successfully" }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error) {
        console.error("Unexpected error:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
