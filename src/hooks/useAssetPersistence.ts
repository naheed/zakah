import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
function mapToZakatCategory(inferredCategory: string): ZakatCategory {
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

    // Find account by institution name (fuzzy match)
    const findAccountByInstitution = useCallback(async (
        portfolioId: string,
        institutionName: string
    ): Promise<AssetAccount | null> => {
        const normalizedName = institutionName.toLowerCase().trim();

        const { data, error } = await supabase
            .from('asset_accounts')
            .select('*')
            .eq('portfolio_id', portfolioId);

        if (error || !data) return null;

        // Fuzzy match - check if names are similar
        const match = data.find(account => {
            const existingName = account.institution_name.toLowerCase().trim();
            return existingName.includes(normalizedName) ||
                normalizedName.includes(existingName) ||
                existingName === normalizedName;
        });

        if (!match) return null;

        // Cast database strings to our typed enums
        return {
            ...match,
            type: match.type as AccountType,
            mask: match.mask || '',
        } as AssetAccount;
    }, []);

    // Create a new account
    const createAccount = useCallback(async (
        portfolioId: string,
        institutionName: string,
        accountType: AccountType,
        name?: string
    ): Promise<string | null> => {
        const { data, error } = await supabase
            .from('asset_accounts')
            .insert({
                portfolio_id: portfolioId,
                institution_name: institutionName,
                type: accountType,
                name: name || `${institutionName} Account`,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error creating account:', error);
            return null;
        }

        return data?.id || null;
    }, []);

    // Check if snapshot exists for this date (duplicate check)
    const isDuplicateSnapshot = useCallback(async (
        accountId: string,
        statementDate: string
    ): Promise<boolean> => {
        const { data, error } = await supabase
            .from('asset_snapshots')
            .select('id')
            .eq('account_id', accountId)
            .eq('statement_date', statementDate)
            .single();

        return !!data && !error;
    }, []);

    // Create snapshot with line items
    const createSnapshot = useCallback(async (
        accountId: string,
        statementDate: string,
        lineItems: ExtractionLineItem[],
        method: 'MANUAL' | 'PDF_PARSE' | 'PLAID_API' = 'PDF_PARSE'
    ): Promise<string | null> => {
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
        stepId?: string
    ): Promise<PersistResult> => {
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Get or create portfolio
            const portfolioId = await getOrCreatePortfolio();
            if (!portfolioId) {
                throw new Error('Failed to get/create portfolio');
            }

            // 2. Find or create account
            let account = await findAccountByInstitution(portfolioId, institutionName);
            let accountId: string;

            if (account) {
                accountId = account.id;
            } else {
                const accountType = stepId ? inferAccountTypeFromStep(stepId) : 'OTHER';
                const newAccountId = await createAccount(portfolioId, institutionName, accountType);
                if (!newAccountId) {
                    throw new Error('Failed to create account');
                }
                accountId = newAccountId;
            }

            // 3. Check for duplicate snapshot
            const date = statementDate || new Date().toISOString().split('T')[0];
            const isDuplicate = await isDuplicateSnapshot(accountId, date);

            if (isDuplicate) {
                setLoading(false);
                return {
                    success: true,
                    accountId,
                    skipped: true
                };
            }

            // 4. Create snapshot with line items
            const snapshotId = await createSnapshot(accountId, date, lineItems);
            if (!snapshotId) {
                throw new Error('Failed to create snapshot');
            }

            setLoading(false);
            return {
                success: true,
                accountId,
                snapshotId,
                skipped: false,
            };

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    }, [user, getOrCreatePortfolio, findAccountByInstitution, createAccount, isDuplicateSnapshot, createSnapshot]);

    // Fetch all accounts for current user
    const fetchAccounts = useCallback(async (): Promise<AssetAccount[]> => {
        if (!user) return [];

        const portfolioId = await getOrCreatePortfolio();
        if (!portfolioId) return [];

        const { data, error } = await supabase
            .from('asset_accounts')
            .select('*')
            .eq('portfolio_id', portfolioId)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching accounts:', error);
            return [];
        }

        // Cast database strings to typed enums
        return (data || []).map(account => ({
            ...account,
            type: account.type as AccountType,
            mask: account.mask || '',
        })) as AssetAccount[];
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

    return {
        persistExtraction,
        fetchAccounts,
        fetchSnapshots,
        fetchLineItems,
        loading,
        error,
    };
}
