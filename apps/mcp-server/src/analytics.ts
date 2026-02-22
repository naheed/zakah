/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * Anonymized calculation analytics — routes through the mcp-gateway
 * edge function instead of using the service role key directly.
 *
 * Privacy guarantees (identical to the web app):
 *   1. Session hash: SHA-256 of sessionId + date (no PII)
 *   2. Values rounded: assets → nearest $1,000, zakat → nearest $100
 *   3. Deduplication: UNIQUE(session_hash, event_date) prevents double-counting
 *   4. Fire-and-forget: errors are logged, never block the user
 */

import { createHash, randomUUID } from 'node:crypto';
import { callGateway, isGatewayConfigured } from './gateway.js';

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
    if (!isGatewayConfigured()) return; // Graceful fallback: no gateway = no analytics

    // Validate
    if (totalAssets < 0 || totalAssets > MAX_TOTAL_ASSETS) return;
    if (zakatDue < 0 || zakatDue > MAX_ZAKAT_DUE) return;
    if (zakatDue > totalAssets) return;

    // Privacy: round values
    const roundedAssets = roundForPrivacy(totalAssets, 1000);
    const roundedZakat = roundForPrivacy(zakatDue, 100);

    // Generate deduplication hash
    const sessionHash = generateSessionHash(sessionId);

    try {
        // Track calculation event via gateway
        await callGateway('track_calculation', {
            session_hash: sessionHash,
            total_assets: roundedAssets,
            zakat_due: roundedZakat,
            source: SOURCE,
        });

        // Update aggregates via gateway
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = today.substring(0, 7); // YYYY-MM
        const currentYear = today.substring(0, 4);   // YYYY

        const periods = [
            { period_type: 'monthly', period_value: currentMonth },
            { period_type: 'yearly', period_value: currentYear },
            { period_type: 'all_time', period_value: 'all' },
        ];

        for (const period of periods) {
            try {
                await callGateway('update_aggregates', {
                    ...period,
                    assets: roundedAssets,
                    zakat: roundedZakat,
                });
            } catch (e) {
                console.error(`[Analytics] Error updating ${period.period_type} aggregate:`, (e as Error).message);
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
