/*
 * Copyright (C) 2026 ZakatFlow
 *
 * AGPL-3.0-or-later
 */

/**
 * Shared types for the ChatGPT widget package.
 * These match the structuredContent shapes returned by the MCP server tools.
 */

/** Result from the calculate_zakat tool */
export interface ZakatResult {
    zakatDue: number;
    totalAssets: number;
    totalLiabilities: number;
    netZakatableWealth: number;
    nisab: number;
    isAboveNisab: boolean;
    methodology: string;
    methodologyId: string;
    reportLink: string;
}

/** Single methodology comparison entry */
export interface MethodologyEntry {
    methodologyId: string;
    methodologyName: string;
    description?: string;
    zakatDue: number;
    totalAssets: number;
    totalLiabilities: number;
    netZakatableWealth: number;
    nisab: number;
    isAboveNisab: boolean;
    keyRules: {
        passiveInvestmentRate: number;
        liabilityMethod: string;
        nisabStandard: string;
    };
    error?: string;
}

/** Result from the compare_madhabs tool */
export interface ComparisonResult {
    type: 'comparison';
    comparisons: MethodologyEntry[];
}

/** Individual asset added during an interactive session */
export interface SessionAsset {
    type: 'cash' | 'gold' | 'silver' | 'stocks' | 'retirement' | 'loans';
    amount: number;
}

/** Progress state for an interactive calculation session */
export interface SessionProgress {
    type: 'session_progress';
    sessionId: string;
    assets: SessionAsset[];
    runningZakat?: number;
    methodology: string;
    nextHint?: string;
}
