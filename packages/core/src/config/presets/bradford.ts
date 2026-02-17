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

export const bradford: ZakatMethodologyConfig = {
    meta: {
        id: 'bradford',
        name: 'Sheikh Joe Bradford',
        version: '1.0.0',
        zmcs_version: '1.0.0',
        author: 'ZakatFlow Official',
        description: 'Contemporary rulings optimized for modern assets (401k, Crypto) where classical texts are silent. This is the default setting for ZakatFlow.',
        ui_label: 'Sheikh Joe Bradford',
        tier: 'official',
        tooltip: "Contemporary rulings optimized for modern assets (401k, Crypto) where classical texts are silent.",
        scholar_url: 'https://joebradford.net',
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
            tooltip: 'Uses silver standard (lower threshold) as the safer option for ensuring Zakat obligations are met.',
        },
        zakat_rate: {
            lunar: 0.025,
            solar: 0.02577,
            description: 'Standard 2.5% lunar rate. Solar rate adjusted for 365-day year (2.5% × 365.25/354.37 ≈ 2.577%).',
            tooltip: 'Standard 2.5% lunar rate. Solar rate adjusted for 365-day year (2.577%).',
        },
    },

    assets: {
        // ── Cash ──
        cash: {
            zakatable: true,
            rate: 1.0,
            description: 'All liquid cash holdings (checking, savings, digital wallets, foreign currency) are fully zakatable.',
            scholarly_basis: 'Unanimous scholarly consensus (Ijma\'): cash is zakatable wealth by definition.',
            tooltip: 'All liquid cash holdings (checking, savings, digital wallets) are fully zakatable.',
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
            tooltip: 'Investment metals are universally zakatable. Jewelry is also zakatable in this methodology (precautionary view).',
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
            tooltip: 'Cryptocurrency is treated as equivalent to gold/silver: a store of value and medium of exchange subject to 2.5% Zakat.',
        },

        // ── Investments ──
        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 0.30,
                treatment: 'underlying_assets',
                description: '30% proxy rule: Only ~30% of a diversified fund\'s market value represents underlying zakatable assets (cash, receivables, inventory). The remainder is non-zakatable (equipment, IP, goodwill).',
                scholarly_basis: 'Approximation of AAOIFI Shariah Standard No. 35. Estimates that ~30% of a diversified equity portfolio represents zakatable liquid assets (cash, receivables, inventory).',
            },
            reits_rate: 0.30,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividend income is zakatable. Haram purification percentage is deducted before Zakat calculation.',
                tooltip: 'Dividend income is zakatable. Haram purification percentage is deducted before Zakat calculation.',
            },
            description: 'Active trading: full market value (trade goods). Passive/long-term: 30% proxy. REITs treated same as passive.',
            scholarly_basis: 'Bradford distinguishes between day-trader (full value) and long-term buy-and-hold (30% proxy for underlying assets).',
            tooltip: 'Active trading: full market value. Passive/long-term: 30% proxy rule applies to portfolio value.',
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
            scholarly_basis: 'Based on the concept of "Māl ḍimār" (inaccessible wealth). Funds are not fully owned (Milk Tām) until penalty-free access (age 59.5). Post-access, the 30% proxy applies to estimate liquid zakatable assets. (Source: JoeBradford.net, "Zakat on Retirement Accounts")',
            tooltip: '401k/IRA exempt under 59.5 (Māl ḍimār). After 59.5, use 30% proxy on market value.',
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
            tooltip: 'Personal property = no Zakat. Rental = 2.5% of income. For sale / land banking = 2.5% of value.',
        },

        // ── Business ──
        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
            description: 'Business Zakat on liquid assets and inventory. Fixed assets (equipment, machinery) are exempt.',
            scholarly_basis: 'Classical consensus: trade goods (cash + receivables + inventory) are zakatable. Fixed assets used in production are exempt (not \'urūḍ al-tijāra).',
            tooltip: 'Business Zakat on liquid assets and inventory. Fixed assets (equipment, machinery) are exempt.',
        },

        // ── Debts Owed To User ──
        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts (collectible) are fully zakatable. Bad debts are not zakatable until actually recovered, then held for one year.',
            scholarly_basis: 'Bradford: "Bad debts (amounts loaned to others that cannot be repaid due to default) are never subject to Zakat until actually received, after which they are held for a year."',
            tooltip: 'Good debts (collectible) are fully zakatable. Bad debts are not zakatable until actually recovered.',
        },

        // ── Trusts ──
        trusts: {
            revocable_rate: 1.0,
            irrevocable_rate: 1.0,
            description: 'Trusts are look-through entities. Zakat is due on the underlying assets if the beneficiary has ownership/access. Bradford applies the principle of milk tām: if the grantor or beneficiary retains actual control, Zakat is due.',
            tooltip: 'Trusts are look-through entities. Zakat is due on the underlying assets if the beneficiary has ownership.',
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
        tooltip: '12-month rule: Deduct debts due within the coming year. Beyond that, future debts are not deductible.',
    },
};
