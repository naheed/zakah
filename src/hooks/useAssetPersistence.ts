import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/runtimeClient';
import { useAuth } from '@/hooks/useAuth';
import {
    AssetPortfolio,
    AssetAccount,
    AssetSnapshot,
    AssetLineItem,
    AccountType,
    ZakatCategory
} from '@/types/assets';
import { ExtractionLineItem } from '@/hooks/useDocumentParsingV2';

// Map AI categories to Zakat categories
export function mapToZakatCategory(inferredCategory: string): ZakatCategory {
    const cat = inferredCategory.toUpperCase();

    // Cash = 100% Liquid
    if (cat.includes('CASH') || cat.includes('CHECKING') || cat.includes('SAVINGS')) {
        return 'LIQUID';
    }

    // Crypto = 100% Zakatable
    if (cat.includes('CRYPTO')) {
        return 'PROXY_100';
    }

    // Stocks/ETFs = 30% Proxy (passive)
    if (cat.includes('EQUITY') || cat.includes('STOCK') || cat.includes('ETF') || cat.includes('MUTUAL')) {
        return 'PROXY_30';
    }

    // Bonds = Liquid
    if (cat.includes('FIXED_INCOME') || cat.includes('BOND')) {
        return 'LIQUID';
    }

    // Retirement accounts - complex, default to PROXY_30
    if (cat.includes('RETIREMENT') || cat.includes('401K') || cat.includes('IRA')) {
        return 'PROXY_30';
    }

    // Expenses/Liabilities - not directly zakatable assets
    if (cat.includes('EXPENSE') || cat.includes('LIABILITY') || cat.includes('DEBT')) {
        return 'EXEMPT';
    }

    // Default to liquid for safety
    return 'LIQUID';
}

// Infer account type from wizard step
export function inferAccountTypeFromStep(stepId: string): AccountType {
    switch (stepId) {
        case 'liquid-assets':
            return 'CHECKING';
        case 'investments':
            return 'BROKERAGE';
        case 'retirement':
            return 'RETIREMENT_401K';
        case 'crypto':
            return 'CRYPTO_WALLET';
        case 'trusts':
            return 'TRUST';
        case 'precious-metals':
            return 'METALS';
        case 'business':
            return 'BUSINESS';
        case 'real-estate':
            return 'REAL_ESTATE';
        default:
            return 'OTHER';
    }
}

interface PersistResult {
    success: boolean;
    accountId?: string;
    snapshotId?: string;
    skipped?: boolean;
    error?: string;
}

