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

export const legal = {
    lastUpdated: 'January 16, 2026',
} as const;
