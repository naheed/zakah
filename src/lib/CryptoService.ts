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
 * CryptoService - Zero Knowledge Privacy Vault
 * 
 * Client-side encryption using:
 * - jose: JWE encryption (AES-256-GCM)
 * - bip39: Recovery phrase generation
 * - PBES2-HS512+A256KW: Key wrapping with high iteration count
 * 
 * The server NEVER sees plaintext data or unencrypted keys.
 */

import * as jose from 'jose';
import * as bip39 from 'bip39';
import { get, set, del } from 'idb-keyval';

// Constants
const DEK_STORAGE_KEY = 'zakat-vault-dek';
const WRAPPED_DEK_STORAGE_KEY = 'zakat-vault-wrapped-dek';
const PERSISTENCE_MODE_KEY = 'zakat-vault-mode';

// PBES2 iteration count (100,000+ for brute-force protection)
const PBES2_ITERATIONS = 310_000;

// Encryption algorithm for data
const DATA_ENCRYPTION_ALG = 'A256GCM';
const KEY_ENCRYPTION_ALG = 'PBES2-HS512+A256KW';

export type PersistenceMode = 'local' | 'cloud' | null;

export interface VaultConfig {
    wrappedDEK: string;
    persistenceMode: PersistenceMode;
}

/**
 * Generate a cryptographically secure Data Encryption Key (DEK)
 * 256-bit random key for AES-256-GCM
 */
export async function generateDEK(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true, // extractable (needed for wrapping)
        ['encrypt', 'decrypt']
    );
}

/**
 * Generate a 12-word BIP-39 recovery phrase
 * Uses 128 bits of entropy for 12 words
 */
export function generateRecoveryPhrase(): string {
    // bip39.generateMnemonic() generates 12 words with 128-bit entropy by default
    return bip39.generateMnemonic(128);
}

/**
 * Validate a recovery phrase
 */
export function validateRecoveryPhrase(phrase: string): boolean {
    return bip39.validateMnemonic(phrase.trim().toLowerCase());
}

/**
 * Wrap (encrypt) the DEK using the recovery phrase
 * Uses PBES2-HS512+A256KW with high iteration count
 */
export async function wrapDEK(dek: CryptoKey, phrase: string): Promise<string> {
    // Export the DEK to raw bytes
    const dekBytes = await crypto.subtle.exportKey('raw', dek);

    // Create a JWE with PBES2 key wrapping
    const jwe = await new jose.EncryptJWT({ dek: jose.base64url.encode(new Uint8Array(dekBytes)) })
        .setProtectedHeader({
            alg: KEY_ENCRYPTION_ALG,
            enc: DATA_ENCRYPTION_ALG,
            p2c: PBES2_ITERATIONS // iteration count
        })
        .encrypt(new TextEncoder().encode(phrase.trim().toLowerCase()));

    return jwe;
}

/**
 * Unwrap (decrypt) the DEK using the recovery phrase
 * Throws if phrase is incorrect
 */
