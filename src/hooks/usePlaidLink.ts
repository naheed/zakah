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
 * usePlaidLink Hook
 *
 * Handles Plaid Link integration:
 * - Fetches Link token from Supabase Edge Function
 * - Opens Plaid Link modal
 * - Exchanges public token on success
 * - Persists accounts and holdings encrypted with user's symmetric key (same model as zakat_calculations)
 *
 * @see docs/PLAID_USER_KEY_ENCRYPTION.md
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useEncryptionKeys } from '@/hooks/useEncryptionKeys';
import { supabase } from '@/integrations/supabase/runtimeClient';
import { persistPlaidDataWithUserKey } from '@/lib/plaidEncryptedPersistence';
import { useAssetPersistence } from '@/hooks/useAssetPersistence';

export type PlaidLinkStatus = 'idle' | 'loading_token' | 'ready' | 'open' | 'exchanging' | 'success' | 'error';

/** Plaid Link onSuccess metadata - institution info from Plaid SDK */
interface PlaidLinkMetadata {
    institution?: { name?: string };
}

/** Plaid Link onExit error - may have display_message */
interface PlaidLinkExitError {
    display_message?: string;
}

/** Plaid Link global - loaded via script tag */
interface PlaidLinkCreator {
    create: (config: {
        token: string;
        onSuccess: (publicToken: string, metadata: PlaidLinkMetadata) => void;
        onExit: (err: PlaidLinkExitError | null) => void;
        onEvent?: (eventName: string, metadata: unknown) => void;
    }) => { open: () => void };
}

declare global {
    interface Window {
        Plaid?: PlaidLinkCreator;
    }
}

interface PlaidLinkResult {
    success: boolean;
    itemId?: string;
    accountsCount?: number;
    error?: string;
}

