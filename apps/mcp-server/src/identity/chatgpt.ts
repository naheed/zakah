/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { getSupabaseAdmin } from '../supabase.js';

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
 * This implements the "Login with ChatGPT" identity pattern:
 * - First call: creates a new user record keyed to the ChatGPT user ID
 * - Subsequent calls: returns the existing record and updates last_seen_at
 *
 * @param chatgptUserId - The user ID from the OpenAI Apps SDK context
 * @param displayName - Optional display name from ChatGPT
 * @returns The user record, or null if Supabase is not configured
 */
export async function findOrCreateChatGPTUser(
    chatgptUserId: string,
    displayName?: string
): Promise<ChatGPTUser | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        console.warn('[ChatGPT Identity] Supabase admin client not configured. Skipping user persistence.');
        return null;
    }

    // Try to find existing user
    const { data: existing, error: findError } = await supabase
        .from('chatgpt_users')
        .select('*')
        .eq('chatgpt_user_id', chatgptUserId)
        .maybeSingle();

    if (findError) {
        console.error('[ChatGPT Identity] Error finding user:', findError.message);
        return null;
    }

    if (existing) {
        // Update last_seen_at
        await supabase
            .from('chatgpt_users')
            .update({ last_seen_at: new Date().toISOString() })
            .eq('id', existing.id);

        return existing as ChatGPTUser;
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
        .from('chatgpt_users')
        .insert({
            chatgpt_user_id: chatgptUserId,
            display_name: displayName || null,
            preferred_madhab: 'bradford',
        })
        .select()
        .single();

    if (createError) {
        console.error('[ChatGPT Identity] Error creating user:', createError.message);
        return null;
    }

    console.log(`[ChatGPT Identity] Created new user: ${chatgptUserId}`);
    return newUser as ChatGPTUser;
}

// ---------------------------------------------------------------------------
// Session Persistence Service
// ---------------------------------------------------------------------------

/**
 * Save a calculation session for a ChatGPT user.
 *
 * @param userId - The ZakatFlow user UUID (from chatgpt_users.id)
 * @param sessionData - The ZakatFormData as a JSON object
 * @param methodology - The madhab/methodology used
 * @param result - Calculation result summary
 * @returns The session record, or null on failure
 */
export async function saveSession(
    userId: string,
    sessionData: Record<string, unknown>,
    methodology: string,
    result: { zakatDue: number; totalAssets: number; isAboveNisab: boolean }
): Promise<ChatGPTSession | null> {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        console.warn('[ChatGPT Identity] Supabase admin client not configured. Skipping session save.');
        return null;
    }

    const { data, error } = await supabase
        .from('chatgpt_sessions')
        .insert({
            user_id: userId,
            session_data: sessionData,
            methodology,
            zakat_due: result.zakatDue,
            total_assets: result.totalAssets,
            is_above_nisab: result.isAboveNisab,
        })
        .select()
        .single();

    if (error) {
        console.error('[ChatGPT Identity] Error saving session:', error.message);
        return null;
    }

    return data as ChatGPTSession;
}

/**
 * Get the most recent sessions for a ChatGPT user.
 *
 * @param userId - The ZakatFlow user UUID
 * @param limit - Max number of sessions to return (default: 5)
 * @returns Array of sessions, newest first
 */
export async function getRecentSessions(
    userId: string,
    limit = 5
): Promise<ChatGPTSession[]> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('chatgpt_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('[ChatGPT Identity] Error fetching sessions:', error.message);
        return [];
    }

    return (data || []) as ChatGPTSession[];
}

/**
 * Update a user's preferred methodology based on their most recent calculation.
 *
 * @param chatgptUserId - The ChatGPT user ID
 * @param madhab - The methodology to set as preferred
 */
export async function updatePreferredMadhab(
    chatgptUserId: string,
    madhab: string
): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return;

    const { error } = await supabase
        .from('chatgpt_users')
        .update({ preferred_madhab: madhab })
        .eq('chatgpt_user_id', chatgptUserId);

    if (error) {
        console.error('[ChatGPT Identity] Error updating preferred madhab:', error.message);
    }
}
