-- Add encrypted_payload column to plaid_accounts
ALTER TABLE public.plaid_accounts
ADD COLUMN encrypted_payload text;

-- Add encrypted_payload column to plaid_holdings
ALTER TABLE public.plaid_holdings
ADD COLUMN encrypted_payload text;

-- Add comment explaining the column
COMMENT ON COLUMN public.plaid_accounts.encrypted_payload IS 'AES-256-GCM encrypted JSON of sensitive account data (balances, official_name). Encrypted with user symmetric key.';
COMMENT ON COLUMN public.plaid_holdings.encrypted_payload IS 'AES-256-GCM encrypted JSON of sensitive holding data (quantities, prices, values). Encrypted with user symmetric key.';