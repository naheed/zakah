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
 * Account Import Mapper
 * 
 * Maps line items from imported accounts to ZakatFormData fields.
 * Uses unified category IDs from assetCategories.ts.
 */

import { ZakatFormData } from './zakatCalculations';
import { AssetLineItem } from '@/types/assets';

/**
 * Question context types used in the wizard
 */
export type QuestionContext =
    | 'liquid-assets'
    | 'investments'
    | 'retirement'
    | 'crypto'
    | 'precious-metals'
    | 'real-estate'
    | 'business'
    | 'trusts'
    | 'debts';

/**
 * Unified mapping from category IDs to ZakatFormData fields.
 * Category IDs match those in src/lib/assetCategories.ts and the Gemini prompt.
 */
const CATEGORY_TO_FIELDS: Record<string, keyof ZakatFormData | null> = {
    // Unified category IDs (primary)
    'CASH_CHECKING': 'checkingAccounts',
    'CASH_SAVINGS': 'savingsAccounts',
    'CASH_ON_HAND': 'cashOnHand',
    'CASH_DIGITAL_WALLET': 'digitalWallets',
    'INVESTMENT_STOCK': 'passiveInvestmentsValue',
    'INVESTMENT_MUTUAL_FUND': 'passiveInvestmentsValue',
    'INVESTMENT_BOND': 'passiveInvestmentsValue',
    'INVESTMENT_ACTIVE': 'activeInvestments',
    'INVESTMENT_REIT': 'reitsValue',
    'INCOME_DIVIDEND': 'dividends',
    'RETIREMENT_401K': 'fourOhOneKVestedBalance',
    'RETIREMENT_IRA': 'traditionalIRABalance',
    'RETIREMENT_ROTH': 'rothIRAContributions',
    'RETIREMENT_HSA': 'hsaBalance',
    'CRYPTO': 'cryptoCurrency',
    'CRYPTO_STAKED': 'stakedAssets',
    'COMMODITY_GOLD': 'goldInvestmentValue',
    'COMMODITY_SILVER': 'silverInvestmentValue',
    'LIABILITY_CREDIT_CARD': 'creditCardBalance',
    'LIABILITY_LOAN': 'studentLoansDue',
    'OTHER': 'cashOnHand',

    // Legacy category IDs (backward compat with old extractions)
    'INVESTMENT_EQUITY': 'passiveInvestmentsValue',
    'INVESTMENT_FIXED_INCOME': 'passiveInvestmentsValue',
    'INCOME_INTEREST': null,
    'EXPENSE_UTILITY': null,
    'EXPENSE_GROCERY': null,
    'EXPENSE_TRANSPORT': null,
    'EXPENSE_INSURANCE': null,

    // Legacy shorthand categories (from Plaid or old imports)
    'CHECKING': 'checkingAccounts',
    'SAVINGS': 'savingsAccounts',
    'CASH': 'cashOnHand',
    'MONEY_MARKET': 'savingsAccounts',
    'CD': 'savingsAccounts',
    'LIQUID': 'checkingAccounts',
    'STOCKS': 'passiveInvestmentsValue',
    'EQUITY': 'passiveInvestmentsValue',
    'ETF': 'passiveInvestmentsValue',
    'MUTUAL_FUNDS': 'passiveInvestmentsValue',
    'INDEX_FUNDS': 'passiveInvestmentsValue',
    'BONDS': 'passiveInvestmentsValue',
    'FIXED_INCOME': 'passiveInvestmentsValue',
    'DIVIDENDS': 'dividends',
    'ACTIVE_TRADING': 'activeInvestments',
    'OPTIONS': 'activeInvestments',
    'PROXY_30': 'passiveInvestmentsValue',
    'PROXY_100': 'activeInvestments',
    'RETIREMENT': 'fourOhOneKVestedBalance',
    '401K': 'fourOhOneKVestedBalance',
    'IRA': 'traditionalIRABalance',
    'ROTH_IRA': 'rothIRAContributions',
    'PENSION': 'fourOhOneKVestedBalance',
    'CRYPTOCURRENCY': 'cryptoCurrency',
    'BITCOIN': 'cryptoCurrency',
    'ETHEREUM': 'cryptoCurrency',
    'STAKING': 'stakedAssets',
    'NFT': 'cryptoTrading',
    'GOLD': 'goldInvestmentValue',
    'SILVER': 'silverInvestmentValue',
    'METALS': 'goldInvestmentValue',
    'GOLD_FULL': 'goldInvestmentValue',
    'SILVER_FULL': 'silverInvestmentValue',
    'REAL_ESTATE': 'rentalPropertyIncome',
    'PROPERTY': 'rentalPropertyIncome',
    'BUSINESS': 'businessCashAndReceivables',
    'INVENTORY': 'businessInventory',
    'RECEIVABLES': 'goodDebtOwedToYou',
    'CREDIT_CARD': 'creditCardBalance',
    'DEBT': 'unpaidBills',
    'LOAN': 'studentLoansDue',
    'EXPENSE': 'monthlyLivingExpenses',
    'LIABILITY': 'unpaidBills',
    'EXEMPT': null,
    'DEDUCTIBLE': null,
};

