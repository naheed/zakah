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
 * CryptoService Unit Tests
 * 
 * Tests for the Zero Knowledge Privacy Vault cryptography layer.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    generateDEK,
    generateRecoveryPhrase,
    validateRecoveryPhrase,
    wrapDEK,
    unwrapDEK,
    encryptData,
    decryptData,
    CryptoVault,
} from '../CryptoService';

describe('CryptoService', () => {
    describe('generateRecoveryPhrase', () => {
        it('should generate a 12-word phrase', () => {
            const phrase = generateRecoveryPhrase();
            const words = phrase.split(' ');
            expect(words).toHaveLength(12);
        });

        it('should generate unique phrases each time', () => {
            const phrase1 = generateRecoveryPhrase();
            const phrase2 = generateRecoveryPhrase();
            expect(phrase1).not.toBe(phrase2);
        });

        it('should generate valid BIP-39 phrases', () => {
            const phrase = generateRecoveryPhrase();
            expect(validateRecoveryPhrase(phrase)).toBe(true);
        });
    });

    describe('validateRecoveryPhrase', () => {
        it('should validate correct phrases', () => {
            const phrase = generateRecoveryPhrase();
            expect(validateRecoveryPhrase(phrase)).toBe(true);
        });

        it('should reject invalid phrases', () => {
            expect(validateRecoveryPhrase('not a valid phrase at all')).toBe(false);
        });

        it('should be case-insensitive', () => {
            const phrase = generateRecoveryPhrase();
            expect(validateRecoveryPhrase(phrase.toUpperCase())).toBe(true);
        });

        it('should handle extra whitespace', () => {
            const phrase = generateRecoveryPhrase();
            expect(validateRecoveryPhrase(`  ${phrase}  `)).toBe(true);
        });
    });

    describe('DEK Generation', () => {
        it('should generate a valid CryptoKey', async () => {
            const dek = await generateDEK();
            expect(dek).toBeDefined();
            expect(dek.type).toBe('secret');
            expect(dek.algorithm.name).toBe('AES-GCM');
        });

        it('should generate extractable keys', async () => {
            const dek = await generateDEK();
            expect(dek.extractable).toBe(true);
        });
    });

    describe('Key Wrapping (wrapDEK / unwrapDEK)', () => {
        it('should wrap and unwrap DEK successfully', async () => {
            const dek = await generateDEK();
            const phrase = generateRecoveryPhrase();

            const wrapped = await wrapDEK(dek, phrase);
            expect(wrapped).toBeDefined();
            expect(typeof wrapped).toBe('string');

            // Unwrap with same phrase
            const recovered = await unwrapDEK(wrapped, phrase);
            expect(recovered).toBeDefined();
            expect(recovered.algorithm.name).toBe('AES-GCM');
        });

        it('should fail with wrong phrase', async () => {
            const dek = await generateDEK();
            const phrase = generateRecoveryPhrase();
            const wrongPhrase = generateRecoveryPhrase();

            const wrapped = await wrapDEK(dek, phrase);

            await expect(unwrapDEK(wrapped, wrongPhrase)).rejects.toThrow('Invalid recovery phrase');
        });

        it('should produce different wrapped keys for same DEK with different phrases', async () => {
            const dek = await generateDEK();
            const phrase1 = generateRecoveryPhrase();
            const phrase2 = generateRecoveryPhrase();

            const wrapped1 = await wrapDEK(dek, phrase1);
            const wrapped2 = await wrapDEK(dek, phrase2);

            expect(wrapped1).not.toBe(wrapped2);
        });
    });

    describe('Data Encryption (encryptData / decryptData)', () => {
        let dek: CryptoKey;

        beforeEach(async () => {
            dek = await generateDEK();
        });

        it('should encrypt and decrypt data successfully', async () => {
            const plaintext = 'Hello, World! Sensitive financial data here.';

            const encrypted = await encryptData(plaintext, dek);
            expect(encrypted).toBeDefined();
            expect(typeof encrypted).toBe('string');
            expect(encrypted).not.toBe(plaintext);

            const decrypted = await decryptData(encrypted, dek);
            expect(decrypted).toBe(plaintext);
        });

        it('should handle JSON data', async () => {
            const data = { amount: 1000, recipient: 'Islamic Relief' };
            const plaintext = JSON.stringify(data);

            const encrypted = await encryptData(plaintext, dek);
            const decrypted = await decryptData(encrypted, dek);

            expect(JSON.parse(decrypted)).toEqual(data);
        });

        it('should handle Unicode text', async () => {
            const plaintext = 'بسم الله الرحمن الرحيم - Zakat: 2.5%';

            const encrypted = await encryptData(plaintext, dek);
            const decrypted = await decryptData(encrypted, dek);

            expect(decrypted).toBe(plaintext);
        });

        it('should produce different ciphertext for same plaintext', async () => {
            const plaintext = 'Same message';

            const encrypted1 = await encryptData(plaintext, dek);
            const encrypted2 = await encryptData(plaintext, dek);

            // JWE includes random IV, so ciphertext should differ
            expect(encrypted1).not.toBe(encrypted2);
        });

        it('should fail with wrong key', async () => {
            const wrongDek = await generateDEK();
            const plaintext = 'Secret message';

            const encrypted = await encryptData(plaintext, dek);

            await expect(decryptData(encrypted, wrongDek)).rejects.toThrow();
        });
    });

    describe('CryptoVault class', () => {
        let vault: CryptoVault;

        beforeEach(() => {
            vault = new CryptoVault();
        });

        it('should start locked', () => {
            expect(vault.isUnlocked).toBe(false);
        });

        it('should initialize and return phrase', async () => {
            const { phrase, wrappedDEK } = await vault.initialize();

            expect(phrase.split(' ')).toHaveLength(12);
            expect(wrappedDEK).toBeDefined();
            expect(vault.isUnlocked).toBe(true);
        });

        it('should encrypt/decrypt when unlocked', async () => {
            await vault.initialize();

            const plaintext = 'Test data';
            const encrypted = await vault.encrypt(plaintext);
            const decrypted = await vault.decrypt(encrypted);

            expect(decrypted).toBe(plaintext);
        });

        it('should throw when encrypting while locked', async () => {
            await expect(vault.encrypt('test')).rejects.toThrow('Vault is locked');
        });

        it('should unlock with correct phrase', async () => {
            const { phrase, wrappedDEK } = await vault.initialize();
            await vault.lock();

            expect(vault.isUnlocked).toBe(false);

            await vault.unlock(wrappedDEK, phrase);

            expect(vault.isUnlocked).toBe(true);
        });
    });
});
