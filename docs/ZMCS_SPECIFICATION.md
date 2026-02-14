# Zakat Methodology Configuration Standard (ZMCS) v2.0.1

## Overview

The **Zakat Methodology Configuration Standard (ZMCS)** is a JSON-based schema designed to encapsulate the diverse juristic opinions (Madhahib) and modern scholarly methodologies regarding Zakat calculation. It allows the ZakatFlow engine to completely change its calculation logic — definitions of wealth, zakatability thresholds, rates, and deductions — simply by loading a different configuration object.

Any institution, scholar, or community can author a ZMCS configuration to fully describe their approach to Zakat.

## Core Philosophy

1. **Immutability** — A configuration defines a fixed, versioned set of rules.
2. **Portability** — The schema is serializable to JSON, allowing methodologies to be shared, versioned, and stored.
3. **Completeness** — The config provides values for *every* decision point in the calculation.
4. **Documentation** — Every section carries human-readable `description` and `scholarly_basis` strings for UI rendering and transparency.

## Supported Methodologies (v2.0)

| ID | Name | Key Features |
|----|------|-------------|
| `balanced` | Sheikh Joe Bradford | 30% proxy, retirement exempt <59.5, jewelry zakatable, 12-month debts |
| `amja` | AMJA (Assembly of Muslim Jurists of America) | Net-withdrawable retirement, stocks as exploited assets, jewelry exempt, currently-due debts only |
| `tahir_anwar` | Imam Tahir Anwar (Hanafi) | Full retirement balance (strong ownership), jewelry zakatable, 100% investments, full debt deduction |
| `qaradawi` | Dr. Al-Qaradawi (Fiqh al-Zakah) | Jewelry exempt (paying recommended), 30% proxy, **10% rental income** (agricultural analogy), net-accessible retirement, 12-month debts, gold Nisab |
| `hanafi` | Hanafi Classical | Jewelry zakatable, full debt deduction, net-accessible retirement |
| `shafii` | Shafi'i Classical | Jewelry exempt, NO debt deduction, net-accessible retirement |
| `maliki` | Maliki Classical | Jewelry exempt, 12-month debts, commercial debt ring-fenced |
| `hanbali` | Hanbali Classical | Jewelry exempt, full debt deduction |

---

## Schema Reference

### 1. Metadata (`meta`)

Describes the configuration file itself. Required for versioning, attribution, and UI display.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique slug identifier (e.g., `hanafi-standard-v2`). Must be URL-safe. |
| `name` | string | Yes | Human-readable methodology name. |
| `version` | string | Yes | Semantic version of this config file. |
| `zmcs_version` | string | Yes | ZMCS schema version targeted (e.g., `2.0.0`). |
| `author` | string | Yes | Scholar, organization, or author name. |
| `description` | string | Yes | Brief summary of the methodology's approach. |
| `ui_label` | string | No | Short label for UI dropdowns. |
| `scholar_url` | string (URL) | No | Link to the scholar's website. |
| `certification.certified_by` | string | No | Certifying scholar or body. |
| `certification.date` | string | No | Date of certification (ISO 8601). |
| `certification.url` | string (URL) | No | Link to the official fatwa or ruling. |

### 2. Thresholds (`thresholds`)

Defines the baseline numbers for Zakat liability.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `nisab.default_standard` | `"gold"` \| `"silver"` | Yes | Default metal standard. Silver (~$400) is safer for the poor; Gold (~$6,000) exempts more people. |
| `nisab.gold_grams` | number | Yes | Nisab in grams of gold. Classical: 85g (20 Mithqal). |
| `nisab.silver_grams` | number | Yes | Nisab in grams of silver. Classical: 595g (200 Dirhams). |
| `nisab.description` | string | No | Methodology-specific notes. |
| `zakat_rate.lunar` | number (0-1) | Yes | Rate for Hijri year. Standard: 0.025 (2.5%). |
| `zakat_rate.solar` | number (0-1) | Yes | Rate for Gregorian year. Standard: 0.02577 (2.577%). |
| `zakat_rate.description` | string | No | Notes on rate calculation. |

### 3. Assets (`assets`)

Defines zakatability for every supported asset class.

