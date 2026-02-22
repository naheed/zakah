/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { randomBytes } from 'node:crypto';

// ---------------------------------------------------------------------------
// Server-side Crypto Module Tests
// ---------------------------------------------------------------------------
describe('crypto module — AES-256-GCM', () => {
    const TEST_MASTER_KEY = randomBytes(32).toString('hex');

    beforeEach(() => {
        vi.resetModules();
        process.env.ENCRYPTION_MASTER_KEY = TEST_MASTER_KEY;
    });

    afterEach(() => {
        delete process.env.ENCRYPTION_MASTER_KEY;
    });

    it('encrypt returns prefixed ciphertext', async () => {
        const { encrypt } = await import('../crypto.js');
        const result = encrypt({ hello: 'world' });
        expect(result).not.toBeNull();
        expect(result!).toMatch(/^enc:v1:/);
    });

    it('decrypt recovers original data', async () => {
        const { encrypt, decrypt } = await import('../crypto.js');
        const testData = { cash: 10000, madhab: 'bradford', assets: [1, 2, 3] };
        const encrypted = encrypt(testData)!;
        const decrypted = decrypt(encrypted);
        expect(decrypted).toEqual(testData);
    });

    it('each encryption produces different ciphertext (unique salt + IV)', async () => {
        const { encrypt } = await import('../crypto.js');
        const data = { amount: 5000 };
        const enc1 = encrypt(data);
        const enc2 = encrypt(data);
        expect(enc1).not.toBe(enc2); // Different salt + IV each time
    });

    it('decrypt returns null for tampered ciphertext', async () => {
        const { encrypt, decrypt } = await import('../crypto.js');
        const encrypted = encrypt({ data: 'sensitive' })!;

        // Tamper with the ciphertext
        const tampered = encrypted.slice(0, -5) + 'XXXXX';
        const result = decrypt(tampered);
        expect(result).toBeNull();
    });

    it('decrypt returns null with wrong master key', async () => {
        const { encrypt } = await import('../crypto.js');
        const encrypted = encrypt({ secret: 'data' })!;

        // Change master key
        vi.resetModules();
        process.env.ENCRYPTION_MASTER_KEY = randomBytes(32).toString('hex');

        const { decrypt } = await import('../crypto.js');
        const result = decrypt(encrypted);
        expect(result).toBeNull();
    });

    it('isEncrypted correctly identifies encrypted data', async () => {
        const { encrypt, isEncrypted } = await import('../crypto.js');
        const encrypted = encrypt({ data: 'test' })!;
        expect(isEncrypted(encrypted)).toBe(true);
        expect(isEncrypted('plain text')).toBe(false);
        expect(isEncrypted('{}')).toBe(false);
    });

    it('isEncryptionConfigured returns true when key is set', async () => {
        const { isEncryptionConfigured } = await import('../crypto.js');
        expect(isEncryptionConfigured()).toBe(true);
    });

    it('encrypt handles large payloads', async () => {
        const { encrypt, decrypt } = await import('../crypto.js');
        const largeData = {
            items: Array.from({ length: 100 }, (_, i) => ({
                id: i,
                name: `Asset ${i}`,
                value: Math.random() * 100000,
            })),
        };
        const encrypted = encrypt(largeData)!;
        expect(encrypted).toBeTruthy();
        const decrypted = decrypt(encrypted);
        expect(decrypted).toEqual(largeData);
    });

    it('decrypt handles plain JSON as fallback (unencrypted data)', async () => {
        const { decrypt } = await import('../crypto.js');
        const plainJson = JSON.stringify({ checkingAccounts: 5000 });
        const result = decrypt(plainJson);
        expect(result).toEqual({ checkingAccounts: 5000 });
    });

    it('generateMasterKey produces valid 64-char hex string', async () => {
        const { generateMasterKey } = await import('../crypto.js');
        const key = generateMasterKey();
        expect(key).toMatch(/^[0-9a-f]{64}$/);
    });
});

