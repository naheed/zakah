/**
 * MCP Gateway Edge Function
 *
 * Secure server-to-server API for the ZakatFlow MCP server (Google Cloud Run).
 * Authenticates via a shared secret (X-MCP-Secret header) instead of user JWTs.
 * Internally uses the service role key to access privileged tables.
 *
 * Actions:
 *   find_or_create_user  — Upsert ChatGPT user identity
 *   save_session          — Create/update encrypted calculation session
 *   get_sessions          — Fetch recent sessions for a user
 *   delete_user_data      — Delete user + sessions (GDPR)
 *   track_calculation     — Insert anonymous analytics event
 *   update_aggregates     — Increment usage aggregates
 *
 * Copyright (C) 2026 ZakatFlow — AGPL-3.0-or-later
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// CORS — server-to-server doesn't usually need CORS but include for safety
// ---------------------------------------------------------------------------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-mcp-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function err(message: string, status = 400) {
  return json({ success: false, error: message }, status);
}

function assertString(val: unknown, name: string, maxLen = 500): string {
  if (typeof val !== "string" || val.length === 0) {
    throw new Error(`${name} must be a non-empty string`);
  }
  if (val.length > maxLen) {
    throw new Error(`${name} exceeds max length of ${maxLen}`);
  }
  return val;
}

function assertNumber(val: unknown, name: string): number {
  const n = Number(val);
  if (!Number.isFinite(n)) {
    throw new Error(`${name} must be a finite number`);
  }
  return n;
}

// ---------------------------------------------------------------------------
// Admin client (service role — bypasses RLS)
// ---------------------------------------------------------------------------

function getAdminClient() {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// Action Handlers
// ---------------------------------------------------------------------------

async function handleFindOrCreateUser(body: Record<string, unknown>) {
  const chatgptUserId = assertString(body.chatgpt_user_id, "chatgpt_user_id", 200);
  const displayName = body.display_name != null
    ? assertString(body.display_name, "display_name", 200)
    : null;

  const sb = getAdminClient();

  // Try to find existing user
  const { data: existing, error: findErr } = await sb
    .from("chatgpt_users")
    .select("*")
    .eq("chatgpt_user_id", chatgptUserId)
    .maybeSingle();

  if (findErr) throw new Error(`DB find error: ${findErr.message}`);

  if (existing) {
    // Update last_seen_at
    await sb
      .from("chatgpt_users")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", existing.id);
    return { success: true, data: existing };
  }

  // Create new user
  const { data: newUser, error: createErr } = await sb
    .from("chatgpt_users")
    .insert({
      chatgpt_user_id: chatgptUserId,
      display_name: displayName,
      preferred_madhab: "bradford",
    })
    .select()
    .single();

  if (createErr) throw new Error(`DB create error: ${createErr.message}`);
  return { success: true, data: newUser };
}

async function handleSaveSession(body: Record<string, unknown>) {
  const userId = assertString(body.user_id, "user_id", 36);
  const methodology = assertString(body.methodology, "methodology", 50);
  const sessionData = body.session_data ?? null;
  const zakatDue = body.zakat_due != null ? assertNumber(body.zakat_due, "zakat_due") : null;
  const totalAssets = body.total_assets != null ? assertNumber(body.total_assets, "total_assets") : null;
  const isAboveNisab = body.is_above_nisab != null ? Boolean(body.is_above_nisab) : null;

  // Optional: allow client to supply session id for upsert
  const sessionId = body.session_id
    ? assertString(body.session_id, "session_id", 36)
    : undefined;

  const sb = getAdminClient();

  if (sessionId) {
    // Upsert (update existing)
    const { data, error } = await sb
      .from("chatgpt_sessions")
      .update({
        session_data: sessionData,
        methodology,
        zakat_due: zakatDue,
        total_assets: totalAssets,
        is_above_nisab: isAboveNisab,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw new Error(`DB update session error: ${error.message}`);
    return { success: true, data };
  }

  // Insert new
  const { data, error } = await sb
    .from("chatgpt_sessions")
    .insert({
      user_id: userId,
      session_data: sessionData,
      methodology,
      zakat_due: zakatDue,
      total_assets: totalAssets,
      is_above_nisab: isAboveNisab,
    })
    .select()
    .single();

  if (error) throw new Error(`DB insert session error: ${error.message}`);
  return { success: true, data };
}

async function handleGetSessions(body: Record<string, unknown>) {
  const userId = assertString(body.user_id, "user_id", 36);
  const limit = body.limit != null ? Math.min(assertNumber(body.limit, "limit"), 50) : 5;

  const sb = getAdminClient();
  const { data, error } = await sb
    .from("chatgpt_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`DB fetch sessions error: ${error.message}`);
  return { success: true, data: data ?? [] };
}

async function handleDeleteUserData(body: Record<string, unknown>) {
  const chatgptUserId = assertString(body.chatgpt_user_id, "chatgpt_user_id", 200);

  const sb = getAdminClient();

  // Find user
  const { data: user, error: findErr } = await sb
    .from("chatgpt_users")
    .select("id")
    .eq("chatgpt_user_id", chatgptUserId)
    .maybeSingle();

  if (findErr) throw new Error(`DB find error: ${findErr.message}`);
  if (!user) return { success: true, data: { deleted: false, reason: "user_not_found" } };

  // Delete sessions first (FK dependency)
  const { error: delSessions } = await sb
    .from("chatgpt_sessions")
    .delete()
    .eq("user_id", user.id);
  if (delSessions) throw new Error(`Delete sessions error: ${delSessions.message}`);

  // Delete user
  const { error: delUser } = await sb
    .from("chatgpt_users")
    .delete()
    .eq("id", user.id);
  if (delUser) throw new Error(`Delete user error: ${delUser.message}`);

  return { success: true, data: { deleted: true, user_id: user.id } };
}

async function handleTrackCalculation(body: Record<string, unknown>) {
  const sessionHash = assertString(body.session_hash, "session_hash", 128);
  const totalAssets = assertNumber(body.total_assets, "total_assets");
  const zakatDue = assertNumber(body.zakat_due, "zakat_due");
  const source = body.source
    ? assertString(body.source, "source", 50)
    : "chatgpt";

  const sb = getAdminClient();
  const { error } = await sb
    .from("zakat_anonymous_events")
    .insert({
      session_hash: sessionHash,
      total_assets: totalAssets,
      zakat_due: zakatDue,
      source,
    });

  if (error) throw new Error(`Track calculation error: ${error.message}`);
  return { success: true };
}

async function handleUpdateAggregates(body: Record<string, unknown>) {
  const periodType = assertString(body.period_type, "period_type", 20);
  const periodValue = assertString(body.period_value, "period_value", 20);
  const assets = assertNumber(body.assets, "assets");
  const zakat = assertNumber(body.zakat, "zakat");

  const sb = getAdminClient();
  const { error } = await sb.rpc("increment_usage_aggregate", {
    p_period_type: periodType,
    p_period_value: periodValue,
    p_assets: assets,
    p_zakat: zakat,
  });

  if (error) throw new Error(`Update aggregates error: ${error.message}`);
  return { success: true };
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const ACTIONS: Record<string, (body: Record<string, unknown>) => Promise<unknown>> = {
  find_or_create_user: handleFindOrCreateUser,
  save_session: handleSaveSession,
  get_sessions: handleGetSessions,
  delete_user_data: handleDeleteUserData,
  track_calculation: handleTrackCalculation,
  update_aggregates: handleUpdateAggregates,
};

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only POST allowed
  if (req.method !== "POST") {
    return err("Method not allowed", 405);
  }

  // Authenticate via shared secret
  const secret = req.headers.get("x-mcp-secret");
  const expectedSecret = Deno.env.get("MCP_GATEWAY_SECRET");

  if (!expectedSecret) {
    console.error("[mcp-gateway] MCP_GATEWAY_SECRET not configured");
    return err("Gateway not configured", 500);
  }

  if (!secret || secret !== expectedSecret) {
    return err("Unauthorized", 401);
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body");
  }

  const action = typeof body.action === "string" ? body.action : "";
  const handler = ACTIONS[action];

  if (!handler) {
    return err(`Unknown action: ${action}. Valid: ${Object.keys(ACTIONS).join(", ")}`);
  }

  try {
    const result = await handler(body);
    return json(result);
  } catch (e) {
    console.error(`[mcp-gateway] Action "${action}" failed:`, e);
    return err(e instanceof Error ? e.message : "Internal error", 500);
  }
});
