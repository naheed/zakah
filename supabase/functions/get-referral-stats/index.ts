import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/domainConfig.ts";

// Privacy threshold: minimum referrals before showing financial stats
// This prevents deanonymization of individual users' financial data
const PRIVACY_THRESHOLD = 5;

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

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

    // Validate input lengths
    if (referralCode && (typeof referralCode !== "string" || referralCode.length > 20)) {
      return new Response(
        JSON.stringify({ error: "Invalid referral code" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (sessionHash && (typeof sessionHash !== "string" || sessionHash.length !== 64)) {
      return new Response(
        JSON.stringify({ error: "Invalid session hash" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role to bypass RLS
    // RLS blocks direct access; this function validates sessionHash before returning data
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
          totalZakatCalculated: null,
          totalAssetsCalculated: null,
          thresholdMet: false,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const thresholdMet = data.total_referrals >= PRIVACY_THRESHOLD;
    
    console.log("Fetched referral stats:", { 
      ...data, 
      thresholdMet,
      privacyThreshold: PRIVACY_THRESHOLD 
    });
    
    return new Response(
      JSON.stringify({
        referralCode: data.referral_code,
        totalReferrals: data.total_referrals,
        // Only reveal financial stats if privacy threshold is met
        totalZakatCalculated: thresholdMet ? data.total_zakat_calculated : null,
        totalAssetsCalculated: thresholdMet ? data.total_assets_calculated : null,
        thresholdMet,
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