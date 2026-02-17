-- Drop the overly permissive policy that allows anyone to read all aggregates
DROP POLICY IF EXISTS "Anyone can read referral aggregates" ON public.referral_aggregates;

-- Create a restrictive policy: only authenticated users who own the data can see it
-- Note: The edge function uses service role key to bypass RLS, 
-- so this policy only affects direct database access
CREATE POLICY "Referrers can view their own aggregates"
ON public.referral_aggregates
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = referrer_user_id);