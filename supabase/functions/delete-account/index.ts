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

        // Delete shares
        await supabaseAdmin.from('zakat_calculation_shares').delete().eq('owner_id', user.id);

        // Delete calculations
        await supabaseAdmin.from('zakat_calculations').delete().eq('user_id', user.id);

        // Delete profile
        // Try both 'id' and 'user_id' to be safe, or just 'id' if we knew schema. 
        // Based on client code using 'user_id', we'll use that. 
        // But usually profiles.id IS the user_id. We'll try user_id matches.
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
