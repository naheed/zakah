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
// AMJA (Assembly of Muslim Jurists of America) Configuration
// =============================================================================
//
// OVERVIEW:
//   AMJA's Zakat methodology follows the majority scholarly position with specific
//   modern adaptations for American Muslims. Their fatwas are issued by a committee
//   of qualified jurists (mujtahidūn) and represent a collective ijtihād.
//
// KEY DISTINGUISHING FEATURES:
//   - Retirement: Net withdrawable amount (balance - penalties - taxes)
//   - Passive investments: Treated as exploited assets — only dividends zakatable, NOT market value
//   - Alternative: ~20% proxy estimate for mixed stock/restricted accounts (Dr. Hatem al-Haj)
//   - Jewelry: Exempt (majority view, not Hanafi)
//   - Debt: Only CURRENTLY DUE payments deductible (strict interpretation)
//
// SOURCES:
//   - amjaonline.org/fatwa/en/82475  (401k & Shares)
//   - amjaonline.org/fatwa/en/87289  (Stocks)
//   - amjaonline.org/fatwa/en/87102  (IRA)
//   - amjaonline.org/fatwa/en/76458  (Mortgage & Debt)
//   - amjaonline.org/fatwa/en/3171   (Jewelry)
//   - amjaonline.org/fatwa/en/23235  (Gold)
//   - Fiqh Council of North America ruling (Feb 2024) on retirement accounts
//
// =============================================================================

