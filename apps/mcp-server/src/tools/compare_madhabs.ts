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
import {
    calculateZakat,
    defaultFormData,
    ZakatFormData,
    ZAKAT_PRESETS,
    AVAILABLE_PRESETS,
} from "@zakatflow/core";
import { WIDGET_URI } from "../widget/template.js";
import { recordAnonymousCalculation, getDefaultSessionId } from "../analytics.js";

const MADHAB_IDS = ['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'qaradawi', 'tahir_anwar'] as const;

export function registerCompareMadhabs(server: McpServer) {
    registerAppTool(
        server,
        "compare_madhabs",
        {
            title: "Compare Methodologies",
            description: "Compare Zakat calculations across 2-4 Islamic jurisprudence methodologies side-by-side. Supports ALL asset categories for accurate comparison. Shows how different schools of thought affect the Zakat obligation for the same financial inputs. NOTE: ZakatFlow provides calculations, not fatwas.",
            annotations: {
                readOnlyHint: true,
                destructiveHint: false,
                openWorldHint: false,
            },
            inputSchema: {
                methodologies: z.array(
                    z.enum(MADHAB_IDS)
                ).min(2).max(4).describe("List of methodology IDs to compare (2-4). Available: bradford, hanafi, shafii, maliki, hanbali, amja, qaradawi, tahir_anwar"),

                // ─── Liquid Assets ───────────────────────────────────────
                cash: z.number().describe("Total liquid cash: checking, savings, cash on hand, digital wallets, foreign currency."),

                // ─── Precious Metals ─────────────────────────────────────
                gold_value: z.number().optional().describe("Value of gold investment (coins, bars, bullion) in USD."),
                gold_jewelry: z.number().optional().describe("Value of wearable gold jewelry in USD (zakatability varies by madhab)."),
                silver_value: z.number().optional().describe("Value of silver investment in USD."),
                silver_jewelry: z.number().optional().describe("Value of wearable silver jewelry in USD."),

                // ─── Crypto ──────────────────────────────────────────────
                crypto: z.number().optional().describe("Value of all cryptocurrency holdings (Bitcoin, Ethereum, etc). 100% zakatable."),
                crypto_trading: z.number().optional().describe("Value of altcoins, NFTs held for active trading."),
                staked_assets: z.number().optional().describe("Principal value of staked crypto."),

                // ─── Investments ─────────────────────────────────────────
                stocks: z.number().optional().describe("Value of stocks, index funds, ETFs, mutual funds."),
                active_trading: z.number().optional().describe("Value of day-trading portfolios or short-term investments."),
                reits: z.number().optional().describe("Value of equity REIT investments."),

                // ─── Retirement ──────────────────────────────────────────
                retirement: z.number().optional().describe("Total vested retirement balance (401k, IRA, Roth combined)."),

                // ─── Trusts ──────────────────────────────────────────────
                revocable_trust: z.number().optional().describe("Value of revocable (living) trusts."),
                irrevocable_trust: z.number().optional().describe("Value of accessible irrevocable trusts."),

                // ─── Real Estate ─────────────────────────────────────────
                real_estate_for_sale: z.number().optional().describe("Market value of property held for sale/flipping."),
                rental_income: z.number().optional().describe("Net rental income in bank."),

                // ─── Business ────────────────────────────────────────────
                business_cash: z.number().optional().describe("Business cash and accounts receivable."),
                business_inventory: z.number().optional().describe("Value of business inventory."),

                // ─── Liabilities ─────────────────────────────────────────
                loans: z.number().optional().describe("Immediate debts (credit cards, bills due now)."),
                monthly_mortgage: z.number().optional().describe("Monthly mortgage payment."),
            },
            _meta: {
                ui: {
                    resourceUri: WIDGET_URI,
                },
            },
        },
        async (params) => {
            const {
                methodologies, cash,
                gold_value, gold_jewelry, silver_value, silver_jewelry,
                crypto, crypto_trading, staked_assets,
                stocks, active_trading, reits,
                retirement,
                revocable_trust, irrevocable_trust,
                real_estate_for_sale, rental_income,
                business_cash, business_inventory,
                loans, monthly_mortgage,
            } = params;

            const comparisons = methodologies.map((madhabId) => {
                const preset = ZAKAT_PRESETS[madhabId];
                if (!preset) {
                    return {
                        methodologyId: madhabId,
                        methodologyName: madhabId,
                        error: `Unknown methodology: ${madhabId}`,
                    };
                }

                const formData: ZakatFormData = {
                    ...defaultFormData,
                    checkingAccounts: cash,
                    goldInvestmentValue: gold_value || 0,
                    goldJewelryValue: gold_jewelry || 0,
                    silverInvestmentValue: silver_value || 0,
                    silverJewelryValue: silver_jewelry || 0,
                    cryptoCurrency: crypto || 0,
                    cryptoTrading: crypto_trading || 0,
                    stakedAssets: staked_assets || 0,
                    hasCrypto: !!(crypto || crypto_trading || staked_assets),
                    passiveInvestmentsValue: (stocks || 0) + (reits || 0),
                    activeInvestments: active_trading || 0,
                    fourOhOneKVestedBalance: retirement || 0,
                    revocableTrustValue: revocable_trust || 0,
                    irrevocableTrustValue: irrevocable_trust || 0,
                    irrevocableTrustAccessible: !!(irrevocable_trust && irrevocable_trust > 0),
                    hasTrusts: !!(revocable_trust || irrevocable_trust),
                    realEstateForSale: real_estate_for_sale || 0,
                    rentalPropertyIncome: rental_income || 0,
                    hasRealEstate: !!(real_estate_for_sale || rental_income),
                    businessCashAndReceivables: business_cash || 0,
                    businessInventory: business_inventory || 0,
                    hasBusiness: !!(business_cash || business_inventory),
                    creditCardBalance: loans || 0,
                    monthlyMortgage: monthly_mortgage || 0,
                    madhab: madhabId,
                    hasPreciousMetals: !!(gold_value || gold_jewelry || silver_value || silver_jewelry),
                };

                const result = calculateZakat(formData);

                return {
                    methodologyId: madhabId,
                    methodologyName: preset.meta.name,
                    description: preset.meta.description,
                    zakatDue: result.zakatDue,
                    totalAssets: result.totalAssets,
                    totalLiabilities: result.totalLiabilities,
                    netZakatableWealth: result.netZakatableWealth,
                    nisab: result.nisab,
                    isAboveNisab: result.isAboveNisab,
                    keyRules: {
                        passiveInvestmentRate: preset.assets?.investments?.passive_investments?.rate ?? 1.0,
                        liabilityMethod: preset.liabilities?.method ?? 'unknown',
                        nisabStandard: preset.thresholds?.nisab?.default_standard ?? 'silver',
                    },
                };
            });

            // Build text summary
            const textLines = comparisons.map((c) => {
                if ('error' in c && c.error) return `${c.methodologyId}: ${c.error}`;
                return `${c.methodologyName}:
  Zakat Due: $${c.zakatDue?.toLocaleString()}
  Net Zakatable: $${c.netZakatableWealth?.toLocaleString()}
  Nisab: $${c.nisab?.toLocaleString()} (${c.keyRules?.nisabStandard})
  Investment Rate: ${((c.keyRules?.passiveInvestmentRate ?? 1) * 100)}%
  Liability Method: ${c.keyRules?.liabilityMethod}`;
            });

            // Record anonymized event using first valid result (fire-and-forget)
            const firstValid = comparisons.find(c => !('error' in c && c.error) && c.totalAssets !== undefined);
            if (firstValid && firstValid.totalAssets !== undefined && firstValid.zakatDue !== undefined) {
                recordAnonymousCalculation(getDefaultSessionId(), firstValid.totalAssets, firstValid.zakatDue).catch(() => { });
            }

            return {
                content: [
                    {
                        type: "text" as const,
                        text: `Methodology Comparison:\n\n${textLines.join('\n\n')}\n\nNote: ZakatFlow provides calculations based on scholarly methodologies, not fatwas. Consult a qualified scholar for personal rulings.`
                    }
                ],
                structuredContent: {
                    type: 'comparison',
                    comparisons,
                },
            };
        }
    );
}
