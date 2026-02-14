import { ZakatMethodologyConfig } from '../types';

// =============================================================================
// HANAFI CLASSICAL Configuration
// =============================================================================
//
// OVERVIEW:
//   The classical Hanafi position on Zakat as derived from Imam Abu Hanifa,
//   Abu Yusuf, Muhammad al-Shaybani, and codified in Al-Hidaya, Badai' al-Sanai',
//   and Al-Mabsut. This represents the mainstream Hanafi opinion applied to
//   modern financial instruments.
//
// KEY DISTINGUISHING FEATURES:
//   - Jewelry: Zakatable (gold/silver are inherently monetary — thaman)
//   - Debt: Full deduction (debts reduce strength of ownership)
//   - Retirement: Net accessible (balance minus taxes/penalties)
//   - Investments: 100% market value (trade goods)
//
// DIFFERENCE FROM IMAM TAHIR ANWAR:
//   This config uses 'net_accessible' for retirement (mainstream contemporary
//   Hanafi application), while Imam Tahir Anwar uses 'full' (strict strong
//   ownership interpretation). Both are valid Hanafi positions.
//
// =============================================================================

export const HANAFI_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'hanafi-standard-v2',
        name: 'Hanafi',
        version: '2.0.0',
        zmcs_version: '2.0.0',
        author: 'ZakatFlow Official',
        description: 'Classical Hanafi: jewelry zakatable, full debt deduction, net accessible retirement, 100% investments.',
        ui_label: 'Hanafi',
    },

    thresholds: {
        nisab: {
            default_standard: 'silver',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: 'Standard Hanafi Nisab: 85g gold (20 Mithqal) or 595g silver (200 Dirhams).',
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
            description: 'All cash holdings are fully zakatable.',
            scholarly_basis: 'Unanimous consensus.',
        },

        precious_metals: {
            investment_gold_rate: 1.0,
            investment_silver_rate: 1.0,
            jewelry: {
                zakatable: true,
                rate: 1.0,
                conditions: [],
                description: 'Gold and silver jewelry is zakatable regardless of whether it is worn for adornment.',
                scholarly_basis: 'Abu Hanifa: gold and silver are inherently monetary (thaman) and do not lose their zakatable nature when fashioned into jewelry. Al-Kasani in Badai\' al-Sanai\': "They are created as prices, and their nature does not change."',
            },
            description: 'All gold and silver is zakatable — investment and personal jewelry alike.',
        },

        crypto: {
            currency_rate: 1.0,
            trading_rate: 1.0,
            staking: {
                principal_rate: 1.0,
                rewards_rate: 1.0,
                vested_only: true,
            },
            description: 'Crypto classified as trade goods or currency — fully zakatable.',
            scholarly_basis: 'Analogical reasoning (qiyās) to trade goods (\'urūḍ al-tijāra) or currency.',
        },

        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                treatment: 'market_value',
                description: '100% of market value is zakatable.',
                scholarly_basis: 'Stocks are trade goods valued at market price on assessment date.',
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividend income is zakatable.',
            },
            description: 'All investments at full market value. Stocks treated as trade goods.',
        },

        retirement: {
            zakatability: 'net_accessible',
            pension_vested_rate: 1.0,
            penalty_rate: 0.10,
            tax_rate_source: 'user_input',
            roth_contributions_rate: 1.0,
            roth_earnings_follow_traditional: true,
            distributions_always_zakatable: true,
            description: 'Zakatable on net accessible amount: vested balance minus taxes and early withdrawal penalties.',
            scholarly_basis: 'Mainstream contemporary Hanafi application: Zakat on what you could access today. Penalties and taxes reduce the net accessible amount.',
        },

        real_estate: {
            primary_residence: { zakatable: false, description: 'Exempt. Unanimous consensus.' },
            rental_property: { zakatable: false, income_zakatable: true, description: 'Value exempt; rental income zakatable.' },
            for_sale: { zakatable: true, rate: 1.0, description: 'Trade goods — full value.' },
            land_banking: { zakatable: true, rate: 1.0, description: 'Held for appreciation — trade goods by intent.' },
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
            description: 'Good debts zakatable. Bad debts upon recovery only.',
        },
    },

    liabilities: {
        method: 'full_deduction',
        commercial_debt: 'fully_deductible',
        personal_debt: {
            deductible: true,
            types: {
                housing: '12_months',
                student_loans: 'full',
                credit_cards: 'full',
                living_expenses: '12_months',
                insurance: 'full',
                unpaid_bills: 'full',
                taxes: 'full',
            },
            description: 'Full deduction: all debts reduce zakatable wealth. "Debt weakens ownership" (al-dayn yunqiṣ al-milk).',
            scholarly_basis: 'Al-Kasani: debts to humans (dayn al-\'ibād) have a claimant who can enforce collection, reducing the strength of ownership.',
        },
        description: 'Hanafi: debts are a full offset against zakatable wealth.',
    },
};
