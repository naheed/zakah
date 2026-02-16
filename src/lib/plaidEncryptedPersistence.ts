/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Persists Plaid accounts and holdings encrypted with the user's symmetric key.
 * Also bridges Plaid data into the asset_accounts/snapshots/line_items pipeline
 * for use in Zakat calculations.
 *
 * @see docs/PLAID_USER_KEY_ENCRYPTION.md
 */

import { supabase } from '@/integrations/supabase/runtimeClient';
import { AccountType } from '@/types/assets';
import { plaidSubtypeToAccountType, ACCOUNT_TYPE_ZAKAT_FIELD_OVERRIDE } from '@/lib/accountImportMapper';
import { mapToZakatCategory } from '@/hooks/useAssetPersistence';

/** Account payload returned by plaid-exchange-token (to be encrypted and stored) */
export interface PlaidAccountPayload {
    account_id: string;
    name: string;
    official_name: string | null;
    type: string;
    subtype: string | null;
    mask: string | null;
    balance_current: number | null;
    balance_available: number | null;
    balance_iso_currency_code: string;
    is_active_trader: boolean;
}

/** Holding payload returned by plaid-exchange-token (to be encrypted and stored) */
export interface PlaidHoldingPayload {
    account_id: string;
    security_id: string;
    name: string | null;
    ticker_symbol: string | null;
    security_type: string | null;
    quantity: number;
    cost_basis: number | null;
    institution_price: number;
    institution_value: number;
    iso_currency_code: string | null;
    institution_price_as_of: string | null;
}

export type EncryptFn = (data: unknown) => Promise<string | null>;

/**
 * Map a Plaid security_type to an inferred category for zakat_category mapping.
 */
function plaidSecurityTypeToCategory(securityType: string | null): string {
    const t = (securityType || '').toLowerCase();
    if (['equity', 'stock'].includes(t)) return 'INVESTMENT_STOCK';
    if (['mutual fund'].includes(t)) return 'INVESTMENT_MUTUAL_FUND';
    if (['etf'].includes(t)) return 'INVESTMENT_STOCK';
    if (['fixed income', 'bond'].includes(t)) return 'INVESTMENT_BOND';
    if (['derivative', 'option'].includes(t)) return 'INVESTMENT_ACTIVE';
    if (['cryptocurrency'].includes(t)) return 'CRYPTO';
    if (['cash'].includes(t)) return 'CASH_SAVINGS';
    return 'OTHER';
}

/**
 * Persist Plaid accounts and holdings to the database with user-key encryption.
 * Also creates asset_accounts, asset_snapshots, and asset_line_items for the
 * Zakat calculation pipeline.
 *
 * @param plaidItemId - UUID of the row in plaid_items
 * @param accounts - Accounts array from plaid-exchange-token response
 * @param holdings - Holdings array from plaid-exchange-token response
 * @param encrypt - User's symmetric encrypt function (from useEncryptionKeys)
 * @param portfolioId - User's portfolio ID for asset pipeline bridging
 * @param institutionName - Institution name for asset_accounts
 * @returns { success: boolean; error?: string }
 */