export function useAssetPersistence() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get or create the user's portfolio
    const getOrCreatePortfolio = useCallback(async (): Promise<string | null> => {
        if (!user) return null;

        // Check for existing portfolio
        const { data: existing, error: fetchError } = await supabase
            .from('portfolios')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (existing) return existing.id;

        // Create new portfolio
        const { data: created, error: createError } = await supabase
            .from('portfolios')
            .insert({ user_id: user.id, currency: 'USD' })
            .select('id')
            .single();

        if (createError) {
            console.error('Error creating portfolio:', createError);
            return null;
        }

        return created?.id || null;
    }, [user]);

    // Find account by institution AND account name/mask
    const findAccount = useCallback(async (
        portfolioId: string,
        institutionName: string,
        accountName?: string,
        mask?: string
    ): Promise<AssetAccount | null> => {
        console.log(`[findAccount] Search: Inst="${institutionName}", Name="${accountName}", Mask="${mask}"`);
        const normalizedInstitution = institutionName.toLowerCase().trim();

        const { data, error } = await supabase
            .from('asset_accounts')
            .select('*')
            .eq('portfolio_id', portfolioId);

        if (error || !data) {
            console.log('[findAccount] DB Error or no data', error);
            return null;
        }

        // Filter by Institution first
        const candidates = data.filter(account => {
            const existingInstitution = account.institution_name.toLowerCase().trim();
            // Fuzzy match institution
            return existingInstitution.includes(normalizedInstitution) ||
                normalizedInstitution.includes(existingInstitution) ||
                existingInstitution === normalizedInstitution;
        });

        console.log(`[findAccount] Candidates for "${institutionName}": ${candidates.length}`, candidates.map(c => ({ id: c.id, name: c.name, mask: c.mask })));

        if (candidates.length === 0) return null;

        // 1. Exact Mask Match (Highest Priority)
        if (mask) {
            const maskMatch = candidates.find(a => a.mask === mask);
            if (maskMatch) {
                console.log(`[findAccount] MATCH: Exact mask match found: ${maskMatch.id}`);
                return {
                    ...maskMatch,
                    type: maskMatch.type as AccountType,
                    mask: maskMatch.mask || '',
                } as AssetAccount;
            } else {
                console.log(`[findAccount] Mask provided ("${mask}") but no candidate matched it.`);
            }
        }

        // 2. Exact Name Match (High Priority)
        if (accountName) {
            const normalizedAccountName = accountName.toLowerCase().trim();
            const nameMatch = candidates.find(a => (a.name || '').toLowerCase().trim() === normalizedAccountName);
            if (nameMatch) {
                console.log(`[findAccount] MATCH: Exact name match found: ${nameMatch.id}`);
                return {
                    ...nameMatch,
                    type: nameMatch.type as AccountType,
                    mask: nameMatch.mask || '',
                } as AssetAccount;
            }
        }

        // 3. Strict Fallback
        if (mask) {
            console.log(`[findAccount] NO MATCH: Mask was provided but not found. Treating as NEW account.`);
            return null;
        }

        // CRITICAL: Disable loose fallback. 
        // If we have no Mask and no Name, do NOT assumes it matches the single existing account.
        // This causes merging of different accounts (Start -> Schwab 1, Upload -> Schwab 2 (merges)).
        // Safe behavior: Create new account.
        if (candidates.length === 1) {
            const candidate = candidates[0];
            // Only use fallback if we have *something* to match on, or if we want to be very aggressive.
            // Given the bug report, we must be conservative.
            // If accountName is present, we checked it above. If we are here, Name didn't match or wasn't provided.

            // DEBUG LOG keeping trace of what would have happened
            console.log(`[findAccount] Single candidate found (${candidate.name}) but no Name/ID match provided. SKIPPING fallback to prevent merge.`);

            // return candidate; // DISABLED
        }

        console.log(`[findAccount] NO MATCH: Multiple candidates or no specific match criteria. Creating NEW.`);
        return null;
    }, []);

    // Create a new account
    const createAccount = useCallback(async (
        portfolioId: string,
        institutionName: string,
        accountType: AccountType,
        name?: string,
        mask?: string
    ): Promise<string | null> => {
        console.log(`[createAccount] Creating new account: "${name}" (${mask || 'no-mask'})`);
        const { data, error } = await supabase
            .from('asset_accounts')
            .insert({
                portfolio_id: portfolioId,
                institution_name: institutionName,
                type: accountType,
                name: name || `${institutionName} Account`,
                mask: mask || null,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error creating account:', error);
            return null;
        }

        console.log(`[createAccount] Created successfully: ${data?.id}`);
        return data?.id || null;
    }, []);

    // Check if snapshot exists for this date (duplicate check)
    const isDuplicateSnapshot = useCallback(async (
        accountId: string,
        statementDate: string
    ): Promise<boolean> => {
        console.log(`[isDuplicateSnapshot] Checking for existing snapshot. Account="${accountId}", Date="${statementDate}"`);
        const { data, error } = await supabase
            .from('asset_snapshots')
            .select('id')
            .eq('account_id', accountId)
            .eq('statement_date', statementDate)
            .single();

        const exists = !!data && !error;
        console.log(`[isDuplicateSnapshot] Result: ${exists ? 'Duplicate found' : 'No duplicate'}`);
        return exists;
    }, []);

    // Create snapshot with line items
    const createSnapshot = useCallback(async (
        accountId: string,
        statementDate: string,
        lineItems: ExtractionLineItem[],
        method: 'MANUAL' | 'PDF_PARSE' | 'PLAID_API' = 'PDF_PARSE'
    ): Promise<string | null> => {
        console.log(`[createSnapshot] Creating snapshot. Account="${accountId}", Items=${lineItems.length}`);

        // Calculate total value from line items
        const totalValue = lineItems.reduce((sum, item) => sum + item.amount, 0);

        // Create snapshot
        const { data: snapshot, error: snapshotError } = await supabase
            .from('asset_snapshots')
            .insert({
                account_id: accountId,
                statement_date: statementDate,
                total_value: totalValue,
                method: method,
                status: 'CONFIRMED',
            })
            .select('id')
            .single();

        if (snapshotError || !snapshot) {
            console.error('Error creating snapshot:', snapshotError);
            return null;
        }

        console.log(`[createSnapshot] Snapshot created: ${snapshot.id}. Inserting ${lineItems.length} line items.`);

        // Create line items
        const lineItemsToInsert = lineItems.map(item => ({
            snapshot_id: snapshot.id,
            description: item.description,
            amount: item.amount,
            raw_category: item.inferredCategory,
            inferred_category: item.inferredCategory,
            zakat_category: mapToZakatCategory(item.inferredCategory),
        }));

        const { error: lineItemsError } = await supabase
            .from('asset_line_items')
            .insert(lineItemsToInsert);

        if (lineItemsError) {
            console.error('Error creating line items:', lineItemsError);
            // Still return snapshot ID - line items can be retried
        }

        return snapshot.id;
    }, []);

    // Main function: Persist extraction result to V2 tables
    const persistExtraction = useCallback(async (
        institutionName: string,
        statementDate: string | undefined,
        lineItems: ExtractionLineItem[],
        stepId?: string,
        accountName?: string,  // Account name
        accountId?: string     // Account ID / Mask
    ): Promise<PersistResult> => {
        console.log(`[persistExtraction] Called with: Inst="${institutionName}", Name="${accountName}", ID="${accountId}"`);
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }
        // ...

        setLoading(true);
        setError(null);

        try {
            // 1. Get or create portfolio
            const portfolioId = await getOrCreatePortfolio();
            if (!portfolioId) {
                throw new Error('Failed to get/create portfolio');
            }

            // 2. Find or create account
            let account = await findAccount(portfolioId, institutionName, accountName, accountId);
            let dbAccountId: string;

            if (account) {
                dbAccountId = account.id;
            } else {
                const accountType = stepId ? inferAccountTypeFromStep(stepId) : 'OTHER';
                const displayName = accountName || `${institutionName} Account`;
                const newAccountId = await createAccount(portfolioId, institutionName, accountType, displayName, accountId);
                if (!newAccountId) {
                    throw new Error('Failed to create account');
                }
                dbAccountId = newAccountId;
            }

            // 3. Check for duplicate snapshot
            const date = statementDate || new Date().toISOString().split('T')[0];
            const isDuplicate = await isDuplicateSnapshot(dbAccountId, date);

            if (isDuplicate) {
                setLoading(false);
                return {
                    success: true,
                    accountId: dbAccountId,
                    skipped: true
                };
            }

            // 4. Create snapshot with line items
            const snapshotId = await createSnapshot(dbAccountId, date, lineItems);
            if (!snapshotId) {
                throw new Error('Failed to create snapshot');
            }

            setLoading(false);
            return {
                success: true,
                accountId: dbAccountId,
                snapshotId,
                skipped: false,
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    }, [user, getOrCreatePortfolio, findAccount, createAccount, isDuplicateSnapshot, createSnapshot]);

    // Fetch all accounts for current user with computed balances
    const fetchAccounts = useCallback(async (): Promise<AssetAccount[]> => {
        if (!user) return [];

        const portfolioId = await getOrCreatePortfolio();
        if (!portfolioId) return [];

        // Fetch accounts with latest snapshot's total_value as balance
        const { data: accounts, error } = await supabase
            .from('asset_accounts')
            .select('*')
            .eq('portfolio_id', portfolioId)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching accounts:', error);
            return [];
        }

        // For each account, fetch the latest snapshot to get balance
        const accountsWithBalances = await Promise.all(
            (accounts || []).map(async (account) => {
                const { data: latestSnapshot } = await supabase
                    .from('asset_snapshots')
                    .select('total_value')
                    .eq('account_id', account.id)
                    .order('statement_date', { ascending: false })
                    .limit(1)
                    .single();

                return {
                    ...account,
                    type: account.type as AccountType,
                    mask: account.mask || '',
                    balance: latestSnapshot?.total_value || 0,
                } as AssetAccount;
            })
        );

        return accountsWithBalances;
    }, [user, getOrCreatePortfolio]);

    // Fetch snapshots for an account
    const fetchSnapshots = useCallback(async (accountId: string): Promise<AssetSnapshot[]> => {
        const { data, error } = await supabase
            .from('asset_snapshots')
            .select('*')
            .eq('account_id', accountId)
            .order('statement_date', { ascending: false });

        if (error) {
            console.error('Error fetching snapshots:', error);
            return [];
        }

        // Cast database strings to typed enums
        return (data || []).map(snapshot => ({
            ...snapshot,
            method: snapshot.method as AssetSnapshot['method'],
            status: snapshot.status as 'DRAFT' | 'CONFIRMED',
        })) as AssetSnapshot[];
    }, []);

    // Fetch line items for a snapshot
    const fetchLineItems = useCallback(async (snapshotId: string): Promise<AssetLineItem[]> => {
        const { data, error } = await supabase
            .from('asset_line_items')
            .select('*')
            .eq('snapshot_id', snapshotId);

        if (error) {
            console.error('Error fetching line items:', error);
            return [];
        }

        // Cast database strings to typed enums
        return (data || []).map(item => ({
            ...item,
            zakat_category: item.zakat_category as ZakatCategory,
        })) as AssetLineItem[];
    }, []);

    // Delete an account (cascades to snapshots and line_items via RLS)
    const deleteAccount = useCallback(async (accountId: string): Promise<boolean> => {
        if (!user) return false;

        try {
            // First delete all line items for all snapshots of this account
            const { data: snapshots } = await supabase
                .from('asset_snapshots')
                .select('id')
                .eq('account_id', accountId);

            if (snapshots && snapshots.length > 0) {
                const snapshotIds = snapshots.map(s => s.id);
                await supabase
                    .from('asset_line_items')
                    .delete()
                    .in('snapshot_id', snapshotIds);
            }

            // Delete all snapshots for this account
            await supabase
                .from('asset_snapshots')
                .delete()
                .eq('account_id', accountId);

            // Finally delete the account
            const { error } = await supabase
                .from('asset_accounts')
                .delete()
                .eq('id', accountId);

            if (error) {
                console.error('Error deleting account:', error);
                return false;
            }

            return true;
        } catch (err) {
            console.error('Error deleting account:', err);
            return false;
        }
    }, [user]);

    return {
        persistExtraction,
        fetchAccounts,
        fetchSnapshots,
        fetchLineItems,
        deleteAccount,
        loading,
        error,
    };
}
