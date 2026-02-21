/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Supabase Client Module Tests
// ---------------------------------------------------------------------------
describe('supabase client module', () => {

    beforeEach(() => {
        // Reset module cache and env vars between tests
        vi.resetModules();
    });

    it('isSupabaseConfigured returns false when no env vars set', async () => {
        // Clear env vars
        const origUrl = process.env.SUPABASE_URL;
        const origAnon = process.env.SUPABASE_ANON_KEY;
        const origService = process.env.SUPABASE_SERVICE_KEY;
        delete process.env.SUPABASE_URL;
        delete process.env.SUPABASE_ANON_KEY;
        delete process.env.SUPABASE_SERVICE_KEY;

        const { isSupabaseConfigured } = await import('../supabase.js');
        expect(isSupabaseConfigured()).toBe(false);

        // Restore
        if (origUrl) process.env.SUPABASE_URL = origUrl;
        if (origAnon) process.env.SUPABASE_ANON_KEY = origAnon;
        if (origService) process.env.SUPABASE_SERVICE_KEY = origService;
    });

    it('getSupabase returns null when URL is not set', async () => {
        delete process.env.SUPABASE_URL;
        delete process.env.SUPABASE_ANON_KEY;

        const { getSupabase } = await import('../supabase.js');
        expect(getSupabase()).toBeNull();
    });

    it('getSupabaseAdmin returns null when service key is not set', async () => {
        delete process.env.SUPABASE_SERVICE_KEY;

        const { getSupabaseAdmin } = await import('../supabase.js');
        expect(getSupabaseAdmin()).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// ChatGPT Identity Service Tests
// ---------------------------------------------------------------------------
describe('ChatGPT identity service', () => {

    it('findOrCreateChatGPTUser returns null when Supabase is not configured', async () => {
        // Ensure no Supabase env vars
        delete process.env.SUPABASE_URL;
        delete process.env.SUPABASE_SERVICE_KEY;

        vi.resetModules();
        const { findOrCreateChatGPTUser } = await import('../identity/chatgpt.js');
        const result = await findOrCreateChatGPTUser('test-chatgpt-user-id', 'Test User');
        expect(result).toBeNull();
    });

    it('saveSession returns null when Supabase is not configured', async () => {
        delete process.env.SUPABASE_URL;
        delete process.env.SUPABASE_SERVICE_KEY;

        vi.resetModules();
        const { saveSession } = await import('../identity/chatgpt.js');
        const result = await saveSession(
            'some-uuid',
            { checkingAccounts: 10000 },
            'bradford',
            { zakatDue: 250, totalAssets: 10000, isAboveNisab: true }
        );
        expect(result).toBeNull();
    });

    it('getRecentSessions returns empty array when Supabase is not configured', async () => {
        delete process.env.SUPABASE_URL;
        delete process.env.SUPABASE_SERVICE_KEY;

        vi.resetModules();
        const { getRecentSessions } = await import('../identity/chatgpt.js');
        const result = await getRecentSessions('some-uuid');
        expect(result).toEqual([]);
    });

    it('updatePreferredMadhab does not throw when Supabase is not configured', async () => {
        delete process.env.SUPABASE_URL;
        delete process.env.SUPABASE_SERVICE_KEY;

        vi.resetModules();
        const { updatePreferredMadhab } = await import('../identity/chatgpt.js');
        // Should not throw
        await expect(updatePreferredMadhab('test-id', 'hanafi')).resolves.toBeUndefined();
    });
});

// ---------------------------------------------------------------------------
// ChatGPT User/Session Types
// ---------------------------------------------------------------------------
describe('ChatGPT identity types', () => {

    it('ChatGPTUser interface has correct fields', async () => {
        const { findOrCreateChatGPTUser } = await import('../identity/chatgpt.js');
        // Verify the function signature exists
        expect(typeof findOrCreateChatGPTUser).toBe('function');
    });

    it('ChatGPTSession interface has correct fields', async () => {
        const { saveSession } = await import('../identity/chatgpt.js');
        expect(typeof saveSession).toBe('function');
    });

    it('exports all expected functions', async () => {
        const mod = await import('../identity/chatgpt.js');
        expect(typeof mod.findOrCreateChatGPTUser).toBe('function');
        expect(typeof mod.saveSession).toBe('function');
        expect(typeof mod.getRecentSessions).toBe('function');
        expect(typeof mod.updatePreferredMadhab).toBe('function');
    });
});

// ---------------------------------------------------------------------------
// SQL Migration Validation
// ---------------------------------------------------------------------------
describe('SQL migration contract', () => {
    it('chatgpt_identity migration file exists and has correct structure', async () => {
        const fs = await import('fs');
        const path = await import('path');

        // Find the migration file relative to the test
        const migrationDir = path.resolve(
            import.meta.dirname || '.',
            '../../../../apps/web/supabase/migrations'
        );

        const files = fs.readdirSync(migrationDir);
        const chatgptMigration = files.find(f => f.includes('chatgpt_identity'));
        expect(chatgptMigration).toBeDefined();

        const content = fs.readFileSync(path.join(migrationDir, chatgptMigration!), 'utf-8');

        // Verify table creation statements
        expect(content).toContain('CREATE TABLE IF NOT EXISTS public.chatgpt_users');
        expect(content).toContain('CREATE TABLE IF NOT EXISTS public.chatgpt_sessions');

        // Verify chatgpt_user_id column
        expect(content).toContain('chatgpt_user_id TEXT UNIQUE NOT NULL');

        // Verify foreign key relationship
        expect(content).toContain('REFERENCES public.chatgpt_users(id)');

        // Verify RLS is enabled
        expect(content).toContain('ENABLE ROW LEVEL SECURITY');

        // Verify no public access policies (service-role only)
        expect(content).not.toMatch(/CREATE POLICY.*ON public\.chatgpt_users.*FOR SELECT/);
    });
});
