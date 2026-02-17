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
 * Asset Categories - Central Definition
 * 
 * This file is the single source of truth for all asset category definitions.
 * Used by:
 * - ExtractionReview.tsx (category dropdown)
 * - useAssetPersistence.ts (Zakat category mapping)
 * - AccountCard.tsx (display labels)
 * - parse-financial-document edge function (Gemini prompt)
 * - accountImportMapper.ts (form field mapping)
 */

export interface AssetCategory {
    /** Internal ID used in database (e.g., "INVESTMENT_STOCK") */
    id: string;
    /** User-friendly label (e.g., "Stocks & ETFs") */
    label: string;
    /** Plain-language description for tooltips */
    description: string;
    /** Optional: Phosphor icon name for visual consistency */
    icon?: string;
    /** Group for organizing in dropdown */
    group: 'cash' | 'investments' | 'retirement' | 'crypto' | 'commodities' | 'liabilities' | 'other';
    /** If true, this category is internal-only and should not appear in user-facing dropdowns */
    internal?: boolean;
}

/**
 * All asset categories with user-friendly labels and descriptions.
 * Categories are ordered by group for logical dropdown presentation.
 */
export const ASSET_CATEGORIES: AssetCategory[] = [
    // ═══════════════════════════════════════════
    // Cash & Bank Accounts
    // ═══════════════════════════════════════════
    {
        id: 'CASH_CHECKING',
        label: 'Checking Account',
        description: 'Money in bank checking accounts',
        icon: 'Wallet',
        group: 'cash',
    },
    {
        id: 'CASH_SAVINGS',
        label: 'Savings / Money Market',
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
    {
        id: 'CASH_DIGITAL_WALLET',
        label: 'Digital Wallet',
        description: 'PayPal, Venmo, Apple Cash, etc.',
        icon: 'DeviceMobile',
        group: 'cash',
    },

    // ═══════════════════════════════════════════
    // Investments
    // ═══════════════════════════════════════════
    {
        id: 'INVESTMENT_STOCK',
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
        label: 'Bonds / Fixed Income',
        description: 'Government or corporate bonds',
        icon: 'Certificate',
        group: 'investments',
    },
    {
        id: 'INVESTMENT_ACTIVE',
        label: 'Active Trading',
        description: 'Day trading, options, frequent trades',
        icon: 'Lightning',
        group: 'investments',
    },
    {
        id: 'INVESTMENT_REIT',
        label: 'REITs',
        description: 'Real Estate Investment Trusts',
        icon: 'Buildings',
        group: 'investments',
    },
    {
        id: 'INCOME_DIVIDEND',
        label: 'Dividends',
        description: 'Cash dividends or interest received',
        icon: 'CurrencyDollar',
        group: 'investments',
    },

    // ═══════════════════════════════════════════
    // Retirement
    // ═══════════════════════════════════════════
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

    // ═══════════════════════════════════════════
    // Crypto
    // ═══════════════════════════════════════════
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

    // ═══════════════════════════════════════════
    // Commodities
    // ═══════════════════════════════════════════
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

    // ═══════════════════════════════════════════
    // Liabilities
    // ═══════════════════════════════════════════
    {
        id: 'LIABILITY_CREDIT_CARD',
        label: 'Credit Card Balance',
        description: 'Outstanding credit card debt',
        icon: 'CreditCard',
        group: 'liabilities',
    },
    {
        id: 'LIABILITY_LOAN',
        label: 'Loan / Debt',
        description: 'Mortgages, car loans, personal loans, student loans',
        icon: 'Bank',
        group: 'liabilities',
    },

    // ═══════════════════════════════════════════
    // Other
    // ═══════════════════════════════════════════
    {
        id: 'OTHER',
        label: 'Other',
        description: 'Assets that don\'t fit other categories',
        icon: 'DotsThree',
        group: 'other',
    },

    // ═══════════════════════════════════════════
    // Internal-only categories (used by calculation engine)
    // ═══════════════════════════════════════════
    {
        id: 'LIQUID',
        label: 'Liquid Assets',
        description: 'Fully zakatable cash and equivalents',
        icon: 'Drop',
        group: 'cash',
        internal: true,
    },
    {
        id: 'PROXY_30',
        label: 'Stocks & Funds (30%)',
        description: 'Equity investments (30% zakatable proxy)',
        icon: 'TrendUp',
        group: 'investments',
        internal: true,
    },
    {
        id: 'PROXY_100',
        label: 'Fully Zakatable',
        description: '100% zakatable (active trading, crypto)',
        icon: 'TrendUp',
        group: 'investments',
        internal: true,
    },
    {
        id: 'EXEMPT',
        label: 'Exempt',
        description: 'Not subject to Zakat',
        icon: 'ShieldCheck',
        group: 'other',
        internal: true,
    },
    {
        id: 'DEDUCTIBLE',
        label: 'Deductible',
        description: 'Reduces Zakat base (debts, liabilities)',
        icon: 'MinusCircle',
        group: 'liabilities',
        internal: true,
    },
    {
        id: 'GOLD_FULL',
        label: 'Gold (Full)',
        description: 'Fully zakatable gold holdings',
        icon: 'Medal',
        group: 'commodities',
        internal: true,
    },
    {
        id: 'SILVER_FULL',
        label: 'Silver (Full)',
        description: 'Fully zakatable silver holdings',
        icon: 'Medal',
        group: 'commodities',
        internal: true,
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
 * Get a category by its ID (includes internal categories)
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
 * Get user-facing categories only (excludes internal ones)
 */
export function getUserFacingCategories(): AssetCategory[] {
    return ASSET_CATEGORIES.filter(cat => !cat.internal);
}

/**
 * Get categories grouped for dropdown display (user-facing only)
 */
export function getCategoriesGrouped(): Record<string, AssetCategory[]> {
    const grouped: Record<string, AssetCategory[]> = {};

    for (const cat of ASSET_CATEGORIES) {
        if (cat.internal) continue; // Skip internal categories
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
            return 'bg-chart-4/10 text-chart-4 border border-chart-4/20';
        case 'investments':
            return 'bg-chart-2/10 text-chart-2 border border-chart-2/20';
        case 'retirement':
            return 'bg-chart-3/10 text-chart-3 border border-chart-3/20';
        case 'crypto':
            return 'bg-chart-5/10 text-chart-5 border border-chart-5/20';
        case 'commodities':
            return 'bg-tertiary-container text-tertiary-on-container border border-tertiary-container/50';
        case 'liabilities':
            return 'bg-destructive/10 text-destructive border border-destructive/20';
        default:
            return 'bg-secondary text-secondary-foreground';
    }
}
