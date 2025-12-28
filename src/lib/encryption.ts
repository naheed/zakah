/**
 * Client-side encryption utilities for E2EE
 * Uses Web Crypto API for AES-GCM (symmetric) and RSA-OAEP (asymmetric)
 */

const SYMMETRIC_ALGORITHM = 'AES-GCM';
const ASYMMETRIC_ALGORITHM = 'RSA-OAEP';
const HASH_ALGORITHM = 'SHA-256';
const KEY_LENGTH = 256;
const RSA_KEY_LENGTH = 2048;

// IndexedDB database name and store
const DB_NAME = 'zakat-encryption-keys';
const STORE_NAME = 'keys';
const SYMMETRIC_KEY_ID = 'symmetric-key';
const KEY_PAIR_ID = 'key-pair';

/**
 * Open IndexedDB connection
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Store a value in IndexedDB
 */
async function storeInDB(id: string, value: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({ id, value });
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    
    tx.oncomplete = () => db.close();
  });
}

/**
 * Retrieve a value from IndexedDB
 */
async function getFromDB(id: string): Promise<any | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result?.value ?? null);
    
    tx.oncomplete = () => db.close();
  });
}

/**
 * Clear all keys from IndexedDB
 */
export async function clearAllKeys(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
    
    tx.oncomplete = () => db.close();
  });
}

// ============ SYMMETRIC ENCRYPTION (for user's own data) ============

/**
 * Generate a new AES-GCM symmetric key
 */
export async function generateSymmetricKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: SYMMETRIC_ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable for export/import
    ['encrypt', 'decrypt']
  );
}

/**
 * Export symmetric key to base64 for storage
 */
export async function exportSymmetricKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return arrayBufferToBase64(exported);
}

/**
 * Import symmetric key from base64
 */
export async function importSymmetricKey(base64Key: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(base64Key);
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: SYMMETRIC_ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data with symmetric key
 * Returns base64 encoded string with IV prepended
 */
export async function encryptData(data: any, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: SYMMETRIC_ALGORITHM,
      iv,
    },
    key,
    plaintext
  );
  
  // Prepend IV to ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  
  return arrayBufferToBase64(combined.buffer);
}

/**
 * Decrypt data with symmetric key
 * Expects base64 encoded string with IV prepended
 */
export async function decryptData(encryptedBase64: string, key: CryptoKey): Promise<any> {
  const combined = base64ToArrayBuffer(encryptedBase64);
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  
  const plaintext = await crypto.subtle.decrypt(
    {
      name: SYMMETRIC_ALGORITHM,
      iv: new Uint8Array(iv),
    },
    key,
    ciphertext
  );
  
  const decoded = new TextDecoder().decode(plaintext);
  return JSON.parse(decoded);
}

// ============ ASYMMETRIC ENCRYPTION (for sharing) ============

/**
 * Generate RSA key pair for sharing
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: ASYMMETRIC_ALGORITHM,
      modulusLength: RSA_KEY_LENGTH,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: HASH_ALGORITHM,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Export public key to base64 (for storing in database)
 */
export async function exportPublicKey(keyPair: CryptoKeyPair): Promise<string> {
  const exported = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  return arrayBufferToBase64(exported);
}

/**
 * Import public key from base64
 */
export async function importPublicKey(base64Key: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(base64Key);
  return crypto.subtle.importKey(
    'spki',
    keyData,
    {
      name: ASYMMETRIC_ALGORITHM,
      hash: HASH_ALGORITHM,
    },
    true,
    ['encrypt']
  );
}

/**
 * Export private key to base64 (for backup/storage)
 */
export async function exportPrivateKey(keyPair: CryptoKeyPair): Promise<string> {
  const exported = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  return arrayBufferToBase64(exported);
}

/**
 * Import private key from base64
 */
export async function importPrivateKey(base64Key: string): Promise<CryptoKey> {
  const keyData = base64ToArrayBuffer(base64Key);
  return crypto.subtle.importKey(
    'pkcs8',
    keyData,
    {
      name: ASYMMETRIC_ALGORITHM,
      hash: HASH_ALGORITHM,
    },
    true,
    ['decrypt']
  );
}

/**
 * Encrypt a symmetric key with recipient's public key
 * Used for sharing data with another user
 */
export async function encryptSymmetricKeyForRecipient(
  symmetricKey: CryptoKey,
  recipientPublicKey: CryptoKey
): Promise<string> {
  const exportedKey = await crypto.subtle.exportKey('raw', symmetricKey);
  const encrypted = await crypto.subtle.encrypt(
    { name: ASYMMETRIC_ALGORITHM },
    recipientPublicKey,
    exportedKey
  );
  return arrayBufferToBase64(encrypted);
}

/**
 * Decrypt a symmetric key with own private key
 * Used when receiving shared data
 */
export async function decryptSymmetricKeyFromSender(
  encryptedKeyBase64: string,
  privateKey: CryptoKey
): Promise<CryptoKey> {
  const encryptedKey = base64ToArrayBuffer(encryptedKeyBase64);
  const decrypted = await crypto.subtle.decrypt(
    { name: ASYMMETRIC_ALGORITHM },
    privateKey,
    encryptedKey
  );
  return crypto.subtle.importKey(
    'raw',
    decrypted,
    { name: SYMMETRIC_ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
}

// ============ KEY MANAGEMENT (IndexedDB) ============

/**
 * Store symmetric key in IndexedDB
 */
export async function storeSymmetricKey(key: CryptoKey): Promise<void> {
  const exported = await exportSymmetricKey(key);
  await storeInDB(SYMMETRIC_KEY_ID, exported);
}

/**
 * Retrieve symmetric key from IndexedDB
 */
export async function retrieveSymmetricKey(): Promise<CryptoKey | null> {
  const exported = await getFromDB(SYMMETRIC_KEY_ID);
  if (!exported) return null;
  return importSymmetricKey(exported);
}

/**
 * Store key pair in IndexedDB
 */
export async function storeKeyPair(keyPair: CryptoKeyPair): Promise<void> {
  const publicKey = await exportPublicKey(keyPair);
  const privateKey = await exportPrivateKey(keyPair);
  await storeInDB(KEY_PAIR_ID, { publicKey, privateKey });
}

/**
 * Retrieve key pair from IndexedDB
 */
export async function retrieveKeyPair(): Promise<CryptoKeyPair | null> {
  const stored = await getFromDB(KEY_PAIR_ID);
  if (!stored) return null;
  
  const publicKey = await importPublicKey(stored.publicKey);
  const privateKey = await importPrivateKey(stored.privateKey);
  
  return { publicKey, privateKey };
}

/**
 * Get exportable public key string from stored key pair
 */
export async function getStoredPublicKey(): Promise<string | null> {
  const stored = await getFromDB(KEY_PAIR_ID);
  return stored?.publicKey ?? null;
}

// ============ UTILITY FUNCTIONS ============

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
