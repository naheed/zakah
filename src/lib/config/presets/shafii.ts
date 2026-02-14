import { ZakatMethodologyConfig } from '../types';

// =============================================================================
// SHAFI'I CLASSICAL Configuration
// =============================================================================
//
// OVERVIEW:
//   The classical Shafi'i position as codified by Imam Al-Nawawi in Al-Majmu'
//   and Al-Shirazi in Al-Muhadhdhab. The Shafi'i school has the most distinctive
//   liability position: debts do NOT reduce Zakat liability at all.
//
// KEY DISTINGUISHING FEATURES:
//   - Jewelry: EXEMPT (personal adornment not zakatable — majority view)
//   - Debt: NO deduction whatsoever (debts do not prevent Zakat obligation)
//   - Retirement: Net accessible
//   - Investments: 100% market value
//   - Nisab: Some Shafi'i scholars prefer gold standard (higher threshold)
//
// =============================================================================

export const SHAFII_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'shafii-standard-v2',
        name: "Shafi'i",
        version: '2.0.0',
        zmcs_version: '2.0.0',
        author: 'ZakatFlow Official',
        description: "Classical Shafi'i: jewelry exempt, NO debt deduction, net accessible retirement, 100% investments.",
        ui_label: "Shafi'i",
    },

    thresholds: {
        nisab: {
            default_standard: 'gold',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: "Shafi'i scholars often prefer the gold standard (higher threshold), though silver is also accepted.",
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
            description: 'All cash holdings fully zakatable.',
            scholarly_basis: 'Unanimous consensus.',
        },

        precious_metals: {
            investment_gold_rate: 1.0,
            investment_silver_rate: 1.0,
            jewelry: {
                zakatable: false,
                rate: 1.0,
                conditions: ['personal_use'],
                description: "Personal-use jewelry is EXEMPT from Zakat. Only gold/silver kept for trading or hoarding is zakatable.",
                scholarly_basis: "Al-Nawawi in Al-Majmu': jewelry used for permissible personal adornment is exempt. Based on the practice of the Companions: Aishah, Ibn Umar, and Jabir did not pay Zakat on their jewelry. Al-Shirazi in Al-Muhadhdhab supports this ruling.",
            },
            description: 'Investment metals zakatable. Personal jewelry exempt (permissible use).',
        },

        crypto: {
            currency_rate: 1.0,
            trading_rate: 1.0,
            staking: {
                principal_rate: 1.0,
                rewards_rate: 1.0,
                vested_only: true,
            },
            description: 'Crypto fully zakatable as currency equivalent.',
        },

        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                treatment: 'market_value',
                description: '100% of market value is zakatable.',
                scholarly_basis: 'Stocks treated as trade goods at market value.',
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividends zakatable.',
            },
            description: 'All investments at full market value.',
        },

        retirement: {
            zakatability: 'net_accessible',
            pension_vested_rate: 1.0,
            penalty_rate: 0.10,
            tax_rate_source: 'user_input',
            roth_contributions_rate: 1.0,
            roth_earnings_follow_traditional: true,
            distributions_always_zakatable: true,
            description: 'Net accessible amount: balance minus taxes and penalties.',
            scholarly_basis: "Contemporary Shafi'i application of accessibility principle.",
        },

        real_estate: {
            primary_residence: { zakatable: false, description: 'Exempt.' },
            rental_property: { zakatable: false, income_zakatable: true, description: 'Value exempt; rental income zakatable.' },
            for_sale: { zakatable: true, rate: 1.0, description: 'Trade goods.' },
            land_banking: { zakatable: true, rate: 1.0, description: 'Trade goods by intent.' },
        },

        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
            description: 'Cash, receivables, inventory zakatable. Fixed assets exempt.',
        },

        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts zakatable. Bad debts upon recovery.',
        },
    },

    liabilities: {
        method: 'no_deduction',
        commercial_debt: 'none',
        personal_debt: {
            deductible: false,
            types: {
                housing: 'none',
                student_loans: 'none',
                credit_cards: 'none',
                living_expenses: 'none',
                insurance: 'none',
                unpaid_bills: 'none',
                taxes: 'none',
            },
            description: "NO debt deduction. Debts do not reduce Zakat liability in Shafi'i fiqh.",
            scholarly_basis: "Al-Nawawi in Al-Majmu': Zakat is an obligation tied to the wealth itself (haqq muta'alliq bi'l-māl), not the owner's net position. The presence of debt does not negate the obligation on wealth that reaches Nisab. This is the strongest distinguishing feature of the Shafi'i position.",
        },
        description: "Shafi'i: No debt deduction. Zakat obligation exists independently of the owner's debt situation.",
    },
};
