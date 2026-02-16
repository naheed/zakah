

# Audit: Document Extraction Categories & Review UI

## Problem 1: Category Mismatch Between Gemini Prompt and Wizard Fields

There are **three separate category systems** that are not aligned:

### Current State (3 disconnected systems)

| Layer | Categories Used | Example |
|-------|----------------|---------|
| **Gemini Prompt** (edge function) | `CASH_CHECKING`, `INVESTMENT_EQUITY`, `RETIREMENT_401K`, `EXPENSE_UTILITY`, etc. | 18 categories |
| **ExtractionReview UI** (assetCategories.ts) | `CASH_CHECKING`, `INVESTMENT_EQUITY`, `RETIREMENT_401K`, `INCOME_DIVIDEND`, etc. | 22 categories (includes internal LIQUID, PROXY_30, EXEMPT, etc.) |
| **Calculation Engine** (accountImportMapper.ts) | `CHECKING`, `SAVINGS`, `STOCKS`, `401K`, `IRA`, etc. | 40+ loose string matches |

The Gemini prompt produces categories like `INVESTMENT_EQUITY` but the accountImportMapper expects `EQUITY` or `STOCKS`. The `mapToZakatCategory()` in useAssetPersistence.ts does substring matching (`cat.includes('EQUITY')`) which accidentally works but is fragile.

### Key Gaps

1. **Missing categories in Gemini prompt**: No `INVESTMENT_MUTUAL_FUND` (just `INVESTMENT_EQUITY` for all stocks/ETFs/mutuals), no `HSA`, no `CRYPTO_STAKED`
2. **Gemini returns expense categories** (`EXPENSE_UTILITY`, `EXPENSE_GROCERY`) that are irrelevant for Zakat -- these shouldn't be extracted from financial statements
3. **The ExtractionReview dropdown shows internal categories** (LIQUID, PROXY_30, EXEMPT, DEDUCTIBLE) that users should never see or select
4. **`mapLineItemToLegacyField()`** uses both category AND description substring matching, creating brittle double-inference

## Problem 2: Categories Don't Match Wizard Questionnaire

The wizard asks about these specific asset types:
- **Liquid**: Checking, Savings, Cash on Hand, Digital Wallets, Foreign Currency
- **Investments**: Active investments, Passive investments (stocks/ETFs/mutual funds), REITs, Dividends
- **Retirement**: Roth IRA (contributions vs earnings), Traditional IRA, 401(k) (vested vs unvested), HSA
- **Crypto**: Currency, Trading, Staked, Staked Rewards, Liquidity Pool
- **Precious Metals**: Gold (investment vs jewelry), Silver (investment vs jewelry)
- **Liabilities**: Living expenses, Credit card, Mortgage, Student loans, Property tax

The Gemini prompt lumps "Stocks, ETFs, Mutual Funds" into one `INVESTMENT_EQUITY` category, making it impossible to distinguish. Retirement categories don't separate contributions vs. earnings.

## Problem 3: UI Issues (from screenshots)

1. **Category dropdown overlaps other rows** -- the `SelectContent` popover covers the "Confirm & Save" button and line items below
2. **Category labels truncated** ("Stocks &...") -- the column is too narrow
3. **Internal categories visible** in dropdown (LIQUID, PROXY_30, EXEMPT, etc.)
4. **No visual grouping** helps users understand which categories matter for Zakat

---

## Plan

### Step 1: Unify Categories to Match Wizard Fields

Create a single authoritative list of **user-facing extraction categories** that map 1:1 to `ZakatFormData` fields. Remove expense categories and internal-only categories from the dropdown.

**New unified categories for Gemini + UI:**

