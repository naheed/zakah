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
        reference: {
            authority: "Al-Nawawi (Al-Majmu' Sharh al-Muhadhdhab), Al-Shirazi (Al-Muhadhdhab fi Fiqh al-Imam al-Shafi'i)",
        },
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
            description: 'Standard 2.5% (1/40th) for a lunar year. Solar rate adjusted to 2.577% for the Gregorian calendar.',
            tooltip: 'Standard 2.5% lunar rate. Solar rate adjusted for 365-day year (2.577%).',
        },
    },

    assets: {
        cash: {
            zakatable: true,
            rate: 1.0,
            description: 'All cash holdings fully zakatable.',
            scholarly_basis: 'Quran 9:34-35 establishes the obligation on gold and silver. Cash is the modern equivalent of gold and silver coinage (thaman). Consensus (ijma\') of all four schools that currency holdings are zakatable.',
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
                scholarly_basis: "Al-Nawawi in Al-Majmu' Sharh al-Muhadhdhab: jewelry used for permissible personal adornment is exempt from Zakat. Based on the practice of the Companions: 'A'ishah (raḍiya Allāhu 'anhā) used to care for orphan girls with gold jewelry and did not pay Zakat on it (Muwatta' Malik). Ibn 'Umar and Jābir also held this view. Al-Shirazi in Al-Muhadhdhab supports this ruling, classifying worn jewelry as personal-use goods (hawā'ij aṣliyya) rather than monetary wealth.",
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
            description: 'Crypto fully zakatable as a store of value analogous to currency or trade goods.',
            scholarly_basis: 'Contemporary Shafi\'i scholars apply qiyās (analogical reasoning) to classify cryptocurrency: if used as a medium of exchange, it takes the ruling of currency (nuqūd); if held for profit, it takes the ruling of trade goods (\'urūḍ al-tijāra). In either case, Zakat is due at market value. The key Shafi\'i principle is that any wealth (māl) with thamaniyya (monetary value recognized by people) is zakatable.',
            tooltip: 'Crypto fully zakatable as currency equivalent or trade goods.',
        },

        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                treatment: 'market_value',
                description: '100% of market value is zakatable. Stocks are viewed as trade goods.',
                scholarly_basis: "Al-Nawawi in Al-Majmu': trade goods (\'urūḍ al-tijāra) are valued at their market price (al-qīma al-sūqiyya) on the day the Hawl is complete. Stocks represent fractional ownership in company assets and are classified as trade goods. The market price is the authoritative valuation.",
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividends zakatable.',
            },
            description: 'All investments at full market value.',
            scholarly_basis: "Shafi'i fiqh: stocks are trade goods (\'urūḍ al-tijāra) valued at current market price. Al-Nawawi in Al-Majmu': the owner values trade goods at market price on the assessment date, not at cost.",
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
            scholarly_basis: "Contemporary Shafi'i application of the principle of milk tām (complete ownership) and qudrah 'ala al-taṣarruf (ability to dispose). Al-Nawawi in Al-Majmu' establishes that Zakat is due on wealth over which the owner has actual authority. Retirement funds with withdrawal restrictions are zakatable on the net amount one could actually access, deducting penalties and taxes that would be incurred upon withdrawal.",
            tooltip: 'Net accessible amount: balance minus taxes and penalties.',
        },

        real_estate: {
            primary_residence: { zakatable: false, description: 'Exempt. Personal-use assets (hawā\'ij aṣliyya) are not zakatable by consensus.' },
            rental_property: { zakatable: false, income_zakatable: true, description: 'Property value exempt (exploited asset — al-māl al-mustaghall). Rental income zakatable at standard 2.5% rate.' },
            for_sale: { zakatable: true, rate: 1.0, description: 'Trade goods (\'urūḍ al-tijāra) at full market value.' },
            land_banking: { zakatable: true, rate: 1.0, description: 'Trade goods by intent (niyyat al-tijāra).' },
            description: 'Personal property exempt. Rental income zakatable at 2.5%. Trade property at full value.',
            tooltip: 'Personal property exempt. Rental income zakatable. Trade property at full value.',
        },

        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
            description: 'Cash, receivables, inventory zakatable. Fixed assets exempt.',
            scholarly_basis: "Al-Nawawi in Al-Majmu': trade goods (\'urūḍ al-tijāra) including inventory and receivables are valued at market price and are zakatable. Fixed assets used in production (ālāt al-ṣinā'a) are exempt as they are not items of trade. This follows the principle that only nāmī (growth-generating) wealth is zakatable.",
            tooltip: 'Cash, receivables, inventory zakatable. Fixed assets exempt.',
        },

        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts (dayn on a solvent, acknowledging debtor) are fully zakatable. Bad debts (doubtful recovery) are not zakatable until actually recovered.',
            scholarly_basis: "Al-Nawawi in Al-Majmu': debts owed to you are classified by recoverability. A debt owed by a solvent, acknowledging debtor (mūsir muqirr) is treated as if the creditor holds the money — Zakat is due annually. A debt owed by an insolvent or denying debtor is like māl ḍimār (inaccessible wealth) — Zakat is deferred until recovery.",
            tooltip: 'Good debts zakatable. Bad debts upon recovery.',
        },

        trusts: {
            revocable_rate: 1.0,
            irrevocable_rate: 1.0,
            description: 'Revocable trusts: grantor retains ownership (milk tām), fully zakatable. Irrevocable trusts: zakatable if the beneficiary has actual access and the ability to dispose (qudrah \'ala al-taṣarruf).',
            tooltip: 'Trusts are look-through entities. Zakat on underlying assets if ownership/access exists.',
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
            scholarly_basis: "Shafi'i Position (Al-Nawawi, Al-Majmu' Sharh al-Muhadhdhab): Zakat is attached to the wealth itself ('ayn al-māl), independent of the owner's liabilities. The obligation arises from possessing Nisab, regardless of debt. Al-Nawawi: \"The correct view (al-ṣaḥīḥ) in our school is that debt does not prevent the obligation of Zakat.\" This is because Zakat is a right of the poor attached to the wealth, and the creditor's claim does not negate the poor's right.",
        },
        description: "Shafi'i: No debt deduction. Zakat obligation exists independently of the owner's debt situation.",
        tooltip: "NO debt deduction. Zakat obligation exists independently of the owner's debt situation.",
    },
};