#### 3.1 Cash (`assets.cash`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `zakatable` | boolean | Yes | Whether cash holdings are zakatable. Universally `true`. |
| `rate` | number (0-1) | Yes | Rate applied. Universally `1.0`. |
| `description` | string | No | Methodology notes. |
| `scholarly_basis` | string | No | Scholarly evidence. |

#### 3.2 Precious Metals (`assets.precious_metals`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `investment_gold_rate` | number (0-1) | Yes | Rate on investment gold. Always `1.0`. |
| `investment_silver_rate` | number (0-1) | Yes | Rate on investment silver. Always `1.0`. |
| `jewelry.zakatable` | boolean | Yes | **Key divergence**: Hanafi/Bradford = `true`; Majority = `false`. |
| `jewelry.rate` | number (0-1) | Yes | Rate if zakatable. Typically `1.0`. |
| `jewelry.conditions` | string[] | No | Conditions (e.g., `personal_use`, `excessive_amount`). |
| `jewelry.description` | string | No | Ruling explanation. |
| `jewelry.scholarly_basis` | string | No | Scholarly evidence for the ruling. |

#### 3.3 Cryptocurrency (`assets.crypto`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currency_rate` | number (0-1) | Yes | Rate on BTC, ETH, stablecoins. Typically `1.0`. |
| `trading_rate` | number (0-1) | Yes | Rate on actively traded crypto/NFTs. Typically `1.0`. |
| `staking.principal_rate` | number (0-1) | Yes | Rate on staked principal. |
| `staking.rewards_rate` | number (0-1) | Yes | Rate on staking rewards. |
| `staking.vested_only` | boolean | Yes | Whether only vested rewards count. |
| `description` | string | No | Notes on crypto treatment. |
| `scholarly_basis` | string | No | Evidence (e.g., thamaniyya analogy). |

#### 3.4 Investments (`assets.investments`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `active_trading_rate` | number (0-1) | Yes | Rate on day-traded investments. Always `1.0`. |
| `passive_investments.rate` | number (0-1) | Yes | **Key divergence**: `1.0` (classical), `0.30` (Bradford proxy), `0.0` (AMJA income-only). |
| `passive_investments.treatment` | `"market_value"` \| `"underlying_assets"` \| `"income_only"` | Yes | Treatment philosophy. See below. |
| `passive_investments.description` | string | No | Detailed explanation. |
| `passive_investments.scholarly_basis` | string | No | Scholarly evidence (e.g., AAOIFI Standard 9). |
| `reits_rate` | number (0-1) | Yes | Rate on Equity REITs. |
| `dividends.zakatable` | boolean | Yes | Whether dividends are zakatable. |
| `dividends.deduct_purification` | boolean | Yes | Whether to deduct haram purification %. |

