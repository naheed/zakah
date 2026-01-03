// Madhab-specific rules and scholarly differences detection
// Each madhab has specific rulings that may differ from the optimized/bradford modes

import { Madhab, CalculationMode } from './zakatCalculations';

// Madhab-specific rules configuration
export interface MadhahRules {
    name: string;
    displayName: string;
    jewelryZakatable: boolean;
    debtDeductionMethod: 'full' | 'immediate_only' | 'twelve_month';
    retirementMethod: 'gross' | 'net_accessible';
}

export const MADHAB_RULES: Record<Madhab, MadhahRules> = {
    hanafi: {
        name: 'hanafi',
        displayName: 'Hanafi',
        jewelryZakatable: true,
        debtDeductionMethod: 'full',
        retirementMethod: 'net_accessible',
    },
    maliki: {
        name: 'maliki',
        displayName: 'Maliki',
        jewelryZakatable: false,
        debtDeductionMethod: 'twelve_month',
        retirementMethod: 'net_accessible',
    },
    shafii: {
        name: 'shafii',
        displayName: "Shafi'i",
        jewelryZakatable: false,
        debtDeductionMethod: 'twelve_month',
        retirementMethod: 'net_accessible',
    },
    hanbali: {
        name: 'hanbali',
        displayName: 'Hanbali',
        jewelryZakatable: false,
        debtDeductionMethod: 'full',
        retirementMethod: 'net_accessible',
    },
    balanced: {
        name: 'balanced',
        displayName: 'Balanced (AMJA)',
        jewelryZakatable: true, // Conservative default
        debtDeductionMethod: 'twelve_month',
        retirementMethod: 'net_accessible',
    },
};

// Mode-specific rules that may override madhab
export interface ModeRules {
    jewelryZakatable: boolean;
    retirementMethod: 'gross' | 'net_accessible' | 'bradford_exempt';
    passiveInvestmentRate: number;
}

export const MODE_RULES: Record<CalculationMode, ModeRules> = {
    pure: {
        jewelryZakatable: true, // Deferred to madhah
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
    conservative: {
        jewelryZakatable: true,
        retirementMethod: 'gross',
        passiveInvestmentRate: 1.0,
    },
    optimized: {
        jewelryZakatable: true, // Follows madhab
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 0.30,
    },
    bradford: {
        jewelryZakatable: false,
        retirementMethod: 'bradford_exempt',
        passiveInvestmentRate: 0.30,
    },
};

// Scholarly difference detection
export interface ScholarlyDifference {
    topic: string;
    appliedOpinion: string;
    madhahOpinion: string;
    supportingScholars: string[];
    methodologyLink: string;
    basis: string;
}

export function getScholarlyDifferences(
    madhab: Madhab,
    mode: CalculationMode,
    isOver59Half: boolean = false
): ScholarlyDifference[] {
    if (mode === 'pure') {
        return []; // Pure mode follows madhab exactly
    }

    const differences: ScholarlyDifference[] = [];
    const madhahRules = MADHAB_RULES[madhab];
    const modeRules = MODE_RULES[mode];

    // Check jewelry difference
    if (madhahRules.jewelryZakatable !== modeRules.jewelryZakatable) {
        differences.push({
            topic: 'Personal Jewelry',
            appliedOpinion: modeRules.jewelryZakatable ? 'Zakatable' : 'Exempt',
            madhahOpinion: madhahRules.jewelryZakatable ? 'Zakatable' : 'Exempt',
            supportingScholars: modeRules.jewelryZakatable
                ? ['Hanafi scholars']
                : ["Shafi'i scholars", 'Hanbali scholars', 'Sheikh Bradford'],
            methodologyLink: '/methodology#metals',
            basis: modeRules.jewelryZakatable
                ? 'Gold and silver retain monetary nature regardless of form'
                : 'Personal adornment for customary use is exempt',
        });
    }

    // Check retirement difference (Bradford rule)
    if (mode === 'bradford' && !isOver59Half) {
        differences.push({
            topic: 'Retirement Accounts (401k/IRA)',
            appliedOpinion: 'Exempt under 59½',
            madhahOpinion: 'Net accessible value zakatable',
            supportingScholars: ['Sheikh Joe Bradford', 'Modern ijtihad'],
            methodologyLink: '/methodology#retirement',
            basis: 'Māl ḍimār (inaccessible wealth) - lacks milk tām and qudrah',
        });
    }

    // Check conservative gross method
    if (mode === 'conservative' && madhahRules.retirementMethod !== 'gross') {
        differences.push({
            topic: 'Retirement Valuation',
            appliedOpinion: 'Gross balance (no tax deduction)',
            madhahOpinion: 'Net accessible value',
            supportingScholars: ['Precautionary opinions'],
            methodologyLink: '/methodology#retirement',
            basis: 'Pay on full amount to ensure obligation is met',
        });
    }

    return differences;
}

// Get the effective jewelry zakatable status
export function isJewelryZakatable(madhab: Madhab, mode: CalculationMode): boolean {
    if (mode === 'pure') {
        return MADHAB_RULES[madhab].jewelryZakatable;
    }
    return MODE_RULES[mode].jewelryZakatable;
}

// Get human-readable madhab name
export function getMadhahDisplayName(madhab: Madhab): string {
    return MADHAB_RULES[madhab].displayName;
}
