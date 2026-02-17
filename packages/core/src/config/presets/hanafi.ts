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
        id: 'hanafi-standard',
        name: 'Hanafi',
        version: '1.0.0',
        zmcs_version: '1.0.0',
        author: 'ZakatFlow Official',
        description: 'Classical Hanafi: jewelry zakatable, full debt deduction, net accessible retirement, 100% investments.',
        ui_label: 'Hanafi',
        tier: 'official',
        tooltip: 'Classical Hanafi: jewelry zakatable, full debt deduction, net accessible retirement, 100% investments.',
        reference: {
            authority: "Al-Kasani (Badai' al-Sanai'), Al-Marghinani (Al-Hidaya), Al-Sarakhsi (Al-Mabsut)",
        },
    },

    thresholds: {
        nisab: {
            default_standard: 'silver',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: 'Standard Hanafi Nisab: 85g gold (20 Mithqal) or 595g silver (200 Dirhams).',
            tooltip: 'Standard Hanafi Nisab: 85g gold (20 Mithqal) or 595g silver (200 Dirhams).',
        },
        zakat_rate: {
            lunar: 0.025,
            solar: 0.02577,
            description: 'Standard 2.5% (1/40th) for a lunar year. Solar rate adjusted to 2.577% for the Gregorian calendar (365.25/354.37 correction).',
            tooltip: 'Standard 2.5% lunar rate. Solar rate adjusted for 365-day year (2.577%).',
        },
    },

    assets: {
        cash: {
            zakatable: true,
            rate: 1.0,
            description: 'All cash holdings are fully zakatable.',
            scholarly_basis: 'Quran 9:34-35: "Those who hoard gold and silver and do not spend them in the way of Allah — give them tidings of a painful punishment." Hadith in Sahih Muslim (Book of Zakat): The Prophet ﷺ prescribed Zakat on gold and silver. Cash is the modern equivalent of gold and silver coinage (thaman). Consensus (ijma\') of all four schools.',
            tooltip: 'All cash holdings are fully zakatable.',
        },

        precious_metals: {
            investment_gold_rate: 1.0,
            investment_silver_rate: 1.0,
            jewelry: {
                zakatable: true,
                rate: 1.0,
                conditions: [],
                description: 'Gold and silver jewelry is zakatable regardless of whether it is worn for adornment.',
                scholarly_basis: 'Abu Hanifa: gold and silver are inherently monetary (thaman) and do not lose their zakatable nature when fashioned into jewelry. Al-Kasani in Badai\' al-Sanai\': "They are created as prices, and their nature does not change." Supported by the hadith of the woman with gold bracelets (Sunan Abu Dawud #1563): The Prophet ﷺ asked, "Do you pay Zakat on these?" She said no, and he said, "Would you like Allah to make you wear bracelets of fire?" Also narrated by Al-Tirmidhi #637.',
            },
            description: 'All gold and silver is zakatable — investment and personal jewelry alike.',
            tooltip: 'All gold and silver is zakatable — investment and personal jewelry alike.',
        },

        crypto: {
            currency_rate: 1.0,
            trading_rate: 1.0,
            staking: {
                principal_rate: 1.0,
                rewards_rate: 1.0,
                vested_only: true,
            },
            description: 'Crypto classified as trade goods or currency — fully zakatable at market value on the assessment date.',
            scholarly_basis: 'Contemporary Hanafi scholars apply analogical reasoning (qiyās) to classify cryptocurrency as either currency (nuqūd) based on its medium-of-exchange function, or trade goods (\'urūḍ al-tijāra) based on its store-of-value function. In either case, it is fully zakatable at market value. Dar al-Ifta al-Misriyyah (2018) and various Hanafi muftis have issued fatwas supporting zakatability.',
            tooltip: 'Crypto classified as trade goods or currency — fully zakatable.',
        },

        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                treatment: 'market_value',
                description: '100% of market value is zakatable. Stocks are treated as trade goods regardless of intent (active vs passive).',
                scholarly_basis: 'Hanafi fiqh treats all stocks as trade goods (\'urūḍ al-tijāra) valued at market price on the assessment date. Al-Kasani in Badai\' al-Sanai\': trade goods are valued "at the price for which they can be sold" (bi-qīmatihi). The market price represents the liquidation value of the owner\'s share.',
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividend income is zakatable.',
            },
            description: 'All investments at full market value. Stocks treated as trade goods.',
            scholarly_basis: 'Classical Hanafi: \'urūḍ al-tijāra (trade goods) are valued at market price (al-qīma al-sūqiyya) on the Zakat assessment date. Al-Marghinani in Al-Hidaya confirms valuation at current market price.',
            tooltip: '100% of market value is zakatable. Stocks are treated as trade goods.',
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
            scholarly_basis: 'Mainstream contemporary Hanafi application: Zakat is due on what you could access today. Early withdrawal penalties and taxes reduce the net accessible amount, as they represent costs that diminish the owner\'s actual claim (milk tām). This is the position of most contemporary Hanafi scholars including those at Dar al-Ifta and SeekersGuidance. Note: Imam Tahir Anwar holds the stricter "full balance" view — see his dedicated preset.',
            tooltip: 'Zakatable on net accessible amount: vested balance minus taxes and early withdrawal penalties.',
        },

        real_estate: {
            primary_residence: { zakatable: false, description: 'Exempt. Unanimous consensus — personal-use assets (hawā\'ij asliyya) are not zakatable.' },
            rental_property: { zakatable: false, income_zakatable: true, description: 'Property value exempt (exploited asset). Rental income zakatable at standard 2.5% rate once received.' },
            for_sale: { zakatable: true, rate: 1.0, description: 'Trade goods (\'urūḍ al-tijāra) — full market value zakatable.' },
            land_banking: { zakatable: true, rate: 1.0, description: 'Held for appreciation — trade goods by intent (niyyat al-tijāra).' },
            description: 'Personal property exempt. Rental income zakatable. Trade property at full value.',
            tooltip: 'Personal property exempt. Rental income zakatable. Trade property at full value.',
        },

        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
            description: 'Cash, receivables, and inventory are fully zakatable. Fixed assets (machinery, buildings) are exempt.',
            scholarly_basis: 'Al-Kasani in Badai\' al-Sanai\': trade goods (\'urūḍ al-tijāra) — including inventory and receivables — are zakatable at market value. Fixed assets used in production (ālāt al-hirfa) are exempt as they are personal-use tools, not items of trade.',
            tooltip: 'Cash, receivables, and inventory are fully zakatable. Fixed assets (machinery, buildings) are exempt.',
        },

        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts (dayn qawī — owed by a willing, solvent debtor) are fully zakatable. Bad debts (dayn ḍa\'īf) are not zakatable until actually recovered.',
            scholarly_basis: 'Hanafi fiqh classifies debts into three categories: strong (dayn qawī, e.g., trade receivables), medium (dayn mutawassiṭ, e.g., loans), and weak (dayn ḍa\'īf, e.g., inheritance before possession). Al-Kasani: strong debts are zakatable immediately; weak debts only upon recovery of Nisab equivalent.',
            tooltip: 'Good debts zakatable. Bad debts upon recovery only.',
        },

        trusts: {
            revocable_rate: 1.0,
            irrevocable_rate: 1.0,
            description: 'Revocable trusts: grantor retains ownership (milk tām), so assets are fully zakatable. Irrevocable trusts: zakatable if the beneficiary has actual access and control.',
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
            description: 'Full deduction: all debts reduce zakatable wealth. "Debt weakens ownership" (al-dayn yunqiṣ al-milk).',
            scholarly_basis: 'Hanafi Position: All debts owed to other humans (dayn al-\'ibād) that are demandable prevent Zakat obligation by reducing net wealth below Nisab. Al-Kasani in Badai\' al-Sanai\': "Debt prevents Zakat because it negates the meaning of wealth (al-ghinā) which is the basis of the obligation." Al-Marghinani in Al-Hidaya: "Debt that has a claimant reduces the zakatable estate." This applies to all types of personal debt — housing, student loans, credit cards, and taxes owed.',
        },
        description: 'Hanafi: debts are a full offset against zakatable wealth.',
        tooltip: 'Full deduction: all debts reduce zakatable wealth. "Debt weakens ownership".',
    },
};
