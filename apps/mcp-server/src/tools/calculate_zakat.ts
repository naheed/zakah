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

export function registerCalculateZakat(server: McpServer) {
    registerAppTool(
        server,
        "calculate_zakat",
        {
            description: "Calculate Zakat obligation based on Islamic jurisprudence. Returns structured calculation data rendered as an interactive widget. NOTE: ZakatFlow provides calculations, not fatwas. Users should consult a qualified scholar for personal rulings.",
            inputSchema: {
                cash: z.number().describe("Total cash assets (checking, savings, cash on hand)."),
                gold_value: z.number().optional().describe("Value of gold investment/jewelry in USD."),
                gold_grams: z.number().optional().describe("Weight of gold in grams (will be converted if value is missing)."),
                silver_value: z.number().optional().describe("Value of silver investment/jewelry in USD."),
                silver_grams: z.number().optional().describe("Weight of silver in grams (will be converted if value is missing)."),
                short_term_investments: z.number().optional().describe("Value of active trading assets or short-term investments (100% zakatable)."),
                long_term_investments: z.number().optional().describe("Value of long-term passive hold assets (stocks, funds) - subject to 30% proxy rule."),
                retirement_total: z.number().optional().describe("Total vested balance of retirement accounts (401k, IRA)."),
                age: z.number().optional().describe("User's age (crucial for retirement exemption rules). Defaults to 30 if not provided."),
                loans: z.number().optional().describe("Start with 0. ONLY include immediate debts due NOW (credit cards, bills, past due). DO NOT include long-term mortgage/student loan balances here."),
                monthly_mortgage: z.number().optional().describe("Monthly payment for primary residence mortgage (deductible for 12 months)."),
                madhab: z.enum(['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'qaradawi']).optional().describe("School of thought for calculation rules."),
            },
            _meta: {
                ui: {
                    resourceUri: WIDGET_URI,
                },
            },
        },
        async ({ cash, gold_value, gold_grams, silver_value, silver_grams, short_term_investments, long_term_investments, retirement_total, age, loans, monthly_mortgage, madhab }) => {
            // Helper for gram conversion if value is missing
            const goldVal = gold_value || (gold_grams ? (gold_grams * (2650 / 31.1035)) : 0);
            const silverVal = silver_value || (silver_grams ? (silver_grams * (24.50 / 31.1035)) : 0);

            const selectedMadhab = madhab || 'bradford';

            // Construct ZakatFormData from inputs
            const formData: ZakatFormData = {
                ...defaultFormData,
                checkingAccounts: cash,
                goldInvestmentValue: goldVal,
                silverInvestmentValue: silverVal,
                activeInvestments: short_term_investments || 0,
                passiveInvestmentsValue: long_term_investments || 0,
                fourOhOneKVestedBalance: retirement_total || 0,
                age: age || 30,
                creditCardBalance: loans || 0,
                monthlyMortgage: monthly_mortgage || 0,
                madhab: selectedMadhab,
            };

            const result = calculateZakat(formData);

            // Generate deep-link for full report
            const isDev = process.env.NODE_ENV === 'development';
            const baseUrl = process.env.CLIENT_URL || (isDev ? 'http://localhost:8080' : 'https://zakatflow.org');
            const encoded = btoa(JSON.stringify(formData));
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

Full Report: ${reportLink}

Note: ZakatFlow provides calculations based on scholarly methodologies, not fatwas. Consult a qualified scholar for personal rulings.`
                    }
                ],
                structuredContent,
            };
        }
    );
}
