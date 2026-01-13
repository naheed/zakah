/**
 * Assets-related content.
 * Account type labels, empty states, freshness indicators.
 */

export const accountTypeLabels = {
    CHECKING: 'Checking',
    SAVINGS: 'Savings',
    BROKERAGE: 'Brokerage',
    RETIREMENT_401K: '401(k)',
    RETIREMENT_IRA: 'IRA',
    ROTH_IRA: 'Roth IRA',
    CRYPTO_WALLET: 'Crypto',
    REAL_ESTATE: 'Real Estate',
    TRUST: 'Trust',
    METALS: 'Precious Metals',
    BUSINESS: 'Business',
    OTHER: 'Other',
} as const;

export const freshness = {
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: (days: number) => `${days}d ago`,
} as const;

export const emptyState = {
    noAccounts: 'No accounts added yet',
    addAccount: 'Add Account',
} as const;
