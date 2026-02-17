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
        reference: {
            authority: "Ibn Qudama (Al-Mughni), Al-Mardawi (Al-Insaf), Ibn Taymiyyah (Majmu' al-Fatawa)",
        },
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
            description: 'Standard 2.5% (1/40th) for a lunar year. Solar rate adjusted to 2.577% for the Gregorian calendar.',
            tooltip: 'Standard 2.5% lunar rate. Solar rate adjusted for 365-day year (2.577%).',
        },
    },

    assets: {
        cash: {
            zakatable: true,
            rate: 1.0,
            description: 'All cash holdings fully zakatable.',
            scholarly_basis: 'Quran 9:34-35 establishes the obligation on gold and silver. Cash is the modern equivalent of gold and silver coinage (thaman). Ibn Qudama in Al-Mughni: Zakat is due on all gold and silver currency that reaches Nisab and completes the Hawl. Consensus (ijma\') of all four schools.',
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
                scholarly_basis: "Ibn Qudama in Al-Mughni: \"There is no Zakat on jewelry that is used for permissible adornment (ḥulī mubāḥ).\" This is the position of the majority of the Companions and scholars, including 'A'ishah, Ibn 'Umar, Jābir, Anas, and Asma' bint Abi Bakr. Al-Mardawi in Al-Insaf confirms this as the mu'tamad (relied-upon) position of the Hanbali school. Jewelry kept for hoarding, savings, or trade is zakatable.",
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
            description: 'Cryptocurrency is fully zakatable at market value, classified as either currency or trade goods.',
            scholarly_basis: 'Contemporary Hanbali scholars apply qiyās to classify cryptocurrency. Ibn Taymiyyah\'s expansive view on thamaniyya (monetary nature) — that any widely accepted medium of exchange can carry the ruling of currency — supports treating crypto as zakatable. The Saudi-based Permanent Committee (al-Lajna al-Dā\'ima) approach of applying Zakat to all forms of productive wealth further supports this classification.',
            tooltip: 'Crypto fully zakatable.',
        },

        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                treatment: 'market_value',
                description: '100% of market value is zakatable.',
                scholarly_basis: "Ibn Qudama in Al-Mughni: trade goods (\'urūḍ al-tijāra) are valued at market price on the assessment date. Stocks represent ownership in company assets and are classified as trade goods. The market price is the authoritative valuation.",
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividends zakatable.',
            },
            description: 'All investments at full market value.',
            scholarly_basis: "Hanbali fiqh: stocks are trade goods (\'urūḍ al-tijāra). Ibn Qudama: \"Trade goods are valued at their market price on the day the Hawl is complete.\" Al-Mardawi confirms this in Al-Insaf.",
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
            scholarly_basis: "Contemporary Hanbali application of milk tām (complete ownership). Ibn Qudama in Al-Mughni establishes that Zakat requires the owner to have actual authority (taṣarruf) over the wealth. Retirement funds subject to withdrawal penalties lack full authority — the net accessible amount after deducting penalties and taxes represents the owner's true claim. This aligns with the Hanbali principle that Zakat is due on wealth over which the owner has tamakkun (established ability to use).",
            tooltip: 'Net accessible: balance minus taxes and penalties.',
        },

        real_estate: {
            primary_residence: { zakatable: false, description: 'Exempt. Personal-use assets (hawā\'ij aṣliyya) are not zakatable by consensus.' },
            rental_property: { zakatable: false, income_zakatable: true, description: 'Property value exempt (exploited asset). Rental income zakatable at standard 2.5% rate.' },
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
            scholarly_basis: "Ibn Qudama in Al-Mughni: trade goods (\'urūḍ al-tijāra) including inventory and receivables are zakatable at market value. Fixed assets used in production are exempt as they are tools of the trade (ālāt al-ḥirfa), not items intended for sale.",
            tooltip: 'Cash, receivables, inventory zakatable. Fixed assets exempt.',
        },

        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts (on a solvent, acknowledging debtor) are fully zakatable. Bad debts are not zakatable until actually recovered.',
            scholarly_basis: "Ibn Qudama in Al-Mughni: debts owed to you are classified by the debtor's condition. A debt on a solvent, acknowledging debtor (mūsir mu'tarif) is zakatable — the owner pays Zakat annually. A debt on an insolvent or denying debtor: two narrations from Imam Ahmad. The mu'tamad view (Al-Mardawi, Al-Insaf): Zakat is due for one year upon recovery, not retroactively.",
            tooltip: 'Good debts zakatable. Bad debts upon recovery.',
        },

        trusts: {
            revocable_rate: 1.0,
            irrevocable_rate: 1.0,
            description: 'Revocable trusts: grantor retains ownership (milk tām), fully zakatable. Irrevocable trusts: zakatable if the beneficiary has actual access and ability to dispose of the assets.',
            tooltip: 'Trusts are look-through entities. Zakat on underlying assets if ownership/access exists.',
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
            scholarly_basis: "Hanbali Position (Ibn Qudama, Al-Mughni): Debts prevent Zakat obligation because they negate ownership (milk). \"There is no Zakat on wealth that is practically owned by another (via debt).\" Ibn Taymiyyah in Majmu' al-Fatawa concurs: \"Debt reduces the zakatable estate because the debtor is not truly wealthy (ghanī) in respect of what he owes.\" This applies to all categories of personal debt — the debt is deducted before assessing whether the remaining wealth reaches Nisab.",
        },
        description: 'Hanbali: full debt deduction, similar to Hanafi position.',
        tooltip: 'Full deduction: all debts offset zakatable wealth (similar to Hanafi).',
    },
};
