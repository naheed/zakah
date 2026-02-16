

# Audit: Plaid Integration -- Account Type Detection and API Usage

## Current State Analysis

### What Plaid Already Returns (But We Ignore)

The Plaid `/accounts/get` and `/investments/holdings/get` APIs already return **structured account type and subtype fields** that tell us exactly what kind of container each account is:

| Plaid Field | Example Values | What It Tells Us |
|---|---|---|
| `account.type` | `investment`, `depository`, `credit`, `loan` | High-level container |
| `account.subtype` | `401k`, `roth`, `ira`, `brokerage`, `hsa`, `checking`, `savings` | Exact container type |

For your Schwab 401(k), Plaid would return:
- `type: "investment"`
- `subtype: "401k"`

**But our current code throws this away.** The `plaid-exchange-token` edge function maps accounts like this:

```
accounts = accountsData.accounts.map((account) => ({
    type: account.type,        // "investment" -- too generic
    subtype: account.subtype,  // "401k" -- THIS IS THE KEY, but we don't use it
    ...
}));
```

The client receives `type` and `subtype` but `persistPlaidDataWithUserKey` encrypts them into `encrypted_payload` and never uses them for classification. There is **no account-type-to-wizard-field mapping** for Plaid data at all.

### What API Products We Request

In `plaid-link-token/index.ts`, we request:
```
products: ["investments", "transactions"]
```

- **`investments`**: Gives us `/investments/holdings/get` (holdings with quantities, prices, cost basis). This is correct for brokerage and retirement accounts.
- **`transactions`**: Gives us `/transactions/get` (individual transactions). We never actually call this endpoint -- we fetch it but don't use it.

### Missing: Plaid Statements API

Plaid has a **Statements** product (`/statements/list` + `/statements/download`) that retrieves actual bank-branded PDF statements. However, this is:
- A separate product requiring `products: ["statements"]` in Link token
- US-only, limited institution coverage
- Returns PDFs, not structured data
- Better suited for loan verification, not Zakat calculation

**Recommendation**: We do NOT need the Statements API. The `/investments/holdings/get` and `/accounts/get` endpoints already return structured, machine-readable data (balances, holdings, quantities) which is far superior to parsing PDFs. The two-layer architecture should work with the structured data Plaid already gives us.

### What We Should Remove

The `transactions` product is requested but never used. This adds unnecessary Plaid Link friction (users see "transactions" permission request) and may limit institution compatibility. We should remove it unless there's a future plan for transaction data.

## The Fix

### Problem 1: Plaid subtype not mapped to AccountType

Plaid returns `subtype: "401k"` but we never map it to our `AccountType` enum. We need a `plaidSubtypeToAccountType()` mapper.

### Problem 2: No account-type override for Plaid holdings

When Plaid data is persisted, individual holdings are stored with their asset class (stock, ETF, mutual fund) but there's no logic to roll them up based on the account container -- the same problem we fixed for PDF uploads.

### Problem 3: Plaid data doesn't flow to the wizard

After Plaid connect, data is stored in `plaid_accounts` and `plaid_holdings` tables, but there's no code that reads this data and maps it to `ZakatFormData` fields for calculation. The data is stored but never used for Zakat computation.

## Plan

### Step 1: Map Plaid subtypes to AccountType

**File:** `src/lib/accountImportMapper.ts` (or new `src/lib/plaidAccountMapper.ts`)

Create a mapping from Plaid's `subtype` values to our `AccountType`:

```
'401k' | 'roth 401k' | '403B' | '457b' | 'pension' -> RETIREMENT_401K
'ira' | 'sep ira' | 'simple ira' -> RETIREMENT_IRA
'roth' -> ROTH_IRA
'hsa' -> HSA
'brokerage' | 'stock plan' -> BROKERAGE
'checking' -> CHECKING
'savings' | 'money market' | 'cd' -> SAVINGS
'crypto exchange' -> CRYPTO_WALLET
```

### Step 2: Apply account-type override in Plaid persistence

**File:** `src/lib/plaidEncryptedPersistence.ts`

After encrypting and persisting Plaid accounts, also create corresponding `asset_accounts` and `asset_snapshots` with the correct `AccountType` derived from Step 1. Each holding's `zakat_category` should be overridden based on the account container (same logic as the PDF extraction fix):

