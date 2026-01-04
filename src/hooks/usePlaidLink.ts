/**
 * usePlaidLink Hook
 * 
 * Handles Plaid Link integration:
 * - Fetches Link token from Supabase Edge Function
 * - Opens Plaid Link modal
 * - Exchanges public token on success
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/runtimeClient';

export type PlaidLinkStatus = 'idle' | 'loading_token' | 'ready' | 'open' | 'exchanging' | 'success' | 'error';

interface PlaidLinkResult {
    success: boolean;
    itemId?: string;
    accountsCount?: number;
    error?: string;
}

export function usePlaidLink() {
    const { toast } = useToast();
    const [status, setStatus] = useState<PlaidLinkStatus>('idle');
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    /**
     * Step 1: Get a Link token from our Edge Function
     */
    const initializePlaid = useCallback(async () => {
        setStatus('loading_token');
        setError(null);

        try {
            const { data, error: fnError } = await supabase.functions.invoke('plaid-link-token');

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
    }, [toast]);

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

        setStatus('open');

        return new Promise((resolve) => {
            // Check if Plaid Link is loaded
            if (typeof window === 'undefined' || !(window as any).Plaid) {
                setStatus('error');
                setError('Plaid Link SDK not loaded');
                resolve({ success: false, error: 'Plaid Link SDK not loaded' });
                return;
            }

            const linkHandler = (window as any).Plaid.create({
                token,
                onSuccess: async (publicToken: string, metadata: any) => {
                    setStatus('exchanging');

                    try {
                        // Exchange the public token
                        const { data, error: exchangeError } = await supabase.functions.invoke('plaid-exchange-token', {
                            body: {
                                public_token: publicToken,
                                institution: metadata.institution,
                            },
                        });

                        if (exchangeError || data?.error) {
                            throw new Error(exchangeError?.message || data?.error);
                        }

                        setStatus('success');
                        toast({
                            title: 'Bank connected!',
                            description: `${metadata.institution?.name || 'Account'} linked successfully`,
                        });

                        resolve({
                            success: true,
                            itemId: data.item_id,
                            accountsCount: data.accounts_count,
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
                onExit: (err: any) => {
                    if (err) {
                        setStatus('error');
                        setError(err.display_message || 'User exited Plaid Link');
                    } else {
                        setStatus('idle');
                    }
                    resolve({ success: false, error: err?.display_message });
                },
                onEvent: (eventName: string, metadata: any) => {
                    console.log('[Plaid Link Event]', eventName, metadata);
                },
            });

            linkHandler.open();
        });
    }, [linkToken, initializePlaid, toast]);

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
