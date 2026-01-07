/**
 * Plaid Link Token Edge Function
 * 
 * Creates a Plaid Link token for the frontend to initialize Plaid Link.
 * Uses direct Fetch API calls for Deno compatibility.
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

// Map environment name to Plaid API base URL
const PLAID_ENVIRONMENTS: Record<string, string> = {
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
        console.log("Starting Plaid Link Token creation...");

        // Get auth header
        const authHeader = req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            console.error("Missing or invalid Authorization header");
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        });

        // Get user from session token
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            console.error("JWT validation failed:", authError);
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const userId = user.id;
        console.log(`User authenticated: ${userId}`);

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

        const baseUrl = PLAID_ENVIRONMENTS[plaidEnv] || PLAID_ENVIRONMENTS.sandbox;
        
        console.log("Requesting Link Token from Plaid...");

        // Create Link token using fetch API
        const plaidResponse = await fetch(`${baseUrl}/link/token/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                client_id: clientId,
                secret: secret,
                user: {
                    client_user_id: userId,
                },
                client_name: "ZakatFlow",
                products: ["investments", "transactions"],
                country_codes: ["US"],
                language: "en",
            }),
        });

        const plaidData = await plaidResponse.json();

        if (!plaidResponse.ok) {
            console.error("Plaid API Error:", JSON.stringify(plaidData));
            throw new Error(plaidData.error_message || plaidData.error_code || "Plaid API error");
        }

        console.log("Link Token received successfully");

        return new Response(
            JSON.stringify({
                link_token: plaidData.link_token,
                expiration: plaidData.expiration,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error: any) {
        console.error("Error creating Plaid Link token:");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);

        const errorMessage = error.message || "Unknown error";
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
