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
 * usePrivacyVault - React Hook for Zero Knowledge Privacy Vault
 * 
 * Manages vault lifecycle:
 * - Loading state (checking for cached DEK)
 * - Unlocked state (ready for encrypt/decrypt)
 * - Needs phrase state (recovery required)
 * - Needs setup state (first time user)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
    vault,
    generateRecoveryPhrase,
    generateDEK,
    wrapDEK,
    unwrapDEK,
    cacheDEK,
    getCachedDEK,
    clearCachedDEK,
    getLocalWrappedDEK,
    storeLocalWrappedDEK,
    getPersistenceMode,
    setPersistenceMode,
    clearVault,
    type PersistenceMode,
} from '@/lib/CryptoService';
import { supabase } from '@/integrations/supabase/runtimeClient';

// ============================================================================
// Types
// ============================================================================

export type VaultStatus =
    | 'loading'
    | 'unlocked'
    | 'needs_phrase'
    | 'needs_setup';

export interface VaultState {
    status: VaultStatus;
    persistenceMode: PersistenceMode;
}

export interface UsePrivacyVaultReturn {
    // State
    status: VaultStatus;
    persistenceMode: PersistenceMode;
    isUnlocked: boolean;

    // Actions
    initializeVault: (mode: PersistenceMode) => Promise<{ phrase?: string }>;
    unlockVault: (phrase?: string) => Promise<void>;
    lockVault: () => Promise<void>;
    resetVault: () => Promise<void>;

    // Crypto operations (only available when unlocked)
    encrypt: (plaintext: string) => Promise<string>;
    decrypt: (jwe: string) => Promise<string>;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function usePrivacyVault(): UsePrivacyVaultReturn {
    const { user } = useAuth();
    const [status, setStatus] = useState<VaultStatus>('loading');
    const [persistenceMode, setPersistenceModeState] = useState<PersistenceMode>(null);
    const [wrappedDEK, setWrappedDEK] = useState<string | null>(null);

    // -------------------------------------------------------------------------
    // Initialization: Check vault state on mount
    // -------------------------------------------------------------------------
    useEffect(() => {
        async function checkVaultState() {
            setStatus('loading');

            try {
                // 1. Try to restore from cache (fastest path)
                const restored = await vault.restoreFromCache();
                if (restored) {
                    const mode = await getPersistenceMode();
                    setPersistenceModeState(mode);
                    setStatus('unlocked');
                    return;
                }

                // 2. Check persistence mode
                const mode = await getPersistenceMode();
                setPersistenceModeState(mode);

                // 3. If no mode set, user needs to set up
                // 3. If no mode set, default to 'managed' logic for new users
                if (!mode) {
                    setStatus('needs_setup');
                    return;
                }

                // 4. Try to get key based on mode
                let wrapped: string | null = null;
                let managed: string | null = null;

                if (mode === 'local') {
                    wrapped = await getLocalWrappedDEK();
                } else if (mode === 'cloud' || mode === 'managed' || mode === 'sovereign') {
                    if (user) {
                        // Fetch from Supabase user profile
                        const { data, error } = await supabase
                            .from('user_profiles')
                            .select('encrypted_master_key, managed_key, persistence_mode')
                            .eq('id', user.id)
                            .single();

                        const profile = data as any;
                        if (!error && profile) {
                            if (profile.persistence_mode === 'managed' && profile.managed_key) {
                                managed = profile.managed_key;
                            } else if (profile.encrypted_master_key) {
                                wrapped = profile.encrypted_master_key;
                            }
                        }
                    }
                }

                if (managed) {
                    // Auto-unlock for managed mode
                    // We need to import the key string back to CryptoKey
                    // Since vault.unlock expects a wrapped key + phrase for unwrapping, 
                    // we need a new method on vault to just set the raw key.
                    // Implementation detail: The 'managed' key IS the raw DEK (exported)

                    // Decode base64 to Uint8Array
                    const binaryString = atob(managed);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }

                    const dek = await crypto.subtle.importKey(
                        'raw',
                        bytes,
                        { name: 'AES-GCM', length: 256 },
                        true,
                        ['encrypt', 'decrypt']
                    );

                    await vault.setRawKey(dek);
                    setStatus('unlocked');
                } else if (wrapped) {
                    setWrappedDEK(wrapped);
                    setStatus('needs_phrase');
                } else {
                    setStatus('needs_setup');
                }
            } catch (error) {
                console.error('[PrivacyVault] Initialization error:', error);
                setStatus('needs_setup');
            }
        }

        checkVaultState();
    }, [user]);

