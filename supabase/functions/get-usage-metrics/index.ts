import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "public, max-age=3600", // 1 hour cache
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with anon key (public read)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = today.substring(0, 7);
    const currentYear = today.substring(0, 4);

    // Fetch all relevant aggregates
    const { data: aggregates, error } = await supabase
      .from("zakat_usage_aggregates")
      .select("*")
      .in("period_type", ["all_time", "monthly", "yearly"])
      .in("period_value", ["all", currentMonth, currentYear]);

    if (error) {
      console.error("Error fetching aggregates:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch metrics" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format response
    const formatPeriod = (periodType: string, periodValue: string) => {
      const found = aggregates?.find(
        (a) => a.period_type === periodType && a.period_value === periodValue
      );
      return {
        calculations: found?.calculation_count || 0,
        totalAssets: found?.total_assets || 0,
        totalZakat: found?.total_zakat || 0,
        uniqueSessions: found?.unique_sessions || 0,
      };
    };

    const response = {
      allTime: formatPeriod("all_time", "all"),
      currentMonth: formatPeriod("monthly", currentMonth),
      currentYear: formatPeriod("yearly", currentYear),
      lastUpdated: new Date().toISOString(),
    };

    console.log("Returning metrics:", response);
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in get-usage-metrics:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
