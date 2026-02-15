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
    initializeVault: (mode: PersistenceMode) => Promise<{ phrase: string }>;
    unlockVault: (phrase: string) => Promise<void>;
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
                if (!mode) {
                    setStatus('needs_setup');
                    return;
                }

                // 4. Try to get wrapped DEK based on mode
                let wrapped: string | null = null;

                if (mode === 'local') {
                    wrapped = await getLocalWrappedDEK();
                } else if (mode === 'cloud' && user) {
                    // Fetch from Supabase user profile
                    const { data, error } = await supabase
                        .from('user_profiles')
                        .select('encrypted_master_key')
                        .eq('id', user.id)
                        .single();

                    if (!error && data?.encrypted_master_key) {
                        wrapped = data.encrypted_master_key;
                    }
                }

                if (wrapped) {
                    setWrappedDEK(wrapped);
                    setStatus('needs_phrase');
                } else {
                    // Has mode but no key - might be corrupted state
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
    const initializeVault = useCallback(async (mode: PersistenceMode): Promise<{ phrase: string }> => {
        if (!mode) throw new Error('Persistence mode is required');

        // Generate new keys
        const dek = await generateDEK();
        const phrase = generateRecoveryPhrase();
        const wrapped = await wrapDEK(dek, phrase);

        // Cache DEK for immediate use
        await cacheDEK(dek);

        // Store based on mode
        await setPersistenceMode(mode);
        setPersistenceModeState(mode);

        if (mode === 'local') {
            await storeLocalWrappedDEK(wrapped);
        } else if (mode === 'cloud' && user) {
            // Store in Supabase
            const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    id: user.id,
                    encrypted_master_key: wrapped,
                    updated_at: new Date().toISOString(),
                });

            if (error) {
                console.error('[PrivacyVault] Failed to save to cloud:', error);
                // Fallback to local
                await storeLocalWrappedDEK(wrapped);
            }
        }

        // Restore vault instance
        await vault.restoreFromCache();
        setStatus('unlocked');

        return { phrase };
    }, [user]);

    // -------------------------------------------------------------------------
    // Unlock vault with recovery phrase
    // -------------------------------------------------------------------------
    const unlockVault = useCallback(async (phrase: string): Promise<void> => {
        if (!wrappedDEK) {
            // Try to fetch again
            const mode = persistenceMode;
            let wrapped: string | null = null;

            if (mode === 'local') {
                wrapped = await getLocalWrappedDEK();
            } else if (mode === 'cloud' && user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('encrypted_master_key')
                    .eq('id', user.id)
                    .single();
                wrapped = data?.encrypted_master_key || null;
            }

            if (!wrapped) {
                throw new Error('No encrypted key found. Please set up the vault first.');
            }

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
        setStatus('needs_phrase');
    }, []);

    // -------------------------------------------------------------------------
    // Reset vault (complete wipe)
    // -------------------------------------------------------------------------
    const resetVault = useCallback(async (): Promise<void> => {
        await clearVault();

        if (user) {
            // Clear from Supabase
            await supabase
                .from('user_profiles')
                .update({ encrypted_master_key: null })
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