| Category ID | Label | Maps to ZakatFormData field |
|---|---|---|
| `CASH_CHECKING` | Checking Account | `checkingAccounts` |
| `CASH_SAVINGS` | Savings / Money Market | `savingsAccounts` |
| `CASH_ON_HAND` | Cash on Hand | `cashOnHand` |
| `CASH_DIGITAL_WALLET` | Digital Wallet (PayPal, Venmo) | `digitalWallets` |
| `INVESTMENT_STOCK` | Stocks & ETFs | `passiveInvestmentsValue` |
| `INVESTMENT_MUTUAL_FUND` | Mutual Funds | `passiveInvestmentsValue` |
| `INVESTMENT_BOND` | Bonds / Fixed Income | `passiveInvestmentsValue` |
| `INVESTMENT_ACTIVE` | Active Trading | `activeInvestments` |
| `INVESTMENT_REIT` | REITs | `reitsValue` |
| `INCOME_DIVIDEND` | Dividends | `dividends` |
| `RETIREMENT_401K` | 401(k) | `fourOhOneKVestedBalance` |
| `RETIREMENT_IRA` | Traditional IRA | `traditionalIRABalance` |
| `RETIREMENT_ROTH` | Roth IRA | `rothIRAContributions` |
| `RETIREMENT_HSA` | HSA | `hsaBalance` |
| `CRYPTO` | Cryptocurrency | `cryptoCurrency` |
| `CRYPTO_STAKED` | Staked Crypto | `stakedAssets` |
| `COMMODITY_GOLD` | Gold | `goldInvestmentValue` |
| `COMMODITY_SILVER` | Silver | `silverInvestmentValue` |
| `LIABILITY_CREDIT_CARD` | Credit Card Balance | `creditCardBalance` |
| `LIABILITY_LOAN` | Loan / Debt | `studentLoansDue` |
| `OTHER` | Other | `cashOnHand` |

### Step 2: Update Gemini Prompt

Update the `STATEMENT_PROMPT` in the edge function to use the exact category IDs from Step 1. Remove expense categories entirely (financial statements list holdings, not expenses). Add clearer instructions for distinguishing mutual funds vs. stocks vs. active trading.

### Step 3: Update `assetCategories.ts`

- Remove internal-only categories (`LIQUID`, `PROXY_30`, `EXEMPT`, `DEDUCTIBLE`, `GOLD_FULL`, `SILVER_FULL`) from the user-facing list
- Add missing categories (`CASH_DIGITAL_WALLET`, `INVESTMENT_ACTIVE`, `INVESTMENT_REIT`, `RETIREMENT_HSA`, `CRYPTO_STAKED`)
- Keep internal categories in a separate non-exported array if needed elsewhere

### Step 4: Update Mappers

- Rewrite `mapToZakatCategory()` in `useAssetPersistence.ts` to use exact ID matches instead of substring matching
- Rewrite `mapLineItemToLegacyField()` in the edge function to use the same exact IDs
- Update `CATEGORY_TO_FIELDS` in `accountImportMapper.ts` to include the new category IDs

### Step 5: Fix ExtractionReview UI

- **Widen category column**: Change grid from `[3fr,2fr,2fr,auto]` to `[2fr,2.5fr,1.5fr,auto]` so labels aren't truncated
- **Fix dropdown overlap**: Add `position="popper"` and `sideOffset` to `SelectContent` so it renders in a portal above other content
- **Filter dropdown**: Only show user-facing categories (exclude internal ones)
- **Mobile responsiveness**: Stack description + category vertically on small screens

---

## Technical Details

### Files to modify:
1. `supabase/functions/parse-financial-document/index.ts` -- Update prompt categories, rewrite `mapLineItemToLegacyField()`
2. `src/lib/assetCategories.ts` -- Add missing categories, separate internal vs user-facing, update `getCategoriesGrouped()` to exclude internal
3. `src/hooks/useAssetPersistence.ts` -- Rewrite `mapToZakatCategory()` with exact matches
4. `src/lib/accountImportMapper.ts` -- Add new category IDs to `CATEGORY_TO_FIELDS`
5. `src/components/zakat/ExtractionReview.tsx` -- Fix grid layout, dropdown overlap, filter internal categories