- `RETIREMENT_401K` container -> all holdings map to `fourOhOneKVestedBalance`
- `RETIREMENT_IRA` container -> all holdings map to `traditionalIRABalance`
- `ROTH_IRA` container -> all holdings map to `rothIRAContributions`
- `HSA` container -> all holdings map to `hsaBalance`
- `BROKERAGE` / `CHECKING` / `SAVINGS` -> per-holding asset class mapping (existing logic)

### Step 3: Create asset_accounts + snapshots from Plaid data

**File:** `src/hooks/usePlaidLink.ts` and `src/lib/plaidEncryptedPersistence.ts`

After Plaid exchange succeeds, in addition to persisting to `plaid_accounts`/`plaid_holdings`, also create:
1. An `asset_account` row (with correct `type` from the subtype mapping) linked to the user's portfolio
2. An `asset_snapshot` with `method: 'PLAID_API'`
3. `asset_line_items` for each holding, with `zakat_category` set according to the account-type override logic

This bridges the Plaid data into the same asset pipeline used by PDF uploads and manual entries, making it visible in the Assets page and usable in Zakat calculations.

### Step 4: Remove unused `transactions` product

**File:** `supabase/functions/plaid-link-token/index.ts`

Change:
```
products: ["investments", "transactions"]
```
To:
```
products: ["investments"]
```

This reduces permission scope and improves institution coverage. If checking/savings accounts are needed (which don't have "investments"), we should use `products: ["transactions"]` only as a fallback or use Plaid's `required_if_supported_products` field.

Actually, the better approach for broad account support:
```
products: ["transactions"],
additional_products: ["investments"]
```

This way:
- Depository accounts (checking/savings) connect via `transactions` (which gives us `/accounts/get` with balances)
- Investment accounts also return holdings via `/investments/holdings/get`

### Step 5: Link `plaid_accounts` to `asset_accounts`

**File:** `src/lib/plaidEncryptedPersistence.ts`

The `plaid_accounts` table already has an `asset_account_id` FK column (currently always null). After creating the `asset_account`, update `plaid_accounts.asset_account_id` to link them. This enables future "refresh" flows where we can update the same asset_account with new Plaid data.

---

## Technical Details

### Plaid subtype to AccountType mapping table

```text
Plaid subtype         -> AccountType
-------------------------------------------
401k, roth 401k       -> RETIREMENT_401K
403B, 457b            -> RETIREMENT_401K
pension, profit sharing -> RETIREMENT_401K
ira, sep ira, simple ira -> RETIREMENT_IRA
roth                  -> ROTH_IRA
hsa                   -> HSA
brokerage, stock plan -> BROKERAGE
checking              -> CHECKING
savings, money market, cd -> SAVINGS
crypto exchange       -> CRYPTO_WALLET
(anything else)       -> OTHER
```

### AccountType to ZakatFormData override (shared with PDF flow)

```text
RETIREMENT_401K -> ALL -> fourOhOneKVestedBalance
RETIREMENT_IRA  -> ALL -> traditionalIRABalance
ROTH_IRA        -> ALL -> rothIRAContributions
HSA             -> ALL -> hsaBalance
BROKERAGE       -> per-holding category mapping
CHECKING        -> checkingAccounts (sum of balances)
SAVINGS         -> savingsAccounts (sum of balances)
CRYPTO_WALLET   -> per-holding category mapping
```

### Files to modify

1. `src/lib/accountImportMapper.ts` -- Add `plaidSubtypeToAccountType()` mapping function
2. `src/lib/plaidEncryptedPersistence.ts` -- Create asset_accounts, snapshots, and line items from Plaid data; link plaid_accounts to asset_accounts; apply account-type override for zakat_category
3. `src/hooks/usePlaidLink.ts` -- Pass portfolio context; call updated persistence that creates asset pipeline entries
4. `supabase/functions/plaid-link-token/index.ts` -- Change products to `["transactions"]` with `additional_products: ["investments"]` for broader coverage
5. `src/hooks/useAssetPersistence.ts` -- Ensure `fetchAccounts` includes Plaid-created asset_accounts; add shared account-type override utility

