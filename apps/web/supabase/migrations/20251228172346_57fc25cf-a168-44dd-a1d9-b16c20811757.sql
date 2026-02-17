-- Create table for anonymous calculation events (for deduplication)
CREATE TABLE public.zakat_anonymous_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_hash TEXT NOT NULL,
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_assets NUMERIC NOT NULL DEFAULT 0,
  zakat_due NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_hash, event_date)
);

-- Create table for pre-computed usage aggregates
CREATE TABLE public.zakat_usage_aggregates (
  period_type TEXT NOT NULL,
  period_value TEXT NOT NULL,
  unique_sessions INTEGER NOT NULL DEFAULT 0,
  total_assets NUMERIC NOT NULL DEFAULT 0,
  total_zakat NUMERIC NOT NULL DEFAULT 0,
  calculation_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (period_type, period_value)
);

-- Enable RLS but allow public read access to aggregates
ALTER TABLE public.zakat_anonymous_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zakat_usage_aggregates ENABLE ROW LEVEL SECURITY;

-- Public read access to aggregates (no auth required)
CREATE POLICY "Anyone can read aggregates"
ON public.zakat_usage_aggregates
FOR SELECT
USING (true);

-- No direct write access to either table (only via edge functions with service role)
-- Events table has no public policies - only service role can write

-- Initialize all_time aggregate
INSERT INTO public.zakat_usage_aggregates (period_type, period_value, unique_sessions, total_assets, total_zakat, calculation_count)
VALUES ('all_time', 'all', 0, 0, 0, 0)
ON CONFLICT DO NOTHING;