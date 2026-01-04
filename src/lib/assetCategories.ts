/**
 * Asset Categories - Central Definition
 * 
 * This file is the single source of truth for all asset category definitions.
 * Used by:
 * - ExtractionReview.tsx (category dropdown)
 * - useAssetPersistence.ts (Zakat category mapping)
 * - AccountCard.tsx (display labels)
 */

export interface AssetCategory {
    /** Internal ID used in database (e.g., "INVESTMENT_EQUITY") */
    id: string;
    /** User-friendly label (e.g., "Stocks & ETFs") */
    label: string;
    /** Plain-language description for tooltips */
    description: string;
    /** Optional: Phosphor icon name for visual consistency */
    icon?: string;
    /** Group for organizing in dropdown */
    group: 'cash' | 'investments' | 'retirement' | 'crypto' | 'commodities' | 'liabilities' | 'other';
}

/**
 * All asset categories with user-friendly labels and descriptions.
 * Categories are ordered by group for logical dropdown presentation.
 */
export const ASSET_CATEGORIES: AssetCategory[] = [
    // Cash & Bank Accounts
    {
        id: 'CASH_CHECKING',
        label: 'Cash / Checking',
        description: 'Money in bank checking accounts',
        icon: 'Wallet',
        group: 'cash',
    },
    {
        id: 'CASH_SAVINGS',
        label: 'Savings',
        description: 'Savings accounts, money market, or CDs',
        icon: 'PiggyBank',
        group: 'cash',
    },
    {
        id: 'CASH_ON_HAND',
        label: 'Cash on Hand',
        description: 'Physical cash not in a bank',
        icon: 'Money',
        group: 'cash',
    },

    // Investments
    {
        id: 'INVESTMENT_EQUITY',
        label: 'Stocks & ETFs',
        description: 'Shares in companies or exchange-traded funds',
        icon: 'TrendUp',
        group: 'investments',
    },
    {
        id: 'INVESTMENT_MUTUAL_FUND',
        label: 'Mutual Funds',
        description: 'Managed investment funds',
        icon: 'ChartPie',
        group: 'investments',
    },
    {
        id: 'INVESTMENT_BOND',
        label: 'Bonds',
        description: 'Government or corporate bonds',
        icon: 'Certificate',
        group: 'investments',
    },
    {
        id: 'INCOME_DIVIDEND',
        label: 'Dividends',
        description: 'Cash dividends or interest received',
        icon: 'CurrencyDollar',
        group: 'investments',
    },

    // Retirement
    {
        id: 'RETIREMENT_401K',
        label: '401(k)',
        description: 'Employer-sponsored retirement account',
        icon: 'Vault',
        group: 'retirement',
    },
    {
        id: 'RETIREMENT_ROTH',
        label: 'Roth IRA',
        description: 'Tax-advantaged retirement (contributions after tax)',
        icon: 'ShieldCheck',
        group: 'retirement',
    },
    {
        id: 'RETIREMENT_IRA',
        label: 'Traditional IRA',
        description: 'Pre-tax retirement account',
        icon: 'Archive',
        group: 'retirement',
    },
    {
        id: 'RETIREMENT_HSA',
        label: 'HSA',
        description: 'Health Savings Account',
        icon: 'FirstAidKit',
        group: 'retirement',
    },

    // Crypto
    {
        id: 'CRYPTO',
        label: 'Cryptocurrency',
        description: 'Bitcoin, Ethereum, and other digital currencies',
        icon: 'CurrencyBtc',
        group: 'crypto',
    },
    {
        id: 'CRYPTO_STAKED',
        label: 'Staked Crypto',
        description: 'Cryptocurrency locked for staking rewards',
        icon: 'Lock',
        group: 'crypto',
    },

    // Commodities
    {
        id: 'COMMODITY_GOLD',
        label: 'Gold',
        description: 'Physical gold or gold ETFs',
        icon: 'Medal',
        group: 'commodities',
    },
    {
        id: 'COMMODITY_SILVER',
        label: 'Silver',
        description: 'Physical silver or silver ETFs',
        icon: 'Medal',
        group: 'commodities',
    },

    // Liabilities (shown but not zakatable)
    {
        id: 'LIABILITY_LOAN',
        label: 'Loan / Debt',
        description: 'Mortgages, car loans, personal loans',
        icon: 'Bank',
        group: 'liabilities',
    },
    {
        id: 'LIABILITY_CREDIT_CARD',
        label: 'Credit Card Balance',
        description: 'Outstanding credit card debt',
        icon: 'CreditCard',
        group: 'liabilities',
    },

    // Other
    {
        id: 'OTHER',
        label: 'Other',
        description: 'Assets that don\'t fit other categories',
        icon: 'DotsThree',
        group: 'other',
    },

    // === Zakat Calculation Categories (internal use) ===
    // These are assigned by the Zakat methodology logic, not user-selectable
    {
        id: 'LIQUID',
        label: 'Liquid Assets',
        description: 'Fully zakatable cash and equivalents',
        icon: 'Drop',
        group: 'cash',
    },
    {
        id: 'PROXY_30',
        label: 'Stocks & Funds',
        description: 'Equity investments (30% zakatable proxy)',
        icon: 'TrendUp',
        group: 'investments',
    },
    {
        id: 'EXEMPT',
        label: 'Exempt',
        description: 'Not subject to Zakat',
        icon: 'ShieldCheck',
        group: 'other',
    },
    {
        id: 'DEDUCTIBLE',
        label: 'Deductible',
        description: 'Reduces Zakat base (debts, liabilities)',
        icon: 'MinusCircle',
        group: 'liabilities',
    },
    {
        id: 'GOLD_FULL',
        label: 'Gold',
        description: 'Fully zakatable gold holdings',
        icon: 'Medal',
        group: 'commodities',
    },
    {
        id: 'SILVER_FULL',
        label: 'Silver',
        description: 'Fully zakatable silver holdings',
        icon: 'Medal',
        group: 'commodities',
    },
];

/**
 * Group labels for dropdown sections
 */
export const CATEGORY_GROUPS: Record<AssetCategory['group'], string> = {
    cash: 'Cash & Bank Accounts',
    investments: 'Investments',
    retirement: 'Retirement Accounts',
    crypto: 'Cryptocurrency',
    commodities: 'Precious Metals',
    liabilities: 'Liabilities',
    other: 'Other',
};

/**
 * Get a category by its ID
 */
export function getCategoryById(id: string): AssetCategory | undefined {
    return ASSET_CATEGORIES.find(cat => cat.id === id);
}

/**
 * Get user-friendly label for a category ID
 */
export function getCategoryLabel(id: string): string {
    const category = getCategoryById(id);
    return category?.label || id;
}

/**
 * Get categories grouped for dropdown display
 */
export function getCategoriesGrouped(): Record<string, AssetCategory[]> {
    const grouped: Record<string, AssetCategory[]> = {};

    for (const cat of ASSET_CATEGORIES) {
        const groupLabel = CATEGORY_GROUPS[cat.group];
        if (!grouped[groupLabel]) {
            grouped[groupLabel] = [];
        }
        grouped[groupLabel].push(cat);
    }

    return grouped;
}

/**
 * Get category color based on group (for badges)
 */
export function getCategoryColor(id: string): string {
    const category = getCategoryById(id);
    if (!category) return 'bg-secondary text-secondary-foreground';

    switch (category.group) {
        case 'cash':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
        case 'investments':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case 'retirement':
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        case 'crypto':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
        case 'commodities':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'liabilities':
            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        default:
            return 'bg-secondary text-secondary-foreground';
    }
}