describe('crypto module — no master key', () => {
    beforeEach(() => {
        vi.resetModules();
        delete process.env.ENCRYPTION_MASTER_KEY;
    });

    it('encrypt returns null when master key is not set', async () => {
        const { encrypt } = await import('../crypto.js');
        const result = encrypt({ data: 'test' });
        expect(result).toBeNull();
    });

    it('isEncryptionConfigured returns false when key is not set', async () => {
        const { isEncryptionConfigured } = await import('../crypto.js');
        expect(isEncryptionConfigured()).toBe(false);
    });

    it('decrypt returns null for encrypted data when key is missing', async () => {
        const { decrypt } = await import('../crypto.js');
        const result = decrypt('enc:v1:somefakebase64data');
        expect(result).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// Persistent Session Store Tests
// ---------------------------------------------------------------------------
describe('PersistentSessionStore — in-memory behavior', () => {

    beforeEach(async () => {
        vi.resetModules();
        // No Supabase configured — tests pure in-memory behavior
        delete process.env.SUPABASE_URL;
        delete process.env.SUPABASE_SERVICE_KEY;
    });

    it('create returns a session with UUID id', async () => {
        const { PersistentSessionStore } = await import('../session/persistent-store.js');
        const session = await PersistentSessionStore.create();
        expect(session.id).toMatch(/^[0-9a-f]{8}-/); // UUID format
        expect(session.formData).toBeDefined();
        expect(session.persisted).toBe(false);
        PersistentSessionStore.clear();
    });

    it('get returns created session from cache', async () => {
        const { PersistentSessionStore } = await import('../session/persistent-store.js');
        const session = await PersistentSessionStore.create();
        const retrieved = await PersistentSessionStore.get(session.id);
        expect(retrieved).toBeDefined();
        expect(retrieved!.id).toBe(session.id);
        PersistentSessionStore.clear();
    });

    it('get returns undefined for non-existent session', async () => {
        const { PersistentSessionStore } = await import('../session/persistent-store.js');
        const result = await PersistentSessionStore.get('non-existent-id');
        expect(result).toBeUndefined();
        PersistentSessionStore.clear();
    });

    it('update modifies form data', async () => {
        const { PersistentSessionStore } = await import('../session/persistent-store.js');
        const session = await PersistentSessionStore.create();
        const updated = await PersistentSessionStore.update(session.id, {
            checkingAccounts: 15000,
        });
        expect(updated).toBeDefined();
        expect(updated!.formData.checkingAccounts).toBe(15000);
        PersistentSessionStore.clear();
    });

    it('update returns undefined for non-existent session', async () => {
        const { PersistentSessionStore } = await import('../session/persistent-store.js');
        const result = await PersistentSessionStore.update('fake-id', {
            checkingAccounts: 999,
        });
        expect(result).toBeUndefined();
        PersistentSessionStore.clear();
    });

    it('delete removes session from cache', async () => {
        const { PersistentSessionStore } = await import('../session/persistent-store.js');
        const session = await PersistentSessionStore.create();
        const deleted = await PersistentSessionStore.delete(session.id);
        expect(deleted).toBe(true);
        const retrieved = await PersistentSessionStore.get(session.id);
        expect(retrieved).toBeUndefined();
        PersistentSessionStore.clear();
    });

    it('clear removes all sessions', async () => {
        const { PersistentSessionStore } = await import('../session/persistent-store.js');
        await PersistentSessionStore.create();
        await PersistentSessionStore.create();
        expect(PersistentSessionStore.size()).toBe(2);
        PersistentSessionStore.clear();
        expect(PersistentSessionStore.size()).toBe(0);
    });

    it('create with chatgptUserId stores it on session (no Supabase)', async () => {
        const { PersistentSessionStore } = await import('../session/persistent-store.js');
        const session = await PersistentSessionStore.create('chatgpt-user-123', 'Test User');
        expect(session.chatgptUserId).toBe('chatgpt-user-123');
        expect(session.zakatflowUserId).toBeUndefined(); // No Supabase = no mapping
        PersistentSessionStore.clear();
    });
});
