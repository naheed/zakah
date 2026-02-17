-- Migration: Add logo_url to asset_accounts
alter table asset_accounts 
add column if not exists logo_url text;

-- Add comment
comment on column asset_accounts.logo_url is 'URL to institution logo (e.g. from Clearbit or internal asset library)';
