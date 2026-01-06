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
        console.log("Starting Plaid Link Token creation...");

        // Get auth user
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            console.error("Missing Auth Header");
            throw new Error("Missing authorization header");
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        });

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error("Auth Error or No User:", authError);
            throw new Error("Unauthorized");
        }

        console.log(`User authenticated: ${user.id}`);

        // Check for secrets
        const clientId = Deno.env.get("PLAID_CLIENT_ID");
        const secret = Deno.env.get("PLAID_SECRET");
        const plaidEnv = Deno.env.get("PLAID_ENV") || "sandbox";

        // Log configuration (masking secrets)
        console.log("Configuration Check:");
        console.log(`- PLAID_ENV: ${plaidEnv}`);
        console.log(`- PLAID_CLIENT_ID: ${clientId ? "Set (ends with " + clientId.slice(-4) + ")" : "MISSING"}`);
        console.log(`- PLAID_SECRET: ${secret ? "Set (starts with " + secret.slice(0, 4) + ")" : "MISSING"}`);

        if (!clientId || !secret) {
            throw new Error("Missing PLAID_CLIENT_ID or PLAID_SECRET environment variables. Please check your Supabase Secrets.");
        }

        // Initialize Plaid client
        const configuration = new Configuration({
            basePath: PlaidEnvironments[plaidEnv],
            baseOptions: {
                headers: {
                    "PLAID-CLIENT-ID": clientId,
                    "PLAID-SECRET": secret,
                },
            },
        });

        const plaidClient = new PlaidApi(configuration);

        console.log("Requesting Link Token from Plaid...");

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

        console.log("Link Token received successfully");

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

        // Return 200 with error body so client can parse the message
        // instead of getting generic "non-2x status code"
        const errorMessage = error.response?.data?.error_message
            || error.response?.data?.error_code
            || error.message
            || "Unknown error";

        console.error("Returning error to client:", errorMessage);

        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 200, // Intentional: Pass error to client parser
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
