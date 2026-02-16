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
// Dr. Yusuf Al-Qaradawi — Fiqh al-Zakah Configuration
// =============================================================================
//
// OVERVIEW:
//   Dr. Yusuf Al-Qaradawi (1926–2022) authored *Fiqh al-Zakah* (1973), the most
//   comprehensive and widely-cited modern treatise on Zakat. His methodology
//   combines deep classical scholarship with progressive modern ijtihād,
//   emphasizing the redistributive purpose of Zakat and adapting classical
//   principles to contemporary economic instruments.
//
// KEY DISTINGUISHING FEATURES:
//   - Jewelry: EXEMPT for permissible personal use (majority view), but paying
//     is recommended as safer/closer to Allah (Ahwat). Investment/hoarded gold: zakatable.
//   - Passive investments: Underlying-assets proxy (30%, AAOIFI) for commercial
//     companies. Uniquely advocates 10% on NET PROFITS for purely industrial
//     companies (agricultural analogy) — documented but approximated via proxy.
//   - Retirement: Net accessible value (rejects total exemption).
//   - Debt: 12-month rule for modern amortized debts (mortgages, loans).
//   - Nisab: Gold standard for stronger economies (preserves Zakat for the truly wealthy).
//   - Rental property: Income zakatable at 10% (agricultural analogy, via income_rate override).
//   - Professional income (Zakat al-Mustafad): Advocates immediate Zakat on salary
//     upon receipt — NOT implementable in current year-end balance model; documented.
//   - Crypto: IUMS (his organization) considers crypto problematic; standard rates
//     applied if user holds crypto, with position documented.
//
// SOURCES:
//   - Yusuf Al-Qaradawi, *Fiqh al-Zakah: A Comparative Study* (1973), 2 vols.
//   - fiqh.islamonline.net/en/zakah-on-jewellery/
//   - fiqh.islamonline.net/en/zakah-on-rental-property/
//   - fiqh.islamonline.net/en/zakah-on-retirement-accounts/
//   - IUMS (International Union of Muslim Scholars) rulings
//   - islamiceconomicsproject.com/fiqh-uz-zakat/
//
// LIMITATIONS (ZMCS v2.0.1):
//   Two of Al-Qaradawi's unique positions cannot be fully represented:
//   1. 10% on net profits for purely industrial companies — ZakatFlow does not
//      distinguish portfolio sectors. The 30% underlying-assets proxy (which
//      Al-Qaradawi accepts as valid alternative) is used instead.
//   2. Zakat al-Mustafad (immediate salary Zakat) — ZakatFlow uses a year-end
//      balance model. Salary accumulated as cash at year-end is still zakatable.
//
// RESOLVED in v2.0.1:
//   - 5-10% on rental income (agricultural analogy) — Now implemented via
//     rental_property.income_rate override (set to 0.10 = 10%). Rental income
//     is taxed at 10% instead of the global 2.5% rate.
//
// =============================================================================

