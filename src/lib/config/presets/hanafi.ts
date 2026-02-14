import { ZakatMethodologyConfig } from '../types';

export const HANAFI_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'hanafi-standard-v1',
        name: 'Hanafi',
        version: '1.0.0',
        author: 'ZakatFlow Official',
        description: 'Classical Hanafi opinion: Gold/Silver zakatable, full debt deduction.',
    },
    thresholds: {
        nisab: {
            default_standard: 'silver',
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
                zakatable: true, // Hanafi view: Jewelry is zakatable
                rate: 1.0,
                description: "Gold and silver are zakatable regardless of form (jewelry or bullion).",
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
                rate: 1.0, // Classical view (market value)
                description: "100% of market value is zakatable.",
            },
            reits_rate: 1.0,
            dividends: { zakatable: true, deduct_purification: true },
        },
        retirement: {
            zakatability: 'net_accessible', // Treat as debt/trust
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
        method: 'full_deduction', // Hanafi: Debts function as an offset
        commercial_debt: 'fully_deductible',
        personal_debt: {
            deductible: true,
            types: {
                housing: 'full', // Deferred debts are deductible
                student_loans: 'full',
                credit_cards: 'full',
                living_expenses: 'full',
            },
        },
    },
};
