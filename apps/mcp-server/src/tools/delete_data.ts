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
import { getSupabaseAdmin } from "../supabase.js";

export function registerDeleteData(server: McpServer) {
    server.tool(
        "delete_my_data",
        "Permanently delete all your ZakatFlow data associated with your ChatGPT account. This removes your user record and all saved calculation sessions. Anonymized analytics (rounded totals with no identifying information) are retained as disclosed in our Privacy Policy §4a.3. This action is IRREVERSIBLE.",
        {
            chatgpt_user_id: z.string().describe("Your ChatGPT user ID (provided by OpenAI). Ask the user to confirm their identity before proceeding."),
            confirm: z.boolean().describe("Must be true to execute deletion. Set to false to preview what would be deleted without actually deleting."),
        },
        async (params) => {
            const { chatgpt_user_id, confirm } = params;

            const supabase = getSupabaseAdmin();
            if (!supabase) {
                return {
                    content: [{
                        type: "text" as const,
                        text: "Data deletion is not available at this time (database not configured). Please contact privacy@vora.dev for manual deletion."
                    }]
                };
            }

            // Look up user
            const { data: user, error: findError } = await supabase
                .from('chatgpt_users')
                .select('id, chatgpt_user_id, created_at')
                .eq('chatgpt_user_id', chatgpt_user_id)
                .maybeSingle();

            if (findError) {
                return {
                    content: [{
                        type: "text" as const,
                        text: `Error looking up your data: ${findError.message}. Please try again or contact privacy@vora.dev.`
                    }]
                };
            }

            if (!user) {
                return {
                    content: [{
                        type: "text" as const,
                        text: `No data found for ChatGPT user ID "${chatgpt_user_id}". You may not have any stored data with ZakatFlow, or the ID may be incorrect. No action was taken.`
                    }]
                };
            }

            // Count sessions for preview/summary
            const { count: sessionCount } = await supabase
                .from('chatgpt_sessions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            const sessionsFound = sessionCount || 0;

            // Preview mode — don't delete
            if (!confirm) {
                return {
                    content: [{
                        type: "text" as const,
                        text: `📋 **Data Deletion Preview** (no data was deleted)\n\nFound the following data for your ChatGPT account:\n- **1 user record** (created ${user.created_at})\n- **${sessionsFound} calculation session(s)**\n\nTo proceed with permanent deletion, call this tool again with \`confirm: true\`.\n\n⚠️ This action is irreversible. Anonymized analytics (rounded totals) will be retained per our Privacy Policy §4a.3 as they contain no personally identifiable information.`
                    }]
                };
            }

            // Execute deletion — sessions first (FK dependency), then user
            const { error: deleteSessionsError } = await supabase
                .from('chatgpt_sessions')
                .delete()
                .eq('user_id', user.id);

            if (deleteSessionsError) {
                return {
                    content: [{
                        type: "text" as const,
                        text: `Error deleting sessions: ${deleteSessionsError.message}. Please contact privacy@vora.dev for assistance.`
                    }]
                };
            }

            const { error: deleteUserError } = await supabase
                .from('chatgpt_users')
                .delete()
                .eq('id', user.id);

            if (deleteUserError) {
                return {
                    content: [{
                        type: "text" as const,
                        text: `Sessions deleted but error removing user record: ${deleteUserError.message}. Please contact privacy@vora.dev to complete the deletion.`
                    }]
                };
            }

            return {
                content: [{
                    type: "text" as const,
                    text: `✅ **Data Deletion Complete**\n\nThe following data has been permanently deleted:\n- **1 user record** for ChatGPT user "${chatgpt_user_id}"\n- **${sessionsFound} calculation session(s)**\n\nAnonymized aggregate analytics (rounded asset/Zakat totals with no identifying information) are retained per our Privacy Policy §4a.3.\n\nIf you use ZakatFlow again through ChatGPT, a new user record will be created automatically.`
                }]
            };
        }
    );
}
