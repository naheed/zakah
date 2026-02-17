import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/domainConfig.ts";

// Maximum reasonable values for validation
const MAX_TOTAL_ASSETS = 100_000_000_000; // $100 billion
const MAX_ZAKAT_DUE = 10_000_000_000; // $10 billion

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionHash, totalAssets, zakatDue, referredBy } = await req.json();

    // Validate input
    if (!sessionHash || typeof sessionHash !== "string" || sessionHash.length !== 64) {
      console.error("Invalid session hash format");
      return new Response(
        JSON.stringify({ error: "Invalid session hash" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof totalAssets !== "number" || totalAssets < 0 || totalAssets > MAX_TOTAL_ASSETS) {
      console.error("Invalid totalAssets:", totalAssets);
      return new Response(
        JSON.stringify({ error: "Invalid totalAssets value" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof zakatDue !== "number" || zakatDue < 0 || zakatDue > MAX_ZAKAT_DUE) {
      console.error("Invalid zakatDue:", zakatDue);
      return new Response(
        JSON.stringify({ error: "Invalid zakatDue value" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate that zakatDue doesn't exceed totalAssets (basic sanity check)
    if (zakatDue > totalAssets) {
      console.error("zakatDue exceeds totalAssets:", { zakatDue, totalAssets });
      return new Response(
        JSON.stringify({ error: "Invalid calculation values" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Round values for additional privacy
    const roundedAssets = Math.round(totalAssets / 1000) * 1000;
    const roundedZakat = Math.round(zakatDue / 100) * 100;

    // Create Supabase client with service role for writes
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date().toISOString().split("T")[0];
    const currentMonth = today.substring(0, 7); // YYYY-MM
    const currentYear = today.substring(0, 4); // YYYY

    // Insert event (with deduplication via unique constraint)
    const { error: insertError, data: insertData } = await supabase
      .from("zakat_anonymous_events")
      .upsert(
        {
          session_hash: sessionHash,
          event_date: today,
          total_assets: roundedAssets,
          zakat_due: roundedZakat,
        },
        { onConflict: "session_hash,event_date", ignoreDuplicates: true }
      )
      .select();

    if (insertError) {
      console.error("Error inserting event:", insertError);
      // Don't fail completely - aggregates can still be updated
    }

    // Check if this was a new insert (not a duplicate)
    const isNewEvent = insertData && insertData.length > 0;
    console.log("Event insert result:", { isNewEvent, insertData });

    if (isNewEvent) {
      // Update all aggregate periods atomically
      const periods = [
        { period_type: "monthly", period_value: currentMonth },
        { period_type: "yearly", period_value: currentYear },
        { period_type: "all_time", period_value: "all" },
      ];

      for (const period of periods) {
        // Upsert with increment
        const { error: upsertError } = await supabase.rpc("increment_usage_aggregate", {
          p_period_type: period.period_type,
          p_period_value: period.period_value,
          p_assets: roundedAssets,
          p_zakat: roundedZakat,
        });

        if (upsertError) {
          console.error(`Error updating ${period.period_type} aggregate:`, upsertError);
          
          // Fallback: try direct upsert
          const { data: existing } = await supabase
            .from("zakat_usage_aggregates")
            .select("*")
            .eq("period_type", period.period_type)
            .eq("period_value", period.period_value)
            .single();

          if (existing) {
            await supabase
              .from("zakat_usage_aggregates")
              .update({
                unique_sessions: existing.unique_sessions + 1,
                total_assets: existing.total_assets + roundedAssets,
                total_zakat: existing.total_zakat + roundedZakat,
                calculation_count: existing.calculation_count + 1,
                updated_at: new Date().toISOString(),
              })
              .eq("period_type", period.period_type)
              .eq("period_value", period.period_value);
          } else {
            await supabase.from("zakat_usage_aggregates").insert({
              period_type: period.period_type,
              period_value: period.period_value,
              unique_sessions: 1,
              total_assets: roundedAssets,
              total_zakat: roundedZakat,
              calculation_count: 1,
            });
          }
        }
      }

      // Handle referral tracking if referredBy code is provided
      if (referredBy && typeof referredBy === "string" && referredBy.length > 0 && referredBy.length <= 20) {
        console.log("Processing referral from code:", referredBy);
        
        // Get the referral aggregate to find the referrer
        const { data: referralAggregate } = await supabase
          .from("referral_aggregates")
          .select("referrer_session_hash, referrer_user_id")
          .eq("referral_code", referredBy)
          .maybeSingle();

        if (referralAggregate) {
          // Insert the referral record
          const { error: referralInsertError } = await supabase
            .from("referrals")
            .insert({
              referrer_session_hash: referralAggregate.referrer_session_hash,
              referrer_user_id: referralAggregate.referrer_user_id,
              referral_code: referredBy,
              referred_session_hash: sessionHash,
              total_assets: roundedAssets,
              zakat_due: roundedZakat,
              converted_at: new Date().toISOString(),
            });

          if (referralInsertError) {
            console.error("Error inserting referral:", referralInsertError);
          } else {
            // Update the referral aggregate
            const { error: aggregateError } = await supabase.rpc("increment_referral_aggregate", {
              p_referral_code: referredBy,
              p_referrer_session_hash: referralAggregate.referrer_session_hash,
              p_referrer_user_id: referralAggregate.referrer_user_id,
              p_assets: roundedAssets,
              p_zakat: roundedZakat,
            });

            if (aggregateError) {
              console.error("Error updating referral aggregate:", aggregateError);
            } else {
              console.log("Referral tracked successfully");
            }
          }
        } else {
          console.log("Referral code not found:", referredBy);
        }
      }
    }

    console.log("Successfully tracked calculation");
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error tracking calculation:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});