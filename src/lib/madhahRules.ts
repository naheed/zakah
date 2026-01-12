// Madhab-specific rules and scholarly differences detection
// Each madhab has specific rulings that may differ from the optimized/bradford modes

import { Madhab, CalculationMode } from './zakatTypes';

// Madhab-specific rules configuration
export interface MadhahRules {
    name: string;
    displayName: string;
    jewelryZakatable: boolean;
    debtDeductionMethod: 'full' | 'immediate_only' | 'twelve_month';
    retirementMethod: 'gross' | 'net_accessible';
}

export const MADHAB_RULES: Record<Madhab, MadhahRules> = {
    balanced: {
        name: 'balanced',
        displayName: 'Balanced (AMJA)',
        jewelryZakatable: true, // Conservative default for generic "Balanced" (Hanafi overlap)
        debtDeductionMethod: 'twelve_month',
        retirementMethod: 'net_accessible',
    },
    hanafi: {
        name: 'hanafi',
        displayName: 'Hanafi',
        jewelryZakatable: true,
        debtDeductionMethod: 'full',
        retirementMethod: 'net_accessible',
    },
    shafii: {
        name: 'shafii',
        displayName: "Shafi'i / Maliki / Hanbali",
        jewelryZakatable: false, // Personal use exempt
        debtDeductionMethod: 'twelve_month', // Common modern fatwa across these schools
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
    bradford: {
        // Sheikh Joe Bradford's specific methodology
        // 1. Personal Jewelry is Exempt (majority view)
        // 2. 401k/IRA exempt if under 59.5 (inaccessible/lack of complete ownership)
        // 3. Passive investments calculated at 30% of market value (proxy for Zakatable assets)
        jewelryZakatable: false,
        retirementMethod: 'bradford_exempt',
        passiveInvestmentRate: 0.30,
    },
    hanafi: {
        jewelryZakatable: true, // Hanafi includes personal jewelry
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
    'maliki-shafii': {
        // Consolidated: Shafi'i, Maliki, Hanbali all use these same rules in our implementation
        jewelryZakatable: false, // Personal jewelry exempt
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
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
                : ["Shafi'i scholars", 'Hanbali scholars', 'Sheikh Joe Bradford'],
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
            supportingScholars: ['Sheikh Joe Bradford'],
            methodologyLink: '/methodology#retirement',
            basis: 'Māl ḍimār (inaccessible wealth) - lacks milk tām and qudrah',
        });
    }

    // Check passive investment difference (Bradford uses 30%)
    if (mode === 'bradford' && modeRules.passiveInvestmentRate < 1.0) {
        differences.push({
            topic: 'Passive Investments (ETFs/Index Funds)',
            appliedOpinion: '30% of value (underlying assets proxy)',
            madhahOpinion: '100% of market value',
            supportingScholars: ['Sheikh Joe Bradford'],
            methodologyLink: '/methodology#investments',
            basis: 'Only zakatable underlying assets count, not fund structure premium',
        });
    }

    return differences;
}

// Get the effective jewelry zakatable status
export function isJewelryZakatable(madhab: Madhab, mode: CalculationMode): boolean {
    return MODE_RULES[mode].jewelryZakatable;
}

// Get human-readable madhab name
export function getMadhahDisplayName(madhab: Madhab): string {
    return MADHAB_RULES[madhab].displayName;
}

// Get display name for calculation mode
export function getModeDisplayName(mode: CalculationMode): string {
    const names: Record<CalculationMode, string> = {
        bradford: 'Balanced (Sheikh Joe Bradford)',
        hanafi: 'Hanafi',
        'maliki-shafii': "Shafi'i / Maliki / Hanbali",
    };
    return names[mode];
}

// Get description for calculation mode
export function getModeDescription(mode: CalculationMode): string {
    const descriptions: Record<CalculationMode, string> = {
        bradford: '30% passive investments, retirement exempt under 59½',
        hanafi: '100% all assets, personal jewelry included',
        'maliki-shafii': '100% all assets, jewelry exempt, 12-month debts',
    };
    return descriptions[mode];
}

// Map user-selected Madhab to the correct Calculation Engine Mode
export function getCalculationModeForMadhab(madhab: Madhab): CalculationMode {
    switch (madhab) {
        case 'balanced':
            return 'bradford';
        case 'hanafi':
            return 'hanafi';
        case 'shafii':
            return 'maliki-shafii';
        default:
            return 'bradford'; // Safe default
    }
}
