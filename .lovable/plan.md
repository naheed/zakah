

# Fix: Account-Level Context for Document Extraction

## The Core Problem

Your Schwab 401(k) statement clearly says **"GOOGLE LLC 401K PLAN"** and **"Personal Choice Retirement Account (PCRA)"** at the top of every page. But the current system:

1. **Ignores the account wrapper type** -- Gemini classifies each holding by its *asset class* (TSLA -> `INVESTMENT_STOCK`, AMAGX -> `INVESTMENT_MUTUAL_FUND`), completely losing the fact that everything is inside a 401(k).
2. **Has no `accountType` in the Gemini output** -- The tool schema returns `accountName` (a freeform string like "PCRA") but no structured `accountType` field.
3. **The persistence layer defaults to `OTHER`** -- Since no `stepId` is passed when uploading from the "Upload First" flow, `inferAccountTypeFromStep()` returns `OTHER`, so the account type in the database is wrong.
4. **Line items map to wrong wizard fields** -- TSLA inside a 401(k) maps to `passiveInvestmentsValue` instead of `fourOhOneKVestedBalance`.

### What Should Happen with Your Schwab 401(k) Statement

| What Gemini Currently Does | What It Should Do |
|---|---|
| TSLA -> `INVESTMENT_STOCK` -> `passiveInvestmentsValue` | TSLA -> `RETIREMENT_401K` -> `fourOhOneKVestedBalance` |
| AMAGX -> `INVESTMENT_MUTUAL_FUND` -> `passiveInvestmentsValue` | AMAGX -> `RETIREMENT_401K` -> `fourOhOneKVestedBalance` |
| HLAL -> `INVESTMENT_STOCK` -> `passiveInvestmentsValue` | HLAL -> `RETIREMENT_401K` -> `fourOhOneKVestedBalance` |
| Cash Sweep -> `CASH_SAVINGS` -> `savingsAccounts` | Cash Sweep -> `RETIREMENT_401K` -> `fourOhOneKVestedBalance` |

The entire account value ($1,039,100.40) should roll up to the **401(k) vested balance** field for Zakat calculation purposes.

## Architecture: Two-Layer Classification

The fix introduces a **two-layer classification** system:

**Layer 1 -- Account Type (container):** What kind of account is this document from?
- Detected from PDF metadata: "401K PLAN", "Roth IRA", "Brokerage", "Checking", "HSA", etc.
- Returned as a new `accountType` field from Gemini.
- User confirms/overrides in the ExtractionReview UI.

**Layer 2 -- Asset Class (contents):** What are the individual holdings?
- Stocks, mutual funds, ETFs, cash, bonds, etc.
- This is what Gemini already does well.
- Kept for informational display but NOT used for Zakat field mapping when the account type overrides it.

**The rule:** When an account type is a retirement wrapper (401K, IRA, ROTH, HSA), ALL holdings inside it map to the corresponding retirement wizard field, regardless of their individual asset class.

## Plan

### Step 1: Add `accountType` to Gemini Prompt and Tool Schema

**File:** `supabase/functions/parse-financial-document/index.ts`

- Add a new section to the `STATEMENT_PROMPT` instructing Gemini to detect the **account wrapper type** from document metadata (headers, footers, plan names).
- Add an `accountType` field to the `extract_financial_data` tool schema with enum values matching `AccountType` in `src/types/assets.ts`: `CHECKING`, `SAVINGS`, `BROKERAGE`, `RETIREMENT_401K`, `RETIREMENT_IRA`, `ROTH_IRA`, `CRYPTO_WALLET`, `OTHER`.
- Add clear prompt rules:

