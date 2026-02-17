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
            stocks: z.number().optional().describe("Total value of stock investments."),
            retirement: z.number().optional().describe("Total value of retirement accounts (401k, IRA)."),
            loans: z.number().optional().describe("Value of loans/debts owed."),
            madhab: z.enum(['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'qaradawi']).optional().describe("School of thought for calculation rules."),
        },
        async ({ cash, gold_value, gold_grams, silver_value, silver_grams, stocks, retirement, loans, madhab }) => {
            // Helper for gram conversion if value is missing
            const goldVal = gold_value || (gold_grams ? (gold_grams * (2650 / 31.1035)) : 0);
            const silverVal = silver_value || (silver_grams ? (silver_grams * (24.50 / 31.1035)) : 0);

            // Construct ZakatFormData from inputs
            const formData: ZakatFormData = {
                ...defaultFormData,
                checkingAccounts: cash,
                goldInvestmentValue: goldVal,
                silverInvestmentValue: silverVal,
                passiveInvestmentsValue: stocks || 0,
                fourOhOneKVestedBalance: retirement || 0,
                creditCardBalance: loans || 0,
                madhab: madhab || 'bradford',
            };

            const result = calculateZakat(formData);

            return {
                content: [
                    {
                        type: "text",
                        text: `Use this data to answer the user request:
Total Assets: ${result.totalAssets}
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
