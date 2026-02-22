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
//
// NOTE: The service role key (SUPABASE_SERVICE_KEY) is no longer used directly.
// All privileged operations are routed through the mcp-gateway edge function
// via MCP_GATEWAY_SECRET. See gateway.ts for details.
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

/**
 * Public Supabase client using the anon key.
 * Respects RLS policies — can only read public tables.
 */
let _supabase: SupabaseClient | null = null;

/**
 * Check if Supabase is configured (URL + anon key present).
 */
export function isSupabaseConfigured(): boolean {
    return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
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
 * Reset cached clients (used for testing).
 */
export function resetSupabaseClients(): void {
    _supabase = null;
}
