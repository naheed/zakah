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
    setup: 'Preferences',
    uploadFirst: 'Upload',
    welcome: 'Welcome',
    categories: 'Asset Types',
    simpleMode: 'Quick Estimate',
    liquidAssets: 'Cash & Bank',
    investments: 'Investments',
    retirement: 'Retirement',
    preciousMetals: 'Precious Metals',
    crypto: 'Crypto',
    trusts: 'Trusts',
    realEstate: 'Real Estate',
    business: 'Business',
    illiquidAssets: 'Other Assets',
    debtOwedToYou: 'Loans Given',
    liabilities: 'Liabilities',
    tax: 'Taxes',
    results: 'Your Obligation',
} as const;

export const preferences = {
    title: 'Personalize Your Calculation',
    entryMethod: {
        title: 'How do you want to enter data?',
        manual: {
            title: 'Manual Entry',
            description: 'Go through the wizard step-by-step.',
        },
        upload: {
            title: 'Auto-Fill (Beta)',
            description: 'Upload bank statements to auto-populate.',
        },
    },
    calculationMode: {
        title: 'Calculation Mode',
        simple: {
            title: 'Quick Estimate',
            description: 'I just want to enter a total number.',
        },
        detailed: {
            title: 'Detailed Breakdown',
            description: 'Walk me through each asset class.',
        },
    },
    methodology: {
        title: 'School of Thought',
        description: 'Select a specific methodology now for tailored guidance. You can compare outputs from other scholars in the final report.',
        bradford: {
            title: 'Sheikh Joe Bradford',
            description: 'Contemporary rulings optimized for modern assets (401k, Crypto) where classical texts are silent.',
        },
    },
} as const;