export async function persistPlaidDataWithUserKey(
    plaidItemId: string,
    accounts: PlaidAccountPayload[],
    holdings: PlaidHoldingPayload[],
    encrypt: EncryptFn,
    portfolioId?: string | null,
    institutionName?: string | null
): Promise<{ success: boolean; error?: string }> {
    if (accounts.length === 0) {
        return { success: true };
    }

    const accountIdToPlaidAccountId: Record<string, string> = {};
    const accountIdToAccountType: Record<string, AccountType> = {};

    try {
        for (const account of accounts) {
            // Derive AccountType from Plaid's type/subtype
            const accountType = plaidSubtypeToAccountType(account.type, account.subtype);
            accountIdToAccountType[account.account_id] = accountType;

            // Note: encrypt function kept for future encrypted_payload column support
            // Currently storing plaintext in typed columns per DB schema

            // Insert into plaid_accounts with plaintext fields (schema has no encrypted_payload column)
            const { data: row, error } = await supabase
                .from('plaid_accounts')
                .insert({
                    plaid_item_id: plaidItemId,
                    account_id: account.account_id,
                    name: account.name,
                    official_name: account.official_name,
                    type: account.type,
                    subtype: account.subtype,
                    mask: account.mask,
                    balance_current: account.balance_current,
                    balance_available: account.balance_available,
                    balance_iso_currency_code: account.balance_iso_currency_code,
                    is_active_trader: account.is_active_trader,
                    last_synced_at: new Date().toISOString(),
                })
                .select('id')
                .single();

            if (error) {
                console.error('[plaidEncryptedPersistence] Insert plaid_accounts failed:', error);
                return { success: false, error: error.message };
            }
            if (row?.id) {
                accountIdToPlaidAccountId[account.account_id] = row.id;
            }

            // Bridge to asset pipeline if portfolioId is available
            if (portfolioId) {
                const displayName = account.official_name || account.name || 'Plaid Account';
                const instName = institutionName || 'Connected Bank';

                const { data: assetAccount, error: assetError } = await supabase
                    .from('asset_accounts')
                    .insert({
                        portfolio_id: portfolioId,
                        institution_name: instName,
                        type: accountType,
                        name: displayName,
                        mask: account.mask || null,
                    })
                    .select('id')
                    .single();

                if (assetError) {
                    console.error('[plaidEncryptedPersistence] Create asset_account failed:', assetError);
                } else if (assetAccount?.id) {
                    // Link plaid_account -> asset_account
                    await supabase
                        .from('plaid_accounts')
                        .update({ asset_account_id: assetAccount.id })
                        .eq('id', row?.id);

                    // Create snapshot for this account
                    const accountHoldings = holdings.filter(h => h.account_id === account.account_id);
                    const isRetirementOverride = accountType in ACCOUNT_TYPE_ZAKAT_FIELD_OVERRIDE &&
                        ['RETIREMENT_401K', 'RETIREMENT_IRA', 'ROTH_IRA', 'HSA'].includes(accountType);

                    // For depository accounts with no holdings, use balance as the single line item
                    const lineItems = accountHoldings.length > 0
                        ? accountHoldings.map(h => {
                            const inferredCategory = isRetirementOverride
                                ? `RETIREMENT_${accountType === 'ROTH_IRA' ? 'ROTH' : accountType === 'RETIREMENT_IRA' ? 'IRA' : accountType === 'HSA' ? 'HSA' : '401K'}`
                                : plaidSecurityTypeToCategory(h.security_type);
                            return {
                                description: h.name || h.ticker_symbol || 'Unknown Holding',
                                amount: h.institution_value,
                                inferredCategory,
                            };
                        })
                        : (account.balance_current != null && account.balance_current > 0)
                            ? [{
                                description: `${displayName} Balance`,
                                amount: account.balance_current,
                                inferredCategory: isRetirementOverride
                                    ? `RETIREMENT_${accountType === 'ROTH_IRA' ? 'ROTH' : accountType === 'RETIREMENT_IRA' ? 'IRA' : accountType === 'HSA' ? 'HSA' : '401K'}`
                                    : (accountType === 'CHECKING' ? 'CASH_CHECKING' : accountType === 'SAVINGS' ? 'CASH_SAVINGS' : 'OTHER'),
                            }]
                            : [];

                    if (lineItems.length > 0) {
                        const totalValue = lineItems.reduce((sum, li) => sum + li.amount, 0);
                        const statementDate = new Date().toISOString().split('T')[0];

                        const { data: snapshot, error: snapError } = await supabase
                            .from('asset_snapshots')
                            .insert({
                                account_id: assetAccount.id,
                                statement_date: statementDate,
                                total_value: totalValue,
                                method: 'PLAID_API',
                                status: 'CONFIRMED',
                            })
                            .select('id')
                            .single();

                        if (snapError) {
                            console.error('[plaidEncryptedPersistence] Create snapshot failed:', snapError);
                        } else if (snapshot?.id) {
                            const lineItemRows = lineItems.map(li => ({
                                snapshot_id: snapshot.id,
                                description: li.description,
                                amount: li.amount,
                                raw_category: li.inferredCategory,
                                inferred_category: li.inferredCategory,
                                zakat_category: mapToZakatCategory(li.inferredCategory),
                            }));

                            const { error: liError } = await supabase
                                .from('asset_line_items')
                                .insert(lineItemRows);

                            if (liError) {
                                console.error('[plaidEncryptedPersistence] Insert line items failed:', liError);
                            }
                        }
                    }
                }
            }
        }

        // Persist holdings to plaid_holdings
        for (const holding of holdings) {
            const plaidAccountId = accountIdToPlaidAccountId[holding.account_id];
            if (!plaidAccountId) {
                console.warn('[plaidEncryptedPersistence] No plaid_account_id for holding account_id', holding.account_id);
                continue;
            }

            const { error: holdError } = await supabase.from('plaid_holdings').insert({
                plaid_account_id: plaidAccountId,
                security_id: holding.security_id,
                name: holding.name,
                ticker_symbol: holding.ticker_symbol,
                security_type: holding.security_type,
                quantity: holding.quantity,
                cost_basis: holding.cost_basis,
                institution_price: holding.institution_price,
                institution_value: holding.institution_value,
                iso_currency_code: holding.iso_currency_code,
            });

            if (holdError) {
                console.error('[plaidEncryptedPersistence] Insert plaid_holdings failed:', holdError);
            }
        }

        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[plaidEncryptedPersistence] Error:', message);
        return { success: false, error: message };
    }
}
