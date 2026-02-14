import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GOLD_API_URL = "https://www.freegoldapi.com/data/gold_silver_ratio_enriched.csv";

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { mode = "daily" } = await req.json().catch(() => ({}));

        let csvText = "";

        if (mode === "backfill") {
            console.log("Starting backfill mode...");
            const response = await fetch(GOLD_API_URL);
            if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.statusText}`);
            csvText = await response.text();
        } else {
            console.log("Starting daily mode...");
            // Fetch the last 2KB to ensure we get the latest line
            const response = await fetch(GOLD_API_URL, {
                headers: { "Range": "bytes=-2048" }
            });

            // If range request fails (e.g. server doesn't support it), fall back to full fetch?
            // freegoldapi.com (GitHub Pages) supports Range.
            if (response.status === 206 || response.status === 200) {
                csvText = await response.text();
            } else {
                throw new Error(`Failed to fetch CSV tail: ${response.status} ${response.statusText}`);
            }
        }

        const lines = csvText.trim().split("\n");
        // If we fetched tail, the first line might be incomplete. Skip it.
        // If we fetched full, the first line is header. Skip it.
        const startingIndex = mode === "backfill" ? 1 : 1;

        // Parse lines
        const updates = [];

        // Process form end to start to find latest easier?
        // For backfill, we want everything (or last 1000).
        // For daily, we want the very last line.

        // We filter valid lines (date, price, currency, ratio)
        // Structure: date,price,currency,silver_oz_per_gold_oz

        const relevantLines = lines.filter(line => {
            const parts = line.split(",");
            return parts.length >= 4 && parts[0].match(/^\d{4}-\d{2}-\d{2}$/);
        });

        // If backfill, take last 1000.
        const linesToProcess = mode === "backfill" ? relevantLines.slice(-1000) : [relevantLines[relevantLines.length - 1]];

        for (const line of linesToProcess) {
            if (!line) continue;
            const [date, goldPriceStr, currency, ratioStr] = line.split(",");

            const goldPrice = parseFloat(goldPriceStr);
            const ratio = parseFloat(ratioStr);

            if (isNaN(goldPrice) || isNaN(ratio)) continue;

            const silverPrice = goldPrice / ratio;

            updates.push({
                date,
                gold_price: goldPrice,
                silver_price: silverPrice,
                currency: currency || 'USD',
                meta: { source: 'freegoldapi', ratio }
            });
        }

        if (updates.length > 0) {
            const { error } = await supabaseClient
                .from("nisab_values")
                .upsert(updates, { onConflict: "date" });

            if (error) throw error;
        }

        return new Response(
            JSON.stringify({ success: true, processed: updates.length, latest: updates[updates.length - 1] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
