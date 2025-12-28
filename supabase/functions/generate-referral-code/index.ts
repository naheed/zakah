import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://zakahflow.com',
  'https://www.zakahflow.com',
  'https://zakatflow.com',
  'https://www.zakatflow.com',
];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  if (origin.startsWith('http://localhost:')) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isOriginAllowed(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

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

    // Check if this session already has a referral code
    const { data: existingAggregate } = await supabase
      .from("referral_aggregates")
      .select("referral_code")
      .eq("referrer_session_hash", sessionHash)
      .maybeSingle();

    if (existingAggregate) {
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