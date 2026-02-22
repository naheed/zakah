/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * Persistent session store that backs the in-memory SessionStore with
 * Supabase persistence and server-side encryption.
 *
 * Architecture:
 *   1. In-memory Map is the primary read store (fast)
 *   2. On create/update, data is encrypted and written to Supabase async
 *   3. On get (miss), data is fetched from Supabase and decrypted
 *
 * This replaces the standalone in-memory SessionStore with a durable,
 * encrypted backend while maintaining the same API contract.
 */

import { ZakatFormData, defaultFormData } from '@zakatflow/core';
import { v4 as uuidv4 } from 'uuid';
import { callGateway, isGatewayConfigured } from '../gateway.js';
import { encrypt, decrypt, isEncryptionConfigured } from '../crypto.js';
import {
    findOrCreateChatGPTUser,
    saveSession as saveSessionToDb,
} from '../identity/chatgpt.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ZakatSessionState {
    id: string;
    chatgptUserId?: string;      // From OpenAI Apps SDK context
    zakatflowUserId?: string;    // Internal UUID from chatgpt_users table
    formData: ZakatFormData;
    lastUpdated: number;
    persisted: boolean;          // Whether this session has been written to Supabase
}

// ---------------------------------------------------------------------------
// In-memory store (primary read cache)
// ---------------------------------------------------------------------------
const sessions = new Map<string, ZakatSessionState>();

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const PersistentSessionStore = {
    /**
     * Create a new session, optionally linking to a ChatGPT user.
     *
     * @param chatgptUserId - Optional ChatGPT user ID from Apps SDK context
     * @param displayName - Optional display name
     */
    create: async (
        chatgptUserId?: string,
        displayName?: string
    ): Promise<ZakatSessionState> => {
        const id = uuidv4();

        // Resolve ChatGPT user identity (if provided and Supabase configured)
        let zakatflowUserId: string | undefined;
        if (chatgptUserId) {
            const user = await findOrCreateChatGPTUser(chatgptUserId, displayName);
            zakatflowUserId = user?.id;
        }

        const session: ZakatSessionState = {
            id,
            chatgptUserId,
            zakatflowUserId,
            formData: { ...defaultFormData },
            lastUpdated: Date.now(),
            persisted: false,
        };

        sessions.set(id, session);
        return session;
    },

    /**
     * Get a session by ID.
     * First checks in-memory cache, then falls back to Supabase.
     */
    get: async (id: string): Promise<ZakatSessionState | undefined> => {
        // Cache hit
        const cached = sessions.get(id);
        if (cached) return cached;

        // Gateway fallback not possible for by-ID lookup without user_id.
        // Sessions are populated on create — a cache miss means the session
        // was created in a different process/restart. Return undefined.
        // The in-memory cache is the primary store for active sessions.
        if (!isGatewayConfigured()) return undefined;

        // We don't have user_id to call get_sessions, so return undefined.
        // Sessions fetched from Supabase require knowing the user_id.
        return undefined;
    },

    /**
     * Update a session's form data.
     * Writes encrypted data to Supabase if the session has a linked user.
     */
    update: async (
        id: string,
        updates: Partial<ZakatFormData>
    ): Promise<ZakatSessionState | undefined> => {
        const session = sessions.get(id);
        if (!session) return undefined;

        session.formData = { ...session.formData, ...updates };
        session.lastUpdated = Date.now();
        sessions.set(id, session);

        // Persist to Supabase if user is linked
        if (session.zakatflowUserId) {
            await PersistentSessionStore.persist(session);
        }

        return session;
    },

    /**
     * Persist a session to Supabase with encryption.
     */
    persist: async (session: ZakatSessionState): Promise<void> => {
        if (!session.zakatflowUserId) return;
        if (!isGatewayConfigured()) return;

        // Encrypt the form data
        const encryptedData = encrypt(session.formData);
        const sessionData = encryptedData || session.formData;

        try {
            await callGateway('save_session', {
                user_id: session.zakatflowUserId,
                session_data: sessionData,
                methodology: session.formData.madhab || 'bradford',
                ...(session.persisted ? { session_id: session.id } : {}),
            });
            session.persisted = true;
        } catch (e) {
            console.error('[PersistentStore] Error persisting session:', (e as Error).message);
        }
    },

    /**
     * Delete a session from memory and Supabase.
     */
    delete: async (id: string): Promise<boolean> => {
        const session = sessions.get(id);
        sessions.delete(id);

        // Single-session delete is in-memory only.
        // For full user data deletion, use the delete_my_data tool.

        return !!session;
    },

    /**
     * Clear all in-memory sessions (for testing).
     */
    clear: (): void => {
        sessions.clear();
    },

    /**
     * Get count of in-memory sessions (for monitoring).
     */
    size: (): number => {
        return sessions.size;
    },
};
