/**
 * Wizard-specific content.
 * All step titles, descriptions, and CTAs for the calculation flow.
 */

export const welcome = {
    // Dashboard (returning user)
    headlineReturning: (firstName?: string) =>
        firstName ? `Welcome back, ${firstName}` : 'Welcome back',
    continueCard: {
        title: 'Continue where you left off',
        stepLabel: (step: number) => `Step ${step}`,
        savedLabel: (time: string) => `Saved ${time}`,
    },
    discardPrompt: 'Discard and start over',

    // Report Card
    calculatedLabel: (time: string) => `Calculated ${time || 'recently'}`,
} as const;

export const auth = {
    signInPrompt: {
        title: 'Sign in to save your progress',
        description: 'Sync across devices and verify your history.',
    },
} as const;

export const assets = {
    sectionTitle: 'Assets',
    noAccountsMessage: 'No accounts added yet',
    moreAccounts: (count: number) => `+${count} more accounts`,
} as const;

// Step titles (for navigation)
export const stepTitles = {
    welcome: 'Welcome',
    categories: 'Asset Types',
    simpleMode: 'Quick Estimate',
    liquidAssets: 'Cash & Savings',
    preciousMetals: 'Gold & Silver',
    crypto: 'Cryptocurrency',
    investments: 'Investments',
    retirement: 'Retirement Accounts',
    trusts: 'Trusts',
    realEstate: 'Real Estate',
    business: 'Business Assets',
    illiquidAssets: 'Other Assets',
    debtOwedToYou: 'Loans to Others',
    liabilities: 'Debts & Liabilities',
    tax: 'Tax Obligations',
    results: 'Your Zakat Report',
} as const;
