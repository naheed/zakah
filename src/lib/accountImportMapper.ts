/**
 * Account Import Mapper
 * 
 * Maps line items from imported accounts to ZakatFormData fields.
 * Handles cross-question mapping (e.g., a brokerage account with checking sweep
 * can contribute to both Liquid Assets and Investments).
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
 * Mapping from Zakat categories to form fields
 */
const CATEGORY_TO_FIELDS: Record<string, keyof ZakatFormData> = {
    // Liquid assets
    'CHECKING': 'checkingAccounts',
    'SAVINGS': 'savingsAccounts',
    'CASH': 'cashOnHand',
    'MONEY_MARKET': 'savingsAccounts',
    'CD': 'savingsAccounts',
    'LIQUID': 'checkingAccounts',

    // Investments
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

    // Retirement
    'RETIREMENT': 'fourOhOneKVestedBalance',
    '401K': 'fourOhOneKVestedBalance',
    'IRA': 'traditionalIRABalance',
    'ROTH_IRA': 'rothIRAContributions',
    'PENSION': 'fourOhOneKVestedBalance',

    // Crypto
    'CRYPTO': 'cryptoCurrency',
    'CRYPTOCURRENCY': 'cryptoCurrency',
    'BITCOIN': 'cryptoCurrency',
    'ETHEREUM': 'cryptoCurrency',
    'STAKING': 'stakedAssets',
    'NFT': 'cryptoTrading',

    // Precious metals
    'GOLD': 'goldValue',
    'SILVER': 'silverValue',
    'METALS': 'goldValue',
    'GOLD_FULL': 'goldValue',
    'SILVER_FULL': 'silverValue',

    // Real estate - map to rental income (net cash received)
    'REAL_ESTATE': 'rentalPropertyIncome',
    'PROPERTY': 'rentalPropertyIncome',

    // Business - map to business fields
    'BUSINESS': 'businessCashAndReceivables',
    'INVENTORY': 'businessInventory',
    'RECEIVABLES': 'goodDebtOwedToYou',

    // Liabilities (negative values)
    'CREDIT_CARD': 'creditCardBalance',
    'DEBT': 'unpaidBills',
    'LOAN': 'studentLoansDue',
    'EXPENSE': 'monthlyLivingExpenses',
    'LIABILITY': 'unpaidBills',

    // Other
    'EXEMPT': null, // Not zakatable, don't map
    'DEDUCTIBLE': null,
    'OTHER': 'cashOnHand', // Default fallback
};

/**
 * Question context to relevant categories mapping
 * Used to filter which accounts appear for each question
 * 
 * NOTE: Categories are intentionally overlapping to handle real-world scenarios:
 * - Retirement accounts often appear in brokerage statements
 * - Brokerage accounts may have retirement holdings
 * - Credit cards may have rewards (cash-like)
 */