export const QARADAWI_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'qaradawi-fiqh-alzakah-v1',
        name: 'Dr. Yusuf Al-Qaradawi (Fiqh al-Zakah)',
        version: '1.0.0',
        zmcs_version: '2.0.0',
        author: 'ZakatFlow Official (based on Fiqh al-Zakah by Dr. Yusuf Al-Qaradawi)',
        description: 'The most comprehensive modern Zakat treatise. Combines classical scholarship with progressive ijtihād: jewelry exempt (paying recommended), 30% proxy for passive investments, 10% on rental income (agricultural analogy), net-accessible retirement, 12-month debt rule, gold Nisab standard.',
        ui_label: 'Al-Qaradawi (Fiqh al-Zakah)',
        tier: 'official',
        tooltip: 'Al-Qaradawi: jewelry exempt (paying recommended), 30% proxy for commercial, 10% on rental income, 12-month debt rule.',
        scholar_url: 'https://fiqh.islamonline.net',
        reference: {
            authority: 'Dr. Yusuf Al-Qaradawi',
            url: 'https://islamfuture.wordpress.com/2010/07/05/fiqh-az-zakat-a-comparative-study-volume-i-by-yusuf-al-qaradawi/',
        },
    },

    thresholds: {
        nisab: {
            default_standard: 'gold',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: 'Al-Qaradawi advocates using whichever standard most benefits the poor. In stronger economies (Western countries), the gold standard is preferred — it ensures only genuinely wealthy individuals pay Zakat while excluding modest savers. In poorer economies, silver may be more appropriate to capture more wealth for redistribution.',
            tooltip: 'Al-Qaradawi advocates using whichever standard most benefits the poor. In stronger economies, the gold standard is preferred.',
        },
        zakat_rate: {
            lunar: 0.025,
            solar: 0.02577,
            description: 'Standard 2.5% lunar rate applied globally. Rental income uses a 10% rate override (Al-Qaradawi\'s agricultural analogy, implemented via income_rate). Industrial company profits at 10% are documented but approximated via 30% proxy.',
            tooltip: 'Standard 2.5% lunar rate. Rental income uses a 10% rate (agricultural analogy).',
        },
    },

    assets: {
        // ── Cash ──
        cash: {
            zakatable: true,
            rate: 1.0,
            description: 'All liquid cash holdings are fully zakatable. Al-Qaradawi also advocates Zakat al-Mustafad: Zakat on professional income upon receipt if it meets Nisab, without waiting for the Hawl. ZakatFlow uses a year-end balance model, so salary accumulated as cash is captured at the assessment date.',
            scholarly_basis: 'Fiqh al-Zakah, Vol. 1: Cash is universally zakatable by consensus (ijma\'). Al-Qaradawi extends this to "al-Mal al-Mustafad" (acquired wealth), arguing salary/professional income should be zakated immediately upon receipt at 2.5% of net income after basic living expenses.',
            tooltip: 'All liquid cash holdings are fully zakatable.',
        },

        // ── Precious Metals ──
        precious_metals: {
            investment_gold_rate: 1.0,
            investment_silver_rate: 1.0,
            jewelry: {
                zakatable: false,
                rate: 1.0,
                conditions: ['personal_use', 'non_excessive'],
                description: 'Permissible personal-use jewelry is EXEMPT from obligatory Zakat (majority view). However, Al-Qaradawi strongly recommends paying Zakat on it as the safer position (Ahwat) that "brings her closer to Almighty Allah." Investment gold, hoarded gold, and men\'s gold jewelry are strictly zakatable.',
                scholarly_basis: 'Fiqh al-Zakah, Vol. 1; fiqh.islamonline.net/en/zakah-on-jewellery/: "No authentic hadith explicitly addresses it... Zakat is not strictly obligatory [on permissible women\'s jewelry], but it is permissible and recommended for women to pay 2.5% annually, particularly for jewelry kept rather than worn." Prohibited jewelry (men\'s gold): unanimously zakatable. Hoarded/investment: unanimously zakatable.',
            },
            description: 'Investment metals always zakatable. Personal jewelry exempt but recommended to pay (Ahwat). Nisab: 85g gold, 595g silver.',
            tooltip: 'Personal jewelry EXEMPT but recommended to pay (Ahwat). Investment gold/hoarded gold: zakatable.',
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
            description: 'If cryptocurrency is held, it is treated as a zakatable asset based on its monetary value. Note: The IUMS (International Union of Muslim Scholars, founded by Al-Qaradawi) considers cryptocurrency holdings problematic due to lack of intrinsic value and state backing.',
            scholarly_basis: 'IUMS Secretary-General Ali al-Qaradaghi (Feb 2022): investment in cryptocurrencies is forbidden (haram) due to "tahreem al-wasail" (prohibition of means). However, if a user holds crypto regardless, the possessions carry monetary value and are treated like currency/trade goods for Zakat purposes — the general principle that Zakat applies to all forms of wealth (\'amwal) prevails.',
            tooltip: 'If cryptocurrency is held, it is treated as a zakatable asset based on its monetary value.',
        },

        // ── Investments ──
        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 0.30,
                treatment: 'underlying_assets',
                description: 'Al-Qaradawi distinguishes between company types. COMMERCIAL companies: Zakat on underlying zakatable assets (cash, inventory, receivables) at 2.5% — approximated via 30% proxy (AAOIFI).',
                scholarly_basis: 'Derived from "Fiqh al-Zakah": Deduction of fixed assets allowed. The 30% rule is a modern application of estimating the zakatable "growth" portion of a mixed entity.',
            },
            reits_rate: 0.30,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividend income is zakatable. For purely industrial companies, Al-Qaradawi considers dividends/profits the primary Zakat base (10% rate via agricultural analogy). In ZakatFlow, dividends are added to liquid cash and taxed at the standard 2.5% rate.',
            },
            description: 'Active trading: 100% market value (trade goods). Passive: 30% underlying-assets proxy for commercial companies. Industrial companies: Al-Qaradawi uniquely advocates 10% on net profits (documented, approximated).',
            scholarly_basis: 'Fiqh al-Zakah classifies stocks using the classical Mudir (active trader, annual valuation) vs. Muhtakir (holder, underlying assets or income) framework. Al-Qaradawi extends this by distinguishing commercial companies (underlying assets) from industrial companies (profit analogy to agriculture).',
            tooltip: 'Active trading: 100% market value. Passive: 30% proxy for commercial. Industrial: 10% on net profits (approx).',
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
            description: 'Zakat is due on retirement accounts based on the net accessible value. Al-Qaradawi does not support total exemption for accessible defined-contribution plans (401k, IRA). If funds are legally withdrawable (even with penalties), they are zakatable on the net amount. Pension funds not yet possessed (defined benefit not yet paid out) are exempt until distribution.',
            scholarly_basis: 'Fiqh al-Zakah; fiqh.islamonline.net/en/zakah-on-retirement-accounts/: "Pension funds not yet possessed are not subject to Zakat" but "Zakat applies to wealth one owns with freedom to use." Voluntary contributions that are withdrawable are zakatable once they reach Nisab. Employer\'s forced contribution: treated as bonus gift, not zakatable until accessible. This aligns with the net-accessible approach rather than Bradford\'s total exemption or Tahir Anwar\'s full-balance view.',
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
                income_rate: 0.10,
                description: 'Rental property income is zakatable at 10% (agricultural analogy). Scholarly Basis: Qaradawi Unique Ruling: Analogy to Agriculture. Net rental income is zakatable at 10% (if expenses deducted) or 5% (gross), immediately upon receipt.',
            },
            for_sale: {
                zakatable: true,
                rate: 1.0,
                description: 'Property listed for sale: zakatable as trade goods at full market value.',
            },
            land_banking: {
                zakatable: true,
                rate: 1.0,
                description: 'Undeveloped land held for appreciation: zakatable annually as trade goods by intent.',
            },
        },

        // ── Business ──
        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
            description: 'Business cash, receivables, and inventory are zakatable. Fixed assets (equipment, machinery) are exempt as tools of production. Service businesses: Zakat primarily on net profits and accumulated cash, not capital equipment.',
            scholarly_basis: 'Fiqh al-Zakah, Vol. 1: "Service income is like agricultural produce — taxed on the yield, not the land." Al-Qaradawi notably modernized Zakat doctrine by arguing productive capital (factories, plants) COULD be subject to Zakat, though ZakatFlow follows the majority view treating them as exempt fixed assets.',
            tooltip: 'Business cash based on net profits. Fixed assets generally exempt.',
        },

        // ── Debts Owed To User ──
        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts (collectible) are zakatable. Bad debts only upon actual recovery.',
            scholarly_basis: 'Standard scholarly position across all schools.',
            tooltip: 'Good debts zakatable. Bad debts only upon actual recovery.',
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
            description: 'Only the IMMEDIATE due amount of long-term debts (mortgages, student loans) is deductible — not the entire principal. For amortized debts, deduct the next 12 months of payments. Credit cards and unpaid bills are due immediately and fully deductible. This prevents wealthy investors from using debt as a Zakat shield.',
            scholarly_basis: 'Fiqh al-Zakah, Vol. 1: Al-Qaradawi supports debt deduction that reduces wealth below Nisab but aligns with the modern 12-month restriction for long-term debts. "The proliferation of commercial and investment loans led jurists to restrict full deduction to prevent wealthy investors from avoiding Zakat through prolonged indebtedness." Only principal amounts are deductible — interest (riba) cannot reduce Zakat obligation.',
        },
        description: 'Al-Qaradawi: 12-month rule for modern amortized debts. Aligns with AAOIFI and modern Hanafi interpretation (Mufti Taqi Usmani). Prevents the "debt shield" loophole where millionaires deduct entire 30-year mortgages.',
        tooltip: '12-month rule for modern amortized debts. Aligns with AAOIFI.',
    },
};
