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
 * Unified Encryption Layer
 * 
 * Provides a unified interface for data encryption that:
 * 1. Uses Privacy Vault (recoverable JWE) when vault is unlocked
 * 2. Falls back to session encryption (ephemeral) for guests
 * 
 * This ensures data is always encrypted, but with recoverability
 * when the user has set up their vault.
 */

import { vault } from '@/lib/CryptoService';
import { encryptSession, decryptSession, isSessionEncrypted } from '@/lib/sessionEncryption';

// Prefix to identify vault-encrypted data
const VAULT_PREFIX = 'vault:';

/**
 * Check if data is encrypted with the vault
 */
export function isVaultEncrypted(data: string): boolean {
    return data.startsWith(VAULT_PREFIX);
}

/**
 * Encrypt data using the best available method:
 * - Vault encryption if vault is unlocked (recoverable)
 * - Session encryption as fallback (ephemeral)
 */
export async function encryptData<T>(data: T): Promise<string> {
    const jsonString = JSON.stringify(data);

    // Try vault encryption first (recoverable)
    if (vault.isUnlocked) {
        try {
            const jwe = await vault.encrypt(jsonString);
            return VAULT_PREFIX + jwe;
        } catch (error) {
            console.error('[UnifiedEncryption] Vault encryption failed:', error);
            throw new Error('Encryption failed. Please try again or lock/unlock your vault.');
        }
    }

    // Fallback to session encryption (ephemeral) ONLY if vault is locked
    return encryptSession(data);
}

/**
 * Decrypt data using the appropriate method based on prefix
 */
export async function decryptData<T>(encryptedData: string): Promise<T | null> {
    // Handle vault-encrypted data
    if (isVaultEncrypted(encryptedData)) {
        const jwe = encryptedData.slice(VAULT_PREFIX.length);

        if (!vault.isUnlocked) {
            console.warn('[UnifiedEncryption] Vault is locked, cannot decrypt vault data');
            return null;
        }

        try {
            const jsonString = await vault.decrypt(jwe);
            return JSON.parse(jsonString) as T;
        } catch (error) {
            console.error('[UnifiedEncryption] Vault decryption failed:', error);
            return null;
        }
    }

    // Handle session-encrypted data
    if (isSessionEncrypted(encryptedData)) {
        return decryptSession<T>(encryptedData);
    }

    // Try parsing as plain JSON (very old format)
    try {
        return JSON.parse(encryptedData) as T;
    } catch {
        return null;
    }
}

/**
 * Re-encrypt data with the current best method
 * Useful for upgrading session-encrypted data to vault-encrypted
 */
export async function reEncryptWithVault<T>(data: T): Promise<string | null> {
    if (!vault.isUnlocked) {
        console.warn('[UnifiedEncryption] Cannot re-encrypt: vault is locked');
        return null;
    }

    try {
        const jsonString = JSON.stringify(data);
        const jwe = await vault.encrypt(jsonString);
        return VAULT_PREFIX + jwe;
    } catch (error) {
        console.error('[UnifiedEncryption] Re-encryption failed:', error);
        return null;
    }
}

/**
 * Check if stored data should be upgraded to vault encryption
 * Returns true if data is session-encrypted but vault is now available
 */
export function shouldUpgradeToVault(encryptedData: string): boolean {
    return vault.isUnlocked && isSessionEncrypted(encryptedData) && !isVaultEncrypted(encryptedData);
}
