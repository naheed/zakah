-- Create function to atomically increment usage aggregates
CREATE OR REPLACE FUNCTION increment_usage_aggregate(
  p_period_type TEXT,
  p_period_value TEXT,
  p_assets NUMERIC,
  p_zakat NUMERIC
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO zakat_usage_aggregates (
    period_type, period_value, unique_sessions, total_assets, total_zakat, calculation_count, updated_at
  )
  VALUES (
    p_period_type, p_period_value, 1, p_assets, p_zakat, 1, now()
  )
  ON CONFLICT (period_type, period_value)
  DO UPDATE SET
    unique_sessions = zakat_usage_aggregates.unique_sessions + 1,
    total_assets = zakat_usage_aggregates.total_assets + p_assets,
    total_zakat = zakat_usage_aggregates.total_zakat + p_zakat,
    calculation_count = zakat_usage_aggregates.calculation_count + 1,
    updated_at = now();
END;
$$;