/**
 * Plaid Exchange Token Edge Function
 * 
 * Exchanges a public_token from Plaid Link for an access_token,
 * stores the item in the database, and fetches initial holdings.
 * Uses direct HTTP calls to Plaid API (no npm SDK needed).
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

interface PlaidAccount {
    account_id: string;
    name: string;
    official_name: string | null;
    type: string;
    subtype: string | null;
    mask: string | null;
    balances: {
        current: number | null;
        available: number | null;
        iso_currency_code: string | null;
    };
}

interface PlaidSecurity {
    security_id: string;
    name: string | null;
    ticker_symbol: string | null;
    type: string | null;
}

interface PlaidHolding {
    account_id: string;
    security_id: string;
    quantity: number;
    cost_basis: number | null;
    institution_price: number;
    institution_value: number;
    iso_currency_code: string | null;
    institution_price_as_of: string | null;
}

async function plaidRequest(baseUrl: string, endpoint: string, body: Record<string, unknown>) {
    const response = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_message || `Plaid API error: ${endpoint}`);
    }

    return data;
}

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            throw new Error("Missing authorization header");
        }

        const { public_token, institution } = await req.json();
        if (!public_token) {
            throw new Error("Missing public_token");
        }

        // Get auth user
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Verify user from auth header
        const supabaseAuth = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
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
        const plaidAuth = { client_id: plaidClientId, secret: plaidSecret };

        console.log(`Exchanging Plaid token for user ${user.id}`);

        // Exchange public token for access token
        const exchangeData = await plaidRequest(plaidBaseUrl, "/item/public_token/exchange", {
            ...plaidAuth,
            public_token,
        });

        const accessToken = exchangeData.access_token;
        const itemId = exchangeData.item_id;

        console.log(`Got access token for item ${itemId}`);

        // Store Plaid item in database
        const { data: plaidItem, error: itemError } = await supabase
            .from("plaid_items")
            .insert({
                user_id: user.id,
                access_token: accessToken, // In production, encrypt this!
                item_id: itemId,
                institution_id: institution?.institution_id,
                institution_name: institution?.name,
                status: "ACTIVE",
            })
            .select()
            .single();

        if (itemError) {
            throw new Error(`Failed to store Plaid item: ${itemError.message}`);
        }

        // Fetch accounts from Plaid
        const accountsData = await plaidRequest(plaidBaseUrl, "/accounts/get", {
            ...plaidAuth,
            access_token: accessToken,
        });

        // Store accounts
        const accountInserts = (accountsData.accounts as PlaidAccount[]).map((account) => ({
            plaid_item_id: plaidItem.id,
            account_id: account.account_id,
            name: account.name,
            official_name: account.official_name,
            type: account.type,
            subtype: account.subtype,
            mask: account.mask,
            balance_current: account.balances?.current,
            balance_available: account.balances?.available,
            balance_iso_currency_code: account.balances?.iso_currency_code || "USD",
            last_synced_at: new Date().toISOString(),
        }));

        const { data: plaidAccounts, error: accountsError } = await supabase
            .from("plaid_accounts")
            .insert(accountInserts)
            .select();

        if (accountsError) {
            console.error("Failed to store accounts:", accountsError);
        }

        // Fetch investment holdings if available
        try {
            const holdingsData = await plaidRequest(plaidBaseUrl, "/investments/holdings/get", {
                ...plaidAuth,
                access_token: accessToken,
            });

            // Build security lookup map
            const securities = new Map<string, PlaidSecurity>(
                (holdingsData.securities as PlaidSecurity[]).map((s) => [s.security_id, s])
            );

            // Map holdings to accounts
            for (const holding of holdingsData.holdings as PlaidHolding[]) {
                const plaidAccount = plaidAccounts?.find(
                    (a) => a.account_id === holding.account_id
                );
                if (!plaidAccount) continue;

                const security = securities.get(holding.security_id);

                await supabase.from("plaid_holdings").insert({
                    plaid_account_id: plaidAccount.id,
                    security_id: holding.security_id,
                    name: security?.name,
                    ticker_symbol: security?.ticker_symbol,
                    security_type: security?.type, // cash, equity, etf, etc.
                    quantity: holding.quantity,
                    cost_basis: holding.cost_basis,
                    institution_price: holding.institution_price,
                    institution_value: holding.institution_value,
                    iso_currency_code: holding.iso_currency_code || "USD",
                    price_as_of: holding.institution_price_as_of,
                });
            }
        } catch (holdingsError) {
            // Investment holdings may not be available for all accounts
            const errorMsg = holdingsError instanceof Error ? holdingsError.message : "Unknown error";
            console.log("No investment holdings available:", errorMsg);
        }

        return new Response(
            JSON.stringify({
                success: true,
                item_id: plaidItem.id,
                accounts_count: plaidAccounts?.length || 0,
            }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error exchanging Plaid token:", errorMessage);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
