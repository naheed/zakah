-- Create referrals table to track individual referrals
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_session_hash TEXT NOT NULL,
  referrer_user_id UUID,
  referral_code TEXT NOT NULL,
  referred_session_hash TEXT,
  referred_user_id UUID,
  total_assets NUMERIC DEFAULT 0,
  zakat_due NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Create referral_aggregates table for quick stats lookup
CREATE TABLE public.referral_aggregates (
  referral_code TEXT NOT NULL PRIMARY KEY,
  referrer_session_hash TEXT NOT NULL,
  referrer_user_id UUID,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_zakat_calculated NUMERIC NOT NULL DEFAULT 0,
  total_assets_calculated NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index on referral_code in referrals table
CREATE INDEX idx_referrals_referral_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_referrer_session ON public.referrals(referrer_session_hash);

-- Enable RLS on both tables
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_aggregates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals - anyone can read (for stats display)
CREATE POLICY "Anyone can read referrals"
ON public.referrals
FOR SELECT
USING (true);

-- RLS Policies for referral_aggregates - anyone can read
CREATE POLICY "Anyone can read referral aggregates"
ON public.referral_aggregates
FOR SELECT
USING (true);

-- Create function to increment referral aggregates (called from edge function with service role)
CREATE OR REPLACE FUNCTION public.increment_referral_aggregate(
  p_referral_code TEXT,
  p_referrer_session_hash TEXT,
  p_referrer_user_id UUID,
  p_assets NUMERIC,
  p_zakat NUMERIC
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO referral_aggregates (
    referral_code, referrer_session_hash, referrer_user_id, 
    total_referrals, total_zakat_calculated, total_assets_calculated, updated_at
  )
  VALUES (
    p_referral_code, p_referrer_session_hash, p_referrer_user_id,
    1, p_zakat, p_assets, now()
  )
  ON CONFLICT (referral_code)
  DO UPDATE SET
    total_referrals = referral_aggregates.total_referrals + 1,
    total_zakat_calculated = referral_aggregates.total_zakat_calculated + p_zakat,
    total_assets_calculated = referral_aggregates.total_assets_calculated + p_assets,
    updated_at = now();
END;
$$;

-- Add trigger for updated_at on referral_aggregates
CREATE TRIGGER update_referral_aggregates_updated_at
BEFORE UPDATE ON public.referral_aggregates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();