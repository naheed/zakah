/**
 * Test Setup
 * 
 * Global configuration for Vitest tests.
 * Includes mocks for browser APIs not available in happy-dom.
 */

import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';

// Mock crypto.subtle for tests (happy-dom doesn't fully implement it)
// In tests, we'll use the actual Web Crypto API when available
if (typeof globalThis.crypto === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    globalThis.crypto = require('crypto').webcrypto as Crypto;
}

// Mock IndexedDB for idb-keyval
// Using fake-indexeddb would be more complete, but for unit tests
// we can mock at the idb-keyval level
vi.mock('idb-keyval', () => {
    const store = new Map<string, unknown>();
    return {
        get: vi.fn((key: string) => Promise.resolve(store.get(key))),
        set: vi.fn((key: string, value: unknown) => {
            store.set(key, value);
            return Promise.resolve();
        }),
        del: vi.fn((key: string) => {
            store.delete(key);
            return Promise.resolve();
        }),
        clear: vi.fn(() => {
            store.clear();
            return Promise.resolve();
        }),
        // Expose store for test assertions
        __store: store,
    };
});

// Clean up after each test
afterEach(() => {
    vi.clearAllMocks();
});
