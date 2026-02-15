/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Persists Plaid accounts and holdings encrypted with the user's symmetric key.
 * Called from the client after plaid-exchange-token returns; edge only stores
 * plaid_items (access_token server-encrypted). See docs/PLAID_USER_KEY_ENCRYPTION.md.
 */

import { supabase } from '@/integrations/supabase/runtimeClient';

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
 * Persist Plaid accounts and holdings to the database with user-key encryption.
 * Inserts into plaid_accounts (encrypted_payload) and plaid_holdings (encrypted_payload).
 * Uses plaintext plaid_item_id, account_id, security_id for joins and API use.
 *
 * @param plaidItemId - UUID of the row in plaid_items
 * @param accounts - Accounts array from plaid-exchange-token response
 * @param holdings - Holdings array from plaid-exchange-token response
 * @param encrypt - User's symmetric encrypt function (from useEncryptionKeys)
 * @returns { success: boolean; error?: string }
 */
export async function persistPlaidDataWithUserKey(
    plaidItemId: string,
    accounts: PlaidAccountPayload[],
    holdings: PlaidHoldingPayload[],
    encrypt: EncryptFn
): Promise<{ success: boolean; error?: string }> {
    if (accounts.length === 0) {
        return { success: true };
    }

    const accountIdToPlaidAccountId: Record<string, string> = {};

    try {
        for (const account of accounts) {
            const payload = {
                name: account.name,
                official_name: account.official_name,
                type: account.type,
                subtype: account.subtype,
                mask: account.mask,
                balance_current: account.balance_current,
                balance_available: account.balance_available,
                balance_iso_currency_code: account.balance_iso_currency_code,
                is_active_trader: account.is_active_trader,
            };
            const encryptedPayload = await encrypt(payload);
            if (!encryptedPayload) {
                console.error('[plaidEncryptedPersistence] Encrypt returned null for account', account.account_id);
                return { success: false, error: 'Encryption failed for account data' };
            }

            const { data: row, error } = await supabase
                .from('plaid_accounts')
                .insert({
                    plaid_item_id: plaidItemId,
                    account_id: account.account_id,
                    encrypted_payload: encryptedPayload,
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
        }

        for (const holding of holdings) {
            const plaidAccountId = accountIdToPlaidAccountId[holding.account_id];
            if (!plaidAccountId) {
                console.warn('[plaidEncryptedPersistence] No plaid_account_id for holding account_id', holding.account_id);
                continue;
            }

            const payload = {
                name: holding.name,
                ticker_symbol: holding.ticker_symbol,
                security_type: holding.security_type,
                quantity: holding.quantity,
                cost_basis: holding.cost_basis,
                institution_price: holding.institution_price,
                institution_value: holding.institution_value,
                iso_currency_code: holding.iso_currency_code,
                institution_price_as_of: holding.institution_price_as_of,
            };
            const encryptedPayload = await encrypt(payload);
            if (!encryptedPayload) {
                console.warn('[plaidEncryptedPersistence] Encrypt returned null for holding', holding.security_id);
                continue;
            }

            const { error: holdError } = await supabase.from('plaid_holdings').insert({
                plaid_account_id: plaidAccountId,
                security_id: holding.security_id,
                encrypted_payload: encryptedPayload,
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
