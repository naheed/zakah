/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Environment Variables
// ---------------------------------------------------------------------------
// SUPABASE_URL           — Project URL (e.g. https://pcwdpsoheoiiavkeyeyx.supabase.co)
// SUPABASE_ANON_KEY      — Publishable anon key (for public reads: nisab_values, currency_rates)
// SUPABASE_SERVICE_KEY   — Service role key (bypasses RLS, for chatgpt_users/sessions writes)
//
// The MCP server uses TWO clients:
// 1. `supabase` (anon) — for reading public data that respects RLS
// 2. `supabaseAdmin` (service-role) — for writing ChatGPT user/session data
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

/**
 * Public Supabase client using the anon key.
 * Respects RLS policies — can only read public tables.
 */
let _supabase: SupabaseClient | null = null;

/**
 * Admin Supabase client using the service role key.
 * Bypasses RLS — used for ChatGPT user/session management.
 * ⚠️ Never expose this client or the service role key to end users.
 */
let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Check if Supabase is configured (URL + at least one key present).
 */
export function isSupabaseConfigured(): boolean {
    return !!(SUPABASE_URL && (SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY));
}

/**
 * Get the public Supabase client (anon key, respects RLS).
 * Returns null if Supabase is not configured.
 */
export function getSupabase(): SupabaseClient | null {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
    if (!_supabase) {
        _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return _supabase;
}

/**
 * Get the admin Supabase client (service role key, bypasses RLS).
 * Returns null if the service role key is not configured.
 *
 * ⚠️ WARNING: This client bypasses all Row-Level Security policies.
 * Only use for server-side operations (ChatGPT user/session management).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
    if (!_supabaseAdmin) {
        _supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }
    return _supabaseAdmin;
}

/**
 * Reset cached clients (used for testing).
 */
export function resetSupabaseClients(): void {
    _supabase = null;
    _supabaseAdmin = null;
}
