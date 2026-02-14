import { ZakatMethodologyConfig } from '../types';

export const MALIKI_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'maliki-standard-v1',
        name: 'Maliki',
        version: '1.0.0',
        author: 'ZakatFlow Official',
        description: "Classical Maliki opinion: Jewelry exempt, limited debt deduction.",
    },
    thresholds: {
        nisab: {
            default_standard: 'gold',
            gold_grams: 85.0,
            silver_grams: 595.0,
        },
        zakat_rate: {
            lunar: 0.025,
            solar: 0.02577,
        },
    },
    assets: {
        cash: { zakatable: true, rate: 1.0 },
        precious_metals: {
            investment_gold_rate: 1.0,
            investment_silver_rate: 1.0,
            jewelry: {
                zakatable: false, // Exempt
                rate: 1.0,
                conditions: ['personal_use'],
            },
        },
        crypto: {
            currency_rate: 1.0,
            trading_rate: 1.0,
            staking: { principal_rate: 1.0, rewards_rate: 1.0, vested_only: true },
        },
        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                description: "100% of market value is zakatable.",
            },
            reits_rate: 1.0,
            dividends: { zakatable: true, deduct_purification: true },
        },
        retirement: {
            zakatability: 'net_accessible',
            pension_vested_rate: 1.0,
            penalty_rate: 0.10,
            tax_rate_source: 'user_input',
        },
        real_estate: {
            primary_residence: { zakatable: false },
            rental_property: { zakatable: false, income_zakatable: true },
            for_sale: { zakatable: true, rate: 1.0 },
            land_banking: { zakatable: true, rate: 1.0 },
        },
        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
        },
        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
        },
    },
    liabilities: {
        method: '12_month_rule', // Debt deduction only if no other assets to cover it
        commercial_debt: 'deductible_from_business_assets',
        personal_debt: {
            deductible: true, // Only if debts reduce net wealth below Nisab
            types: {
                housing: '12_months', // Only current due
                student_loans: 'current_due',
                credit_cards: 'full',
                living_expenses: 'none',
            },
        },
    },
};
