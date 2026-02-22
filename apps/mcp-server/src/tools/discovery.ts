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
import {
    ZAKAT_PRESETS,
    calculateNisab,
    GOLD_PRICE_PER_OUNCE,
    SILVER_PRICE_PER_OUNCE,
    GRAMS_PER_OUNCE,
    AVAILABLE_PRESETS
} from "@zakatflow/core";

export function registerDiscoveryTools(server: McpServer) {
    // 1. List Methodologies
    server.tool(
        "list_methodologies",
        "List all available Zakat calculation methodologies supported by ZakatFlow.",
        {},
        {
            title: "List Methodologies",
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: false,
        },
        async () => {
            const list = AVAILABLE_PRESETS.map(p => ({
                id: p.meta.id,
                name: p.meta.name,
                description: p.meta.description,
                default_nisab: p.thresholds.nisab.default_standard
            }));

            return {
                content: [{
                    type: "text",
                    text: `Available Zakat Methodologies:\n${JSON.stringify(list, null, 2)}`
                }]
            };
        }
    );

    // 2. Get Nisab Info
    server.tool(
        "get_nisab_info",
        "Get the current Nisab threshold for a specific methodology.",
        {
            methodology_id: z.string().optional().describe("ID of the methodology to check. Defaults to 'bradford'."),
        },
        {
            title: "Get Nisab Info",
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: false,
        },
        async ({ methodology_id }) => {
            const preset = ZAKAT_PRESETS[methodology_id || 'bradford'] || ZAKAT_PRESETS['bradford'];
            const standard = preset.thresholds.nisab.default_standard;

            const nisabValue = calculateNisab(SILVER_PRICE_PER_OUNCE, GOLD_PRICE_PER_OUNCE, standard as any);

            return {
                content: [{
                    type: "text",
                    text: `Nisab Information for ${preset.meta.name}:
- Standard: ${standard.toUpperCase()}
- Current Value: $${nisabValue.toFixed(2)} USD
- Grams Required: ${standard === 'gold' ? preset.thresholds.nisab.gold_grams : preset.thresholds.nisab.silver_grams}g
- Market Data: Gold ~$${GOLD_PRICE_PER_OUNCE}/oz, Silver ~$${SILVER_PRICE_PER_OUNCE}/oz`
                }]
            };
        }
    );
}