    // -------------------------------------------------------------------------
    // Initialize a new vault
    // -------------------------------------------------------------------------
    const initializeVault = useCallback(async (mode: PersistenceMode): Promise<{ phrase?: string }> => {
        if (!mode) throw new Error('Persistence mode is required');

        // Generate new DEK
        const dek = await generateDEK();

        // Cache DEK for immediate use
        await cacheDEK(dek);

        // Store based on mode
        await setPersistenceMode(mode);
        setPersistenceModeState(mode);

        if (mode === 'managed') {
            // Managed Mode: Store raw DEK (encrypted by RLS) in Supabase
            // We need to export it to string first
            const exported = await crypto.subtle.exportKey('raw', dek);
            const binaryString = String.fromCharCode(...new Uint8Array(exported));
            const base64Key = btoa(binaryString);

            if (user) {
                const { error } = await supabase
                    .from('user_profiles')
                    .upsert({
                        id: user.id,
                        managed_key: base64Key,
                        persistence_mode: 'managed',
                        updated_at: new Date().toISOString(),
                    });

                if (error) {
                    console.error('[PrivacyVault] Failed to save managed key:', error);
                    throw error;
                }
            }

            // Allow immediate use without phrase
            await vault.setRawKey(dek);
            setStatus('unlocked');
            return {}; // No phrase needed

        } else {
            // Sovereign / Local / Cloud (Legacy) Mode: Wrap with phrase
            const phrase = generateRecoveryPhrase();
            const wrapped = await wrapDEK(dek, phrase);

            if (mode === 'local') {
                await storeLocalWrappedDEK(wrapped);
            } else if ((mode === 'cloud' || mode === 'sovereign') && user) {
                const { error } = await supabase
                    .from('user_profiles')
                    .upsert({
                        id: user.id,
                        encrypted_master_key: wrapped,
                        persistence_mode: 'sovereign',
                        updated_at: new Date().toISOString(),
                    });

                if (error) {
                    console.error('[PrivacyVault] Failed to save to cloud:', error);
                    // Fallback to local
                    await storeLocalWrappedDEK(wrapped);
                }
            }

            // Activate
            if (mode === 'local' || mode === 'cloud' || mode === 'sovereign') {
                // For sovereign modes, we need to restore using the phrase content implicitly
                // ensuring the vault instance has the key
                await vault.setRawKey(dek);
            }

            setStatus('unlocked');
            return { phrase };
        }
    }, [user]);

    // -------------------------------------------------------------------------
    // Unlock vault
    // -------------------------------------------------------------------------
    const unlockVault = useCallback(async (phrase?: string): Promise<void> => {
        // If managed mode, we shouldn't even be here usually as checkVaultState handles it,
        // but if we need to force re-fetch:

        const mode = persistenceMode;

        if (mode === 'managed' && user) {
            const { data } = await supabase
                .from('user_profiles')
                .select('managed_key')
                .eq('id', user.id)
                .single();

            const profile = data as any;
            if (profile?.managed_key) {
                const binaryString = atob(profile.managed_key);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                const dek = await crypto.subtle.importKey(
                    'raw',
                    bytes,
                    { name: 'AES-GCM', length: 256 },
                    true,
                    ['encrypt', 'decrypt']
                );

                await vault.setRawKey(dek);
                setStatus('unlocked');
                return;
            }
        }

        // Sovereign logic
        if (!phrase) throw new Error('Recovery phrase required for sovereign mode');

        if (!wrappedDEK) {
            // ... (existing fetch logic)
            let wrapped: string | null = null;
            if (mode === 'local') {
                wrapped = await getLocalWrappedDEK();
            } else if ((mode === 'cloud' || mode === 'sovereign') && user) {
                const { data } = await (supabase
                    .from('user_profiles')
                    .select('encrypted_master_key')
                    .eq('id', user.id)
                    .single() as any);
                const profile = data as any;
                wrapped = profile?.encrypted_master_key || null;
            }

            if (!wrapped) throw new Error('No encrypted key found');

            setWrappedDEK(wrapped);
            await vault.unlock(wrapped, phrase);
        } else {
            await vault.unlock(wrappedDEK, phrase);
        }

        setStatus('unlocked');
    }, [wrappedDEK, persistenceMode, user]);

    // -------------------------------------------------------------------------
    // Lock vault (clear session)
    // -------------------------------------------------------------------------
    const lockVault = useCallback(async (): Promise<void> => {
        await vault.lock();
        // If managed, we effectively stay "unlocked" next time they load if logged in
        // But explicitly calling lock clears the memory.
        setStatus(persistenceMode === 'managed' ? 'loading' : 'needs_phrase');
    }, [persistenceMode]);

    // -------------------------------------------------------------------------
    // Reset vault (complete wipe)
    // -------------------------------------------------------------------------
    const resetVault = useCallback(async (): Promise<void> => {
        await clearVault();

        if (user) {
            // Clear from Supabase
            await supabase
                .from('user_profiles')
                .update({
                    encrypted_master_key: null,
                    managed_key: null,
                    persistence_mode: null
                })
                .eq('id', user.id);
        }

        setPersistenceModeState(null);
        setWrappedDEK(null);
        setStatus('needs_setup');
    }, [user]);

    // -------------------------------------------------------------------------
    // Encrypt/Decrypt (proxy to vault instance)
    // -------------------------------------------------------------------------
    const encrypt = useCallback(async (plaintext: string): Promise<string> => {
        if (status !== 'unlocked') {
            throw new Error('Vault is locked');
        }
        return vault.encrypt(plaintext);
    }, [status]);

    const decrypt = useCallback(async (jwe: string): Promise<string> => {
        if (status !== 'unlocked') {
            throw new Error('Vault is locked');
        }
        return vault.decrypt(jwe);
    }, [status]);

    // -------------------------------------------------------------------------
    // Return
    // -------------------------------------------------------------------------
    return useMemo(() => ({
        status,
        persistenceMode,
        isUnlocked: status === 'unlocked',
        initializeVault,
        unlockVault,
        lockVault,
        resetVault,
        encrypt,
        decrypt,
    }), [
        status,
        persistenceMode,
        initializeVault,
        unlockVault,
        lockVault,
        resetVault,
        encrypt,
        decrypt,
    ]);
}