export async function unwrapDEK(wrappedDEK: string, phrase: string): Promise<CryptoKey> {
    try {
        const { payload } = await jose.jwtDecrypt(
            wrappedDEK,
            new TextEncoder().encode(phrase.trim().toLowerCase()),
            {
                keyManagementAlgorithms: [KEY_ENCRYPTION_ALG],
                contentEncryptionAlgorithms: [DATA_ENCRYPTION_ALG],
            }
        );

        const dekBytes = jose.base64url.decode(payload.dek as string);

        // Ensure we pass an ArrayBuffer (not ArrayBufferLike) to WebCrypto
        const dekKeyBuffer = new ArrayBuffer(dekBytes.byteLength);
        new Uint8Array(dekKeyBuffer).set(dekBytes);

        return crypto.subtle.importKey(
            'raw',
            dekKeyBuffer,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
    } catch (error) {
        throw new Error('Invalid recovery phrase or corrupted key data');
    }
}

/**
 * Encrypt data using the DEK
 * Returns a JWE compact serialization string
 */
export async function encryptData(data: string, dek: CryptoKey): Promise<string> {
    // Export DEK for jose (it expects Uint8Array for symmetric keys)
    const dekBytes = await crypto.subtle.exportKey('raw', dek);
    const key = new Uint8Array(dekBytes);

    const jwe = await new jose.EncryptJWT({ data })
        .setProtectedHeader({ alg: 'dir', enc: DATA_ENCRYPTION_ALG })
        .setIssuedAt()
        .encrypt(key);

    return jwe;
}

/**
 * Decrypt JWE data using the DEK
 * Returns the original plaintext
 */
export async function decryptData(jwe: string, dek: CryptoKey): Promise<string> {
    try {
        const dekBytes = await crypto.subtle.exportKey('raw', dek);
        const key = new Uint8Array(dekBytes);

        const { payload } = await jose.jwtDecrypt(jwe, key, {
            contentEncryptionAlgorithms: [DATA_ENCRYPTION_ALG],
        });

        return payload.data as string;
    } catch (error) {
        throw new Error('Failed to decrypt data - key mismatch or corrupted data');
    }
}

// ============================================================================
// IndexedDB Storage Functions (DEK Cache)
// ============================================================================

/**
 * Store the DEK in IndexedDB for session use
 * The DEK is stored in extractable form for quick access
 */
export async function cacheDEK(dek: CryptoKey): Promise<void> {
    const dekBytes = await crypto.subtle.exportKey('raw', dek);
    await set(DEK_STORAGE_KEY, new Uint8Array(dekBytes));
}

/**
 * Retrieve the DEK from IndexedDB cache
 * Returns null if not cached
 */
export async function getCachedDEK(): Promise<CryptoKey | null> {
    try {
        const dekBytes = await get<Uint8Array>(DEK_STORAGE_KEY);
        if (!dekBytes) return null;

        // Ensure we pass an ArrayBuffer (not ArrayBufferLike) to WebCrypto
        const dekKeyBuffer = new ArrayBuffer(dekBytes.byteLength);
        new Uint8Array(dekKeyBuffer).set(dekBytes);

        return crypto.subtle.importKey(
            'raw',
            dekKeyBuffer,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
    } catch {
        return null;
    }
}

/**
 * Clear the DEK from IndexedDB (logout/lock)
 */
export async function clearCachedDEK(): Promise<void> {
    await del(DEK_STORAGE_KEY);
}

/**
 * Store wrapped DEK locally (for local-only mode)
 */
export async function storeLocalWrappedDEK(wrappedDEK: string): Promise<void> {
    await set(WRAPPED_DEK_STORAGE_KEY, wrappedDEK);
}

/**
 * Get locally stored wrapped DEK
 */
export async function getLocalWrappedDEK(): Promise<string | null> {
    return (await get<string>(WRAPPED_DEK_STORAGE_KEY)) || null;
}

/**
 * Store persistence mode preference
 */
export async function setPersistenceMode(mode: PersistenceMode): Promise<void> {
    if (mode) {
        await set(PERSISTENCE_MODE_KEY, mode);
    } else {
        await del(PERSISTENCE_MODE_KEY);
    }
}

/**
 * Get persistence mode preference
 */
export async function getPersistenceMode(): Promise<PersistenceMode> {
    return (await get<PersistenceMode>(PERSISTENCE_MODE_KEY)) || null;
}

/**
 * Clear all vault data from local storage
 */
export async function clearVault(): Promise<void> {
    await del(DEK_STORAGE_KEY);
    await del(WRAPPED_DEK_STORAGE_KEY);
    await del(PERSISTENCE_MODE_KEY);
}

// ============================================================================
// Convenience Class (Stateful Wrapper)
// ============================================================================

/**
 * CryptoVault - Stateful wrapper for crypto operations
 * Maintains the active DEK in memory for the session
 */
export class CryptoVault {
    private dek: CryptoKey | null = null;

    get isUnlocked(): boolean {
        return this.dek !== null;
    }

    /**
     * Initialize a new vault with fresh keys
     * Returns the recovery phrase that MUST be saved by the user
     */
    async initialize(): Promise<{ phrase: string; wrappedDEK: string }> {
        const dek = await generateDEK();
        const phrase = generateRecoveryPhrase();
        const wrappedDEK = await wrapDEK(dek, phrase);

        this.dek = dek;
        await cacheDEK(dek);

        return { phrase, wrappedDEK };
    }

    /**
     * Unlock the vault using recovery phrase
     */
    async unlock(wrappedDEK: string, phrase: string): Promise<void> {
        const dek = await unwrapDEK(wrappedDEK, phrase);
        this.dek = dek;
        await cacheDEK(dek);
    }

    /**
     * Try to restore from cached DEK
     */
    async restoreFromCache(): Promise<boolean> {
        const dek = await getCachedDEK();
        if (dek) {
            this.dek = dek;
            return true;
        }
        return false;
    }

    /**
     * Lock the vault (clear DEK from memory and cache)
     */
    async lock(): Promise<void> {
        this.dek = null;
        await clearCachedDEK();
    }

    /**
     * Encrypt data - throws if vault is locked
     */
    async encrypt(plaintext: string): Promise<string> {
        if (!this.dek) throw new Error('Vault is locked');
        return encryptData(plaintext, this.dek);
    }

    /**
     * Decrypt data - throws if vault is locked
     */
    async decrypt(jwe: string): Promise<string> {
        if (!this.dek) throw new Error('Vault is locked');
        return decryptData(jwe, this.dek);
    }
}

// Export singleton instance for app-wide use
export const vault = new CryptoVault();
