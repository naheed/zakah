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
 * Settings page content.
 * Section titles, labels, descriptions, and dialog strings.
 */

export const page = {
    title: 'Settings',
    metaDescription: 'Configure your Zakat calculation settings.',
} as const;

export const sections = {
    appearance: 'Appearance',
    calculationEngine: 'Methodology',
    dataManagement: 'Data & Privacy',
} as const;

export const appearance = {
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',
} as const;

export const calculationEngine = {
    madhab: {
        label: 'School of Thought',
        description: 'Methodology for calculations',
        sheetTitle: 'Select School (Madhab)',
        sheetDescription: 'Different schools have varying rulings on certain assets.',
    },
    nisab: {
        label: 'Nisab Standard',
        description: 'Minimum threshold for Zakat eligibility',
        sheetTitle: 'Select Nisab Standard',
        silverOption: (amount: string) => `Silver — ${amount}`,
        goldOption: (amount: string) => `Gold — ${amount}`,
    },
    calendar: {
        label: 'Calendar Reference',
        description: 'Timeline for your Hawl year',
        sheetTitle: 'Select Calendar Type',
    },
    hawlDate: {
        label: 'Hawl Anniversary',
        description: 'Your annual Zakat date',
        sheetTitle: 'Set Your Hawl Date',
        sheetDescription: 'Select the date you first reached Nisab or the date you mark your annual Zakat.',
        notSet: 'Not set',
    },
} as const;

export const dataManagement = {
    clearSession: {
        label: 'Clear Current Session',
        description: 'Reset calculator to start fresh',
        button: 'Clear Session',
        confirmTitle: 'Clear Current Session?',
        confirmDescription: 'This will remove your current calculation progress. Your saved reports will not be affected.',
        confirmAction: 'Clear Session',
        cancel: 'Cancel',
        success: 'Session cleared',
    },
    deleteAllData: {
        label: 'Delete All Data',
        description: 'Remove all saved data from this device',
        button: 'Delete All Data',
        confirmTitle: 'Delete All Data?',
        confirmDescription: 'This will permanently delete all your Zakat calculations, linked accounts, and settings from this device. This action cannot be undone.',
        confirmAction: 'Delete Everything',
        cancel: 'Cancel',
        success: 'All data deleted',
    },
} as const;

/**
 * Metrics display content.
 * Global and referral variant messages.
 */
export const metrics = {
    global: (assets: string, zakat: string) =>
        `We've helped evaluate ${assets} in assets and calculate ${zakat} in Zakat.`,
    referral: (assets: string, zakat: string) =>
        `Through your shares, people evaluated ${assets} in assets and calculated ${zakat} in Zakat.`,
} as const;
