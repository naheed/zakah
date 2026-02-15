/**
 * One-Time Plaid Cleanup Edge Function
 *
 * Revokes all Plaid access tokens for all users and deletes all plaid_items
 * (and thus plaid_accounts, plaid_holdings via CASCADE). Use this once when
 * migrating to user-key encrypted Plaid storage so existing plaintext data and
 * tokens are cleared; users will need to re-link their banks.
 *
 * SECURITY: Requires header x-plaid-cleanup-secret to match env PLAID_CLEANUP_SECRET.
 * Set PLAID_CLEANUP_SECRET in Supabase Edge Function secrets before invoking.
 * Do not expose this secret to the client or commit it.
 *
 * Invoke: POST with header x-plaid-cleanup-secret: <your-secret>
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

const PLAID_ENVIRONMENTS: Record<string, string> = {
    sandbox: "https://sandbox.plaid.com",
    development: "https://development.plaid.com",
    production: "https://production.plaid.com",
};

async function decryptToken(encryptedBase64: string, masterKey: string): Promise<string> {
    const enc = new TextEncoder();
    const binaryStr = atob(encryptedBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const data = bytes.slice(28);

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(masterKey),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        data
    );
    return new TextDecoder().decode(decryptedBuffer);
}

serve(async (req) => {
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({ error: "Method not allowed" }),
            { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const secret = req.headers.get("x-plaid-cleanup-secret");
    const expectedSecret = Deno.env.get("PLAID_CLEANUP_SECRET");

    if (!expectedSecret || secret !== expectedSecret) {
        console.error("[plaid-cleanup-all] Unauthorized: missing or invalid x-plaid-cleanup-secret");
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const plaidClientId = Deno.env.get("PLAID_CLIENT_ID");
    const plaidSecret = Deno.env.get("PLAID_SECRET");
    const plaidEnv = Deno.env.get("PLAID_ENV") || "sandbox";
    const plaidEncryptionKey = Deno.env.get("PLAID_ENCRYPTION_KEY");

    if (!plaidClientId || !plaidSecret || !plaidEncryptionKey) {
        console.error("[plaid-cleanup-all] Missing Plaid or encryption env vars");
        return new Response(
            JSON.stringify({ error: "Server misconfigured" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const baseUrl = PLAID_ENVIRONMENTS[plaidEnv] || PLAID_ENVIRONMENTS.sandbox;

    const { data: plaidItems, error: fetchError } = await supabaseAdmin
        .from("plaid_items")
        .select("id, user_id, access_token");

    if (fetchError) {
        console.error("[plaid-cleanup-all] Failed to fetch plaid_items:", fetchError);
        return new Response(
            JSON.stringify({ error: fetchError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const items = plaidItems ?? [];
    let revoked = 0;
    let errors = 0;

    for (const item of items) {
        try {
            const decryptedToken = await decryptToken(item.access_token, plaidEncryptionKey);
            const res = await fetch(`${baseUrl}/item/remove`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: plaidClientId,
                    secret: plaidSecret,
                    access_token: decryptedToken,
                }),
            });
            if (res.ok) {
                revoked++;
            } else {
                const body = await res.text();
                console.warn("[plaid-cleanup-all] Plaid /item/remove failed for item", item.id, res.status, body);
                errors++;
            }
        } catch (err) {
            console.error("[plaid-cleanup-all] Failed to revoke item", item.id, err);
            errors++;
        }
    }

    const ids = items.map((i) => i.id);
    const deleted = ids.length;

    if (ids.length > 0) {
        const { error: deleteError } = await supabaseAdmin
            .from("plaid_items")
            .delete()
            .in("id", ids);

        if (deleteError) {
            console.error("[plaid-cleanup-all] Failed to delete plaid_items:", deleteError);
            return new Response(
                JSON.stringify({ error: deleteError.message, revoked, errors }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
    }
    console.log("[plaid-cleanup-all] Complete. Revoked:", revoked, "Deleted:", deleted, "Errors:", errors);

    return new Response(
        JSON.stringify({
            success: true,
            revoked,
            deleted,
            errors,
            message: "All Plaid tokens revoked and all plaid_items (and related rows) deleted. Users must re-link banks.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
});
