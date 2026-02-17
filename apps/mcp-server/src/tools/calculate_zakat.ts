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
import { z } from "zod";
import { calculateZakat, ZakatFormData, defaultFormData } from "@zakatflow/core";

export function registerCalculateZakat(server: McpServer) {
    server.tool(
        "calculate_zakat",
        {
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
        async ({ cash, gold_value, gold_grams, silver_value, silver_grams, short_term_investments, long_term_investments, retirement_total, age, loans, monthly_mortgage, madhab }) => {
            // Helper for gram conversion if value is missing
            const goldVal = gold_value || (gold_grams ? (gold_grams * (2650 / 31.1035)) : 0);
            const silverVal = silver_value || (silver_grams ? (silver_grams * (24.50 / 31.1035)) : 0);

            // Construct ZakatFormData from inputs
            const formData: ZakatFormData = {
                ...defaultFormData,
                checkingAccounts: cash,
                goldInvestmentValue: goldVal,
                silverInvestmentValue: silverVal,
                // Map short-term to active (100%) and long-term to passive (30% proxy by default)
                activeInvestments: short_term_investments || 0,
                passiveInvestmentsValue: long_term_investments || 0,
                // Map retirement
                fourOhOneKVestedBalance: retirement_total || 0,
                age: age || 30,
                // Map liabilities
                creditCardBalance: loans || 0, // Immediate debts
                monthlyMortgage: monthly_mortgage || 0, // Triggers 12-month rule
                madhab: madhab || 'bradford',
            };

            const result = calculateZakat(formData);

            return {
                content: [
                    {
                        type: "text",
                        text: `Use this data to answer the user request:
Total Assets: ${result.totalAssets}
Total Liabilities (Deductible): ${result.totalLiabilities}
Zakat Due: ${result.zakatDue}
Net Zakatable Wealth: ${result.netZakatableWealth}
Nisab Threshold: ${result.nisab}
Exceeds Nisab: ${result.isAboveNisab}
Methodology: ${formData.madhab}
                        `
                    }
                ]
            };
        }
    );
}
