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
        id: 'maliki-standard',
        name: 'Maliki',
        version: '1.0.0',
        zmcs_version: '1.0.0',
        author: 'ZakatFlow Official',
        description: 'Classical Maliki: jewelry exempt, 12-month debt deduction, commercial debt ring-fenced to business assets, 100% investments.',
        ui_label: 'Maliki',
        tier: 'official',
        tooltip: 'Classical Maliki: jewelry exempt, 12-month debt deduction, commercial debt ring-fenced.',
        reference: {
            authority: "Imam Malik (Al-Mudawwana), Khalil ibn Ishaq (Mukhtasar Khalil), Al-Dardir (Al-Sharh al-Kabir)",
        },
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
            description: 'Standard 2.5% (1/40th) for a lunar year. Solar rate adjusted to 2.577% for the Gregorian calendar.',
            tooltip: 'Standard 2.5% lunar rate. Solar rate adjusted for 365-day year (2.577%).',
        },
    },

    assets: {
        cash: {
            zakatable: true,
            rate: 1.0,
            description: 'All cash holdings fully zakatable.',
            scholarly_basis: 'Quran 9:34-35 establishes the obligation on gold and silver. Cash is the modern equivalent of gold and silver coinage (thaman). Imam Malik in Al-Mudawwana: Zakat is due on all gold and silver currency holdings that reach Nisab and complete the Hawl. Consensus (ijma\') of all four schools.',
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
                scholarly_basis: "Khalil in Mukhtasar Khalil: gold and silver used for permissible adornment (ḥulī mubāḥ) are exempt from Zakat. Imam Malik in Al-Mudawwana: \"There is no Zakat on women's jewelry that is worn and used for adornment.\" This follows the practice of the Companions — 'A'ishah, Ibn 'Umar, and Jābir did not pay Zakat on personal jewelry. Jewelry kept for savings, hoarding, or trade is zakatable.",
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
            description: 'Cryptocurrency is fully zakatable as a store of value with monetary characteristics (thamaniyya).',
            scholarly_basis: 'Contemporary Maliki scholars apply the principle of thamaniyya (monetary value recognized by people in transactions) to classify crypto as zakatable wealth. The Maliki school is particularly open to expanding the definition of currency beyond gold and silver — Imam Malik himself accepted fulūs (copper coins) as potentially zakatable if widely circulated. Crypto with market value and exchange utility falls under this principle.',
            tooltip: 'Crypto fully zakatable as a store of value.',
        },

        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                treatment: 'market_value',
                description: '100% of market value is zakatable. For modern listed shares, the market value indicates the tradeable price.',
                scholarly_basis: "Maliki fiqh distinguishes between Mudir (active trader — valued at market price annually) and Muḥtakir (long-term holder — valued at cost, Zakat due only upon sale). For modern diversified stock portfolios on public exchanges, the Mudir treatment is applied: stocks are valued at market price. Al-Dardir in Al-Sharh al-Kabir: the Mudir's goods are valued \"at the price for which they sell on the day of assessment.\"",
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividends zakatable.',
            },
            description: 'All investments at full market value.',
            scholarly_basis: "Maliki Mudir/Muḥtakir framework applied to modern markets. Al-Dardir: the Mudir values goods at market price annually. For publicly traded stocks, market price is the practical standard.",
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
            description: 'Net accessible amount: balance minus taxes and penalties.',
            scholarly_basis: "Contemporary Maliki application of the concept of māl ḍimār (inaccessible wealth). Imam Malik in Al-Mudawwana: wealth that the owner cannot access or dispose of is not subject to Zakat until it returns to their possession. Retirement funds with restrictions are a modern form of māl ḍimār — Zakat is due on the net amount that could actually be withdrawn, deducting penalties and taxes.",
            tooltip: 'Net accessible amount: balance minus taxes and penalties.',
        },

        real_estate: {
            primary_residence: { zakatable: false, description: 'Exempt. Personal-use assets are not zakatable by consensus.' },
            rental_property: { zakatable: false, income_zakatable: true, description: 'Property value exempt (exploited asset — al-māl al-mustaghall). Rental income zakatable at standard 2.5% rate.' },
            for_sale: { zakatable: true, rate: 1.0, description: 'Trade goods (\'urūḍ al-tijāra) at full market value.' },
            land_banking: { zakatable: true, rate: 1.0, description: 'Trade goods by intent (niyyat al-tijāra).' },
            description: 'Personal property exempt. Rental income zakatable. Trade property at full value.',
            tooltip: 'Personal property exempt. Rental income zakatable. Trade property at full value.',
        },

        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
            description: 'Cash, receivables, inventory zakatable. Fixed assets exempt.',
            scholarly_basis: "Al-Dardir in Al-Sharh al-Kabir: trade goods valued at market price for the Mudir (frequent trader). The Maliki school uniquely ring-fences commercial debt to business assets only — business debts cannot reduce personal zakatable wealth.",
            tooltip: 'Cash, receivables, inventory zakatable. Fixed assets exempt.',
        },

        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts (on a solvent, acknowledging debtor) are zakatable. Bad debts (māl ḍimār — doubtful recovery) are not zakatable until actually recovered.',
            scholarly_basis: "Imam Malik in Al-Mudawwana: debts owed by an insolvent or absent debtor are classified as māl ḍimār (inaccessible wealth). No Zakat is due on them until recovered. Upon recovery, one year's Zakat is paid (not retroactive). Khalil in Mukhtasar: \"He pays Zakat for one year only\" upon recovery of a long-lost debt.",
            tooltip: 'Good debts zakatable. Bad debts upon recovery only.',
        },

        trusts: {
            revocable_rate: 1.0,
            irrevocable_rate: 1.0,
            description: 'Revocable trusts: grantor retains ownership, fully zakatable. Irrevocable trusts: zakatable if the beneficiary has actual access and ability to dispose of the assets.',
            tooltip: 'Trusts are look-through entities. Zakat on underlying assets if ownership/access exists.',
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
            scholarly_basis: "Maliki Position (Khalil in Mukhtasar Khalil): Debts are deductible ONLY if they (1) reduce wealth below Nisab and (2) the debtor possesses no other assets to pay them from. Commercial debts are uniquely ring-fenced to business assets — they cannot reduce personal zakatable wealth. This \"middle path\" between the Hanafi full deduction and the Shafi'i no deduction reflects the Maliki principle of balancing the rights of the poor against the debtor's genuine obligations.",
        },
        description: 'Maliki: limited debt deduction with 12-month horizon and business-asset ring-fencing.',
        tooltip: '12-month rule: Only debts due within the coming year reduce zakatable wealth.',
    },
};
