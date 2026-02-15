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

        // --- Decryption Helper (Match Encryption in plaid-exchange-token) ---
        async function decryptToken(encryptedBase64: string, masterKey: string): Promise<string> {
            const enc = new TextEncoder();

            // 1. Decode Base64
            const binaryStr = atob(encryptedBase64);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
            }

            // 2. Extract Salt (16), IV (12), and Ciphertext
            // Layout: [Salt 16] [IV 12] [Ciphertext...]
            const salt = bytes.slice(0, 16);
            const iv = bytes.slice(16, 28);
            const data = bytes.slice(28);

            // 3. Import Master Key
            const keyMaterial = await crypto.subtle.importKey(
                "raw",
                enc.encode(masterKey),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            // 4. Derive Decryption Key using extracted Salt
            const key = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 100000,
                    hash: "SHA-256"
                },
                keyMaterial,
                { name: "AES-GCM", length: 256 },
                false,
                ["decrypt"]
            );

            // 5. Decrypt
            const decryptedBuffer = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                data
            );

            return new TextDecoder().decode(decryptedBuffer);
        }

        // 2a. Revoke Plaid Tokens (Compliance)
        // Access tokens should be encrypted in a real prod env, here we simply retrieve them.
        // In the next step, we will verify if encryption is active and decrypt if necessary.
        // For now, let's fetch items and attempt revocation.

        const plaidClientId = Deno.env.get("PLAID_CLIENT_ID");
        const plaidSecret = Deno.env.get("PLAID_SECRET");
        const plaidEnv = Deno.env.get("PLAID_ENV") || "sandbox";

        if (plaidClientId && plaidSecret) {
            console.log("Plaid credentials found. Checking for connected items...");
            const { data: plaidItems } = await supabaseAdmin
                .from("plaid_items")
                .select("access_token")
                .eq("user_id", user.id);

            if (plaidItems && plaidItems.length > 0) {
                console.log(`Found ${plaidItems.length} Plaid items to revoke.`);

                const PLAID_ENVIRONMENTS: Record<string, string> = {
                    sandbox: "https://sandbox.plaid.com",
                    development: "https://development.plaid.com",
                    production: "https://production.plaid.com",
                };
                const baseUrl = PLAID_ENVIRONMENTS[plaidEnv];

                for (const item of plaidItems) {
                    try {
                        const encryptedToken = item.access_token;
                        // Decrypt using the same key (ANON KEY for this demo)
                        // In prod, ensure this key matches what was used to encrypt.
                        const decryptedToken = await decryptToken(encryptedToken, Deno.env.get("PLAID_ENCRYPTION_KEY")!);

                        console.log("Revoking Plaid access token...");
                        await fetch(`${baseUrl}/item/remove`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                client_id: plaidClientId,
                                secret: plaidSecret,
                                access_token: decryptedToken
                            })
                        });
                    } catch (err) {
                        console.error("Failed to revoke Plaid token (continuing deletion):", err);
                    }
                }
            }
        }

        // 2b. Delete Plaid items (cascades to plaid_accounts, plaid_holdings)
        await supabaseAdmin.from("plaid_items").delete().eq("user_id", user.id);

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
