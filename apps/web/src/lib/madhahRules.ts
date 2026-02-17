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

// =============================================================================
// Madhab Rules — UI Display Layer
// =============================================================================
//
// PURPOSE:
//   Provides human-readable display names, descriptions, and quick-reference
//   properties for each supported methodology. This is the UI-facing layer;
//   the actual calculation logic is driven by ZMCS configs in src/lib/config/.
//
// NOTE:
//   MADHAB_RULES is a legacy compatibility layer. For calculation logic, always
//   use the ZMCS presets from src/lib/config/presets/. The `jewelryZakatable`,
//   `debtDeductionMethod`, etc. fields here are for UI display only and MUST
//   stay in sync with the corresponding ZMCS config values.
//

import { Madhab } from './zakatTypes';

/** UI-facing madhab rules (display only — calculation uses ZMCS configs). */
export interface MadhhabRules {
    name: string;
    displayName: string;
    description: string;
    jewelryZakatable: boolean;
    debtDeductionMethod: 'full' | 'none' | 'twelve_month' | 'current_due';
    retirementMethod: 'gross' | 'net_accessible' | 'bradford_exempt' | 'full';
    passiveInvestmentRate: number;
}

export const MADHAB_RULES: Record<Madhab, MadhhabRules> = {
    bradford: {
        name: 'bradford',
        displayName: 'Sheikh Joe Bradford',
        description: 'Contemporary rulings optimized for modern assets (401k, Crypto) where classical texts are silent',
        jewelryZakatable: true, // Bradford: all gold/silver jewelry is zakatable
        debtDeductionMethod: 'twelve_month',
        retirementMethod: 'bradford_exempt',
        passiveInvestmentRate: 0.30,
    },
    amja: {
        name: 'amja',
        displayName: 'AMJA (Assembly of Muslim Jurists of America)',
        description: 'Net-withdrawable retirement, stocks as exploited assets (dividends only), jewelry exempt, only currently-due debts deductible',
        jewelryZakatable: false,
        debtDeductionMethod: 'current_due',
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 0.0, // Only dividends, not market value
    },
    tahir_anwar: {
        name: 'tahir_anwar',
        displayName: 'Imam Tahir Anwar (Hanafi)',
        description: 'Strong ownership: full retirement balance, jewelry zakatable, 100% investments, full debt deduction',
        jewelryZakatable: true,
        debtDeductionMethod: 'full',
        retirementMethod: 'full',
        passiveInvestmentRate: 1.0,
    },
    hanafi: {
        name: 'hanafi',
        displayName: 'Hanafi',
        description: '100% all assets, jewelry zakatable, full debt deduction, net accessible retirement',
        jewelryZakatable: true,
        debtDeductionMethod: 'full',
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
    shafii: {
        name: 'shafii',
        displayName: "Shafi'i",
        description: '100% all assets, jewelry exempt, NO debt deduction',
        jewelryZakatable: false,
        debtDeductionMethod: 'none',
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
    maliki: {
        name: 'maliki',
        displayName: 'Maliki',
        description: '100% all assets, jewelry exempt, 12-month debts, commercial debt ring-fenced',
        jewelryZakatable: false,
        debtDeductionMethod: 'twelve_month',
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
    hanbali: {
        name: 'hanbali',
        displayName: 'Hanbali',
        description: '100% all assets, jewelry exempt, full debt deduction',
        jewelryZakatable: false,
        debtDeductionMethod: 'full',
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 1.0,
    },
    qaradawi: {
        name: 'qaradawi',
        displayName: 'Dr. Al-Qaradawi (Fiqh al-Zakah)',
        description: 'Jewelry exempt (paying recommended), 30% passive investments, 10% on rental income (agricultural analogy), net accessible retirement, 12-month debts, gold Nisab',
        jewelryZakatable: false, // Exempt but paying recommended (Ahwat)
        debtDeductionMethod: 'twelve_month',
        retirementMethod: 'net_accessible',
        passiveInvestmentRate: 0.30, // AAOIFI proxy (he accepts as valid alternative)
    },
};

// Legacy compatibility aliases
export const MODE_RULES = MADHAB_RULES;

// ---------------------------------------------------------------------------
// Scholarly Difference Detection (for UI display)
// ---------------------------------------------------------------------------
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

    // Retirement exemption for Bradford
    if (madhab === 'bradford' && !isOver59Half) {
        differences.push({
            topic: 'Retirement Accounts (401k/IRA)',
            appliedOpinion: 'Exempt under 59½',
            madhhabOpinion: 'Net accessible value zakatable',
            supportingScholars: ['Sheikh Joe Bradford'],
            methodologyLink: '/methodology#retirement',
            basis: 'Māl ḍimār (inaccessible wealth) - lacks milk tām and qudrah',
        });
    }

    // 30% rule for Bradford
    if (madhab === 'bradford' && rules.passiveInvestmentRate < 1.0) {
        differences.push({
            topic: 'Passive Investments (ETFs/Index Funds)',
            appliedOpinion: '30% of value (underlying assets proxy)',
            madhhabOpinion: '100% of market value',
            supportingScholars: ['Sheikh Joe Bradford', 'AAOIFI'],
            methodologyLink: '/methodology#investments',
            basis: 'Only zakatable underlying assets count, not fund structure premium',
        });
    }

    // AMJA exploited-asset view
    if (madhab === 'amja') {
        differences.push({
            topic: 'Long-term Stock Investments',
            appliedOpinion: 'Only dividends/income zakatable (not market value)',
            madhhabOpinion: '100% of market value (other schools)',
            supportingScholars: ['AMJA Fatwa Committee'],
            methodologyLink: '/methodology#investments',
            basis: 'Stocks treated as exploited assets (al-māl al-mustaghall) — like rental property, only income is zakatable',
        });
    }

    // Strong ownership for Tahir Anwar
    if (madhab === 'tahir_anwar') {
        differences.push({
            topic: 'Retirement Accounts (401k/IRA)',
            appliedOpinion: 'Full vested balance zakatable (no deductions)',
            madhhabOpinion: 'Net accessible (other schools deduct penalties/taxes)',
            supportingScholars: ['Imam Tahir Anwar'],
            methodologyLink: '/methodology#retirement',
            basis: 'Strong ownership (milk tām): if legally yours, it is zakatable regardless of access restrictions',
        });
    }

    // Qaradawi unique positions
    if (madhab === 'qaradawi') {
        differences.push({
            topic: 'Passive Investments (Industrial Companies)',
            appliedOpinion: '30% underlying-assets proxy (2.5% rate)',
            madhhabOpinion: '10% on net profits for industrial companies (agricultural analogy)',
            supportingScholars: ['Dr. Yusuf Al-Qaradawi'],
            methodologyLink: '/methodology#investments',
            basis: 'Fiqh al-Zakah: industrial companies (transport, hotels, manufacturing) should pay Zakat on net profits at 10%, analogous to agricultural produce. The 30% proxy is accepted as a practical simplification.',
        });
        differences.push({
            topic: 'Rental Property Income',
            appliedOpinion: '10% on net rental income (ZMCS income_rate override)',
            madhhabOpinion: '2.5% on accumulated rental cash (other methodologies)',
            supportingScholars: ['Dr. Yusuf Al-Qaradawi'],
            methodologyLink: '/methodology#realestate',
            basis: 'Fiqh al-Zakah: rental income analogized to agricultural produce — 10% on net rent (after deductions) or 5% on gross rent. Implemented via ZMCS v2.0.1 multi-rate calculation: rental income is separated from the standard 2.5% pool and taxed at 10%.',
        });
        differences.push({
            topic: 'Professional Income (Zakat al-Mustafad)',
            appliedOpinion: 'Year-end balance method (salary accumulated as cash)',
            madhhabOpinion: 'Immediate Zakat on salary upon receipt at 2.5%',
            supportingScholars: ['Dr. Yusuf Al-Qaradawi'],
            methodologyLink: '/methodology#cash',
            basis: 'Fiqh al-Zakah: strong proponent of Zakat al-Mustafad — paying Zakat on professional income immediately upon receipt without waiting for the Hawl. ZakatFlow uses a year-end balance model.',
        });
    }

    // Jewelry: Hanafi/Bradford/Tahir differ from majority
    if (rules.jewelryZakatable) {
        differences.push({
            topic: 'Personal Jewelry',
            appliedOpinion: 'Zakatable',
            madhhabOpinion: 'Exempt (majority view)',
            supportingScholars: madhab === 'bradford' ? ['Sheikh Joe Bradford'] :
                madhab === 'tahir_anwar' ? ['Imam Tahir Anwar', 'Hanafi scholars'] :
                    ['Hanafi scholars'],
            methodologyLink: '/methodology#metals',
            basis: 'Gold and silver retain monetary nature regardless of form',
        });
    }

    return differences;
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------
export function isJewelryZakatable(madhab: Madhab): boolean {
    return MADHAB_RULES[madhab].jewelryZakatable;
}

export function getMethodologyDisplayName(madhab: Madhab): string {
    return MADHAB_RULES[madhab]?.displayName || 'Sheikh Joe Bradford';
}

export function getMethodologyDescription(madhab: Madhab): string {
    return MADHAB_RULES[madhab]?.description || '';
}

/**
 * Returns centralized explanation strings for asset rulings based on the selected methodology.
 * Used by PDF and CSV reports to ensure consistency.
 */
export function getAssetRuleExplanations(madhab: Madhab) {
    const rules = MADHAB_RULES[madhab] || MADHAB_RULES.bradford;

    return {
        liquidAssets: {
            ruling: "100%",
            sub: "Fully accessible liquidity"
        },
        investments: {
            ruling: rules.passiveInvestmentRate < 1 ? "Mixed" : "100%",
            sub: rules.passiveInvestmentRate < 1
                ? `Split Strategy (${(rules.passiveInvestmentRate * 100).toFixed(0)}% Passive)`
                : "100% Market Value"
        },
        retirement: {
            ruling: rules.retirementMethod === 'bradford_exempt' ? "Exempt" :
                rules.retirementMethod === 'full' ? "100%" : "Accessible",
            sub: rules.retirementMethod === 'bradford_exempt' ? "Exempt if under 59.5 (Inaccessible)" :
                rules.retirementMethod === 'full' ? "Full Vested Balance" :
                    "Net Accessible (After Tax/Penalty)"
        },
        preciousMetals: {
            ruling: rules.jewelryZakatable ? "100%" : "Mixed",
            sub: rules.jewelryZakatable ? "Gold & Silver Holdings (Zakatable)" : "Bullion Only (Jewelry Exempt)"
        },
        crypto: {
            ruling: "100%",
            sub: "Digital Currency & Tokens"
        },
        realEstate: {
            ruling: "100%",
            sub: "Trade Goods & Inventory"
        },
        business: {
            ruling: "100%",
            sub: "Cash, Receivables & Inventory"
        },
        debtOwedToYou: {
            ruling: "100%",
            sub: "Strong/Collectible Debts"
        }
    };
}

// Legacy compatibility aliases - Deprecated
export const getMadhhabDisplayName = getMethodologyDisplayName;
export const getMadhahDisplayName = getMethodologyDisplayName;
export const getModeDisplayName = getMethodologyDisplayName;
export const getModeDescription = getMethodologyDescription;
export const getMethodologyLabel = getMethodologyDisplayName;

