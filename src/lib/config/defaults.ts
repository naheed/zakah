import { ZakatMethodologyConfig } from './types';

// Default Configuration: "Balanced" (Sheikh Joe Bradford)
// This mirrors the current hardcoded logic in the application.
export const DEFAULT_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'balanced-standard-v1',
        name: 'Balanced (Sheikh Joe Bradford)',
        version: '1.0.0',
        author: 'ZakatFlow Official',
        description: 'Modern synthesis: 30% rule for stocks, retirement exempt under 59.5, jewelry exempt.',
        certification: {
            certified_by: 'Sheikh Joe Bradford',
            url: 'https://zakatflow.org/methodology',
        },
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
        cash: {
            zakatable: true,
            rate: 1.0,
        },
        precious_metals: {
            investment_gold_rate: 1.0,
            investment_silver_rate: 1.0,
            jewelry: {
                zakatable: false, // Exempt in Balanced/Shafi'i/Maliki
                rate: 1.0,
                conditions: ['personal_use'],
                description: "Women's personal jewelry is exempt (permissible usage).",
            },
        },
        crypto: {
            currency_rate: 1.0,
            trading_rate: 1.0,
            staking: {
                principal_rate: 1.0,
                rewards_rate: 1.0,
                vested_only: true,
            },
        },
        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 0.30, // 30% rule
                description: "30% proxy rule (AAOIFI) for underlying zakatable assets.",
            },
            reits_rate: 0.30, // Treated same as passive
            dividends: {
                zakatable: true,
                deduct_purification: true,
            },
        },
        retirement: {
            zakatability: 'conditional_age',
            exemption_age: 59.5,
            pension_vested_rate: 1.0, // If accessible
            penalty_rate: 0.10,
            tax_rate_source: 'user_input',
            description: "401k/IRA is exempt (Māl ḍimār) until age 59.5. Roth contributions always zakatable.",
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
        method: '12_month_rule',
        commercial_debt: 'fully_deductible',
        personal_debt: {
            deductible: true,
            types: {
                housing: '12_months',
                student_loans: 'current_due',
                credit_cards: 'full',
                living_expenses: '12_months',
            },
        },
    },
};
