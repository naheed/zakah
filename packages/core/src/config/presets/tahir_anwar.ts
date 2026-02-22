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
// IMAM TAHIR ANWAR Configuration (Hanafi-Leaning, Strong Ownership)
// =============================================================================
//
// OVERVIEW:
//   Imam Tahir Anwar is a prominent American Muslim scholar based in San Jose, CA,
//   formerly the Imam of South Bay Islamic Association (SBIA) and a lecturer at
//   Zaytuna College. His approach to Zakat follows Hanafi fiqh principles with
//   a practical focus on American Muslim financial contexts.
//
// KEY DISTINGUISHING FEATURES:
//   - Retirement: FULL vested balance is zakatable ("strong ownership" view)
//     No age-based exemptions — if you own it, it's zakatable.
//   - Jewelry: Zakatable (Hanafi position — gold/silver are monetary by nature)
//   - Investments: Full market value (100%) for all stocks/funds
//   - Debt: Hanafi method — short-term debts fully deductible,
//     long-term debts: only upcoming 12-month installments deductible
//   - Emphasis on the Hanafi principle of "milk tām" (complete ownership)
//     being the threshold for zakatability
//
// SOURCES:
//   - "Hanafi Fiqh of Zakat" lecture by Imam Tahir Anwar (Zaytuna College)
//   - Classical Hanafi texts: Al-Hidaya (Al-Marghinani), Badai' al-Sanai' (Al-Kasani)
//   - IslamQA Hanafi rulings on retirement and jewelry
//   - zakat.org resource center methodology
//
// NOTES:
//   This configuration represents the "strong ownership" Hanafi interpretation.
//   It produces the HIGHEST Zakat obligations among all presets because:
//   1. Full retirement balance (no exemptions or deductions)
//   2. All jewelry zakatable
//   3. 100% market value on investments (no proxy)
//   4. Full debt deduction (which can reduce obligation)
//
// =============================================================================

