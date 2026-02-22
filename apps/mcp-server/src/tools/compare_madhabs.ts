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
            description: "Compare Zakat calculations across 2-3 Islamic jurisprudence methodologies side-by-side. Shows how different schools of thought affect the Zakat obligation for the same financial inputs. NOTE: ZakatFlow provides calculations, not fatwas.",
            inputSchema: {
                methodologies: z.array(
                    z.enum(MADHAB_IDS)
                ).min(2).max(4).describe("List of methodology IDs to compare (2-4). Available: bradford, hanafi, shafii, maliki, hanbali, amja, qaradawi, tahir_anwar"),
                cash: z.number().describe("Total cash assets (checking, savings, cash on hand)."),
                gold_value: z.number().optional().describe("Value of gold in USD."),
                stocks: z.number().optional().describe("Value of long-term passive investments."),
                retirement: z.number().optional().describe("Total vested retirement balance."),
                loans: z.number().optional().describe("Immediate debts (credit cards, bills due now)."),
            },
            _meta: {
                ui: {
                    resourceUri: WIDGET_URI,
                },
            },
        },
        async ({ methodologies, cash, gold_value, stocks, retirement, loans }) => {
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
                    passiveInvestmentsValue: stocks || 0,
                    fourOhOneKVestedBalance: retirement || 0,
                    creditCardBalance: loans || 0,
                    madhab: madhabId,
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
