-- Enable RLS on zakat_anonymous_events table
ALTER TABLE public.zakat_anonymous_events ENABLE ROW LEVEL SECURITY;

-- No SELECT policy = no public read access
-- The edge function uses service role key which bypasses RLS for writes
-- This keeps the anonymous tracking functional while protecting the data