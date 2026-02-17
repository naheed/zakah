import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { defaultFormData, ZakatFormData } from "@zakatflow/core";

export function registerReportingTools(server: McpServer) {
    server.tool(
        "create_report_link",
        {
            cash: z.number().optional(),
            gold_value: z.number().optional(),
            silver_value: z.number().optional(),
            stocks: z.number().optional(),
            retirement: z.number().optional(),
            loans: z.number().optional(),
            madhab: z.enum(['bradford', 'hanafi', 'shafii', 'maliki', 'hanbali', 'amja', 'qaradawi']).optional(),
        },
        async ({ cash, gold_value, silver_value, stocks, retirement, loans, madhab }) => {

            // Reconstruct the form data (Simplified mapping)
            // Ideally we would accept the full JSON blob from the agent, but this is safer for now.
            const formData: ZakatFormData = {
                ...defaultFormData,
                checkingAccounts: cash || 0,
                goldInvestmentValue: gold_value || 0,
                silverInvestmentValue: silver_value || 0,
                passiveInvestmentsValue: stocks || 0,
                fourOhOneKVestedBalance: retirement || 0,
                creditCardBalance: loans || 0,
                madhab: madhab || 'bradford',
            };

            // Base64 Encode
            const jsonString = JSON.stringify(formData);
            const encoded = btoa(jsonString);

            // Construct Link
            // In dev: http://localhost:8080 or http://localhost:5173 
            // In prod: https://zakatflow.org
            const isDev = process.env.NODE_ENV === 'development';
            const baseUrl = process.env.CLIENT_URL || (isDev ? 'http://localhost:8080' : 'https://zakatflow.org');
            const link = `${baseUrl}?data=${encoded}`;

            return {
                content: [{
                    type: "text",
                    text: `Here is your **ZakatFlow Official Report**:
[View Full Breakdown](${link})

*Note: This link contains your calculation data. You can save or print it from the website.*`
                }]
            };
        }
    );
}
