/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @vitest-environment node
 * 
 * Privacy Vault Integration Tests
 * 
 * Tests the complete user journeys for the Privacy Vault feature.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
    generateDEK,
    generateRecoveryPhrase,
    wrapDEK,
    unwrapDEK,
    cacheDEK,
    getCachedDEK,
    clearCachedDEK,
    storeLocalWrappedDEK,
    getLocalWrappedDEK,
    setPersistenceMode,
    getPersistenceMode,
    clearVault,
    CryptoVault,
    encryptData,
    decryptData,
} from '@/lib/CryptoService';

// Mock IndexedDB for Node environment
vi.mock('idb-keyval', () => {
    const store = new Map();
    return {
        get: vi.fn(async (key) => store.get(key)),
        set: vi.fn(async (key, val) => store.set(key, val)),
        del: vi.fn(async (key) => store.delete(key)),
        clear: vi.fn(async () => store.clear())
    };
});

describe('Privacy Vault Integration Tests', () => {
    // Use a fresh vault instance for each test to avoid singleton state issues
    let testVault: CryptoVault;

    beforeEach(async () => {
        // Clean state before each test
        await clearVault();
        testVault = new CryptoVault();
    });

    afterEach(async () => {
        // Cleanup after each test
        await clearVault();
        vi.clearAllMocks();
    });

    /**
     * USER JOURNEY 1: New User Local Setup
     * 
     * Scenario: First-time user chooses "This Device Only" storage
     */
    describe('Journey 1: New User - Local Storage Setup', () => {
        it('should complete full local setup flow', async () => {
            // 1. Check initial state - no vault configured
            expect(await getPersistenceMode()).toBeNull();
            expect(await getCachedDEK()).toBeNull();

            // 2. Initialize vault directly (mimics initializeVault function)
            const result = await testVault.initialize();

            // 3. Verify initialization outputs
            expect(result.phrase.split(' ')).toHaveLength(12);
            expect(result.wrappedDEK).toBeDefined();
            expect(testVault.isUnlocked).toBe(true);

            // 4. Store as local mode
            await setPersistenceMode('local');
            await storeLocalWrappedDEK(result.wrappedDEK);

            // 5. Verify setup complete
            expect(await getPersistenceMode()).toBe('local');
            expect(await getLocalWrappedDEK()).toBe(result.wrappedDEK);

            // 6. Vault should be usable for encryption
            const testData = 'Sensitive Zakat Data: $10,000';
            const encrypted = await testVault.encrypt(testData);
            expect(encrypted).not.toBe(testData);
            expect(encrypted).toContain('eyJ'); // JWE header

            const decrypted = await testVault.decrypt(encrypted);
            expect(decrypted).toBe(testData);
        });

        it('should generate valid 12-word phrase', () => {
            const phrase = generateRecoveryPhrase();
            const words = phrase.split(' ');
            expect(words).toHaveLength(12);
        });
    });

    /**
     * USER JOURNEY 2: Returning User - Cached Session
     * 
     * Scenario: User returns within same browser session
     */
    describe('Journey 2: Returning User - Cached Session', () => {
        it('should auto-unlock from cached DEK', async () => {
            // Setup: Create cached session
            const dek = await generateDEK();
            await cacheDEK(dek);

            // Simulate app reload - vault restores from cache
            const restored = await testVault.restoreFromCache();
            expect(restored).toBe(true);
            expect(testVault.isUnlocked).toBe(true);
        });
    });

    /**
     * USER JOURNEY 3: Recovery Flow - New Device
     * 
     * Scenario: User on new device with no cached DEK
     */
    describe('Journey 3: Recovery Flow - New Device', () => {
        it('should recover vault with correct phrase', async () => {
            // Setup: Create vault 
            const dek = await generateDEK();
            const phrase = generateRecoveryPhrase();
            const wrapped = await wrapDEK(dek, phrase);

            // Store wrapped DEK (simulates existing vault on another device)
            await setPersistenceMode('local');
            await storeLocalWrappedDEK(wrapped);

            // Do NOT cache DEK (simulates new device)
            // Vault should be locked
            expect(testVault.isUnlocked).toBe(false);

            // Recovery: Unlock with phrase 
            await testVault.unlock(wrapped, phrase);
            expect(testVault.isUnlocked).toBe(true);

            // Should now be able to encrypt/decrypt
            const testData = 'Recovered data';
            const encrypted = await testVault.encrypt(testData);
            const decrypted = await testVault.decrypt(encrypted);
            expect(decrypted).toBe(testData);
        });

        it('should fail with incorrect phrase', async () => {
            const dek = await generateDEK();
            const correctPhrase = generateRecoveryPhrase();
            const wrongPhrase = generateRecoveryPhrase();
            const wrapped = await wrapDEK(dek, correctPhrase);

            await expect(unwrapDEK(wrapped, wrongPhrase))
                .rejects.toThrow('Invalid recovery phrase');
        });
    });

    /**
     * USER JOURNEY 4: Data Encryption Round-Trip
     * 
     * Scenario: User saves and loads encrypted data
     */
    describe('Journey 4: Data Encryption Round-Trip', () => {
        it('should encrypt and decrypt donation data', async () => {
            // Setup vault
            await testVault.initialize();
            expect(testVault.isUnlocked).toBe(true);

            // Test data
            const donationData = JSON.stringify({
                amount: 1000,
                recipient: 'Islamic Relief',
                date: '2026-01-07',
                category: 'charity',
            });

            // Encrypt
            const encrypted = await testVault.encrypt(donationData);
            expect(encrypted).toBeDefined();
            expect(encrypted).toContain('eyJ'); // JWE starts with base64 header

            // Decrypt
            const decrypted = await testVault.decrypt(encrypted);
            expect(decrypted).toBe(donationData);
            expect(JSON.parse(decrypted).amount).toBe(1000);
        });

        it('should handle Unicode data (Arabic text)', async () => {
            await testVault.initialize();

            const arabicData = 'بسم الله الرحمن الرحيم - Zakat: $2,500';
            const encrypted = await testVault.encrypt(arabicData);
            const decrypted = await testVault.decrypt(encrypted);

            expect(decrypted).toBe(arabicData);
        });
    });

    /**
     * USER JOURNEY 5: Vault Lock/Unlock Cycle
     * 
     * Scenario: User explicitly locks vault (logout-like action)
     */
    describe('Journey 5: Lock/Unlock Cycle', () => {
        it('should lock vault and require phrase to unlock', async () => {
            // Setup
            const { phrase, wrappedDEK } = await testVault.initialize();
            expect(testVault.isUnlocked).toBe(true);

            // Lock
            await testVault.lock();
            expect(testVault.isUnlocked).toBe(false);

            // Unlock with phrase
            await testVault.unlock(wrappedDEK, phrase);
            expect(testVault.isUnlocked).toBe(true);
        });
    });
});
