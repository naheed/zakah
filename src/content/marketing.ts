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
 * Marketing / Landing Page content.
 * Centralized copy for the first-time visitor experience.
 */

export const hero = {
    headline: 'Zakat,',
    headlineAccent: 'Clarified.',
    subhead: "Navigate your complex portfolio—401(k)s, crypto, gold, trusts, and more—across 8 scholarly methodologies. Generate a detailed PDF or CSV report in minutes. Private, secure, and accurate.",
    cta: "Start Calculating",
    previewPdf: "Preview PDF Report",
    downloadCsv: "Download CSV Sample",
} as const;

export const reportCard = {
    title: "Annual Zakat Statement",
    period: "Fiscal Year 2026",
    userName: "Ahmed A.",
    zakatDueLabel: "Zakat Due",
    zakatDueValue: "$12,940.00",
    netAssetsLabel: "Zakatable Wealth",
    netAssetsValue: "$517,600.00",
    totalAssetsLabel: "Total Assets",
    totalAssetsValue: "$777,600.00",
    liabilitiesLabel: "Liabilities",
    liabilitiesValue: "($260,000.00)",
    privacyBadge: "Session Encrypted",
    cta: "Download Certified Report",
} as const;

export const trustBadges = {
    encryption: 'Zero-Knowledge Encryption',
    sessionOnly: 'Open Source & Auditable',
} as const;

export const sankey = {
    heading: 'From Cash Flow to',
    headingAccent: 'Zakat Flow',
    personaIntro: 'Meet Ahmed — a $500K portfolio across 6 asset classes. Watch how ZakatFlow traces every dollar to its obligation.',
    footnote: '*Flow shows how assets are filtered by Zakat rules before final calculation',
    totalAssets: "Total Assets",
    deductions: "Deductions",
    netWealth: "Net Wealth",
    zakatDue: "Zakat Due",
} as const;

export const threeWays = {
    heading: "Start however you're comfortable",
    subhead: 'Three paths, one result — an accurate, methodology-aware Zakat calculation.',
    manual: {
        title: "Enter manually",
        description: "Guided wizard walks you through every asset class — cash, stocks, crypto, gold, and more."
    },
    upload: {
        title: "Upload a statement",
        description: "Drop a bank or brokerage PDF — AI extracts the numbers and maps them to Zakat categories."
    },
    bank: {
        title: "Connect your bank",
        description: "Link via Plaid for real-time balances. Your data is encrypted with a key only you control."
    }
} as const;

export const whatsCovered = {
    heading: '8 methodologies. 10 asset classes.',
    subhead: 'Your scholar, your assets — calculated with precision.',
    // Methodologies with corrected labels and distinguishing keys
    methodologies: [
        { name: "Sheikh Joe Bradford", tradition: "Modern", key: "Retirement & passive ETF rules" },
        { name: "AMJA", tradition: "Modern", key: "Assembly of Muslim Jurists" },
        { name: "Imam Tahir Anwar", tradition: "Hanafi", key: "Bay Area community scholar" },
        { name: "Dr. Al-Qaradawi", tradition: "Modern Fiqh", key: "Fiqh al-Zakah theory" },
        { name: "Hanafi", tradition: "Classical", key: "No jewelry Zakat" },
        { name: "Shafi'i", tradition: "Classical", key: "No debt deductions" },
        { name: "Maliki", tradition: "Classical", key: "Jewelry above 200 dirhams" },
        { name: "Hanbali", tradition: "Classical", key: "Strictest retirement rules" },
    ],
    assets: [
        { id: "Cash & Savings", label: "Cash" },
        { id: "Investments", label: "Stocks" },
        { id: "Retirement", label: "Retirement" },
        { id: "Crypto & Digital", label: "Crypto" },
        { id: "Precious Metals", label: "Gold & Silver" },
        { id: "Business", label: "Business" },
        { id: "Real Estate", label: "Real Estate" },
        { id: "Trusts", label: "Trusts" },
        { id: "Debts Owed to You", label: "Debts Owed" },
        { id: "Illiquid Assets", label: "Other Assets" },
    ]
} as const;

export const privacy = {
    heading: 'Your data, your rules',
    subhead: 'Privacy built into every layer — choose how secure you need to be.',
    managed: {
        title: "Managed",
        subtitle: "Frictionless",
        description: "We store the encryption key so you can access your data across devices. We never read your financial data."
    },
    sovereign: {
        title: "Sovereign",
        subtitle: "Zero-knowledge",
        description: "12-word recovery phrase. Only you can decrypt. If you lose it, the data is gone forever — by design."
    },
    openSource: "Open Source (AGPL-3.0) — audit every line of code"
} as const;

export const finalCta = {
    heading: 'Ready to fulfill your obligation?',
    subhead: 'Join the community members who trust ZakatFlow to calculate their Zakat with accuracy, privacy, and scholarly rigor.',
    button: "Start Calculating",
    reassurance: {
        noSignup: "No sign-up required",
        encrypted: "Device-encrypted",
        time: "Takes 5 minutes"
    }
} as const;

export const footer = {
    methodologyDisclaimer: "8 Scholarly Methodologies: Sheikh Joe Bradford (Default), AMJA & Classical Opinions",
} as const;
