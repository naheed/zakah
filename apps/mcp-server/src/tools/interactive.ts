import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SessionStore } from "../session/store.js";
import { calculateZakat } from "@zakatflow/core";

export function registerInteractiveTools(server: McpServer) {
    // Tool to start a session
    server.tool(
        "start_session",
        {},
        async () => {
            const session = SessionStore.create();
            return {
                content: [{ type: "text", text: `Session started. ID: ${session.id}` }],
                _meta: { widgetSessionId: session.id }
            };
        }
    );

    // Tool to add assets
    server.tool(
        "add_asset",
        {
            sessionId: z.string().describe("The widget session ID received from previous turns."),
            assetType: z.enum(['cash', 'gold', 'silver', 'stocks', 'retirement', 'loans']),
            amount: z.number().describe("The value or amount of the asset."),
        },
        async ({ sessionId, assetType, amount }) => {
            const session = SessionStore.get(sessionId);
            if (!session) {
                return {
                    content: [{ type: "text", text: "Session not found. Please start a new session." }],
                    isError: true
                };
            }

            // Map asset type to form data keys
            const updates: Partial<typeof session.formData> = {};
            switch (assetType) {
                case 'cash': updates.checkingAccounts = (session.formData.checkingAccounts || 0) + amount; break;
                case 'gold': updates.goldInvestmentValue = (session.formData.goldInvestmentValue || 0) + amount; break;
                case 'silver': updates.silverInvestmentValue = (session.formData.silverInvestmentValue || 0) + amount; break;
                case 'stocks': updates.activeInvestments = (session.formData.activeInvestments || 0) + amount; break;
                case 'retirement': updates.traditionalIRABalance = (session.formData.traditionalIRABalance || 0) + amount; break;
                case 'loans': updates.unpaidBills = (session.formData.unpaidBills || 0) + amount; break;
            }

            const updatedSession = SessionStore.update(sessionId, updates);
            if (!updatedSession) {
                return {
                    content: [{ type: "text", text: "Failed to update session." }],
                    isError: true
                };
            }

            const calculation = calculateZakat(updatedSession.formData);

            return {
                content: [{
                    type: "text",
                    text: `Updated ${assetType} by adding $${amount}. New Zakat Due: $${calculation.zakatDue.toFixed(2)}`
                }],
                _meta: {
                    widgetSessionId: sessionId,
                }
            };
        }
    );
}
