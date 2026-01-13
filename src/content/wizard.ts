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

// Step titles (for navigation) - aligned with ZakatWizard.tsx allSteps
export const stepTitles = {
    welcome: 'Welcome',
    categories: 'Asset Types',
    simpleMode: 'Quick Calculate',
    liquidAssets: 'Cash & Bank',
    investments: 'Investments',
    retirement: 'Retirement',
    preciousMetals: 'Precious Metals',
    crypto: 'Crypto',
    trusts: 'Trusts',
    realEstate: 'Real Estate',
    business: 'Business',
    illiquidAssets: 'Other Assets',
    debtOwedToYou: 'Receivables',
    liabilities: 'Deductions',
    tax: 'Taxes',
    results: 'Your Zakat',
} as const;
