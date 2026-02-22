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
    GOLD_PRICE_PER_OUNCE,
    SILVER_PRICE_PER_OUNCE,
    GRAMS_PER_OUNCE
} from "@zakatflow/core";

export function registerMarketTools(server: McpServer) {
    server.tool(
        "get_market_prices",
        "Get current gold and silver market prices used for Nisab threshold calculations.",
        {
            currency: z.string().default("USD").describe("Currency to return prices in (Currently only USD supported).")
        },
        {
            title: "Get Market Prices",
            readOnlyHint: true,
            destructiveHint: false,
            openWorldHint: false,
        },
        async () => {
            const goldPerGram = GOLD_PRICE_PER_OUNCE / GRAMS_PER_OUNCE;
            const silverPerGram = SILVER_PRICE_PER_OUNCE / GRAMS_PER_OUNCE;

            return {
                content: [
                    {
                        type: "text",
                        text: `Current Market Prices (Mock/Default):
Gold: $${goldPerGram.toFixed(2)}/gram ($${GOLD_PRICE_PER_OUNCE.toFixed(2)}/oz)
Silver: $${silverPerGram.toFixed(2)}/gram ($${SILVER_PRICE_PER_OUNCE.toFixed(2)}/oz)
Grams per Ounce: ${GRAMS_PER_OUNCE}
Note: These are baseline prices used for Nisab calculation.`
                    }
                ]
            };
        }
    );
}
