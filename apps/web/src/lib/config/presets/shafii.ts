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
        id: 'shafii-standard',
        name: "Shafi'i",
        version: '1.0.0',
        zmcs_version: '1.0.0',
        author: 'ZakatFlow Official',
        description: "Classical Shafi'i: jewelry exempt, NO debt deduction, net accessible retirement, 100% investments.",
        ui_label: "Shafi'i",
        tier: 'official',
        tooltip: "Classical Shafi'i: jewelry exempt, NO debt deduction, net accessible retirement, 100% investments.",
    },

    thresholds: {
        nisab: {
            default_standard: 'gold',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: "Shafi'i scholars often prefer the gold standard (higher threshold), though silver is also accepted.",
            tooltip: "Shafi'i scholars often prefer the gold standard (higher threshold), though silver is also accepted.",
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
            tooltip: 'All cash holdings fully zakatable.',
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
            tooltip: 'Personal-use jewelry is EXEMPT from Zakat. Investment metals zakatable.',
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
            tooltip: 'Crypto fully zakatable as currency equivalent.',
        },

        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                treatment: 'market_value',
                description: '100% of market value is zakatable. Stocks are viewed as trade goods.',
                scholarly_basis: 'Stocks treated as trade goods at market value.',
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividends zakatable.',
            },
            description: 'All investments at full market value.',
            tooltip: '100% of market value is zakatable. Stocks are viewed as trade goods.',
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
            tooltip: 'Net accessible amount: balance minus taxes and penalties.',
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
            tooltip: 'Cash, receivables, inventory zakatable. Fixed assets exempt.',
        },

        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts zakatable. Bad debts upon recovery.',
            tooltip: 'Good debts zakatable. Bad debts upon recovery.',
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
            scholarly_basis: "Shafi'i Position (Al-Majmu'): Zakat is attached to the wealth itself (Ain al-Mal), independent of the owner's liabilities. Existing debt does not prevent the obligation.",
        },
        description: "Shafi'i: No debt deduction. Zakat obligation exists independently of the owner's debt situation.",
        tooltip: "NO debt deduction. Zakat obligation exists independently of the owner's debt situation.",
    },
};
