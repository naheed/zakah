# Plaid Data Encryption with User Keys

**Status:** Design + Implementation  
**Last Updated:** February 2026  
**Related:** [SECURITY.md](SECURITY.md), [ENGINEERING_DESIGN.md](ENGINEERING_DESIGN.md)

## 1. Current State (Pre–User-Key Encryption)

### 1.1 What Is Encrypted Today

| Data | Location | Key | Notes |
|------|----------|-----|------|
| Plaid `access_token` | `plaid_items.access_token` | Server: `PLAID_ENCRYPTION_KEY` | Edge encrypts/decrypts for Plaid API and delete-account. |

### 1.2 What Is Stored in Plaintext

- **plaid_items:** `item_id`, `institution_id`, `institution_name`, `status`, `error_code`, `error_message`, `consent_expiration_time`
- **plaid_accounts:** `account_id`, `name`, `official_name`, `type`, `subtype`, `mask`, `balance_current`, `balance_available`, `balance_iso_currency_code`, `is_active_trader`, etc.
- **plaid_holdings:** `security_id`, `name`, `ticker_symbol`, `security_type`, `quantity`, `cost_basis`, `institution_price`, `institution_value`, etc.

So: only the Plaid token is encrypted (with a **server** key). All other Plaid table data is plaintext in the database.

### 1.3 How Other Tables Use “User Keys”

- **zakat_calculations:** Client holds a symmetric key (IndexedDB via `useEncryptionKeys`). The client encrypts the full payload (form_data, name, zakat_due, year, etc.) and stores it in `form_data`; placeholder values are stored in other columns. The server never sees the user’s key or plaintext.
- **Guest vault:** Session key in memory; data encrypted in localStorage.

So “user keys” here means **client-held keys**: the server cannot decrypt the payload. We align Plaid table data with this model.

---

## 2. Goal

Encrypt Plaid table data **with the same user-key model** as `zakat_calculations`:

- Sensitive fields (institution name, account names, balances, holdings) are encrypted on the **client** with the user’s symmetric key.
- Only ciphertext is stored in the database (in new columns).
- Edge function continues to encrypt/decrypt only the Plaid `access_token` (server key) so it can call Plaid API and revoke on delete.

---

## 3. Design

### 3.1 Schema Changes

- **plaid_items**
  - Add `encrypted_metadata TEXT` (nullable).
  - Plaintext keep: `user_id`, `item_id`, `access_token` (server-encrypted), `status`, `error_code`, `error_message` so the edge can update status without client.
  - **Encrypted in `encrypted_metadata` (client):** `institution_id`, `institution_name`, `consent_expiration_time`.

- **plaid_accounts**
  - Add `encrypted_payload TEXT` (nullable).
  - Plaintext keep: `id`, `plaid_item_id`, `account_id` (Plaid’s id, needed for API and joins), `asset_account_id`, `last_synced_at`.
  - **Encrypted in `encrypted_payload` (client):** `name`, `official_name`, `type`, `subtype`, `mask`, `balance_current`, `balance_available`, `balance_iso_currency_code`, `is_active_trader`.

- **plaid_holdings**
  - Add `encrypted_payload TEXT` (nullable).
  - Plaintext keep: `id`, `plaid_account_id`, `security_id`.
  - **Encrypted in `encrypted_payload` (client):** `name`, `ticker_symbol`, `security_type`, `quantity`, `cost_basis`, `institution_price`, `institution_value`, `iso_currency_code`, `unofficial_currency_code`, `price_as_of`.

Existing rows can keep legacy columns populated (backward compatibility). New rows written by the client use `encrypted_*`; readers use encrypted payload when present, else fall back to legacy columns.

### 3.2 Flow: Link (Exchange)

1. **Client:** User completes Plaid Link; client calls `plaid-exchange-token` with `public_token` and `institution`.
2. **Edge:**
   - Exchange token with Plaid; get `access_token`, `item_id`.
   - Encrypt `access_token` with `PLAID_ENCRYPTION_KEY`; insert **only** `plaid_items` (user_id, item_id, access_token, institution_id, institution_name, status).
   - Fetch accounts and holdings from Plaid.
   - **Do not** insert into `plaid_accounts` or `plaid_holdings`.
   - Return in response: `{ success, item_id, plaid_item_id, accounts, holdings }` (accounts/holdings as raw JSON).
3. **Client:**
   - On success, ensure encryption keys are ready (`useEncryptionKeys`).
   - Encrypt each account payload (name, official_name, type, subtype, mask, balances, is_active_trader) with user’s symmetric key; insert into `plaid_accounts` (plaid_item_id, account_id, encrypted_payload).
   - Encrypt each holding payload; insert into `plaid_holdings` (plaid_account_id from inserted accounts, security_id, encrypted_payload).
   - Encrypt plaid_items metadata (institution_id, institution_name, consent_expiration_time) and update `plaid_items` set `encrypted_metadata` for the new item.

