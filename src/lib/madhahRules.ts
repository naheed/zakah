// Madhab-specific rules for Zakat calculation
// Unified ruleset - no separate "modes" (legacy concept removed)

import { Madhab } from './zakatTypes';

// Unified Madhab rules configuration (merged from legacy MODE_RULES)
export interface MadhhabRules {
    name: string;
    displayName: string;
    description: string;
    jewelryZakatable: boolean;
    debtDeductionMethod: 'full' | 'none' | 'twelve_month';
    retirementMethod: 'gross' | 'net_accessible' | 'bradford_exempt';
    passiveInvestmentRate: number; // 1.0 = 100%, 0.30 = 30% (AAOIFI proxy)
}

export const MADHAB_RULES: Record<Madhab, MadhhabRules> = {
    balanced: {
        name: 'balanced',
        displayName: 'Balanced (Sheikh Joe Bradford)',
        description: '30% passive investments, retirement exempt under 59½, jewelry exempt, 12-month debts',
        jewelryZakatable: false, // Majority view (exempt)
        debtDeductionMethod: 'twelve_month', // Modern synthesis
        retirementMethod: 'bradford_exempt', // Traditional 401k/IRA exempt under 59.5
        passiveInvestmentRate: 0.30, // AAOIFI 30% proxy
    },
    hanafi: {
        name: 'hanafi',
        displayName: 'Hanafi',
        description: '100% all assets, jewelry included, full debt deduction',
        jewelryZakatable: true, // Gold/silver taxed regardless of form
        debtDeductionMethod: 'full', // All debts to humans deductible
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
    shafii: {
        name: 'shafii',
        displayName: "Shafi'i",
        description: '100% all assets, jewelry exempt, no debt deduction',
        jewelryZakatable: false, // Personal adornment exempt
        debtDeductionMethod: 'none', // Debt does NOT prevent Zakat (Al-Nawawi)
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
    maliki: {
        name: 'maliki',
        displayName: 'Maliki',
        description: '100% all assets, jewelry exempt, 12-month debts',
        jewelryZakatable: false, // Personal adornment exempt
        debtDeductionMethod: 'twelve_month', // Deductible only if no other assets
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
    hanbali: {
        name: 'hanbali',
        displayName: 'Hanbali',
        description: '100% all assets, jewelry exempt, full debt deduction',
        jewelryZakatable: false, // Personal adornment exempt
        debtDeductionMethod: 'full', // Full deduction (like Hanafi)
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
};

// Legacy compatibility: MODE_RULES is now just an alias to MADHAB_RULES
// This allows gradual migration of consumers
export const MODE_RULES = MADHAB_RULES;

// Scholarly difference detection (simplified - no mode parameter needed)
export interface ScholarlyDifference {
    topic: string;
    appliedOpinion: string;
    madhhabOpinion: string;
    supportingScholars: string[];
    methodologyLink: string;
    basis: string;
}

export function getScholarlyDifferences(
    madhab: Madhab,
    isOver59Half: boolean = false
): ScholarlyDifference[] {
    const differences: ScholarlyDifference[] = [];
    const rules = MADHAB_RULES[madhab];

    // Highlight retirement exemption for balanced mode
    if (madhab === 'balanced' && !isOver59Half) {
        differences.push({
            topic: 'Retirement Accounts (401k/IRA)',
            appliedOpinion: 'Exempt under 59½',
            madhhabOpinion: 'Net accessible value zakatable',
            supportingScholars: ['Sheikh Joe Bradford'],
            methodologyLink: '/methodology#retirement',
            basis: 'Māl ḍimār (inaccessible wealth) - lacks milk tām and qudrah',
        });
    }

    // Highlight 30% rule for balanced mode
    if (madhab === 'balanced' && rules.passiveInvestmentRate < 1.0) {
        differences.push({
            topic: 'Passive Investments (ETFs/Index Funds)',
            appliedOpinion: '30% of value (underlying assets proxy)',
            madhhabOpinion: '100% of market value',
            supportingScholars: ['Sheikh Joe Bradford', 'AAOIFI'],
            methodologyLink: '/methodology#investments',
            basis: 'Only zakatable underlying assets count, not fund structure premium',
        });
    }

    // Jewelry: only Hanafi differs
    if (madhab === 'hanafi') {
        differences.push({
            topic: 'Personal Jewelry',
            appliedOpinion: 'Zakatable',
            madhhabOpinion: 'Exempt (majority view)',
            supportingScholars: ['Hanafi scholars'],
            methodologyLink: '/methodology#metals',
            basis: 'Gold and silver retain monetary nature regardless of form',
        });
    }

    return differences;
}

// Get the effective jewelry zakatable status
export function isJewelryZakatable(madhab: Madhab): boolean {
    return MADHAB_RULES[madhab].jewelryZakatable;
}

// Get human-readable madhab name
export function getMadhhabDisplayName(madhab: Madhab): string {
    return MADHAB_RULES[madhab].displayName;
}

// Get description for madhab
export function getMadhhabDescription(madhab: Madhab): string {
    return MADHAB_RULES[madhab].description;
}

// Legacy compatibility aliases
export const getMadhahDisplayName = getMadhhabDisplayName;
export const getModeDisplayName = getMadhhabDisplayName;
export const getModeDescription = getMadhhabDescription;
