/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * Server-side AES-256-GCM encryption for ChatGPT session data.
 *
 * Adapted from the Privacy Vault pattern (apps/web/src/lib/sessionEncryption.ts)
 * for server-side Node.js crypto. Uses a master key from env vars to derive
 * per-encryption DEKs.
 *
 * Key hierarchy:
 *   ENCRYPTION_MASTER_KEY (env var, 64 hex chars = 256 bits)
 *     → scrypt(master_key + salt) → DEK (per-encryption)
 *       → AES-256-GCM(DEK, IV, plaintext) → ciphertext
 *
 * Envelope format (base64-encoded):
 *   [salt:16][iv:12][authTag:16][ciphertext:N]
 *
 * Compatible with the web app's Privacy Vault encryption standard.
 */

import {
    createCipheriv,
    createDecipheriv,
    randomBytes,
    scryptSync,
} from 'node:crypto';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;          // 96-bit IV for GCM
const AUTH_TAG_LENGTH = 16;    // 128-bit authentication tag
const SALT_LENGTH = 16;        // 128-bit salt for scrypt key derivation
const KEY_LENGTH = 32;         // 256-bit key
const SCRYPT_COST = 16384;     // N parameter for scrypt (2^14)
const SCRYPT_BLOCK_SIZE = 8;   // r parameter
const SCRYPT_PARALLELISM = 1;  // p parameter
const ENCRYPTED_PREFIX = 'enc:v1:'; // Identifies server-encrypted data

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get the master key from environment. Returns null if not configured.
 */
function getMasterKey(): Buffer | null {
    const key = process.env.ENCRYPTION_MASTER_KEY;
    if (!key) return null;

    // Accept 64 hex chars (256 bits) or raw 32-byte base64
    if (/^[0-9a-fA-F]{64}$/.test(key)) {
        return Buffer.from(key, 'hex');
    }
    const buf = Buffer.from(key, 'base64');
    if (buf.length === KEY_LENGTH) return buf;

    console.error('[Crypto] ENCRYPTION_MASTER_KEY must be 64 hex chars or 32-byte base64');
    return null;
}

/**
 * Derive an encryption key from the master key using scrypt.
 */
function deriveKey(masterKey: Buffer, salt: Buffer): Buffer {
    return scryptSync(masterKey, salt, KEY_LENGTH, {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELISM,
    });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check if server-side encryption is available.
 */
export function isEncryptionConfigured(): boolean {
    return getMasterKey() !== null;
}

/**
 * Encrypt a JSON-serializable value using AES-256-GCM.
 *
 * @param data - Any JSON-serializable value
 * @returns Base64-encoded ciphertext with `enc:v1:` prefix, or null if encryption is not configured
 */
export function encrypt(data: unknown): string | null {
    const masterKey = getMasterKey();
    if (!masterKey) {
        console.warn('[Crypto] Encryption not configured. Data stored in plaintext.');
        return null;
    }

    const salt = randomBytes(SALT_LENGTH);
    const iv = randomBytes(IV_LENGTH);
    const dek = deriveKey(masterKey, salt);

    const cipher = createCipheriv(ALGORITHM, dek, iv, { authTagLength: AUTH_TAG_LENGTH });
    const plaintext = JSON.stringify(data);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // Envelope: salt + iv + authTag + ciphertext
    const envelope = Buffer.concat([salt, iv, authTag, encrypted]);

    return ENCRYPTED_PREFIX + envelope.toString('base64');
}

/**
 * Decrypt a value encrypted with `encrypt()`.
 *
 * @param encryptedData - The `enc:v1:` prefixed ciphertext
 * @returns Parsed JSON value, or null if decryption fails
 */
export function decrypt<T = unknown>(encryptedData: string): T | null {
    if (!encryptedData.startsWith(ENCRYPTED_PREFIX)) {
        // Not encrypted — try to parse as plain JSON
        try {
            return JSON.parse(encryptedData) as T;
        } catch {
            return null;
        }
    }

    const masterKey = getMasterKey();
    if (!masterKey) {
        console.error('[Crypto] Cannot decrypt: ENCRYPTION_MASTER_KEY not configured');
        return null;
    }

    try {
        const envelope = Buffer.from(
            encryptedData.slice(ENCRYPTED_PREFIX.length),
            'base64'
        );

        // Extract components
        const salt = envelope.subarray(0, SALT_LENGTH);
        const iv = envelope.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const authTag = envelope.subarray(
            SALT_LENGTH + IV_LENGTH,
            SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
        );
        const ciphertext = envelope.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);

        // Derive the same key
        const dek = deriveKey(masterKey, salt);

        const decipher = createDecipheriv(ALGORITHM, dek, iv, { authTagLength: AUTH_TAG_LENGTH });
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([
            decipher.update(ciphertext),
            decipher.final(),
        ]);

        return JSON.parse(decrypted.toString('utf8')) as T;
    } catch (e) {
        console.error('[Crypto] Decryption failed:', (e as Error).message);
        return null;
    }
}

/**
 * Check if a string is server-encrypted data.
 */
export function isEncrypted(data: string): boolean {
    return data.startsWith(ENCRYPTED_PREFIX);
}

/**
 * Generate a new random master key (for initial setup).
 * Returns 64 hex characters suitable for ENCRYPTION_MASTER_KEY env var.
 */
export function generateMasterKey(): string {
    return randomBytes(KEY_LENGTH).toString('hex');
}