So the edge never writes sensitive plaintext to `plaid_accounts` or `plaid_holdings`; the client owns encryption and insert for those tables.

### 3.3 Flow: Read (Display)

- **Client** fetches rows from `plaid_items` / `plaid_accounts` / `plaid_holdings` (RLS as today).
- If `encrypted_payload` / `encrypted_metadata` is non-null: decrypt with user’s symmetric key and use decrypted fields for UI.
- If null (legacy row): use existing plaintext columns (backward compatibility).

### 3.4 Flow: Refresh / Sync

- If we add a “refresh balances” flow: edge fetches from Plaid (using decrypted `access_token`), returns new account/holding data to client; client decrypts existing `encrypted_payload`, merges new balances, re-encrypts, and updates rows. Edge does not write to `plaid_accounts` / `plaid_holdings`.

### 3.5 Reading (Decrypt) — For Future UI

When the app reads from `plaid_accounts` or `plaid_holdings` (e.g. to display linked accounts or holdings):

1. Fetch rows as usual (RLS applies).
2. For each row, if `encrypted_payload` is non-null: call `decrypt(encrypted_payload)` with the user’s symmetric key and use the decrypted JSON for display (name, balance, etc.).
3. If `encrypted_payload` is null (legacy row): use the existing plaintext columns (`name`, `balance_current`, etc.).

Same pattern for `plaid_items.encrypted_metadata` if present (institution_name, etc.).

### 3.6 Delete Account

- **Unchanged.** Edge decrypts `access_token` with `PLAID_ENCRYPTION_KEY`, calls Plaid `/item/remove`, then deletes user data (including plaid_* rows). No need to decrypt user-key payloads for deletion.

---

## 4. Security Properties

- **At rest:** Plaid metadata, account names, balances, and holdings are encrypted with a key that only the user’s client holds (same model as zakat_calculations).
- **Server:** Cannot read encrypted_payload / encrypted_metadata without the user’s key. Plaid token remains server-key encrypted so the edge can call Plaid and revoke.
- **Backward compatibility:** Legacy rows without encrypted columns continue to work (read from plaintext columns) until data is migrated or re-linked.

---

## 5. One-Time Cleanup of Existing Tokens and Data

To migrate to the new user-key encrypted model and remove all existing plaintext Plaid data and tokens:

1. **Set a secret** in Supabase Edge Function secrets: `PLAID_CLEANUP_SECRET` (e.g. a long random string). Do not commit it or expose it to the client.
2. **Deploy** the `plaid-cleanup-all` edge function.
3. **Invoke once** (e.g. via curl or Supabase dashboard):
   ```bash
   curl -X POST "https://<project-ref>.supabase.co/functions/v1/plaid-cleanup-all" \
     -H "Content-Type: application/json" \
     -H "x-plaid-cleanup-secret: <your-PLAID_CLEANUP_SECRET>"
   ```
4. The function will:
   - Revoke every Plaid access token via Plaid’s `/item/remove` API
   - Delete all rows in `plaid_items` (CASCADE deletes `plaid_accounts` and `plaid_holdings`)
5. **Notify users** that bank connections have been cleared and they need to re-link if they want to use Plaid again (new links will use the encrypted flow).
6. **Optional:** Remove or rotate `PLAID_CLEANUP_SECRET` after the one-time run so the endpoint cannot be used again.

---

## 6. Implementation Checklist

- [ ] Migration: add `encrypted_metadata` to `plaid_items`, `encrypted_payload` to `plaid_accounts` and `plaid_holdings`.
- [ ] Edge `plaid-exchange-token`: stop inserting into `plaid_accounts` / `plaid_holdings`; return `plaid_item_id`, `accounts`, `holdings` in response.
- [ ] Client: after exchange success, encrypt and insert `plaid_accounts` and `plaid_holdings` (and optionally update `plaid_items.encrypted_metadata`).
- [ ] Client: when reading Plaid data, prefer `encrypted_payload` / `encrypted_metadata`; decrypt with user key; fall back to legacy columns if null.
- [ ] Types: update Supabase types for new columns; add types for decrypted payload shapes.
- [ ] Docs: update SECURITY.md and ENGINEERING_DESIGN.md to state that Plaid table data is encrypted with user keys (client-side).
- [ ] Logging: add client and server logging (no secrets) for encrypt/decrypt and persist steps.
- [ ] **One-time cleanup:** run `plaid-cleanup-all` (see Section 5) if migrating existing users; then notify users to re-link.
