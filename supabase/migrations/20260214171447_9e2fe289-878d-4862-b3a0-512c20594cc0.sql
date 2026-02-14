
-- Create nisab_values table for storing daily gold/silver prices
CREATE TABLE public.nisab_values (
  date DATE NOT NULL PRIMARY KEY,
  gold_price NUMERIC NOT NULL,
  silver_price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create currency_rates table for multi-currency support
CREATE TABLE public.currency_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL,
  rate NUMERIC NOT NULL,
  date DATE NOT NULL,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(base_currency, target_currency, date)
);

-- Enable RLS on both tables
ALTER TABLE public.nisab_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

-- Public read access for nisab_values (everyone needs to see nisab thresholds)
CREATE POLICY "Anyone can read nisab values"
ON public.nisab_values
FOR SELECT
USING (true);

-- Public read access for currency_rates
CREATE POLICY "Anyone can read currency rates"
ON public.currency_rates
FOR SELECT
USING (true);

-- Index for fast date lookups on currency_rates
CREATE INDEX idx_currency_rates_date ON public.currency_rates (date, base_currency, target_currency);

-- Trigger for updated_at on nisab_values
CREATE TRIGGER update_nisab_values_updated_at
BEFORE UPDATE ON public.nisab_values
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
