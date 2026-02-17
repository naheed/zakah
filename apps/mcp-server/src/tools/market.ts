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
        {
            currency: z.string().default("USD").describe("Currency to return prices in (Currently only USD supported).")
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
