import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { referralCode, sessionHash } = await req.json();

    // Validate at least one identifier is provided
    if (!referralCode && !sessionHash) {
      return new Response(
        JSON.stringify({ error: "Either referralCode or sessionHash is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    let query = supabase
      .from("referral_aggregates")
      .select("referral_code, total_referrals, total_zakat_calculated, total_assets_calculated");

    if (referralCode) {
      query = query.eq("referral_code", referralCode);
    } else if (sessionHash) {
      query = query.eq("referrer_session_hash", sessionHash);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Error fetching referral stats:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch referral stats" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({
          referralCode: null,
          totalReferrals: 0,
          totalZakatCalculated: 0,
          totalAssetsCalculated: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetched referral stats:", data);
    return new Response(
      JSON.stringify({
        referralCode: data.referral_code,
        totalReferrals: data.total_referrals,
        totalZakatCalculated: data.total_zakat_calculated,
        totalAssetsCalculated: data.total_assets_calculated,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in get-referral-stats:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
