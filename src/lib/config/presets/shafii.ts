import { ZakatMethodologyConfig } from '../types';

export const SHAFII_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'shafii-standard-v1',
        name: "Shafi'i",
        version: '1.0.0',
        author: 'ZakatFlow Official',
        description: "Classical Shafi'i opinion: Jewelry exempt, no debt deduction.",
    },
    thresholds: {
        nisab: {
            default_standard: 'gold', // Shafi'is often prefer gold standard
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
                zakatable: false, // Exempt for permissible use
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
            description: "Zakatable on net accessible amount.",
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
        method: 'no_deduction', // Shafi'i: Debt does not prevent Zakat
        commercial_debt: 'none',
        personal_debt: {
            deductible: false,
            // Even though not deductible, we set defaults
            types: {
                housing: 'none',
                expense_period: 'monthly',
                student_loans: 'none',
                credit_cards: 'none',
                living_expenses: 'none'
            }
        },
    },
};
