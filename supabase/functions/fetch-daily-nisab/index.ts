import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/domainConfig.ts";

const GOLD_API_URL = "https://www.freegoldapi.com/data/gold_silver_ratio_enriched.csv";

serve(async (req) => {
    const origin = req.headers.get("origin");
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
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
            const response = await fetch(GOLD_API_URL, {
                headers: { "Range": "bytes=-2048" }
            });

            if (response.status === 206 || response.status === 200) {
                csvText = await response.text();
            } else {
                throw new Error(`Failed to fetch CSV tail: ${response.status} ${response.statusText}`);
            }
        }

        const lines = csvText.trim().split("\n");

        const relevantLines = lines.filter(line => {
            const parts = line.split(",");
            return parts.length >= 4 && parts[0].match(/^\d{4}-\d{2}-\d{2}$/);
        });

        const linesToProcess = mode === "backfill" ? relevantLines.slice(-1000) : [relevantLines[relevantLines.length - 1]];

        // Use a Map to deduplicate by date (last entry wins)
        const updateMap = new Map();

        for (const line of linesToProcess) {
            if (!line) continue;
            const [date, goldPriceStr, currency, ratioStr] = line.split(",");

            const goldPrice = parseFloat(goldPriceStr);
            const ratio = parseFloat(ratioStr);

            if (isNaN(goldPrice) || isNaN(ratio)) continue;

            const silverPrice = goldPrice / ratio;

            updateMap.set(date, {
                date,
                gold_price: goldPrice,
                silver_price: silverPrice,
                currency: currency || 'USD',
                meta: { source: 'freegoldapi', ratio }
            });
        }

        const updates = Array.from(updateMap.values());

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

    } catch (error: unknown) {
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
