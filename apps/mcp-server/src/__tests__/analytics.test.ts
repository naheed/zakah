/*
 * Copyright (C) 2026 ZakatFlow
 *
 * AGPL-3.0-or-later
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSessionHash, roundForPrivacy, getDefaultSessionId, recordAnonymousCalculation } from '../analytics.js';
import { createHash } from 'node:crypto';

// ---------------------------------------------------------------------------
// Unit Tests — Pure Functions
// ---------------------------------------------------------------------------

describe('Analytics — generateSessionHash', () => {
    it('returns a 64-char hex SHA-256 hash', () => {
        const hash = generateSessionHash('test-session-id');
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('is deterministic for the same session ID on the same day', () => {
        const hash1 = generateSessionHash('session-abc');
        const hash2 = generateSessionHash('session-abc');
        expect(hash1).toBe(hash2);
    });

    it('produces different hashes for different session IDs', () => {
        const hash1 = generateSessionHash('session-1');
        const hash2 = generateSessionHash('session-2');
        expect(hash1).not.toBe(hash2);
    });

    it('includes date in the hash to ensure daily deduplication', () => {
        // Verify the hash contains the date component
        const today = new Date().toISOString().split('T')[0];
        const expectedHash = createHash('sha256')
            .update(`my-session:${today}`)
            .digest('hex');
        const actual = generateSessionHash('my-session');
        expect(actual).toBe(expectedHash);
    });
});

describe('Analytics — roundForPrivacy', () => {
    it('rounds assets to nearest $1,000', () => {
        expect(roundForPrivacy(12345, 1000)).toBe(12000);
        expect(roundForPrivacy(12500, 1000)).toBe(13000);
        expect(roundForPrivacy(12999, 1000)).toBe(13000);
        expect(roundForPrivacy(0, 1000)).toBe(0);
    });

    it('rounds zakat to nearest $100', () => {
        expect(roundForPrivacy(308.50, 100)).toBe(300);
        expect(roundForPrivacy(350, 100)).toBe(400);
        expect(roundForPrivacy(99.99, 100)).toBe(100);
        expect(roundForPrivacy(0, 100)).toBe(0);
    });

    it('handles large values correctly', () => {
        expect(roundForPrivacy(99_999_999, 1000)).toBe(100_000_000);
        expect(roundForPrivacy(1_000_000_000, 1000)).toBe(1_000_000_000);
    });
});

describe('Analytics — getDefaultSessionId', () => {
    it('returns a string', () => {
        const id = getDefaultSessionId();
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
    });

    it('returns the same ID on repeated calls (singleton)', () => {
        const id1 = getDefaultSessionId();
        const id2 = getDefaultSessionId();
        expect(id1).toBe(id2);
    });
});

// ---------------------------------------------------------------------------
// Integration Tests — recordAnonymousCalculation
// ---------------------------------------------------------------------------

describe('Analytics — recordAnonymousCalculation', () => {
    it('returns silently when Supabase is not configured', async () => {
        // Without SUPABASE env vars, getSupabaseAdmin() returns null
        // recordAnonymousCalculation should just return without error
        await expect(
            recordAnonymousCalculation('test-session', 10000, 250)
        ).resolves.toBeUndefined();
    });

    it('returns silently for negative totalAssets', async () => {
        await expect(
            recordAnonymousCalculation('test-session', -100, 0)
        ).resolves.toBeUndefined();
    });

    it('returns silently for negative zakatDue', async () => {
        await expect(
            recordAnonymousCalculation('test-session', 10000, -50)
        ).resolves.toBeUndefined();
    });

    it('returns silently when zakatDue exceeds totalAssets', async () => {
        await expect(
            recordAnonymousCalculation('test-session', 1000, 2000)
        ).resolves.toBeUndefined();
    });

    it('returns silently for values exceeding maximum thresholds', async () => {
        await expect(
            recordAnonymousCalculation('test-session', 200_000_000_000, 250)
        ).resolves.toBeUndefined();
    });
});

// ---------------------------------------------------------------------------
// Migration Validation
// ---------------------------------------------------------------------------

describe('Analytics — SQL Migration', () => {
    it('migration file exists', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const migrationPath = path.resolve(
            import.meta.dirname || '.',
            '../../../web/supabase/migrations/20260222000000_analytics_source_column.sql'
        );
        const exists = fs.existsSync(migrationPath);
        expect(exists).toBe(true);
    });

    it('migration adds source column with web default', async () => {
        const fs = await import('node:fs');
        const path = await import('node:path');
        const migrationPath = path.resolve(
            import.meta.dirname || '.',
            '../../../web/supabase/migrations/20260222000000_analytics_source_column.sql'
        );
        const content = fs.readFileSync(migrationPath, 'utf-8');
        expect(content).toContain('source');
        expect(content).toContain("DEFAULT 'web'");
        expect(content).toContain('zakat_anonymous_events');
    });
});
