/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * Anonymized calculation analytics — server-side equivalent of the
 * `track-zakat-calculation` Supabase Edge Function.
 *
 * Privacy guarantees (identical to the web app):
 *   1. Session hash: SHA-256 of sessionId + date (no PII)
 *   2. Values rounded: assets → nearest $1,000, zakat → nearest $100
 *   3. Deduplication: UNIQUE(session_hash, event_date) prevents double-counting
 *   4. Service role writes only (no public RLS policies)
 *   5. Fire-and-forget: errors are logged, never block the user
 */

import { createHash, randomUUID } from 'node:crypto';
import { getSupabaseAdmin } from './supabase.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_TOTAL_ASSETS = 100_000_000_000;  // $100 billion
const MAX_ZAKAT_DUE = 10_000_000_000;      // $10 billion
const SOURCE = 'chatgpt';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a SHA-256 session hash for deduplication.
 * Uses sessionId + date to ensure one event per session per day.
 */
export function generateSessionHash(sessionId: string): string {
    const today = new Date().toISOString().split('T')[0];
    return createHash('sha256')
        .update(`${sessionId}:${today}`)
        .digest('hex');
}

/**
 * Round a value for additional privacy.
 *   - Assets → nearest $1,000
 *   - Zakat  → nearest $100
 */
export function roundForPrivacy(value: number, granularity: number): number {
    return Math.round(value / granularity) * granularity;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Record an anonymized calculation event.
 *
 * This is a fire-and-forget function — call it with `.catch(() => {})`
 * so analytics never blocks the user's Zakat calculation response.
 *
 * @param sessionId - Unique session identifier (UUID or any string)
 * @param totalAssets - Total zakatable assets (unrounded)
 * @param zakatDue - Zakat due amount (unrounded)
 */
export async function recordAnonymousCalculation(
    sessionId: string,
    totalAssets: number,
    zakatDue: number
): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return; // Graceful fallback: no Supabase = no analytics

    // Validate
    if (totalAssets < 0 || totalAssets > MAX_TOTAL_ASSETS) return;
    if (zakatDue < 0 || zakatDue > MAX_ZAKAT_DUE) return;
    if (zakatDue > totalAssets) return;

    // Privacy: round values
    const roundedAssets = roundForPrivacy(totalAssets, 1000);
    const roundedZakat = roundForPrivacy(zakatDue, 100);

    // Generate deduplication hash
    const sessionHash = generateSessionHash(sessionId);
    const today = new Date().toISOString().split('T')[0];

    try {
        // Insert event (deduplicated by session_hash + event_date)
        const { data: insertData, error: insertError } = await supabase
            .from('zakat_anonymous_events')
            .upsert(
                {
                    session_hash: sessionHash,
                    event_date: today,
                    total_assets: roundedAssets,
                    zakat_due: roundedZakat,
                    source: SOURCE,
                },
                { onConflict: 'session_hash,event_date', ignoreDuplicates: true }
            )
            .select();

        if (insertError) {
            console.error('[Analytics] Error inserting event:', insertError.message);
            return;
        }

        // Only update aggregates for new events (not duplicates)
        const isNewEvent = insertData && insertData.length > 0;
        if (!isNewEvent) return;

        // Update aggregate periods
        const currentMonth = today.substring(0, 7); // YYYY-MM
        const currentYear = today.substring(0, 4);   // YYYY

        const periods = [
            { period_type: 'monthly', period_value: currentMonth },
            { period_type: 'yearly', period_value: currentYear },
            { period_type: 'all_time', period_value: 'all' },
        ];

        for (const period of periods) {
            const { error: rpcError } = await supabase.rpc('increment_usage_aggregate', {
                p_period_type: period.period_type,
                p_period_value: period.period_value,
                p_assets: roundedAssets,
                p_zakat: roundedZakat,
            });

            if (rpcError) {
                console.error(`[Analytics] Error updating ${period.period_type} aggregate:`, rpcError.message);
                // Fallback: try direct update
                const { data: existing } = await supabase
                    .from('zakat_usage_aggregates')
                    .select('*')
                    .eq('period_type', period.period_type)
                    .eq('period_value', period.period_value)
                    .single();

                if (existing) {
                    await supabase
                        .from('zakat_usage_aggregates')
                        .update({
                            unique_sessions: existing.unique_sessions + 1,
                            total_assets: existing.total_assets + roundedAssets,
                            total_zakat: existing.total_zakat + roundedZakat,
                            calculation_count: existing.calculation_count + 1,
                            updated_at: new Date().toISOString(),
                        })
                        .eq('period_type', period.period_type)
                        .eq('period_value', period.period_value);
                } else {
                    await supabase.from('zakat_usage_aggregates').insert({
                        period_type: period.period_type,
                        period_value: period.period_value,
                        unique_sessions: 1,
                        total_assets: roundedAssets,
                        total_zakat: roundedZakat,
                        calculation_count: 1,
                    });
                }
            }
        }

        console.log('[Analytics] Recorded ChatGPT calculation event');
    } catch (e) {
        console.error('[Analytics] Unexpected error:', (e as Error).message);
    }
}

/**
 * Generate a deterministic session ID for calculations without an explicit session.
 * Uses a random UUID — one per process lifecycle.
 */
let _defaultSessionId: string | null = null;
export function getDefaultSessionId(): string {
    if (!_defaultSessionId) {
        _defaultSessionId = randomUUID();
    }
    return _defaultSessionId;
}
