
-- Fix critical: restrict zakat_usage_aggregates to authenticated users only
DROP POLICY IF EXISTS "Anyone can read aggregates" ON public.zakat_usage_aggregates;
CREATE POLICY "Authenticated users can read aggregates"
  ON public.zakat_usage_aggregates
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
