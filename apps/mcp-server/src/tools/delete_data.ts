/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { callGateway, isGatewayConfigured } from "../gateway.js";

export function registerDeleteData(server: McpServer) {
    server.tool(
        "delete_my_data",
        "Permanently delete all your ZakatFlow data associated with your ChatGPT account. This removes your user record and all saved calculation sessions. Anonymized analytics (rounded totals with no identifying information) are retained as disclosed in our Privacy Policy §4a.3. This action is IRREVERSIBLE.",
        {
            chatgpt_user_id: z.string().describe("Your ChatGPT user ID (provided by OpenAI). Ask the user to confirm their identity before proceeding."),
            confirm: z.boolean().describe("Must be true to execute deletion. Set to false to preview what would be deleted without actually deleting."),
        },
        {
            title: "Delete My Data",
            readOnlyHint: false,
            destructiveHint: true,
            openWorldHint: false,
        },
        async (params) => {
            const { chatgpt_user_id, confirm } = params;

            if (!isGatewayConfigured()) {
                return {
                    content: [{
                        type: "text" as const,
                        text: "Data deletion is not available at this time (gateway not configured). Please contact privacy@vora.dev for manual deletion."
                    }]
                };
            }

            // Preview mode — check if user exists via gateway
            let userData: { deleted?: boolean; reason?: string; user_id?: string } | null = null;
            try {
                // Use find_or_create_user to check existence (it won't create if user exists)
                const user = await callGateway<{ id: string; created_at: string }>('find_or_create_user', {
                    chatgpt_user_id,
                });

                if (!user) {
                    return {
                        content: [{
                            type: "text" as const,
                            text: `No data found for ChatGPT user ID "${chatgpt_user_id}". You may not have any stored data with ZakatFlow, or the ID may be incorrect. No action was taken.`
                        }]
                    };
                }

                // Get session count for preview
                let sessionCount = 0;
                try {
                    const sessions = await callGateway<unknown[]>('get_sessions', {
                        user_id: user.id,
                        limit: 50,
                    });
                    sessionCount = sessions?.length || 0;
                } catch {
                    // Ignore — session count is informational
                }

                // Preview mode
                if (!confirm) {
                    return {
                        content: [{
                            type: "text" as const,
                            text: `📋 **Data Deletion Preview** (no data was deleted)\n\nFound the following data for your ChatGPT account:\n- **1 user record** (created ${user.created_at})\n- **${sessionCount} calculation session(s)**\n\nTo proceed with permanent deletion, call this tool again with \`confirm: true\`.\n\n⚠️ This action is irreversible. Anonymized analytics (rounded totals) will be retained per our Privacy Policy §4a.3 as they contain no personally identifiable information.`
                        }]
                    };
                }

                // Execute deletion via gateway
                userData = await callGateway<{ deleted: boolean; user_id: string }>('delete_user_data', {
                    chatgpt_user_id,
                });

                if (userData?.deleted) {
                    return {
                        content: [{
                            type: "text" as const,
                            text: `✅ **Data Deletion Complete**\n\nThe following data has been permanently deleted:\n- **1 user record** for ChatGPT user "${chatgpt_user_id}"\n- **${sessionCount} calculation session(s)**\n\nAnonymized aggregate analytics (rounded asset/Zakat totals with no identifying information) are retained per our Privacy Policy §4a.3.\n\nIf you use ZakatFlow again through ChatGPT, a new user record will be created automatically.`
                        }]
                    };
                } else {
                    return {
                        content: [{
                            type: "text" as const,
                            text: `No data found for ChatGPT user ID "${chatgpt_user_id}". No action was taken.`
                        }]
                    };
                }

            } catch (e) {
                return {
                    content: [{
                        type: "text" as const,
                        text: `Error during data deletion: ${(e as Error).message}. Please try again or contact privacy@vora.dev.`
                    }]
                };
            }
        }
    );
}