export const AMJA_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'amja-standard',
        name: 'AMJA (Assembly of Muslim Jurists of America)',
        version: '1.0.0',
        zmcs_version: '1.0.0',
        author: 'ZakatFlow Official (based on AMJA fatwas)',
        description: 'AMJA collective ijtihād: net-withdrawable retirement, stocks as exploited assets (dividends only), jewelry exempt, currently-due debt deduction only.',
        ui_label: 'AMJA Standard',
        tooltip: 'AMJA collective ijtihād: net-withdrawable retirement, stocks as exploited assets, jewelry exempt, currently-due debt deduction only.',
        scholar_url: 'https://www.amjaonline.org/fatwa/en/',
        tier: 'official',
        reference: {
            authority: 'AMJA Resident Fatwa Committee',
            url: 'https://www.amjaonline.org/fatwa/en/87747/zakat-on-401k',
        },
    },

    thresholds: {
        nisab: {
            default_standard: 'silver',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: 'Silver standard (lower threshold) is the safer option, ensuring more people fulfill their obligation.',
            tooltip: 'Silver standard (lower threshold) is the safer option, ensuring more people fulfill their obligation.',
        },
        zakat_rate: {
            lunar: 0.025,
            solar: 0.02577,
            description: 'Standard 2.5% lunar rate.',
            tooltip: 'Standard 2.5% lunar rate.',
        },
    },

    assets: {
        // ── Cash ──
        cash: {
            zakatable: true,
            rate: 1.0,
            description: 'All liquid cash holdings are fully zakatable.',
            scholarly_basis: 'Unanimous consensus (Ijma\').',
            tooltip: 'All liquid cash holdings are fully zakatable.',
        },

        // ── Precious Metals ──
        precious_metals: {
            investment_gold_rate: 1.0,
            investment_silver_rate: 1.0,
            jewelry: {
                zakatable: false,
                rate: 1.0,
                conditions: ['personal_use'],
                description: 'Personal-use jewelry is EXEMPT. Zakat is only required on gold/silver kept for trading, savings, or hoarding.',
                scholarly_basis: 'AMJA follows the majority view: "No Zakat is obligatory on jewelry intended for personal adornment and regular wear." Based on the practice of companions (Aishah, Ibn Umar, Jabir). Jewelry exceeding societal average (extravagance) may have the surplus zakatable.',
            },
            description: 'Investment metals are zakatable. Personal jewelry exempt (majority view).',
            tooltip: 'Investment metals are zakatable. Personal jewelry EXEMPT (majority view).',
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
            description: 'Cryptocurrency treated as zakatable asset based on thamaniyya (monetary value) principle.',
            scholarly_basis: 'While AMJA has not issued a specific crypto fatwa, the general scholarly consensus treats crypto as possessing monetary value and desirability, making it zakatable like currency.',
            tooltip: 'Cryptocurrency treated as zakatable asset based on thamaniyya (monetary value) principle.',
        },

        // ── Investments ──
        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 0.0,
                treatment: 'income_only',
                description: 'Long-term stocks treated as EXPLOITED ASSETS (like rental property): Zakat due only on dividends/profits received, NOT on market value of the shares themselves.',
                scholarly_basis: 'AMJA Fatwa #82475: Long-term stocks are treated as "exploited assets" (mustaghallāt) like rental property. Zakat is due on the *income/dividends* only, not the capital market value.',
            },
            reits_rate: 0.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividend income is zakatable. This is the primary channel through which long-term investments generate Zakat liability.',
            },
            description: 'Active trading: full market value (trade goods). Long-term/passive: exploited-asset view — only dividends/income zakatable.',
            scholarly_basis: 'AMJA distinguishes between trading stocks (trade goods = market value) and long-term investment stocks (exploited assets = income only). This mirrors the classical distinction between \'urūḍ al-tijāra and al-māl al-mustaghall.',
            tooltip: 'Long-term stocks: Exploited assets (only dividends zakatable). Active trading: Market value.',
        },

        // ── Retirement ──
        retirement: {
            zakatability: 'net_accessible',
            pension_vested_rate: 1.0,
            penalty_rate: 0.10,
            tax_rate_source: 'user_input',
            roth_contributions_rate: 1.0,
            roth_earnings_follow_traditional: true,
            distributions_always_zakatable: true,
            description: 'Zakat on the NET WITHDRAWABLE amount: balance minus prescribed penalties minus taxes. You do not need to actually withdraw — it only needs to be legally withdrawable. Roth contributions always fully zakatable (accessible tax-free).',
            scholarly_basis: 'AMJA Fatwa #82216: "Zakah is mandated on the withdrawable amount after deducting all taxes, interest, administrative fees, penalty."',
            tooltip: 'Zakat on the NET WITHDRAWABLE amount: balance minus prescribed penalties minus taxes.',
        },

        // ── Real Estate ──
        real_estate: {
            primary_residence: {
                zakatable: false,
                description: 'Personal home exempt. Unanimous consensus.',
            },
            rental_property: {
                zakatable: false,
                income_zakatable: true,
                description: 'Property value NOT zakatable. Rental revenue is zakatable once it reaches Nisab and has been held for a full lunar year.',
            },
            for_sale: {
                zakatable: true,
                rate: 1.0,
                description: 'Property for sale: zakatable as trade goods.',
            },
            land_banking: {
                zakatable: true,
                rate: 1.0,
                description: 'Land held for appreciation: zakatable annually (trade goods by intent).',
            },
            description: 'AMJA: Rental property value NOT zakatable; rental income IS. Property for sale or land banking is trade goods.',
            tooltip: 'Rental property value NOT zakatable; rental income IS. Property for sale is trade goods.',
        },

        // ── Business ──
        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
            description: 'Business cash, receivables, and inventory are zakatable. Fixed assets exempt.',
            scholarly_basis: 'Classical consensus across all schools: trade goods (\'urūḍ al-tijāra) — cash, receivables, inventory — are zakatable at market value. Fixed assets used in production (machinery, equipment) are exempt as tools of the trade, not items intended for sale.',
            tooltip: 'Business cash, receivables, and inventory are zakatable. Fixed assets exempt.',
        },

        // ── Debts Owed To User ──
        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts zakatable. Bad debts only upon recovery.',
            scholarly_basis: 'Standard majority scholarly position: debts owed by a solvent, acknowledging debtor are zakatable. Debts owed by an insolvent or denying debtor are not zakatable until recovered.',
            tooltip: 'Good debts zakatable. Bad debts only upon recovery.',
        },

        // ── Trusts ──
        trusts: {
            revocable_rate: 1.0,
            irrevocable_rate: 1.0,
            description: 'Trusts are look-through entities. Zakat is due on the underlying assets if the beneficiary has ownership and access. AMJA applies the principle of milk tām (complete ownership).',
            tooltip: 'Trusts are look-through entities. Zakat on underlying assets if ownership/access exists.',
        },
    },

    liabilities: {
        method: 'current_due_only',
        commercial_debt: 'fully_deductible',
        personal_debt: {
            deductible: true,
            types: {
                housing: 'current_due',
                student_loans: 'current_due',
                credit_cards: 'full',
                living_expenses: 'current_due',
                insurance: 'current_due',
                unpaid_bills: 'full',
                taxes: 'current_due',
            },
            description: 'Only payments CURRENTLY DUE are deductible. Monthly mortgage payment (not total balance), current month\'s bills, credit card balance (due immediately). Future debt obligations are NOT deducted.',
            scholarly_basis: 'AMJA fatwa #76458: "Only the payment due (e.g., monthly mortgage payment) is deductible, not the entire loan balance." Principle: "Just as future income is not added to the Zakat pool, future debt payments are not deducted before they are due."',
        },
        description: 'AMJA strict interpretation: only currently due payments reduce zakatable wealth. Future obligations do not affect current Zakat liability.',
        tooltip: 'Only currently due payments (this month) are deductible. Future debt obligations are NOT deducted.',
    },
};
