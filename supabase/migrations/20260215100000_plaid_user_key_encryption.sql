-- Plaid User-Key Encryption: Add columns for client-side encrypted payloads
-- Sensitive Plaid metadata, account, and holding data will be encrypted with
-- the user's client-held symmetric key (same model as zakat_calculations).
-- See docs/PLAID_USER_KEY_ENCRYPTION.md for design and flow.
--
-- Legacy plaintext columns remain for backward compatibility; new writes use
-- encrypted_* columns. Readers decrypt when encrypted_* is non-null.

-- plaid_items: encrypted metadata (institution_name, institution_id, consent_expiration_time)
ALTER TABLE public.plaid_items
ADD COLUMN IF NOT EXISTS encrypted_metadata TEXT;

COMMENT ON COLUMN public.plaid_items.encrypted_metadata IS 'Client-encrypted JSON: institution_id, institution_name, consent_expiration_time. Decrypt with user symmetric key.';

-- plaid_accounts: encrypted payload (name, official_name, type, subtype, mask, balances, is_active_trader)
ALTER TABLE public.plaid_accounts
ADD COLUMN IF NOT EXISTS encrypted_payload TEXT;

COMMENT ON COLUMN public.plaid_accounts.encrypted_payload IS 'Client-encrypted JSON: name, official_name, type, subtype, mask, balance_*, is_active_trader. Decrypt with user symmetric key.';

-- plaid_holdings: encrypted payload (name, ticker, security_type, quantity, cost_basis, prices, etc.)
ALTER TABLE public.plaid_holdings
ADD COLUMN IF NOT EXISTS encrypted_payload TEXT;

COMMENT ON COLUMN public.plaid_holdings.encrypted_payload IS 'Client-encrypted JSON: name, ticker_symbol, security_type, quantity, cost_basis, institution_price, institution_value, etc. Decrypt with user symmetric key.';
