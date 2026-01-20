/**
 * Common UI strings used across multiple components.
 * Buttons, labels, and shared terminology.
 */

export const buttons = {
    signIn: 'Sign in with Google',
    signInToSave: 'Sign in to Save',
    startCalculating: 'Start Calculating',
    startNew: 'Start New Calculation',
    continue: 'Continue',
    viewFullReport: 'View Full Report',
    viewAll: 'View all history',
    manageAll: 'Manage All',
    addAccount: '+ Add Account',
    discardAndStart: 'Discard and start over',
} as const;

export const labels = {
    zakatDue: 'Zakat Obligation',
    totalValue: 'Zakatable Assets',
    inProgress: 'In Progress',
    latestReport: 'Latest Summary',
    pastReports: 'Past Cycles',
    assets: 'Assets',
    communityImpact: 'Community Impact',
    yourImpact: 'Your Purification',
} as const;

export const badges = {
    zeroKnowledge: 'Zero-Knowledge Encryption',
    sessionOnly: 'Session-Only Storage',
} as const;

export const settings = {
    settings: 'Settings',
} as const;

// Shared accessibility labels
export const a11y = {
    settings: 'Settings',
    viewSettings: 'View Settings',
} as const;