/**
 * Question context to relevant categories mapping
 */
const CONTEXT_TO_CATEGORIES: Record<QuestionContext, string[]> = {
    'liquid-assets': [
        'CASH_CHECKING', 'CASH_SAVINGS', 'CASH_ON_HAND', 'CASH_DIGITAL_WALLET',
        'CHECKING', 'SAVINGS', 'CASH', 'MONEY_MARKET', 'CD', 'LIQUID',
        'BROKERAGE_CASH', 'SWEEP', 'CASH_SWEEP',
    ],
    'investments': [
        'INVESTMENT_STOCK', 'INVESTMENT_MUTUAL_FUND', 'INVESTMENT_BOND', 'INVESTMENT_ACTIVE',
        'INVESTMENT_REIT', 'INCOME_DIVIDEND', 'INVESTMENT_EQUITY', 'INVESTMENT_FIXED_INCOME',
        'STOCKS', 'EQUITY', 'ETF', 'MUTUAL_FUNDS', 'INDEX_FUNDS', 'BONDS',
        'FIXED_INCOME', 'DIVIDENDS', 'ACTIVE_TRADING', 'OPTIONS', 'PROXY_30', 'PROXY_100',
        'BROKERAGE', 'SECURITIES',
        'RETIREMENT_401K', 'RETIREMENT_IRA', 'RETIREMENT_ROTH', 'RETIREMENT_HSA',
        'RETIREMENT', '401K', 'IRA', 'ROTH_IRA', 'PENSION', 'HSA', '529',
    ],
    'retirement': [
        'RETIREMENT_401K', 'RETIREMENT_IRA', 'RETIREMENT_ROTH', 'RETIREMENT_HSA',
        'RETIREMENT', '401K', 'IRA', 'ROTH_IRA', 'PENSION', 'HSA', '529', '403B', '457',
        'INVESTMENT_STOCK', 'INVESTMENT_MUTUAL_FUND', 'INVESTMENT_BOND',
        'STOCKS', 'EQUITY', 'ETF', 'MUTUAL_FUNDS', 'INDEX_FUNDS', 'BONDS', 'FIXED_INCOME',
        'BROKERAGE', 'SECURITIES',
    ],
    'crypto': [
        'CRYPTO', 'CRYPTO_STAKED',
        'CRYPTOCURRENCY', 'BITCOIN', 'ETHEREUM', 'STAKING', 'NFT',
        'DEFI', 'WALLET', 'ALTCOIN', 'TOKEN',
    ],
    'precious-metals': [
        'COMMODITY_GOLD', 'COMMODITY_SILVER',
        'GOLD', 'SILVER', 'METALS', 'GOLD_FULL', 'SILVER_FULL',
        'BULLION', 'COINS', 'PLATINUM', 'PALLADIUM',
    ],
    'real-estate': [
        'REAL_ESTATE', 'PROPERTY', 'RENTAL', 'REIT', 'MORTGAGE_ASSET',
        'INVESTMENT_REIT',
    ],
    'business': [
        'BUSINESS', 'INVENTORY', 'RECEIVABLES', 'REVENUE', 'COMMERCIAL',
    ],
    'trusts': [
        'TRUST', 'TRUSTEE', 'BENEFICIARY', 'ESTATE',
    ],
    'debts': [
        'LIABILITY_CREDIT_CARD', 'LIABILITY_LOAN',
        'CREDIT_CARD', 'DEBT', 'LOAN', 'LIABILITY', 'EXPENSE',
        'MORTGAGE', 'AUTO_LOAN', 'STUDENT_LOAN', 'PERSONAL_LOAN', 'HOME_EQUITY',
        'BALANCE', 'OWED', 'PAYABLE', 'CREDIT_LINE',
    ],
};

