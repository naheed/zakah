-- Migration: Add logo_url to asset_accounts
ALTER TABLE asset_accounts 
ADD COLUMN IF NOT EXISTS logo_url text;

-- Add comment
COMMENT ON COLUMN asset_accounts.logo_url IS 'URL to institution logo (e.g. from Clearbit or internal asset library)';