**Passive Investment Treatment:**
- `"market_value"` — Rate applies to full market value (Hanafi, Shafi'i, Maliki, Hanbali).
- `"underlying_assets"` — Rate is a proxy for zakatable company assets (Bradford 30% / AAOIFI / Al-Qaradawi).
- `"income_only"` — Only dividends/income zakatable, not principal market value (AMJA).

#### 3.5 Retirement (`assets.retirement`)

This is the most divergent area across methodologies.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `zakatability` | enum | Yes | Primary method. See below. |
| `exemption_age` | number | No | Age threshold for `conditional_age` (e.g., `59.5`). |
| `post_threshold_method` | `"net_accessible"` \| `"proxy_rate"` \| `"full"` | No | What happens after age threshold is met. |
| `post_threshold_rate` | number (0-1) | No | Rate for `proxy_rate` method (e.g., `0.30`). |
| `pension_vested_rate` | number (0-1) | No | Rate on vested balance. |
| `penalty_rate` | number (0-1) | No | Early withdrawal penalty (US: `0.10`). |
| `tax_rate_source` | `"user_input"` \| `"flat_rate"` | No | Tax rate determination. |
| `roth_contributions_rate` | number (0-1) | Yes | **Key divergence**: `0.30` (Bradford proxy) vs `1.0` (most others). |
| `roth_earnings_follow_traditional` | boolean | Yes | Whether Roth earnings use same rules as Traditional. |
| `distributions_always_zakatable` | boolean | Yes | Whether already-withdrawn funds are zakatable. |
| `description` | string | No | Ruling explanation. |
| `scholarly_basis` | string | No | Evidence and citations. |

**Zakatability Methods:**
| Value | Description | Used By |
|-------|-------------|---------|
| `"full"` | 100% of vested balance | Imam Tahir Anwar (strong ownership) |
| `"net_accessible"` | Balance minus taxes and penalties | AMJA, Hanafi, Shafi'i, Maliki, Hanbali |
| `"conditional_age"` | Exempt below age, then `post_threshold_method` | Sheikh Joe Bradford |
| `"deferred_upon_access"` | Zakat only when withdrawn | Māl ḍimār strict view |
| `"exempt"` | Fully exempt | N/A |

#### 3.6 Real Estate (`assets.real_estate`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `primary_residence.zakatable` | boolean | Yes | Always `false`. |
| `rental_property.zakatable` | boolean | Yes | Property value zakatable? Usually `false`. |
| `rental_property.income_zakatable` | boolean | Yes | Rental income zakatable? Usually `true`. |
| `rental_property.income_rate` | number (0-1) | No | **v2.0.1**: Override Zakat rate for rental income. If set, rental income is taxed at this rate instead of the global 2.5%. Al-Qaradawi: `0.10` (10%, agricultural analogy). Omit for standard rate. |
| `for_sale.zakatable` | boolean | Yes | Property for sale. Usually `true` (trade goods). |
| `for_sale.rate` | number (0-1) | Yes | Rate on for-sale property. |
| `land_banking.zakatable` | boolean | Yes | Land held for appreciation. Usually `true`. |
| `land_banking.rate` | number (0-1) | Yes | Rate on land banking. |

#### 3.7 Business (`assets.business`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cash_receivables_rate` | number (0-1) | Yes | Rate on business cash/receivables. Usually `1.0`. |
| `inventory_rate` | number (0-1) | Yes | Rate on trade inventory. Usually `1.0`. |
| `fixed_assets_rate` | number (0-1) | Yes | Rate on fixed assets. Usually `0.0`. |

#### 3.8 Debts Owed to User (`assets.debts_owed_to_user`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `good_debt_rate` | number (0-1) | Yes | Rate on collectible debts. Usually `1.0`. |
| `bad_debt_rate` | number (0-1) | Yes | Rate on doubtful debts. Usually `0.0`. |
| `bad_debt_on_recovery` | boolean | Yes | Whether bad debt is only zakatable upon recovery. |

#### 3.9 Optional Sections

**Illiquid Assets (`assets.illiquid_assets`)** — Optional.
| Field | Type | Description |
|-------|------|-------------|
| `rate` | number (0-1) | Rate on illiquid assets/livestock. Default `1.0`. |

**Trusts (`assets.trusts`)** — Optional.
| Field | Type | Description |
|-------|------|-------------|
| `revocable_rate` | number (0-1) | Rate on revocable trusts. Default `1.0`. |
| `irrevocable_rate` | number (0-1) | Rate on irrevocable trusts. Default `1.0`. |

### 4. Liabilities (`liabilities`)

Defines how debts are deducted from wealth.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `method` | enum | Yes | Global deduction philosophy. See below. |
| `commercial_debt` | enum | Yes | `"fully_deductible"` / `"deductible_from_business_assets"` / `"none"`. |
| `personal_debt.deductible` | boolean | Yes | Master switch for personal debt deduction. |
| `personal_debt.cap` | `"none"` \| `"total_assets"` \| `"total_cash"` | No | Cap on total deduction. |
| `personal_debt.types.housing` | `"full"` \| `"12_months"` \| `"current_due"` \| `"none"` | No | Mortgage deduction rule. |
| `personal_debt.types.student_loans` | `"full"` \| `"current_due"` \| `"none"` | No | Student loan deduction. |
| `personal_debt.types.credit_cards` | `"full"` \| `"none"` | No | Credit card deduction. |
| `personal_debt.types.living_expenses` | `"full"` \| `"12_months"` \| `"current_due"` \| `"none"` | No | Living expense deduction. |
| `personal_debt.types.insurance` | `"full"` \| `"current_due"` \| `"none"` | No | Insurance premium deduction. |
| `personal_debt.types.unpaid_bills` | `"full"` \| `"none"` | No | Unpaid bills deduction. |
| `personal_debt.types.taxes` | `"full"` \| `"current_due"` \| `"none"` | No | Tax payment deduction. |

**Deduction Methods:**
| Value | Description | Used By |
|-------|-------------|---------|
| `"full_deduction"` | All debts fully deductible | Hanafi, Hanbali, Imam Tahir Anwar |
| `"no_deduction"` | Debts do NOT reduce Zakat | Shafi'i |
| `"12_month_rule"` | Debts due within coming year | Maliki, Sheikh Joe Bradford |
| `"current_due_only"` | Only currently due payments | AMJA |

**Per-Category Rule Values:**
| Value | Behavior |
|-------|----------|
| `"full"` | Annualized (12× monthly) or total balance |
| `"12_months"` | 12 months of payments |
| `"current_due"` | Current month's payment only |
| `"none"` | Not deductible |

---

## Example: Complete Hanafi Configuration

```json
{
  "$schema": "https://zakatflow.org/schemas/zmcs/v2",
  "meta": {
    "id": "hanafi-standard-v2",
    "name": "Hanafi",
    "version": "2.0.0",
    "zmcs_version": "2.0.0",
    "author": "ZakatFlow Official",
    "description": "Classical Hanafi: jewelry zakatable, full debt deduction, net accessible retirement, 100% investments."
  },
  "thresholds": {
    "nisab": {
      "default_standard": "silver",
      "gold_grams": 85.0,
      "silver_grams": 595.0
    },
    "zakat_rate": {
      "lunar": 0.025,
      "solar": 0.02577
    }
  },
  "assets": {
    "cash": { "zakatable": true, "rate": 1.0 },
    "precious_metals": {
      "investment_gold_rate": 1.0,
      "investment_silver_rate": 1.0,
      "jewelry": {
        "zakatable": true,
        "rate": 1.0,
        "description": "Gold and silver jewelry is zakatable regardless of personal use.",
        "scholarly_basis": "Abu Hanifa: gold and silver are inherently monetary (thaman)."
      }
    },
    "crypto": {
      "currency_rate": 1.0,
      "trading_rate": 1.0,
      "staking": { "principal_rate": 1.0, "rewards_rate": 1.0, "vested_only": true }
    },
    "investments": {
      "active_trading_rate": 1.0,
      "passive_investments": {
        "rate": 1.0,
        "treatment": "market_value",
        "description": "100% of market value is zakatable."
      },
      "reits_rate": 1.0,
      "dividends": { "zakatable": true, "deduct_purification": true }
    },
    "retirement": {
      "zakatability": "net_accessible",
      "pension_vested_rate": 1.0,
      "penalty_rate": 0.10,
      "tax_rate_source": "user_input",
      "roth_contributions_rate": 1.0,
      "roth_earnings_follow_traditional": true,
      "distributions_always_zakatable": true,
      "description": "Net accessible: balance minus taxes and penalties."
    },
    "real_estate": {
      "primary_residence": { "zakatable": false },
      "rental_property": { "zakatable": false, "income_zakatable": true, "income_rate": 0.10 },
      "for_sale": { "zakatable": true, "rate": 1.0 },
      "land_banking": { "zakatable": true, "rate": 1.0 }
    },
    "business": {
      "cash_receivables_rate": 1.0,
      "inventory_rate": 1.0,
      "fixed_assets_rate": 0.0
    },
    "debts_owed_to_user": {
      "good_debt_rate": 1.0,
      "bad_debt_rate": 0.0,
      "bad_debt_on_recovery": true
    }
  },
  "liabilities": {
    "method": "full_deduction",
    "commercial_debt": "fully_deductible",
    "personal_debt": {
      "deductible": true,
      "types": {
        "housing": "12_months",
        "student_loans": "full",
        "credit_cards": "full",
        "living_expenses": "12_months",
        "insurance": "full",
        "unpaid_bills": "full",
        "taxes": "full"
      },
      "description": "Full deduction: all debts reduce zakatable wealth.",
      "scholarly_basis": "Al-Kasani: debts to humans weaken ownership strength."
    }
  }
}
```

---

## Cross-Methodology Comparison

### Jewelry Zakatability
| Methodology | Jewelry Zakatable? | Basis |
|-------------|-------------------|-------|
| **Hanafi** | Yes | Gold/silver are monetary by nature |
| **Imam Tahir Anwar** | Yes | Hanafi position |
| **Sheikh Joe Bradford** | Yes | Precautionary (Ahwat) position |
| **AMJA** | No | Majority view (personal adornment exempt) |
| **Shafi'i** | No | Al-Nawawi: permissible use exemption |
| **Maliki** | No | Khalil: personal adornment exempt |
| **Hanbali** | No | Ibn Qudama: majority view |
| **Al-Qaradawi** | No (recommended) | Exempt but paying is "safer" (Ahwat) |

### Passive Investment Treatment
| Methodology | Rate | Treatment | Basis |
|-------------|------|-----------|-------|
| **Hanafi/Shafi'i/Maliki/Hanbali** | 100% | Market value | Stocks = trade goods |
| **Imam Tahir Anwar** | 100% | Market value | Strong ownership |
| **Sheikh Joe Bradford** | 30% | Underlying assets | AAOIFI proxy |
| **Al-Qaradawi** | 30% | Underlying assets | Accepts AAOIFI proxy; uniquely advocates 10% on net profits for industrial companies |
| **AMJA** | 0% (dividends only) | Income only | Exploited asset analogy |

### Retirement (401k/IRA, Age 35)
| Methodology | Method | Zakatable Amount (on $100k) |
|-------------|--------|----------------------------|
| **Sheikh Joe Bradford** | Exempt (<59.5) | $0 |
| **AMJA** | Net accessible | $65,000 (after 25% tax + 10% penalty) |
| **Al-Qaradawi** | Net accessible | $65,000 (accessible = zakatable) |
| **Hanafi/Shafi'i/Maliki/Hanbali** | Net accessible | $65,000 |
| **Imam Tahir Anwar** | Full balance | $100,000 |

### Rental Income Treatment (v2.0.1)
| Methodology | Income Zakatable? | Rate | Basis |
|-------------|-------------------|------|-------|
| **All except Al-Qaradawi** | Yes | 2.5% (global) | Rental income enters standard asset pool |
| **Al-Qaradawi** | Yes | **10%** (override) | Agricultural analogy — rental buildings = land watered by rain (ʿushr rate). Implemented via `income_rate` override in ZMCS v2.0.1 multi-rate calculation. |

### Debt Deduction
| Methodology | Method | Mortgage Treatment | Credit Card |
|-------------|--------|--------------------|-------------|
| **Hanafi/Hanbali/Tahir** | Full deduction | 12 months | Full balance |
| **Bradford** | 12-month rule | 12 months | Full balance |
| **Al-Qaradawi** | 12-month rule | 12 months | Full balance |
| **Maliki** | 12-month rule | 12 months | Full balance |
| **AMJA** | Current due only | This month only | Full balance |
| **Shafi'i** | No deduction | None | None |

---

## Validation

ZMCS configurations are validated at runtime using Zod schemas (`src/lib/config/schema.ts`). The canonical TypeScript types are inferred from these schemas (`src/lib/config/types.ts`).

### Validation Workflow
```
User JSON → ZakatMethodologySchema.safeParse() → Valid Config | Fallback to Default
```

### Compliance Testing
All registered presets are validated by `src/lib/__tests__/zmcs_compliance.test.ts`:
1. **Schema validation** — Every preset passes full Zod validation.
2. **Metadata completeness** — All required fields present.
3. **Calculation sanity** — Produces Zakat > 0 for canonical test case.
4. **Methodology-specific rules** — Jewelry, debt, retirement rules verified.
5. **Documentation completeness** — Description and scholarly_basis strings present.
6. **Cross-methodology comparison** — All 8 presets produce distinct results.

---

## Creating a Custom Configuration

1. Start from a base preset (`src/lib/config/presets/*.ts`).
2. Modify the parameters to match your local fatwa or institutional ruling.
3. Update `meta.id`, `meta.name`, `meta.author`, and `meta.description`.
4. Add `description` and `scholarly_basis` strings to document your choices.
5. Validate with `loadMethodologyConfig(yourConfig)`.

---

*ZMCS v2.0.1 — February 14, 2026*
*ZakatFlow — zakatflow.org*
