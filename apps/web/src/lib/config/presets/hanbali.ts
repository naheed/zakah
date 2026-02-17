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
// HANBALI CLASSICAL Configuration
// =============================================================================
//
// OVERVIEW:
//   The classical Hanbali position as codified by Ibn Qudama in Al-Mughni and
//   Al-Mardawi in Al-Insaf. The Hanbali school shares many positions with the
//   Hanafi school (particularly full debt deduction) but differs on jewelry
//   (exempt, following the majority view).
//
// KEY DISTINGUISHING FEATURES:
//   - Jewelry: EXEMPT (follows majority view, unlike Hanafi)
//   - Debt: Full deduction (like Hanafi — all debts offset wealth)
//   - Retirement: Net accessible
//   - Investments: 100% market value
//
// =============================================================================

export const HANBALI_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'hanbali-standard',
        name: 'Hanbali',
        version: '1.0.0',
        zmcs_version: '1.0.0',
        author: 'ZakatFlow Official',
        description: 'Classical Hanbali: jewelry exempt, full debt deduction, net accessible retirement, 100% investments.',
        ui_label: 'Hanbali',
        tier: 'official',
        tooltip: 'Classical Hanbali: jewelry exempt, full debt deduction, net accessible retirement.',
    },

    thresholds: {
        nisab: {
            default_standard: 'silver',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: 'Hanbali standard: silver threshold (200 Dirhams = 595g).',
            tooltip: 'Hanbali standard: silver threshold (200 Dirhams = 595g).',
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
                description: 'Personal-use jewelry EXEMPT. Follows the majority scholarly view.',
                scholarly_basis: 'Ibn Qudama in Al-Mughni: "There is no Zakat on jewelry that is used for permissible adornment." This is the position of the majority of companions and scholars.',
            },
            description: 'Investment metals zakatable. Personal jewelry exempt (majority Hanbali view).',
            tooltip: 'Personal-use jewelry EXEMPT (majority view). Investment metals zakatable.',
        },

        crypto: {
            currency_rate: 1.0,
            trading_rate: 1.0,
            staking: {
                principal_rate: 1.0,
                rewards_rate: 1.0,
                vested_only: true,
            },
            description: 'Crypto fully zakatable.',
            tooltip: 'Crypto fully zakatable.',
        },

        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                treatment: 'market_value',
                description: '100% of market value is zakatable.',
                scholarly_basis: 'Stocks as trade goods at market value.',
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividends zakatable.',
            },
            description: 'All investments at full market value.',
            tooltip: '100% of market value is zakatable.',
        },

        retirement: {
            zakatability: 'net_accessible',
            pension_vested_rate: 1.0,
            penalty_rate: 0.10,
            tax_rate_source: 'user_input',
            roth_contributions_rate: 1.0,
            roth_earnings_follow_traditional: true,
            distributions_always_zakatable: true,
            description: 'Net accessible: balance minus taxes and penalties.',
            scholarly_basis: 'Contemporary Hanbali application.',
            tooltip: 'Net accessible: balance minus taxes and penalties.',
        },

        real_estate: {
            primary_residence: { zakatable: false, description: 'Exempt.' },
            rental_property: { zakatable: false, income_zakatable: true, description: 'Value exempt; income zakatable.' },
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
            description: 'Full deduction: all debts offset zakatable wealth (similar to Hanafi).',
            scholarly_basis: 'Hanbali Position (Al-Mughni): Debts prevent Zakat obligation because they negate ownership (Milk). "There is no Zakat on wealth that is practically owned by another (via debt)."',
        },
        description: 'Hanbali: full debt deduction, similar to Hanafi position.',
        tooltip: 'Full deduction: all debts offset zakatable wealth (similar to Hanafi).',
    },
};
