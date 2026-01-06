/**
 * Plaid Link Token Edge Function
 * 
 * Creates a Plaid Link token for the frontend to initialize Plaid Link.
 * Uses direct HTTP calls to Plaid API (no npm SDK needed).
 * 
 * Required environment variables:
 * - PLAID_CLIENT_ID
 * - PLAID_SECRET
 * - PLAID_ENV (sandbox, development, production)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Plaid API base URLs by environment
const PLAID_URLS: Record<string, string> = {
    sandbox: "https://sandbox.plaid.com",
    development: "https://development.plaid.com",
    production: "https://production.plaid.com",
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

        // Get Plaid credentials
        const plaidClientId = Deno.env.get("PLAID_CLIENT_ID");
        const plaidSecret = Deno.env.get("PLAID_SECRET");
        const plaidEnv = Deno.env.get("PLAID_ENV") || "sandbox";

        if (!plaidClientId || !plaidSecret) {
            throw new Error("Plaid credentials not configured");
        }

        const plaidBaseUrl = PLAID_URLS[plaidEnv] || PLAID_URLS.sandbox;

        console.log(`Creating Plaid Link token for user ${user.id} in ${plaidEnv} environment`);

        // Create Link token via Plaid API
        const response = await fetch(`${plaidBaseUrl}/link/token/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: plaidClientId,
                secret: plaidSecret,
                user: {
                    client_user_id: user.id,
                },
                client_name: "ZakatFlow",
                products: ["investments", "transactions"],
                country_codes: ["US"],
                language: "en",
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Plaid API error:", data);
            throw new Error(data.error_message || "Failed to create Link token");
        }

        console.log("Link token created successfully");

        return new Response(
            JSON.stringify({
                link_token: data.link_token,
                expiration: data.expiration,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error creating Plaid Link token:", errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
