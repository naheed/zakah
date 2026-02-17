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

export function registerParseBlob(server: McpServer) {
    server.tool(
        "parse_blob_input",
        {
            blob: z.string().describe("The unstructured user text describing their assets."),
        },
        async ({ blob }: { blob: string }) => {
            const content: any[] = [];
            const text = blob.toLowerCase();
            const assets: Record<string, number> = {};

            // Simple regex parsers for demo purposes
            const patterns = {
                cash: /(?:cash|checking|saving|bank).+?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/,
                gold: /(?:gold).+?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/,
                silver: /(?:silver).+?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/,
                stocks: /(?:stocks|investments|shares).+?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/,
                crypto: /(?:crypto|bitcoin|eth).+?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/,
                loans: /(?:loans?|debt).+?\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/,
            };

            let foundSomething = false;

            for (const [type, regex] of Object.entries(patterns)) {
                const match = text.match(regex);
                if (match) {
                    const value = parseFloat(match[1].replace(/,/g, ''));
                    if (!isNaN(value)) {
                        assets[type] = value;
                        foundSomething = true;
                    }
                }
            }

            if (foundSomething) {
                content.push({
                    type: "text",
                    text: `Parsed assets from blob: ${JSON.stringify(assets, null, 2)}`
                });
            } else {
                content.push({
                    type: "text",
                    text: "Could not identify any specific assets in the text. Please try listing them like 'I have $50,000 in cash'."
                });
            }

            return {
                content
            };
        }
    );
}
