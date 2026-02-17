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

import { ZakatMethodologyConfig } from './types';

// =============================================================================
// DEFAULT CONFIGURATION: Sheikh Joe Bradford ("Balanced" Synthesis)
// =============================================================================
//
// OVERVIEW:
//   Sheikh Joe Bradford's approach is a modern scholarly synthesis that adapts
//   classical fiqh to contemporary Western financial instruments. It is the default
//   methodology in ZakatFlow, designed for American Muslim professionals.
//
// KEY DISTINGUISHING FEATURES:
//   - 30% proxy rule for passive investments (AAOIFI Standard 9 rationale)
//   - Retirement accounts exempt under age 59.5 (Māl ḍimār / inaccessible wealth)
//   - After 59.5, retirement uses 30% proxy on market value
//   - Jewelry IS zakatable (all gold/silver regardless of form)
//   - 12-month debt deduction rule (debts due within the coming year)
//   - Roth IRA contributions at 30% proxy
//
// SOURCES:
//   - "Simple Zakat Guide" by Joe Bradford
//   - joebradford.net newsletter series on Zakat
//   - Instagram @joewbradford investment asset guide
//   - Bradford Institute Shariah advisory publications
//
// =============================================================================

export const DEFAULT_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'balanced-bradford-v2',
        name: 'Balanced (Sheikh Joe Bradford)',
        version: '2.0.0',
        zmcs_version: '2.0.0',
        author: 'ZakatFlow Official',
        description: 'Modern synthesis by Sheikh Joe Bradford: 30% proxy for passive investments, retirement exempt under 59.5, jewelry zakatable, 12-month debt deduction.',
        ui_label: 'Balanced (Bradford)',
        scholar_url: 'https://joebradford.net',
        tier: 'official',
        reference: {
            authority: 'Sheikh Joe Bradford',
            url: 'https://joebradford.net/zakat-on-assets-a-quick-review/',
        },
    },

    thresholds: {
        nisab: {
            default_standard: 'silver',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: 'Uses silver standard (lower threshold) as the safer option for ensuring Zakat obligations are met.',
        },
        zakat_rate: {
            lunar: 0.025,
            solar: 0.02577,
            description: 'Standard 2.5% lunar rate. Solar rate adjusted for 365-day year (2.5% × 365.25/354.37 ≈ 2.577%).',
        },
    },

    assets: {
        // ── Cash ──
        cash: {
            zakatable: true,
            rate: 1.0,
            description: 'All liquid cash holdings (checking, savings, digital wallets, foreign currency) are fully zakatable.',
            scholarly_basis: 'Unanimous scholarly consensus (Ijma\'): cash is zakatable wealth by definition.',
        },

        // ── Precious Metals ──
        precious_metals: {
            investment_gold_rate: 1.0,
            investment_silver_rate: 1.0,
            jewelry: {
                zakatable: true,
                rate: 1.0,
                conditions: [],
                description: 'All gold and silver jewelry is zakatable regardless of personal use. No exemption for adornment.',
                scholarly_basis: 'Bradford holds the precautionary (Ahwat) position: gold and silver retain monetary nature regardless of form. Based on hadith in Sahih Muslim about the obligation on gold and silver possessions. "There is insufficient textual evidence for distinguishing worn from stored jewelry."',
            },
            description: 'Investment metals are universally zakatable. Bradford rules jewelry zakatable as well (precautionary/Hanafi-aligned position).',
        },

        // ── Crypto ──
        crypto: {
            currency_rate: 1.0,
            trading_rate: 1.0,
            staking: {
                principal_rate: 1.0,
                rewards_rate: 1.0,
                vested_only: true,
            },
            description: 'Cryptocurrency is treated as equivalent to gold/silver: a store of value and medium of exchange subject to 2.5% Zakat on full market value.',
            scholarly_basis: 'Bradford treats crypto as analogous to gold and silver based on thamaniyya (recognition as currency) and store-of-value function.',
        },

        // ── Investments ──
        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 0.30,
                treatment: 'underlying_assets',
                description: '30% proxy rule: Only ~30% of a diversified fund\'s market value represents underlying zakatable assets (cash, receivables, inventory). The remainder is non-zakatable (equipment, IP, goodwill).',
                scholarly_basis: 'Based on AAOIFI Shariah Standard No. 9 and Bradford\'s adaptation: "(Market Value × 30%) × 2.5%" targets current assets in a diversified portfolio.',
            },
            reits_rate: 0.30,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividend income is zakatable. Haram purification percentage is deducted before Zakat calculation.',
            },
            description: 'Active trading: full market value (trade goods). Passive/long-term: 30% proxy. REITs treated same as passive.',
            scholarly_basis: 'Bradford distinguishes between day-trader (full value) and long-term buy-and-hold (30% proxy for underlying assets).',
        },

        // ── Retirement ──
        retirement: {
            zakatability: 'conditional_age',
            exemption_age: 59.5,
            post_threshold_method: 'proxy_rate',
            post_threshold_rate: 0.30,
            pension_vested_rate: 1.0,
            penalty_rate: 0.10,
            tax_rate_source: 'user_input',
            roth_contributions_rate: 0.30,
            roth_earnings_follow_traditional: true,
            distributions_always_zakatable: true,
            description: '401k/IRA exempt under 59.5 (Māl ḍimār — inaccessible wealth lacking milk tām and qudrah). After 59.5, use 30% proxy on market value. Roth contributions: 30% proxy always. Cash distributions taken before retirement: zakatable on the amount withdrawn.',
            scholarly_basis: 'Bradford\'s position: "No Zakat if no distributions are taken" before retirement age. Post-retirement (stay invested): "(Market Value × 30%) × 2.5%" annually. Cash-out: "2.5% once on total." Roth: "(Total Contributions × 30%) × 2.5%".',
        },

        // ── Real Estate ──
        real_estate: {
            primary_residence: {
                zakatable: false,
                description: 'Personal home is exempt. Unanimous scholarly consensus.',
            },
            rental_property: {
                zakatable: false,
                income_zakatable: true,
                description: 'Property value exempt (exploited asset). 2.5% on net rental income received.',
            },
            for_sale: {
                zakatable: true,
                rate: 1.0,
                description: 'Property listed for sale is trade goods: 2.5% on full market value.',
            },
            land_banking: {
                zakatable: true,
                rate: 1.0,
                description: 'Undeveloped land held for appreciation: zakatable annually on market value (majority scholarly view — trade goods by intent).',
            },
            description: 'Personal property = no Zakat. Rental = 2.5% of income. For sale / land banking = 2.5% of value.',
        },

        // ── Business ──
        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
            description: 'Business Zakat on liquid assets and inventory. Fixed assets (equipment, machinery) are exempt.',
            scholarly_basis: 'Classical consensus: trade goods (cash + receivables + inventory) are zakatable. Fixed assets used in production are exempt (not \'urūḍ al-tijāra).',
        },

        // ── Debts Owed To User ──
        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts (collectible) are fully zakatable. Bad debts are not zakatable until actually recovered, then held for one year.',
            scholarly_basis: 'Bradford: "Bad debts (amounts loaned to others that cannot be repaid due to default) are never subject to Zakat until actually received, after which they are held for a year."',
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
                insurance: 'current_due',
                unpaid_bills: 'full',
                taxes: 'full',
            },
            description: '12-month rule: Deduct debts due within the coming year. Credit cards and unpaid bills are immediately due, so fully deductible. Mortgage and living expenses annualized (12 months).',
            scholarly_basis: 'Bradford synthesizes the Maliki 12-month framework with modern financial realities. Monthly recurring expenses annualized for practical calculation.',
        },
        description: 'Debts due within the coming year reduce zakatable wealth. Beyond that, future debts are not deductible.',
    },
};
