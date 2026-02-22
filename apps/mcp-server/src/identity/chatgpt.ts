/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { callGateway, isGatewayConfigured } from '../gateway.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatGPTUser {
    id: string;               // UUID
    chatgpt_user_id: string;  // From OpenAI Apps SDK
    display_name: string | null;
    preferred_madhab: string;
    created_at: string;
    updated_at: string;
    last_seen_at: string;
}

export interface ChatGPTSession {
    id: string;               // UUID
    user_id: string;          // FK to chatgpt_users.id
    session_data: Record<string, unknown> | null;
    methodology: string;
    zakat_due: number | null;
    total_assets: number | null;
    is_above_nisab: boolean | null;
    created_at: string;
    updated_at: string;
}

// ---------------------------------------------------------------------------
// User Identity Service
// ---------------------------------------------------------------------------

/**
 * Find or create a ZakatFlow user record for a ChatGPT user.
 * Routes through the mcp-gateway edge function.
 *
 * @param chatgptUserId - The user ID from the OpenAI Apps SDK context
 * @param displayName - Optional display name from ChatGPT
 * @returns The user record, or null if gateway is not configured
 */
export async function findOrCreateChatGPTUser(
    chatgptUserId: string,
    displayName?: string
): Promise<ChatGPTUser | null> {
    if (!isGatewayConfigured()) {
        console.warn('[ChatGPT Identity] Gateway not configured. Skipping user persistence.');
        return null;
    }

    try {
        const user = await callGateway<ChatGPTUser>('find_or_create_user', {
            chatgpt_user_id: chatgptUserId,
            display_name: displayName || null,
        });
        return user;
    } catch (e) {
        console.error('[ChatGPT Identity] Error in findOrCreateChatGPTUser:', (e as Error).message);
        return null;
    }
}

// ---------------------------------------------------------------------------
// Session Persistence Service
// ---------------------------------------------------------------------------

/**
 * Save a calculation session for a ChatGPT user.
 * Routes through the mcp-gateway edge function.
 */
export async function saveSession(
    userId: string,
    sessionData: Record<string, unknown>,
    methodology: string,
    result: { zakatDue: number; totalAssets: number; isAboveNisab: boolean }
): Promise<ChatGPTSession | null> {
    if (!isGatewayConfigured()) {
        console.warn('[ChatGPT Identity] Gateway not configured. Skipping session save.');
        return null;
    }

    try {
        const session = await callGateway<ChatGPTSession>('save_session', {
            user_id: userId,
            session_data: sessionData,
            methodology,
            zakat_due: result.zakatDue,
            total_assets: result.totalAssets,
            is_above_nisab: result.isAboveNisab,
        });
        return session;
    } catch (e) {
        console.error('[ChatGPT Identity] Error saving session:', (e as Error).message);
        return null;
    }
}

/**
 * Get the most recent sessions for a ChatGPT user.
 * Routes through the mcp-gateway edge function.
 */
export async function getRecentSessions(
    userId: string,
    limit = 5
): Promise<ChatGPTSession[]> {
    if (!isGatewayConfigured()) return [];

    try {
        const sessions = await callGateway<ChatGPTSession[]>('get_sessions', {
            user_id: userId,
            limit,
        });
        return sessions || [];
    } catch (e) {
        console.error('[ChatGPT Identity] Error fetching sessions:', (e as Error).message);
        return [];
    }
}

/**
 * Update a user's preferred methodology.
 * Folded into find_or_create_user — calling it again updates the user record.
 *
 * Note: The gateway's find_or_create_user updates last_seen_at on existing users.
 * For preferred_madhab, we rely on the session methodology being tracked separately.
 * This is a no-op until the gateway adds an update_user action.
 */
export async function updatePreferredMadhab(
    chatgptUserId: string,
    madhab: string
): Promise<void> {
    // Currently a no-op — the gateway doesn't support field-level user updates yet.
    // The preferred methodology is tracked via session data instead.
    console.debug(`[ChatGPT Identity] Preferred madhab update deferred: ${chatgptUserId} -> ${madhab}`);
}
