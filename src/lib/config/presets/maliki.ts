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
// MALIKI CLASSICAL Configuration
// =============================================================================
//
// OVERVIEW:
//   The classical Maliki position as codified in Mukhtasar Khalil, Sharh Al-Dardir,
//   and Al-Mudawwana of Imam Malik. The Maliki school has a distinctive "limited
//   debt deduction" approach and distinguishes between active traders (Mudir) and
//   long-term holders (Muhtakir).
//
// KEY DISTINGUISHING FEATURES:
//   - Jewelry: EXEMPT (personal adornment — majority view)
//   - Debt: 12-month rule (only debts due within the coming year deductible)
//   - Commercial debt: Deductible only from business assets (ring-fenced)
//   - Retirement: Net accessible
//   - Investments: 100% market value (though Maliki Mudir/Muhtakir distinction
//     exists for business traders, we apply 100% for modern stock markets)
//
// =============================================================================

export const MALIKI_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'maliki-standard-v2',
        name: 'Maliki',
        version: '2.0.0',
        zmcs_version: '2.0.0',
        author: 'ZakatFlow Official',
        description: 'Classical Maliki: jewelry exempt, 12-month debt deduction, commercial debt ring-fenced to business assets, 100% investments.',
        ui_label: 'Maliki',
        tier: 'official',
        tooltip: 'Classical Maliki: jewelry exempt, 12-month debt deduction, commercial debt ring-fenced.',
    },

    thresholds: {
        nisab: {
            default_standard: 'gold',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: 'Maliki scholars commonly reference the gold standard.',
            tooltip: 'Maliki scholars commonly reference the gold standard.',
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
                description: 'Personal-use jewelry EXEMPT. Jewelry for trading or hoarding is zakatable.',
                scholarly_basis: 'Khalil in Mukhtasar: gold and silver used for permissible adornment are exempt. Based on the practice of the Companions and the principle that personal-use items are not zakatable.',
            },
            description: 'Investment metals zakatable. Personal jewelry exempt.',
            tooltip: 'Personal-use jewelry EXEMPT. Jewelry for trading or hoarding is zakatable.',
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
                description: '100% of market value is zakatable. For modern listed shares, the market value indicates the tradeable price.',
                scholarly_basis: 'Maliki fiqh distinguishes between Mudir (active trader, valued at market) and Muhtakir (long-term holder, valued at cost). For modern diversified stock portfolios, market value is the practical standard.',
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividends zakatable.',
            },
            description: 'All investments at full market value.',
            tooltip: '100% of market value is zakatable. For modern listed shares, the market value indicates the tradeable price.',
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
            scholarly_basis: 'Contemporary Maliki application: Zakat on accessible portion.',
            tooltip: 'Net accessible amount: balance minus taxes and penalties.',
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
            scholarly_basis: 'Al-Dardir: trade goods valued at market price for the Mudir (frequent trader).',
        },

        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts zakatable. Bad debts upon recovery.',
        },
    },

    liabilities: {
        method: '12_month_rule',
        commercial_debt: 'deductible_from_business_assets',
        personal_debt: {
            deductible: true,
            types: {
                housing: '12_months',
                student_loans: 'current_due',
                credit_cards: 'full',
                living_expenses: 'current_due',
                insurance: 'current_due',
                unpaid_bills: 'full',
                taxes: 'current_due',
            },
            description: '12-month rule: Only debts due within the coming year reduce zakatable wealth. Commercial debts are ring-fenced — deductible only against business assets, not personal wealth.',
            scholarly_basis: 'Maliki Position (Mukhtasar Khalil): Debts are deductible ONLY if they (1) reduce wealth below Nisab and (2) possess no other assets to pay them. Commercial debts are ring-fenced to business assets.',
        },
        description: 'Maliki: limited debt deduction with 12-month horizon and business-asset ring-fencing.',
        tooltip: '12-month rule: Only debts due within the coming year reduce zakatable wealth.',
    },
};