```text
ACCOUNT TYPE DETECTION (CRITICAL):
Look for these clues in the document header, footer, and account description:
- "401(k)", "401K", "403(b)", "457" -> accountType = "RETIREMENT_401K"
- "Roth IRA" -> accountType = "ROTH_IRA"  
- "Traditional IRA", "SEP IRA", "IRA" -> accountType = "RETIREMENT_IRA"
- "HSA", "Health Savings" -> accountType = "HSA"
- "Brokerage", "Individual", "Joint" -> accountType = "BROKERAGE"
- "Checking" -> accountType = "CHECKING"
- "Savings", "Money Market" -> accountType = "SAVINGS"
- "Crypto", "Digital Assets" -> accountType = "CRYPTO_WALLET"

IMPORTANT: The accountType describes the CONTAINER, not the contents. 
A 401(k) account that holds stocks and mutual funds is still accountType = "RETIREMENT_401K".
```

- Return `accountType` in the response alongside existing fields.

### Step 2: Add Account Type Confirmation to ExtractionReview UI

**File:** `src/components/zakat/ExtractionReview.tsx`

- Add a new **Account Type** dropdown between the Institution Name and Account Name fields.
- Pre-populate with Gemini's detected `accountType`.
- User can override if Gemini got it wrong.
- Use the `AccountType` values from `src/types/assets.ts` with user-friendly labels.
- Show a brief explanation: "This determines how holdings are classified for Zakat. A 401(k) with stocks inside is treated as retirement, not investments."

### Step 3: Update `CATEGORY_TO_FORM_FIELD` Mapping with Account Context

**File:** `supabase/functions/parse-financial-document/index.ts`

- Update `aggregateLegacyData()` to accept an `accountType` parameter.
- When `accountType` is `RETIREMENT_401K`, ALL line items map to `fourOhOneKVestedBalance` regardless of their `inferredCategory`.
- When `accountType` is `RETIREMENT_IRA`, ALL map to `traditionalIRABalance`.
- When `accountType` is `ROTH_IRA`, ALL map to `rothIRAContributions`.
- When `accountType` is `CHECKING`, cash items stay as `checkingAccounts`.
- When `accountType` is `BROKERAGE` or `OTHER`, use the existing per-line-item category mapping (current behavior).

### Step 4: Pass `accountType` Through the Extraction Flow

**Files:** `src/hooks/useDocumentParsingV2.ts`, `src/hooks/useExtractionFlow.ts`, `src/hooks/useAssetPersistence.ts`

- Add `accountType` to `DocumentExtractionResult` interface.
- Pass it through `ReviewableData` and `ConfirmedData`.
- In `persistExtraction()`, use `accountType` from the confirmed data instead of `inferAccountTypeFromStep()`.
- In `createSnapshot()` / line item insertion, when `accountType` is a retirement type, override `inferred_category` and `zakat_category` accordingly.

### Step 5: Add `HSA` to `AccountType`

**File:** `src/types/assets.ts`

- Add `'HSA'` to the `AccountType` union type since it's missing but needed for HSA statement detection.

---

## Technical Details

### Account Type to Wizard Field Override Map

```text
RETIREMENT_401K -> ALL holdings -> fourOhOneKVestedBalance
RETIREMENT_IRA  -> ALL holdings -> traditionalIRABalance  
ROTH_IRA        -> ALL holdings -> rothIRAContributions
HSA             -> ALL holdings -> hsaBalance
CHECKING        -> use per-line category mapping (default)
SAVINGS         -> use per-line category mapping (default)
BROKERAGE       -> use per-line category mapping (default)
CRYPTO_WALLET   -> use per-line category mapping (default)
OTHER           -> use per-line category mapping (default)
```

### Files to Modify

1. `supabase/functions/parse-financial-document/index.ts` -- Add accountType to prompt, tool schema, response, and override logic in `aggregateLegacyData()`
2. `src/types/assets.ts` -- Add `'HSA'` to AccountType
3. `src/hooks/useDocumentParsingV2.ts` -- Add `accountType` to `DocumentExtractionResult`
4. `src/hooks/useExtractionFlow.ts` -- Pass `accountType` through review flow
5. `src/components/zakat/ExtractionReview.tsx` -- Add Account Type dropdown with user confirmation
6. `src/hooks/useAssetPersistence.ts` -- Use confirmed `accountType` in persistence, override zakat_category for retirement wrappers

