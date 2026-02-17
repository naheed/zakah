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