const CONTEXT_TO_CATEGORIES: Record<QuestionContext, string[]> = {
    'liquid-assets': [
        'CHECKING', 'SAVINGS', 'CASH', 'MONEY_MARKET', 'CD', 'LIQUID',
        'BROKERAGE_CASH', 'SWEEP', 'CASH_SWEEP', // Brokerage sweep accounts
    ],
    'investments': [
        'STOCKS', 'EQUITY', 'ETF', 'MUTUAL_FUNDS', 'INDEX_FUNDS', 'BONDS',
        'FIXED_INCOME', 'DIVIDENDS', 'ACTIVE_TRADING', 'OPTIONS', 'PROXY_30', 'PROXY_100',
        'BROKERAGE', 'SECURITIES', // Generic brokerage
        // Retirement often in brokerage statements:
        'RETIREMENT', '401K', 'IRA', 'ROTH_IRA', 'PENSION', 'HSA', '529',
    ],
    'retirement': [
        'RETIREMENT', '401K', 'IRA', 'ROTH_IRA', 'PENSION', 'HSA', '529', '403B', '457',
        // Retirement accounts hold investments:
        'STOCKS', 'EQUITY', 'ETF', 'MUTUAL_FUNDS', 'INDEX_FUNDS', 'BONDS', 'FIXED_INCOME',
        'BROKERAGE', 'SECURITIES',
    ],
    'crypto': [
        'CRYPTO', 'CRYPTOCURRENCY', 'BITCOIN', 'ETHEREUM', 'STAKING', 'NFT',
        'DEFI', 'WALLET', 'ALTCOIN', 'TOKEN',
    ],
    'precious-metals': [
        'GOLD', 'SILVER', 'METALS', 'GOLD_FULL', 'SILVER_FULL',
        'BULLION', 'COINS', 'PLATINUM', 'PALLADIUM',
    ],
    'real-estate': [
        'REAL_ESTATE', 'PROPERTY', 'RENTAL', 'REIT', 'MORTGAGE_ASSET',
    ],
    'business': [
        'BUSINESS', 'INVENTORY', 'RECEIVABLES', 'REVENUE', 'COMMERCIAL',
    ],
    'trusts': [
        'TRUST', 'TRUSTEE', 'BENEFICIARY', 'ESTATE',
    ],
    'debts': [
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
 * Also filters to accounts updated within maxAgeMonths
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
        // Check recency
        const accountDate = new Date(account.updated_at || account.created_at || 0);
        if (accountDate < cutoffDate) return false;

        // Check relevance (if we have line items)
        if (account.lineItems && account.lineItems.length > 0) {
            return isAccountRelevantForContext(account.lineItems, context);
        }

        // If no line items, include it (we'll fetch them later)
        return true;
    });
}

/**
 * Map line items from an account to form field updates
 * Returns partial ZakatFormData with values to merge
 */
export function mapLineItemsToFormData(
    lineItems: AssetLineItem[]
): Partial<ZakatFormData> {
    const updates: Partial<ZakatFormData> = {};

    for (const item of lineItems) {
        const category = (item.zakat_category || item.inferred_category || 'OTHER').toUpperCase();
        const fieldName = CATEGORY_TO_FIELDS[category];

        if (!fieldName) continue; // Skip unmapped categories

        // Type-safe accumulation
        const currentValue = (updates[fieldName] as number) || 0;
        (updates as any)[fieldName] = currentValue + item.amount;
    }

    return updates;
}

/**
 * Merge imported account data into existing form data
 * Handles the cross-question nature of imports
 */
export function mergeAccountIntoFormData(
    currentFormData: ZakatFormData,
    lineItems: AssetLineItem[]
): ZakatFormData {
    const updates = mapLineItemsToFormData(lineItems);

    // Merge updates into current form data
    const merged = { ...currentFormData };

    for (const [key, value] of Object.entries(updates)) {
        if (typeof value === 'number') {
            const currentValue = (merged[key as keyof ZakatFormData] as number) || 0;
            (merged as any)[key] = currentValue + value;
        }
    }

    return merged;
}

/**
 * Get all form fields that would be updated by an account's line items
 * Useful for showing users which questions will be affected
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
        if (['checkingAccounts', 'savingsAccounts', 'cashOnHand'].includes(field)) {
            labels.add('Liquid Assets');
        } else if (['passiveInvestmentsValue', 'activeInvestments', 'dividends'].includes(field)) {
            labels.add('Investments');
        } else if (['fourOhOneKVestedBalance', 'traditionalIRABalance', 'rothIRAContributions'].includes(field)) {
            labels.add('Retirement');
        } else if (['cryptoCurrency', 'cryptoTrading', 'stakedAssets'].includes(field)) {
            labels.add('Crypto');
        } else if (['goldValue', 'silverValue'].includes(field)) {
            labels.add('Precious Metals');
        } else if (['creditCardDebt', 'personalLoans', 'otherShortTermDebt'].includes(field)) {
            labels.add('Debts');
        }
    }

    return Array.from(labels);
}