export const TAHIR_ANWAR_CONFIG: ZakatMethodologyConfig = {
    meta: {
        id: 'tahir-anwar-hanafi',
        name: 'Imam Tahir Anwar (Hanafi)',
        version: '1.0.0',
        zmcs_version: '1.0.0',
        author: 'ZakatFlow Official (based on Imam Tahir Anwar teachings)',
        description: 'Hanafi "strong ownership" approach: full retirement balance zakatable, jewelry zakatable, 100% investment market value, full debt deduction for short-term debts.',
        ui_label: 'Imam Tahir Anwar',
        tier: 'official',
        tooltip: 'Imam Tahir Anwar: Full retirement balance zakatable, jewelry zakatable, 100% investments, full debt deduction.',
        scholar_url: 'https://www.zaytuna.edu',
        reference: {
            authority: 'Imam Tahir Anwar',
            url: 'https://www.youtube.com/watch?v=gORKh7C5_Y0',
        },
    },

    thresholds: {
        nisab: {
            default_standard: 'silver',
            gold_grams: 85.0,
            silver_grams: 595.0,
            description: 'Standard Hanafi Nisab: 85g gold (20 Mithqal) or 595g silver (200 Dirhams). Silver standard preferred (lower threshold, more inclusive).',
            tooltip: 'Standard Hanafi Nisab: 85g gold (20 Mithqal) or 595g silver (200 Dirhams). Silver standard preferred.',
        },
        zakat_rate: {
            lunar: 0.025,
            solar: 0.02577,
            description: 'Standard 2.5% lunar rate.',
            tooltip: 'Standard 2.5% lunar rate. Solar rate adjusted for 365-day year (2.577%).',
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
                zakatable: true,
                rate: 1.0,
                conditions: [],
                description: 'ALL gold and silver jewelry is zakatable in Hanafi fiqh, including jewelry worn for personal adornment. No exemption for worn jewelry.',
                scholarly_basis: 'Abu Hanifa\'s position: gold and silver are inherently monetary metals (thaman) and retain their zakatable nature regardless of form. Al-Kasani in Badai\' al-Sanai\': "Gold and silver are created as prices (athmān), and their nature does not change by fashioning them into jewelry." Supported by hadith of the woman with gold bracelets (Abu Dawud).',
            },
            description: 'All gold and silver — investment or jewelry — is zakatable. Hanafi foundational principle.',
            tooltip: 'ALL gold and silver jewelry is zakatable, including worn jewelry. Hanafi position.',
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
            description: 'Cryptocurrency treated as trade goods (\'urūḍ al-tijāra) — full market value zakatable.',
            scholarly_basis: 'Contemporary Hanafi scholars apply the principle of analogical reasoning (qiyās) to classify crypto as either currency or trade goods, both of which are zakatable at full value.',
            tooltip: 'Crypto treated as trade goods — full market value zakatable.',
        },

        // ── Investments ──
        investments: {
            active_trading_rate: 1.0,
            passive_investments: {
                rate: 1.0,
                treatment: 'market_value',
                description: '100% of market value is zakatable. No proxy reduction — full ownership = full zakatability.',
                scholarly_basis: 'Classical Hanafi position: stocks represent ownership in company assets. The market value reflects your share of zakatable and non-zakatable assets. Some Hanafi scholars argue for the company\'s zakatable assets proportion, but the practical implementation uses full market value as it represents what you could sell for today.',
            },
            reits_rate: 1.0,
            dividends: {
                zakatable: true,
                deduct_purification: true,
                description: 'Dividend income is zakatable. Purification of haram portion deducted.',
            },
            description: 'All investments at full market value. Active and passive treated equally — your ownership stake is your zakatable amount.',
            scholarly_basis: 'Hanafi fiqh treats stocks as trade goods (\'urūḍ al-tijāra) valued at market price on the Zakat assessment date.',
            tooltip: '100% of market value is zakatable. No proxy reduction.',
        },

        // ── Retirement ──
        retirement: {
            zakatability: 'full',
            pension_vested_rate: 1.0,
            roth_contributions_rate: 1.0,
            roth_earnings_follow_traditional: true,
            distributions_always_zakatable: true,
            description: 'FULL vested balance is zakatable regardless of age, penalties, or access restrictions. Strong ownership (milk tām): if you own the money and it is legally yours, Zakat is due on it. No deduction for potential penalties or taxes — those are hypothetical until withdrawal.',
            scholarly_basis: 'Hanafi principle of strong ownership (milk tām): "The person possesses the capacity to exercise authority over the designated sum." Even with early withdrawal penalties, the funds are legally yours. The penalty is a cost of access, not a reduction in ownership. Supported by: Al-Hidaya (Al-Marghinani), Shariahboard.org ruling #234473. Imam Tahir Anwar teaches: Zakat on the full deposited amount if it meets Nisab, even if withdrawal is restricted.',
            tooltip: 'FULL vested balance is zakatable regardless of age or penalties. Strong ownership (milk tām).',
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
                description: 'Property value not zakatable (exploited asset). Rental income is zakatable.',
            },
            for_sale: {
                zakatable: true,
                rate: 1.0,
                description: 'Property for sale is trade goods — full value zakatable.',
            },
            land_banking: {
                zakatable: true,
                rate: 1.0,
                description: 'Land held for appreciation: zakatable (trade goods by intent).',
            },
            description: 'Hanafi real estate treatment: personal use exempt, income-producing = income zakatable, trade = full value.',
            tooltip: 'Hanafi: personal use exempt, income-producing = income zakatable, trade = full value.',
        },

        // ── Business ──
        business: {
            cash_receivables_rate: 1.0,
            inventory_rate: 1.0,
            fixed_assets_rate: 0.0,
            description: 'Business Zakat on cash, receivables, and inventory. Fixed assets exempt.',
            scholarly_basis: 'Classical Hanafi: \'urūḍ al-tijāra (trade goods) are zakatable at market value. Fixed assets (āt al-hirfa) used in production are exempt.',
            tooltip: 'Business Zakat on cash, receivables, and inventory. Fixed assets exempt.',
        },

        // ── Debts Owed To User ──
        debts_owed_to_user: {
            good_debt_rate: 1.0,
            bad_debt_rate: 0.0,
            bad_debt_on_recovery: true,
            description: 'Good debts are zakatable. Bad debts only upon actual recovery.',
            scholarly_basis: 'Hanafi: Receivable debts (dayn) owed by a solvent debtor are zakatable. Debts owed by an insolvent debtor are not zakatable until recovered.',
            tooltip: 'Good debts are zakatable. Bad debts only upon actual recovery.',
        },

        // ── Trusts ──
        trusts: {
            revocable_rate: 1.0,
            irrevocable_rate: 1.0,
            description: 'Trusts are look-through entities. Zakat is due on the underlying assets if the beneficiary has ownership (milk tām) and access.',
            tooltip: 'Trusts are look-through entities. Zakat on underlying assets if ownership/access exists.',
        },
    },

    liabilities: {
        method: 'full_deduction',
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
                taxes: 'full',
            },
            description: 'Hanafi debt deduction: All debts reduce zakatable wealth. Deduct only what you plan to pay this month — your immediate financial obligation. Credit cards and unpaid bills are immediately due in full, so fully deductible. Long-term debts (mortgage, student loans) are deducted at the current monthly installment only.',
            scholarly_basis: 'Hanafi fiqh: "Debt weakens ownership" (al-dayn yunqiṣ al-milk). Al-Kasani in Badai\' al-Sanai\': debts to humans (dayn al-\'ibād) are deductible because they have a claimant who can enforce collection. Imam Tahir Anwar teaches: deduct what you owe right now, not projected future payments.',
        },
        description: 'Hanafi: full deduction philosophy. All debts to humans reduce zakatable wealth. Deduct only your current month\'s obligations — not annualized projections.',
        tooltip: 'Full deduction: Deduct only what you plan to pay this month.',
    },
};
