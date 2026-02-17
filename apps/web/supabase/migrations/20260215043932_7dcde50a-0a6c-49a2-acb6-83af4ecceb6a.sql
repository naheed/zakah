
-- Revert: restore public read access for landing page social proof metrics
DROP POLICY IF EXISTS "Authenticated users can read aggregates" ON public.zakat_usage_aggregates;
CREATE POLICY "Anyone can read aggregates"
  ON public.zakat_usage_aggregates
  FOR SELECT
  USING (true);
