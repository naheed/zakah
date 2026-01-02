import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/domainConfig.ts";

// Generate a short, URL-safe referral code
function generateCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  for (let i = 0; i < 8; i++) {
    code += chars[array[i] % chars.length];
  }
  return code;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionHash, userId } = await req.json();

    // Validate session hash
    if (!sessionHash || typeof sessionHash !== "string" || sessionHash.length !== 64) {
      console.error("Invalid session hash format");
      return new Response(
        JSON.stringify({ error: "Invalid session hash" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for writes
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // PRIORITY 1: Check if this USER already has a referral code (logged-in users)
    if (userId) {
      const { data: userAggregate } = await supabase
        .from("referral_aggregates")
        .select("referral_code")
        .eq("referrer_user_id", userId)
        .maybeSingle();

      if (userAggregate) {
        console.log("Found existing referral code for user:", userAggregate.referral_code);
        return new Response(
          JSON.stringify({ code: userAggregate.referral_code }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // PRIORITY 2: Check if this SESSION already has a referral code (anonymous users)
    const { data: existingAggregate } = await supabase
      .from("referral_aggregates")
      .select("referral_code")
      .eq("referrer_session_hash", sessionHash)
      .maybeSingle();

    if (existingAggregate) {
      // If user just logged in, associate their userId with existing session code
      if (userId && !existingAggregate.referrer_user_id) {
        await supabase
          .from("referral_aggregates")
          .update({ referrer_user_id: userId })
          .eq("referral_code", existingAggregate.referral_code);
        console.log("Associated userId with existing session code");
      }
      console.log("Found existing referral code:", existingAggregate.referral_code);
      return new Response(
        JSON.stringify({ code: existingAggregate.referral_code }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a new unique code
    let code = generateCode();
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      // Check if code already exists
      const { data: existingCode } = await supabase
        .from("referral_aggregates")
        .select("referral_code")
        .eq("referral_code", code)
        .maybeSingle();

      if (!existingCode) {
        break;
      }

      code = generateCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.error("Could not generate unique code after max attempts");
      return new Response(
        JSON.stringify({ error: "Could not generate unique code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the referral aggregate entry
    const { error: insertError } = await supabase
      .from("referral_aggregates")
      .insert({
        referral_code: code,
        referrer_session_hash: sessionHash,
        referrer_user_id: userId || null,
        total_referrals: 0,
        total_zakat_calculated: 0,
        total_assets_calculated: 0,
      });

    if (insertError) {
      console.error("Error creating referral aggregate:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create referral code" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generated new referral code:", code);
    return new Response(
      JSON.stringify({ code }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating referral code:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});