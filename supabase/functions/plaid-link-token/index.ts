/**
 * Plaid Link Token Edge Function
 * 
 * Creates a Plaid Link token for the frontend to initialize Plaid Link.
 * 
 * Required environment variables:
 * - PLAID_CLIENT_ID
 * - PLAID_SECRET
 * - PLAID_ENV (sandbox, development, production)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "npm:plaid@26.0.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Get auth user
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            throw new Error("Missing authorization header");
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        });

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error("Unauthorized");
        }

        // Initialize Plaid client
        const plaidEnv = Deno.env.get("PLAID_ENV") || "sandbox";
        const configuration = new Configuration({
            basePath: PlaidEnvironments[plaidEnv],
            baseOptions: {
                headers: {
                    "PLAID-CLIENT-ID": Deno.env.get("PLAID_CLIENT_ID"),
                    "PLAID-SECRET": Deno.env.get("PLAID_SECRET"),
                },
            },
        });

        const plaidClient = new PlaidApi(configuration);

        // Create Link token
        const response = await plaidClient.linkTokenCreate({
            user: {
                client_user_id: user.id,
            },
            client_name: "ZakatFlow",
            products: [Products.Investments, Products.Transactions],
            country_codes: [CountryCode.Us],
            language: "en",
            // Optional: specify webhook for updates
            // webhook: `${supabaseUrl}/functions/v1/plaid-webhook`,
        });

        return new Response(
            JSON.stringify({
                link_token: response.data.link_token,
                expiration: response.data.expiration,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error creating Plaid Link token:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
