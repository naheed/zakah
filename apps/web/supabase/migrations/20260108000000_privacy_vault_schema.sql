-- Zero Knowledge Privacy Vault: Database Schema Update
-- This migration adds encrypted key storage and cleans existing plaintext data

-- ============================================================================
-- 1. Create user_profiles table for vault data
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    encrypted_master_key TEXT,  -- Wrapped DEK (PBES2-HS512+A256KW encrypted)
    persistence_mode TEXT CHECK (persistence_mode IN ('local', 'cloud')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER handle_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================================
-- 2. CLEAN SLATE: Truncate existing plaintext sensitive data
-- ============================================================================
-- WARNING: This permanently deletes all existing data in these tables!
-- Only run this in development/staging or when explicitly resetting production.

-- Uncomment the following lines when ready to execute:
-- TRUNCATE TABLE public.asset_accounts CASCADE;
-- TRUNCATE TABLE public.line_items CASCADE;
-- TRUNCATE TABLE public.zakat_calculations CASCADE;
-- TRUNCATE TABLE public.donations CASCADE;
-- TRUNCATE TABLE public.zakat_years CASCADE;
-- TRUNCATE TABLE public.hawl_settings CASCADE;

-- ============================================================================
-- 3. Add encrypted_data columns to existing tables (future use)
-- ============================================================================
-- When we migrate to fully encrypted storage, each table will have an
-- encrypted_data column containing the JWE blob instead of plaintext columns.

-- Example (do not run yet):
-- ALTER TABLE public.zakat_calculations ADD COLUMN encrypted_data TEXT;
-- ALTER TABLE public.donations ADD COLUMN encrypted_data TEXT;
