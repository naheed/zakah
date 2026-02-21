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

/**
 * Maps extraction category IDs to Zakat calculation categories.
 * Uses exact ID matching (no substring matching).
 */
export function mapToZakatCategory(inferredCategory: string): ZakatCategory {
    const cat = inferredCategory.toUpperCase();

    const CATEGORY_TO_ZAKAT: Record<string, ZakatCategory> = {
        // Cash = 100% Liquid
        'CASH_CHECKING': 'LIQUID',
        'CASH_SAVINGS': 'LIQUID',
        'CASH_ON_HAND': 'LIQUID',
        'CASH_DIGITAL_WALLET': 'LIQUID',

        // Investments
        'INVESTMENT_STOCK': 'PROXY_30',
        'INVESTMENT_MUTUAL_FUND': 'PROXY_30',
        'INVESTMENT_BOND': 'LIQUID',
        'INVESTMENT_ACTIVE': 'PROXY_100',
        'INVESTMENT_REIT': 'PROXY_30',
        'INCOME_DIVIDEND': 'LIQUID',

        // Retirement
        'RETIREMENT_401K': 'PROXY_30',
        'RETIREMENT_IRA': 'PROXY_30',
        'RETIREMENT_ROTH': 'PROXY_30',
        'RETIREMENT_HSA': 'EXEMPT',

        // Crypto
        'CRYPTO': 'PROXY_100',
        'CRYPTO_STAKED': 'PROXY_100',

        // Commodities
        'COMMODITY_GOLD': 'LIQUID',
        'COMMODITY_SILVER': 'LIQUID',

        // Liabilities
        'LIABILITY_CREDIT_CARD': 'EXEMPT',
        'LIABILITY_LOAN': 'EXEMPT',

        // Other
        'OTHER': 'LIQUID',

        // Legacy category IDs (backward compat with old data)
        'INVESTMENT_EQUITY': 'PROXY_30',
        'INVESTMENT_FIXED_INCOME': 'LIQUID',
        'INCOME_INTEREST': 'LIQUID',
        'EXPENSE_UTILITY': 'EXEMPT',
        'EXPENSE_GROCERY': 'EXEMPT',
        'EXPENSE_TRANSPORT': 'EXEMPT',
        'EXPENSE_INSURANCE': 'EXEMPT',

        // Plaid and third-party legacy account/subtype mappings
        'CHECKING': 'LIQUID',
        'DEPOSITORY_CHECKING': 'LIQUID',
        'SAVINGS': 'LIQUID',
        'DEPOSITORY_SAVINGS': 'LIQUID',
        'MONEY_MARKET': 'LIQUID',
        'EQUITY': 'PROXY_30',
        'STOCK': 'PROXY_30',
        'ETF': 'PROXY_30',
        'MUTUAL_FUND': 'PROXY_30',
        'MUTUAL_FUNDS': 'PROXY_30',
        '401K': 'PROXY_30',
        'IRA': 'PROXY_30',
        'ROTH_IRA': 'PROXY_30',
        'TRADITIONAL_IRA': 'PROXY_30',
        'RETIREMENT': 'PROXY_30',
        'CREDIT_CARD_DEBT': 'EXEMPT',
        'CREDIT_CARD': 'EXEMPT',
        'LIABILITY': 'EXEMPT',
        'LOAN': 'EXEMPT',
        'DEBT': 'EXEMPT',
    };

    return CATEGORY_TO_ZAKAT[cat] ?? 'LIQUID';
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

        const { data: existing, error: fetchError } = await supabase
            .from('portfolios')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (existing) return existing.id;

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

        const candidates = data.filter(account => {
            const existingInstitution = account.institution_name.toLowerCase().trim();
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

        if (candidates.length === 1) {
            const candidate = candidates[0];
            console.log(`[findAccount] Single candidate found (${candidate.name}) but no Name/ID match provided. SKIPPING fallback to prevent merge.`);
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

        const totalValue = lineItems.reduce((sum, item) => sum + item.amount, 0);

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
        }

        return snapshot.id;
    }, []);

    // Main function: Persist extraction result to V2 tables
    const persistExtraction = useCallback(async (
        institutionName: string,
        statementDate: string | undefined,
        lineItems: ExtractionLineItem[],
        stepId?: string,
        accountName?: string,
        accountId?: string,
        confirmedAccountType?: string
    ): Promise<PersistResult> => {
        console.log(`[persistExtraction] Called with: Inst="${institutionName}", Name="${accountName}", ID="${accountId}"`);
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        setLoading(true);
        setError(null);

        try {
            const portfolioId = await getOrCreatePortfolio();
            if (!portfolioId) {
                throw new Error('Failed to get/create portfolio');
            }

            let account = await findAccount(portfolioId, institutionName, accountName, accountId);
            let dbAccountId: string;

            if (account) {
                dbAccountId = account.id;
            } else {
                const accountType = (confirmedAccountType as AccountType) || (stepId ? inferAccountTypeFromStep(stepId) : 'OTHER');
                const displayName = accountName || `${institutionName} Account`;
                const newAccountId = await createAccount(portfolioId, institutionName, accountType, displayName, accountId);
                if (!newAccountId) {
                    throw new Error('Failed to create account');
                }
                dbAccountId = newAccountId;
            }

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

        const { data: accounts, error } = await supabase
            .from('asset_accounts')
            .select('*')
            .eq('portfolio_id', portfolioId)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching accounts:', error);
            return [];
        }

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

        return (data || []).map(item => ({
            ...item,
            zakat_category: item.zakat_category as ZakatCategory,
        })) as AssetLineItem[];
    }, []);

    // Delete an account
    const deleteAccount = useCallback(async (accountId: string): Promise<boolean> => {
        const { error } = await supabase
            .from('asset_accounts')
            .delete()
            .eq('id', accountId);

        if (error) {
            console.error('Error deleting account:', error);
            return false;
        }
        return true;
    }, []);

    return {
        loading,
        error,
        persistExtraction,
        fetchAccounts,
        fetchSnapshots,
        fetchLineItems,
        deleteAccount,
    };
}
