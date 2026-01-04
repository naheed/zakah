/**
 * Session-specific encryption for localStorage data.
 * 
 * Uses AES-256-GCM encryption with a session-derived key that is stored
 * in sessionStorage. When the browser closes, the key is automatically
 * cleared, making the encrypted localStorage data unreadable.
 * 
 * This provides true encryption for session data without requiring
 * user authentication.
 */

const SESSION_KEY_STORAGE = 'zakat-session-key';
const ENCRYPTION_PREFIX = 'v2:'; // Identifies encrypted data
// Force HMR update

/**
 * Get or create a session-specific encryption key.
 * The key is stored in sessionStorage and cleared when the browser closes.
 */
async function getOrCreateSessionKey(): Promise<CryptoKey> {
  const storedKey = sessionStorage.getItem(SESSION_KEY_STORAGE);

  if (storedKey) {
    console.debug('[Encryption] Found existing session key in storage');
    try {
      // Import existing key
      const keyData = Uint8Array.from(atob(storedKey), c => c.charCodeAt(0));
      return await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (e) {
      console.error('Failed to import session key, generating new one:', e);
      // Fall through to generate new key
    }
  }

  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  console.debug('[Encryption] Generated NEW session key');

  // Export and store in sessionStorage
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
  sessionStorage.setItem(SESSION_KEY_STORAGE, keyBase64);

  return key;
}

/**
 * Encrypt data for session storage using AES-256-GCM.
 * Returns a base64-encoded string with encryption prefix.
 */
export async function encryptSession(data: unknown): Promise<string> {
  try {
    const key = await getOrCreateSessionKey();

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encode data as JSON and then as bytes
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(jsonString);

    // Encrypt
    const encryptedBytes = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBytes
    );

    // Combine IV + encrypted data
    const combined = new Uint8Array(iv.length + encryptedBytes.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBytes), iv.length);

    // Encode as base64 with prefix
    return ENCRYPTION_PREFIX + btoa(String.fromCharCode(...combined));
  } catch (e) {
    console.error('Session encryption failed:', e);
    throw new Error('Failed to encrypt session data');
  }
}

/**
 * Decrypt session data encrypted with encryptSession.
 * Returns null if decryption fails (e.g., session key was cleared).
 */
export async function decryptSession<T = unknown>(encryptedData: string): Promise<T | null> {
  // Check for encryption prefix
  if (!encryptedData.startsWith(ENCRYPTION_PREFIX)) {
    return null;
  }

  try {
    const key = await getOrCreateSessionKey();
    console.debug('[Encryption] Attempting decryption of data length:', encryptedData.length);

    // Remove prefix and decode base64
    const base64Data = encryptedData.slice(ENCRYPTION_PREFIX.length);
    const combined = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedBytes = combined.slice(12);

    // Decrypt
    const decryptedBytes = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBytes
    );

    // Decode JSON
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedBytes);
    console.debug('[Encryption] Decryption successful');
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.error('[Encryption] Session decryption failed details:', e);
    return null;
  }
}

/**
 * Check if data is encrypted with session encryption.
 */
export function isSessionEncrypted(data: string): boolean {
  return data.startsWith(ENCRYPTION_PREFIX);
}

/**
 * Try to decrypt legacy obfuscated (base64) data.
 * Returns null if decryption fails.
 */
export function deobfuscateLegacy<T = unknown>(data: string): T | null {
  try {
    // Try base64 decode with URI component encoding
    const decoded = decodeURIComponent(atob(data));
    return JSON.parse(decoded) as T;
  } catch {
    try {
      // Try raw JSON parse (very old format)
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }
}

/**
 * Clear the session encryption key.
 * Call this when user logs out or wants to clear session.
 */
export function clearSessionKey(): void {
  sessionStorage.removeItem(SESSION_KEY_STORAGE);
}
