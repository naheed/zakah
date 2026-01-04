-- Fix the get_recursive_referral_stats function - the recursive CTE structure was incorrect
-- The JOIN to referral_tree must come first in the recursive part

CREATE OR REPLACE FUNCTION public.get_recursive_referral_stats(p_referral_code text, p_session_hash text DEFAULT NULL::text)
 RETURNS TABLE(total_referrals bigint, total_zakat_calculated numeric, total_assets_calculated numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_start_code TEXT;
BEGIN
  -- If session hash is provided but no code, try to find the code for that session
  IF p_referral_code IS NULL AND p_session_hash IS NOT NULL THEN
    SELECT referral_code INTO v_start_code 
    FROM referral_aggregates 
    WHERE referrer_session_hash = p_session_hash;
  ELSE
    v_start_code := p_referral_code;
  END IF;

  -- If still no code found, return 0s
  IF v_start_code IS NULL THEN
    RETURN QUERY SELECT 0::BIGINT, 0::NUMERIC, 0::NUMERIC;
    RETURN;
  END IF;

  RETURN QUERY
  WITH RECURSIVE referral_tree AS (
    -- Base case: Direct referrals
    SELECT 
      r.referred_session_hash,
      r.zakat_due,
      r.total_assets,
      1 as depth
    FROM referrals r
    WHERE r.referral_code = v_start_code

    UNION ALL

    -- Recursive case: Find people referred by the people we found
    -- IMPORTANT: Reference referral_tree first, then join to other tables
    SELECT 
      child.referred_session_hash,
      child.zakat_due,
      child.total_assets,
      rt.depth + 1
    FROM referral_tree rt
    JOIN referral_aggregates ra ON ra.referrer_session_hash = rt.referred_session_hash
    JOIN referrals child ON child.referral_code = ra.referral_code
    WHERE rt.depth < 20
  )
  SELECT 
    COUNT(*)::BIGINT as total_referrals,
    COALESCE(SUM(zakat_due), 0) as total_zakat_calculated,
    COALESCE(SUM(total_assets), 0) as total_assets_calculated
  FROM referral_tree;
END;
$function$;