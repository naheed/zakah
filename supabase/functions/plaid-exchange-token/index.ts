/**
 * Plaid Exchange Token Edge Function
 * 
 * Exchanges a public_token from Plaid Link for an access_token,
 * stores the item in the database, and fetches initial holdings.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Configuration, PlaidApi, PlaidEnvironments } from "npm:plaid@26.0.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

        // Exchange public token for access token
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token,
        });

        const accessToken = exchangeResponse.data.access_token;
        const itemId = exchangeResponse.data.item_id;

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
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        // Store accounts
        const accountInserts = accountsResponse.data.accounts.map((account) => ({
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
            const holdingsResponse = await plaidClient.investmentsHoldingsGet({
                access_token: accessToken,
            });

            // Build security lookup map
            const securities = new Map(
                holdingsResponse.data.securities.map((s) => [s.security_id, s])
            );

            // Map holdings to accounts
            for (const holding of holdingsResponse.data.holdings) {
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
            console.log("No investment holdings available:", holdingsError.message);
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
        console.error("Error exchanging Plaid token:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
