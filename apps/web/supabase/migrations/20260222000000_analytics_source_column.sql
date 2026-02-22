-- Add source column to distinguish web vs ChatGPT calculation events
-- Non-breaking: defaults to 'web' so existing rows are unaffected.

ALTER TABLE public.zakat_anonymous_events
ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'web';

-- Index for filtering by source in analytics queries
CREATE INDEX IF NOT EXISTS idx_anonymous_events_source
ON public.zakat_anonymous_events (source);
