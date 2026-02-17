import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
    bradfordAgent,
    amjaAgent,
    tahirAnwarAgent,
    qaradawiAgent,
    hanafiAgent,
    shafiiAgent,
    malikiAgent,
    hanbaliAgent
} from "@zakatflow/core";

export function registerAgentProtocol(mcp: McpServer) {
    mcp.tool(
        "get_agent_protocol",
        {
            methodology_id: z.string().describe("The ID of the Zakat methodology (e.g., 'bradford', 'amja', 'tahir-anwar-hanafi-v2')")
        },
        async ({ methodology_id }: { methodology_id: string }) => {
            let protocol;

            switch (methodology_id) {
                case 'bradford':
                    protocol = bradfordAgent;
                    break;
                case 'amja':
                case 'amja-standard-v2':
                    protocol = amjaAgent;
                    break;
                case 'tahir_anwar':
                case 'tahir-anwar-hanafi-v2':
                    protocol = tahirAnwarAgent;
                    break;
                case 'qaradawi':
                case 'qaradawi-fiqh-alzakah-v1':
                    protocol = qaradawiAgent;
                    break;
                case 'hanafi':
                case 'hanafi-standard-v2':
                    protocol = hanafiAgent;
                    break;
                case 'shafii':
                case 'shafii-standard-v2':
                    protocol = shafiiAgent;
                    break;
                case 'maliki':
                case 'maliki-standard-v2':
                    protocol = malikiAgent;
                    break;
                case 'hanbali':
                case 'hanbali-standard-v2':
                    protocol = hanbaliAgent;
                    break;
                default:
                    // Return bradford as safe default, or error
                    // For now, let's return a helpful error so the agent knows to retry or stick to defaults
                    return {
                        content: [{
                            type: "text",
                            text: `Protocol not found for ID: ${methodology_id}. Available: bradford, amja, tahir-anwar-hanafi-v2, qaradawi-fiqh-alzakah-v1`
                        }]
                    };
            }

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(protocol, null, 2)
                }]
            };
        }
    );
}