/**
 * Check if an account is relevant for a given question context
 */
export function isAccountRelevantForContext(
    lineItems: AssetLineItem[],
    context: QuestionContext
): boolean {
    const relevantCategories = CONTEXT_TO_CATEGORIES[context] || [];
    return lineItems.some(item => {
        const category = (item.zakat_category || item.inferred_category || '').toUpperCase();
        return relevantCategories.includes(category);
    });
}

/**
 * Filter accounts to those relevant for a given context
 */
export function filterRelevantAccounts<T extends {
    id: string;
    updated_at?: string;
    created_at?: string;
    lineItems?: AssetLineItem[];
}>(
    accounts: T[],
    context: QuestionContext,
    maxAgeMonths: number = 6
): T[] {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - maxAgeMonths);

    return accounts.filter(account => {
        const accountDate = new Date(account.updated_at || account.created_at || 0);
        if (accountDate < cutoffDate) return false;

        if (account.lineItems && account.lineItems.length > 0) {
            return isAccountRelevantForContext(account.lineItems, context);
        }

        return true;
    });
}

/**
 * Map line items from an account to form field updates
 */
export function mapLineItemsToFormData(
    lineItems: AssetLineItem[]
): Partial<ZakatFormData> {
    const updates: Partial<ZakatFormData> = {};

    for (const item of lineItems) {
        const category = (item.zakat_category || item.inferred_category || 'OTHER').toUpperCase();
        const fieldName = CATEGORY_TO_FIELDS[category];

        if (!fieldName) continue;

        const currentValue = (updates as Record<string, number | undefined>)[fieldName] || 0;
        (updates as Record<string, number>)[fieldName] = currentValue + item.amount;
    }

    return updates;
}

/**
 * Merge imported account data into existing form data
 */
export function mergeAccountIntoFormData(
    currentFormData: ZakatFormData,
    lineItems: AssetLineItem[]
): ZakatFormData {
    const updates = mapLineItemsToFormData(lineItems);

    const merged = { ...currentFormData };

    for (const [key, value] of Object.entries(updates)) {
        if (typeof value === 'number') {
            const currentValue = (merged[key as keyof ZakatFormData] as number) || 0;
            (merged as any)[key as keyof ZakatFormData] = currentValue + value;
        }
    }

    return merged;
}

/**
 * Get all form fields that would be updated by an account's line items
 */
export function getAffectedFormFields(lineItems: AssetLineItem[]): string[] {
    const fields = new Set<string>();

    for (const item of lineItems) {
        const category = (item.zakat_category || item.inferred_category || 'OTHER').toUpperCase();
        const fieldName = CATEGORY_TO_FIELDS[category];
        if (fieldName) {
            fields.add(fieldName);
        }
    }

    return Array.from(fields);
}

/**
 * Get human-readable labels for affected question areas
 */
export function getAffectedQuestionLabels(lineItems: AssetLineItem[]): string[] {
    const fields = getAffectedFormFields(lineItems);
    const labels = new Set<string>();

    for (const field of fields) {
        if (['checkingAccounts', 'savingsAccounts', 'cashOnHand', 'digitalWallets'].includes(field)) {
            labels.add('Liquid Assets');
        } else if (['passiveInvestmentsValue', 'activeInvestments', 'dividends', 'reitsValue'].includes(field)) {
            labels.add('Investments');
        } else if (['fourOhOneKVestedBalance', 'traditionalIRABalance', 'rothIRAContributions', 'hsaBalance'].includes(field)) {
            labels.add('Retirement');
        } else if (['cryptoCurrency', 'cryptoTrading', 'stakedAssets'].includes(field)) {
            labels.add('Crypto');
        } else if (['goldInvestmentValue', 'goldJewelryValue', 'silverInvestmentValue', 'silverJewelryValue'].includes(field)) {
            labels.add('Precious Metals');
        } else if (['creditCardBalance', 'studentLoansDue', 'unpaidBills'].includes(field)) {
            labels.add('Debts');
        }
    }

    return Array.from(labels);
}
