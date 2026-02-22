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

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAppTool } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { calculateZakat, ZakatFormData, defaultFormData, ZAKAT_PRESETS } from "@zakatflow/core";
import { WIDGET_URI } from "../widget/template.js";
import { recordAnonymousCalculation, getDefaultSessionId } from "../analytics.js";

const ALL_MADHAB_IDS = ['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'qaradawi', 'tahir_anwar'] as const;

export function registerCalculateZakat(server: McpServer) {
    registerAppTool(
        server,
        "calculate_zakat",
        {
            title: "Calculate Zakat",
            description: "Calculate Zakat obligation based on Islamic jurisprudence. Supports ALL asset categories: cash, precious metals, crypto, investments, retirement, trusts, real estate, business, illiquid assets, and detailed liabilities. Returns structured calculation data rendered as an interactive widget. NOTE: ZakatFlow provides calculations, not fatwas. Users should consult a qualified scholar for personal rulings.",
            annotations: {
                readOnlyHint: true,
                destructiveHint: false,
                openWorldHint: false,
            },
            inputSchema: {
                // ─── Liquid Assets ───────────────────────────────────────
                cash: z.number().describe("Total liquid cash: checking accounts, savings, cash on hand, digital wallets (PayPal/Venmo/CashApp), and foreign currency combined."),

                // ─── Precious Metals ─────────────────────────────────────
                gold_value: z.number().optional().describe("Value of gold INVESTMENT (coins, bars, bullion) in USD. Always 100% zakatable."),
                gold_grams: z.number().optional().describe("Weight of gold in grams (will be converted to USD if gold_value is missing)."),
                gold_jewelry: z.number().optional().describe("Value of WEARABLE gold jewelry in USD. Zakatability depends on madhab: Hanafi = zakatable, Shafii/Maliki/Hanbali = exempt."),
                silver_value: z.number().optional().describe("Value of silver INVESTMENT in USD."),
                silver_grams: z.number().optional().describe("Weight of silver in grams (will be converted if silver_value is missing)."),
                silver_jewelry: z.number().optional().describe("Value of wearable silver jewelry in USD."),

                // ─── Crypto & Digital Assets ─────────────────────────────
                crypto: z.number().optional().describe("Value of all cryptocurrency holdings (Bitcoin, Ethereum, etc). 100% zakatable. If you have detailed DeFi positions, use the fields below instead."),
                crypto_trading: z.number().optional().describe("Value of altcoins, meme coins, NFTs held for active trading. 100% zakatable."),
                staked_assets: z.number().optional().describe("Principal value of staked crypto (e.g., staked ETH). Zakatable at market value."),
                staked_rewards: z.number().optional().describe("Vested staking rewards that can be claimed. Zakatable when vested."),
                liquidity_pool: z.number().optional().describe("Current redeemable value of liquidity pool positions (e.g., Uniswap LP tokens)."),

                // ─── Investments ─────────────────────────────────────────
                stocks: z.number().optional().describe("Value of stocks, index funds, ETFs, mutual funds, or other equity investments. This is the most common investment type. Subject to methodology-specific rates (e.g., Bradford 30%, Hanafi 100%)."),
                active_trading: z.number().optional().describe("Value of day-trading portfolios or short-term speculative investments. 100% zakatable."),
                reits: z.number().optional().describe("Value of equity REIT investments (avoid mortgage REITs). Treated like passive stock investments."),
                dividends: z.number().optional().describe("Total dividends received this year. May require purification if from non-halal sources."),

                // ─── Retirement ──────────────────────────────────────────
                retirement_total: z.number().optional().describe("Total vested balance of ALL retirement accounts combined (401k, IRA, etc). Use this for simple entry, OR use the detailed fields below."),
                roth_ira_contributions: z.number().optional().describe("Roth IRA principal contributions (always penalty-free to withdraw). Zakatable."),
                roth_ira_earnings: z.number().optional().describe("Roth IRA earnings (may have early withdrawal penalty if under 59.5)."),
                traditional_ira: z.number().optional().describe("Traditional IRA vested balance."),
                four_oh_one_k: z.number().optional().describe("401(k) vested balance (employer-matched portion that has vested)."),
                hsa_balance: z.number().optional().describe("Health Savings Account balance. Zakatable if accessible."),
                age: z.number().optional().describe("User's age (crucial for retirement exemption rules — over 59.5 changes accessibility). Defaults to 30 if not provided."),

                // ─── Trusts ──────────────────────────────────────────────
                revocable_trust: z.number().optional().describe("Value of revocable (living) trusts. Grantor retains control — zakatable."),
                irrevocable_trust: z.number().optional().describe("Value of irrevocable trusts where beneficiary has current access. Zakatable if accessible."),

                // ─── Real Estate ─────────────────────────────────────────
                real_estate_for_sale: z.number().optional().describe("Market value of property held for flipping/sale. 100% zakatable as trade goods."),
                land_banking: z.number().optional().describe("Value of undeveloped land held for future appreciation. 100% zakatable."),
                rental_income: z.number().optional().describe("Net rental income received and currently in bank (not the property value itself)."),

                // ─── Business ────────────────────────────────────────────
                business_cash: z.number().optional().describe("Business cash, accounts receivable, and liquid business assets."),
                business_inventory: z.number().optional().describe("Value of business inventory/merchandise for sale. Zakatable as trade goods."),

                // ─── Illiquid Assets ─────────────────────────────────────
                illiquid_assets: z.number().optional().describe("Value of other illiquid assets (collectibles, equipment for trade, etc)."),
                livestock: z.number().optional().describe("Value of livestock held for trade (not personal use animals)."),

                // ─── Debt Owed TO You ────────────────────────────────────
                good_debt_owed: z.number().optional().describe("Money owed TO the user that is collectible (borrower is willing and able to repay). Zakatable."),
                bad_debt_recovered: z.number().optional().describe("Bad debt that was recovered this year. Zakatable in the year of recovery."),

                // ─── Liabilities (Deductions) ────────────────────────────
                loans: z.number().optional().describe("Start with 0. ONLY include immediate debts due NOW (credit cards, bills past due). DO NOT include long-term mortgage/student loan balances."),
                unpaid_bills: z.number().optional().describe("Unpaid bills and invoices currently due."),
                monthly_mortgage: z.number().optional().describe("Monthly payment for primary residence mortgage (deductible for 12 months)."),
                student_loans: z.number().optional().describe("Current student loan payments due (not total balance — only current installments)."),
                property_tax: z.number().optional().describe("Property tax payments due."),
                living_expenses: z.number().optional().describe("Monthly basic living expenses (deductible in some methodologies)."),

                // ─── Preferences ─────────────────────────────────────────
                madhab: z.enum(ALL_MADHAB_IDS).optional().describe("School of thought for calculation rules. Available: bradford (modern synthesis), hanafi, shafii, maliki, hanbali, amja, qaradawi, tahir_anwar."),
                nisab_standard: z.enum(['silver', 'gold']).optional().describe("Nisab threshold standard. Silver = lower threshold (more people owe Zakat), Gold = higher threshold. Most methodologies default to silver."),
            },
            _meta: {
                ui: {
                    resourceUri: WIDGET_URI,
                },
            },
        },
        async (params) => {
            // Destructure all params
            const {
                cash, gold_value, gold_grams, gold_jewelry, silver_value, silver_grams, silver_jewelry,
                crypto, crypto_trading, staked_assets, staked_rewards, liquidity_pool,
                stocks, active_trading, reits, dividends,
                retirement_total, roth_ira_contributions, roth_ira_earnings, traditional_ira, four_oh_one_k, hsa_balance, age,
                revocable_trust, irrevocable_trust,
                real_estate_for_sale, land_banking, rental_income,
                business_cash, business_inventory,
                illiquid_assets, livestock,
                good_debt_owed, bad_debt_recovered,
                loans, unpaid_bills, monthly_mortgage, student_loans, property_tax, living_expenses,
                madhab, nisab_standard,
            } = params;

            // Helper for gram conversion if value is missing
            const goldVal = gold_value || (gold_grams ? (gold_grams * (2650 / 31.1035)) : 0);
            const silverVal = silver_value || (silver_grams ? (silver_grams * (24.50 / 31.1035)) : 0);

            const selectedMadhab = madhab || 'bradford';

            // Compute retirement: use detailed fields if provided, else fall back to single total
            const retirementVested = (roth_ira_contributions || 0) + (roth_ira_earnings || 0) +
                (traditional_ira || 0) + (four_oh_one_k || 0);
            const retirementTotal = retirementVested > 0 ? retirementVested : (retirement_total || 0);

            // Construct ZakatFormData from inputs — FULL parity with web app
            const formData: ZakatFormData = {
                ...defaultFormData,
                // Liquid Assets
                checkingAccounts: cash,

                // Precious Metals
                goldInvestmentValue: goldVal,
                goldJewelryValue: gold_jewelry || 0,
                silverInvestmentValue: silverVal,
                silverJewelryValue: silver_jewelry || 0,

                // Crypto
                cryptoCurrency: crypto || 0,
                cryptoTrading: crypto_trading || 0,
                stakedAssets: staked_assets || 0,
                stakedRewardsVested: staked_rewards || 0,
                liquidityPoolValue: liquidity_pool || 0,
                hasCrypto: !!(crypto || crypto_trading || staked_assets || staked_rewards || liquidity_pool),

                // Investments
                activeInvestments: active_trading || 0,
                passiveInvestmentsValue: (stocks || 0) + (reits || 0),
                dividends: dividends || 0,

                // Retirement
                fourOhOneKVestedBalance: retirementTotal,
                rothIRAContributions: roth_ira_contributions || 0,
                rothIRAEarnings: roth_ira_earnings || 0,
                traditionalIRABalance: traditional_ira || 0,
                hsaBalance: hsa_balance || 0,
                age: age || 30,

                // Trusts
                revocableTrustValue: revocable_trust || 0,
                irrevocableTrustValue: irrevocable_trust || 0,
                irrevocableTrustAccessible: !!(irrevocable_trust && irrevocable_trust > 0),
                hasTrusts: !!(revocable_trust || irrevocable_trust),

                // Real Estate
                realEstateForSale: real_estate_for_sale || 0,
                landBankingValue: land_banking || 0,
                rentalPropertyIncome: rental_income || 0,
                hasRealEstate: !!(real_estate_for_sale || land_banking || rental_income),

                // Business
                businessCashAndReceivables: business_cash || 0,
                businessInventory: business_inventory || 0,
                hasBusiness: !!(business_cash || business_inventory),

                // Illiquid Assets
                illiquidAssetsValue: illiquid_assets || 0,
                livestockValue: livestock || 0,
                hasIlliquidAssets: !!(illiquid_assets || livestock),

                // Debt Owed To You
                goodDebtOwedToYou: good_debt_owed || 0,
                badDebtRecovered: bad_debt_recovered || 0,
                hasDebtOwedToYou: !!(good_debt_owed || bad_debt_recovered),

                // Liabilities
                creditCardBalance: loans || 0,
                unpaidBills: unpaid_bills || 0,
                monthlyMortgage: monthly_mortgage || 0,
                studentLoansDue: student_loans || 0,
                propertyTax: property_tax || 0,
                monthlyLivingExpenses: living_expenses || 0,

                // Preferences
                madhab: selectedMadhab,
                nisabStandard: nisab_standard || 'silver',
                hasPreciousMetals: !!(goldVal || gold_jewelry || silverVal || silver_jewelry),
            };

            const result = calculateZakat(formData);

            // Generate compact deep-link — strip zero-value and default fields to minimize URL length
            const isDev = process.env.NODE_ENV === 'development';
            const baseUrl = process.env.CLIENT_URL || (isDev ? 'http://localhost:8080' : 'https://zakatflow.org');
            const compactData: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(formData)) {
                // Skip zero numbers, empty strings, false booleans, and default values
                if (value === 0 || value === '' || value === false) continue;
                if (key === 'entryMethod' && value === 'manual') continue;
                if (key === 'isHousehold' && value === false) continue;
                if (key === 'isSimpleMode' && value === false) continue;
                if (key === 'calendarType' && value === 'lunar') continue;
                if (key === 'nisabStandard' && value === 'silver') continue;
                if (key === 'passiveInvestmentIntent' && value === 'mudir') continue;
                if (key === 'estimatedTaxRate' && value === 0.25) continue;
                if (key === 'age' && value === 30) continue;
                if (key === 'retirementWithdrawalAllowed' && value === true) continue;
                if (key === 'retirementWithdrawalLimit' && value === 1) continue;
                if (key === 'householdMembers') continue; // Skip array — too large, re-created by web app
                compactData[key] = value;
            }
            const encoded = btoa(JSON.stringify(compactData));
            const reportLink = `${baseUrl}?data=${encoded}&utm_source=chatgpt&utm_medium=widget`;

            // Get methodology display name
            const preset = ZAKAT_PRESETS[selectedMadhab];
            const methodologyName = preset?.meta?.name || selectedMadhab;

            // Structured content for both ChatGPT narration and widget rendering
            const structuredContent = {
                zakatDue: result.zakatDue,
                totalAssets: result.totalAssets,
                totalLiabilities: result.totalLiabilities,
                netZakatableWealth: result.netZakatableWealth,
                nisab: result.nisab,
                isAboveNisab: result.isAboveNisab,
                methodology: methodologyName,
                methodologyId: selectedMadhab,
                reportLink,
            };

            // Record anonymized event (fire-and-forget, never blocks response)
            recordAnonymousCalculation(getDefaultSessionId(), result.totalAssets, result.zakatDue).catch(() => { });

            // Build methodology notes for the model narration
            const notes: string[] = [];

            // Explain stock rate if methodology uses something other than 100%
            const invRules = preset?.assets?.investments;
            if (invRules?.passive_investments && formData.passiveInvestmentsValue > 0) {
                const rate = invRules.passive_investments.rate;
                const treatment = invRules.passive_investments.treatment;
                if (rate !== 1.0) {
                    const pct = (rate * 100).toFixed(0);
                    const inputVal = formData.passiveInvestmentsValue;
                    const zakatableVal = inputVal * rate;
                    const reason = treatment === 'underlying_assets'
                        ? 'underlying zakatable company assets (AAOIFI proxy)'
                        : treatment === 'income_only'
                            ? 'income/dividends only'
                            : `${pct}% of market value`;
                    notes.push(`${methodologyName} values passive stock investments at ${pct}% (${reason}). Your $${inputVal.toLocaleString()} in stocks counts as $${zakatableVal.toLocaleString()} for Zakat purposes.`);
                }
            }

            const methodologyNote = notes.length > 0
                ? `\nMethodology Notes:\n${notes.map(n => `• ${n}`).join('\n')}\n`
                : '';

            return {
                content: [
                    {
                        type: "text" as const,
                        text: `Zakat Calculation Results:
Total Assets: $${result.totalAssets.toLocaleString()}
Total Liabilities (Deductible): $${result.totalLiabilities.toLocaleString()}
Net Zakatable Wealth: $${result.netZakatableWealth.toLocaleString()}
Nisab Threshold: $${result.nisab.toLocaleString()}
Exceeds Nisab: ${result.isAboveNisab ? 'Yes' : 'No'}
Zakat Due: $${result.zakatDue.toLocaleString()}
Methodology: ${methodologyName}
${methodologyNote}
Full Report: ${reportLink}

Note: ZakatFlow provides calculations based on scholarly methodologies, not fatwas. Consult a qualified scholar for personal rulings.`
                    }
                ],
                structuredContent,
            };
        }
    );
}
