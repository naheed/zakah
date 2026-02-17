-- Add public_key column to profiles for asymmetric encryption
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS public_key TEXT;

-- Add encryption_version to zakat_calculations to track encrypted records
ALTER TABLE public.zakat_calculations 
ADD COLUMN IF NOT EXISTS encryption_version INTEGER DEFAULT 0;

-- Add encrypted_form_data to shares for E2EE sharing
ALTER TABLE public.zakat_calculation_shares 
ADD COLUMN IF NOT EXISTS encrypted_form_data TEXT;

-- Add encrypted_symmetric_key to shares (symmetric key encrypted with recipient's public key)
ALTER TABLE public.zakat_calculation_shares 
ADD COLUMN IF NOT EXISTS encrypted_symmetric_key TEXT;

-- Create index on public_key for faster lookups when sharing
CREATE INDEX IF NOT EXISTS idx_profiles_public_key ON public.profiles(public_key) WHERE public_key IS NOT NULL;