export function usePlaidLink() {
    const { toast } = useToast();
    const { encrypt, isReady: encryptionReady } = useEncryptionKeys();
    const { persistExtraction } = useAssetPersistence();
    const [status, setStatus] = useState<PlaidLinkStatus>('idle');
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    /** Get or create the user's portfolio ID for asset pipeline bridging */
    const getPortfolioId = useCallback(async (): Promise<string | null> => {
        try {
            const { data: existing } = await supabase
                .from('portfolios')
                .select('id')
                .single();
            if (existing) return existing.id;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data: created } = await supabase
                .from('portfolios')
                .insert({ user_id: user.id, currency: 'USD' })
                .select('id')
                .single();
            return created?.id || null;
        } catch {
            return null;
        }
    }, []);

    const getAccessToken = useCallback(async () => {
        // First try getSession, then fallback to getUser for fresh token
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.error('[Plaid] Session error:', sessionError);
            throw new Error(sessionError.message);
        }

        let token = sessionData.session?.access_token;
        
        // If no session token, try refreshing
        if (!token) {
            console.log('[Plaid] No session token, attempting refresh...');
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
                console.error('[Plaid] Refresh error:', refreshError);
                throw new Error('Your session has expired. Please sign in again to connect your bank.');
            }
            token = refreshData.session?.access_token;
        }

        if (!token) {
            console.error('[Plaid] No access token available');
            throw new Error('Your session has expired. Please sign in again to connect your bank.');
        }

        console.log('[Plaid] Got access token:', token.substring(0, 20) + '...');
        return token;
    }, []);

    /**
     * Step 1: Get a Link token from our Edge Function
     */
    const initializePlaid = useCallback(async () => {
        setStatus('loading_token');
        setError(null);

        try {
            const accessToken = await getAccessToken();

            const { data, error: fnError } = await supabase.functions.invoke('plaid-link-token', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (fnError) {
                throw new Error(fnError.message);
            }

            if (data?.error) {
                throw new Error(data.error);
            }

            setLinkToken(data.link_token);
            setStatus('ready');
            return data.link_token;
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to initialize Plaid';
            setError(errorMsg);
            setStatus('error');
            toast({
                title: 'Connection failed',
                description: errorMsg,
                variant: 'destructive',
            });
            return null;
        }
    }, [getAccessToken, toast]);

    /**
     * Step 2: Open Plaid Link (called by component when user clicks)
     * This uses the Plaid Link JS SDK which must be loaded in the page
     */
    const openPlaidLink = useCallback(async (): Promise<PlaidLinkResult> => {
        // Ensure we have a token
        let token = linkToken;
        if (!token) {
            token = await initializePlaid();
            if (!token) {
                return { success: false, error: 'Failed to get Link token' };
            }
        }

        if (!encryptionReady || !encrypt) {
            console.warn('[Plaid] Encryption not ready; user-key persistence of account/holding data will be skipped');
        }

        setStatus('open');

        return new Promise((resolve) => {
            // Check if Plaid Link is loaded
            if (typeof window === 'undefined' || !window.Plaid) {
                setStatus('error');
                setError('Plaid Link SDK not loaded');
                resolve({ success: false, error: 'Plaid Link SDK not loaded' });
                return;
            }

            const linkHandler = window.Plaid!.create({
                token,
                onSuccess: async (publicToken: string, metadata: PlaidLinkMetadata) => {
                    setStatus('exchanging');

                    try {
                        const accessToken = await getAccessToken();

                        // Exchange the public token (edge stores only plaid_items; returns accounts/holdings for client encrypt)
                        const { data, error: exchangeError } = await supabase.functions.invoke('plaid-exchange-token', {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                            body: {
                                public_token: publicToken,
                                institution: metadata.institution,
                            },
                        });

                        if (exchangeError || data?.error) {
                            throw new Error(exchangeError?.message || data?.error);
                        }

                        const plaidItemId = data.plaid_item_id ?? data.item_id;
                        const accounts = data.accounts ?? [];
                        const holdings = data.holdings ?? [];
                        const instName = metadata.institution?.name || null;

                        // Get portfolio for asset pipeline bridging
                        const portfolioId = await getPortfolioId();

                        if (encryptionReady && encrypt && plaidItemId && accounts.length > 0) {
                            const persistResult = await persistPlaidDataWithUserKey(
                                plaidItemId,
                                accounts,
                                holdings,
                                encrypt,
                                portfolioId,
                                instName
                            );
                            if (!persistResult.success) {
                                console.error('[Plaid] User-key persist failed:', persistResult.error);
                                toast({
                                    title: 'Bank connected',
                                    description: 'Account linked, but some details could not be saved securely. You can reconnect later.',
                                    variant: 'destructive',
                                });
                            }
                        } else if (accounts.length > 0 && !encrypt) {
                            console.warn('[Plaid] Encryption not available; account/holding data not persisted (item only)');
                        }

                        setStatus('success');
                        toast({
                            title: 'Bank connected!',
                            description: `${metadata.institution?.name || 'Account'} linked successfully`,
                        });

                        resolve({
                            success: true,
                            itemId: plaidItemId,
                            accountsCount: data.accounts_count ?? accounts.length,
                        });
                    } catch (err) {
                        const errorMsg = err instanceof Error ? err.message : 'Failed to link account';
                        setStatus('error');
                        setError(errorMsg);
                        toast({
                            title: 'Connection failed',
                            description: errorMsg,
                            variant: 'destructive',
                        });
                        resolve({ success: false, error: errorMsg });
                    }
                },
                onExit: (err: PlaidLinkExitError | null) => {
                    if (err) {
                        setStatus('error');
                        setError(err.display_message || 'User exited Plaid Link');
                    } else {
                        setStatus('idle');
                    }
                    resolve({ success: false, error: err?.display_message });
                },
                onEvent: (eventName: string, metadata: unknown) => {
                    console.log('[Plaid Link Event]', eventName, metadata);
                },
            });

            linkHandler.open();
        });
    }, [getAccessToken, linkToken, initializePlaid, toast, encrypt, encryptionReady]);

    /**
     * Reset state
     */
    const reset = useCallback(() => {
        setStatus('idle');
        setLinkToken(null);
        setError(null);
    }, []);

    return {
        status,
        error,
        linkToken,
        initializePlaid,
        openPlaidLink,
        reset,
        isLoading: status === 'loading_token' || status === 'exchanging',
        isReady: status === 'ready',
    };
}
