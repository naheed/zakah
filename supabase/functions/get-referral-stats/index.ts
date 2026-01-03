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

    // Use the recursive RPC function to get total stats
    const { data: stats, error: statsError } = await supabase.rpc(
      'get_recursive_referral_stats',
      {
        p_referral_code: referralCode,
        p_session_hash: sessionHash
      }
    );

    if (statsError) {
      console.error("Error fetching referral stats:", statsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch referral stats" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also get the referral code if we only have session hash (for UI display)
    let finalReferralCode = referralCode;
    if (!finalReferralCode && sessionHash) {
      const { data: codeData } = await supabase
        .from("referral_aggregates")
        .select("referral_code")
        .eq("referrer_session_hash", sessionHash)
        .maybeSingle();

      if (codeData) {
        finalReferralCode = codeData.referral_code;
      }
    }

    // The RPC returns an array of rows (even though it's just one row)
    const data = stats && stats.length > 0 ? stats[0] : null;



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
        referralCode: finalReferralCode,
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