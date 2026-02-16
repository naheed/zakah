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
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { getCorsHeaders } from "../_shared/cors.ts";

// Map environment name to Plaid API base URL
const PLAID_ENVIRONMENTS: Record<string, string> = {
    sandbox: "https://sandbox.plaid.com",
    development: "https://development.plaid.com",
    production: "https://production.plaid.com",
};

serve(async (req) => {
    // Validate origin and generate CORS headers (no wildcard *)
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Get auth header (do NOT log header values)
        const authHeader = req.headers.get("Authorization");
        
        if (!authHeader?.startsWith("Bearer ")) {
            console.error("Missing or invalid Authorization header");
            return new Response(
                JSON.stringify({ error: "Unauthorized - Please sign in to connect your bank" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Missing backend configuration secrets (SUPABASE_URL / SUPABASE_ANON_KEY)");
            return new Response(
                JSON.stringify({ error: "Server misconfigured" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Validate the user via the passed JWT (do not rely on server-side session storage)
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

        if (authError || !user) {
            console.error("JWT validation failed:", authError);
            return new Response(
                JSON.stringify({ error: "Unauthorized - Please sign in to connect your bank" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const userId = user.id;

        // Check for secrets
        const clientId = Deno.env.get("PLAID_CLIENT_ID");
        const secret = Deno.env.get("PLAID_SECRET");
        const plaidEnv = Deno.env.get("PLAID_ENV") || "sandbox";

        if (!clientId || !secret) {
            throw new Error("Missing PLAID_CLIENT_ID or PLAID_SECRET environment variables. Please check your Supabase Secrets.");
        }

        const baseUrl = PLAID_ENVIRONMENTS[plaidEnv] || PLAID_ENVIRONMENTS.sandbox;

        // Request Link Token from Plaid API

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
                products: ["transactions"],
                additional_consented_products: ["investments"],
                country_codes: ["US"],
                language: "en",
            }),
        });

        const plaidData = await plaidResponse.json();

        if (!plaidResponse.ok) {
            console.error("[plaid-link-token] Plaid API error:", plaidData.error_code);
            throw new Error(plaidData.error_message || plaidData.error_code || "Plaid API error");
        }

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
        const errorMessage = error.message || "Unknown error";
        console.error("[plaid-link-token] Error:", errorMessage);

        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 200, // Intentional: Pass error to client parser
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
