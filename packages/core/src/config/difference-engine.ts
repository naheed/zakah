import { ZakatMethodologyConfig } from './types';

export interface MethodologyDifference {
    category: string;
    label: string;
    verdictA: string; // e.g., "Zakatable"
    verdictB: string; // e.g., "Exempt"
    detailsA?: string;
    detailsB?: string;
    isDifferent: boolean;
}

export const COMPARE_KEYS = [
    'jewelry',
    'retirement',
    'investments',
    'debt',
] as const;

export type CompareKey = typeof COMPARE_KEYS[number];

export class DifferenceEngine {
    static compare(configA: ZakatMethodologyConfig, configB: ZakatMethodologyConfig): MethodologyDifference[] {
        const diffs: MethodologyDifference[] = [];

        // 1. Jewelry (Precious Metals)
        diffs.push(this.compareJewelry(configA, configB));

        // 2. Retirement (401k/IRA)
        diffs.push(this.compareRetirement(configA, configB));

        // 3. Investments (Stocks/Funds)
        diffs.push(this.compareInvestments(configA, configB));

        // 4. Debt Deduction
        diffs.push(this.compareDebt(configA, configB));

        return diffs;
    }

    private static compareJewelry(a: ZakatMethodologyConfig, b: ZakatMethodologyConfig): MethodologyDifference {
        const key = 'jewelry';
        const valA = a.assets.precious_metals.jewelry.zakatable;
        const valB = b.assets.precious_metals.jewelry.zakatable;

        return {
            category: 'Jewelry',
            label: 'Personal Gold/Silver',
            verdictA: valA ? 'Zakatable' : 'Exempt',
            verdictB: valB ? 'Zakatable' : 'Exempt',
            isDifferent: valA !== valB,
        };
    }

    private static compareRetirement(a: ZakatMethodologyConfig, b: ZakatMethodologyConfig): MethodologyDifference {
        const format = (c: ZakatMethodologyConfig) => {
            const method = c.assets.retirement.zakatability;
            switch (method) {
                case 'full': return '100% of Balance';
                case 'net_accessible': return 'Net Accessible (Minus Taxes/Penalties)';
                case 'conditional_age': return `Exempt until Age ${c.assets.retirement.exemption_age}`;
                case 'deferred_upon_access': return 'Exempt until Withdrawn';
                case 'exempt': return 'Exempt';
                default: return method;
            }
        };

        return {
            category: 'Retirement',
            label: '401(k) & IRA',
            verdictA: format(a),
            verdictB: format(b),
            isDifferent: a.assets.retirement.zakatability !== b.assets.retirement.zakatability,
        };
    }

    private static compareInvestments(a: ZakatMethodologyConfig, b: ZakatMethodologyConfig): MethodologyDifference {
        const format = (c: ZakatMethodologyConfig) => {
            const treat = c.assets.investments.passive_investments.treatment;
            const rate = c.assets.investments.passive_investments.rate;

            if (treat === 'market_value') return '100% Market Value';
            if (treat === 'income_only') return 'Dividends Only (No Principal)';
            if (treat === 'underlying_assets') return `${(rate * 100).toFixed(0)}% of Market Value`;
            return treat;
        };

        return {
            category: 'Investments',
            label: 'Stocks & Funds',
            verdictA: format(a),
            verdictB: format(b),
            isDifferent:
                a.assets.investments.passive_investments.treatment !== b.assets.investments.passive_investments.treatment ||
                a.assets.investments.passive_investments.rate !== b.assets.investments.passive_investments.rate,
        };
    }

    private static compareDebt(a: ZakatMethodologyConfig, b: ZakatMethodologyConfig): MethodologyDifference {
        const format = (c: ZakatMethodologyConfig) => {
            const method = c.liabilities.method;
            switch (method) {
                case 'full_deduction': return 'Fully Deductible';
                case 'no_deduction': return 'Not Deductible';
                case '12_month_rule': return 'Next 12 Months Only';
                case 'current_due_only': return 'Current Month Only';
                default: return method;
            }
        };

        return {
            category: 'Debt',
            label: 'Loans & Mortgages',
            verdictA: format(a),
            verdictB: format(b),
            isDifferent: a.liabilities.method !== b.liabilities.method,
        };
    }
}
