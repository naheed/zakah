# Zakat Methodology Configuration Standard (ZMCS) v1.0

## Overview
The **Zakat Methodology Configuration Standard (ZMCS)** is a JSON-based schema designed to encapsulate the diverse juristic opinions (Madhahib) regarding Zakat calculation. It allows the ZakatFlow engine to completely change its calculation logic—definitions of wealth, zakatability thresholds, rates, and deductions—simply by loading a different configuration object.

## Core Philosophy
1.  **Immutability**: A configuration defines a fixed set of rules.
2.  **Portability**: The schema is serializable to JSON, allowing methodologies to be shared, versioned, and stored.
3.  **Completeness**: The config must provide values for *every* decision point in the calculation.

## Schema Reference

### 1. Metadata (`meta`)
Describes the configuration file itself.
- `id` (string): Unique identifier (e.g., `hanafi-standard-v1`).
- `name` (string): Human-readable title (e.g., "Hanafi Standard").
- `version` (string): Semantic version of this specific config file.
- `author` (string): Who created this config (Scholar, Org, or User).
- `description` (string): Brief summary of the methodology's approach.

### 2. Thresholds (`thresholds`)
Defines the baseline numbers for Zakat liability.
- `nisab`:
    - `default_standard` ("gold" | "silver"): Which metal determines the Nisab.
    - `gold_grams` (number): Grams of gold for Nisab (usually 85g or 87.48g).
    - `silver_grams` (number): Grams of silver for Nisab (usually 595g or 612.36g).
- `zakat_rate`:
    - `lunar` (number): Rate for lunar year (standard: 0.025).
    - `solar` (number): Rate for solar year (standard: 0.02577).

### 3. Assets (`assets`)
Defines zaktability for each asset class.

#### Metals
- `gold_jewelry` / `silver_jewelry`:
    - `zakatable` (boolean): Is personal jewelry zakatable?
    - `usage_exemption` (boolean): Is there an exemption for "permissible use"?

#### Retirement (401k/IRA)
- `zakatability` ("full" | "net_accessible" | "conditional_age" | "deferred_upon_access" | "exempt"):
    - `full`: 100% of vested balance.
    - `net_accessible`: Balance minus taxes and penalties (standard AMJA view).
    - `conditional_age`: Exempt if under a certain age (e.g., 59.5), otherwise net accessible (Bradford view).
    - `deferred_upon_access`: Zakat due only when funds are withdrawn.
    - `exempt`: Not zakatable.
- `exemption_age` (number?): Age threshold for `conditional_age` (default 59.5).
- `penalty_rate` (number?): Early withdrawal penalty rate (default 0.10).
- `tax_rate_source` ("user_input" | "flat_rate" | "estimated"): How to determine tax deduction.

#### Investments
- `passive_investments`:
    - `rate` (number): The percentage of the asset value that is zakatable (e.g., 1.0 for 100%, 0.3 for 30%).
- `active_investments`:
    - `rate` (number): Usually 1.0 (100%).

#### Real Estate
- `rental_property`:
    - `zakatable` (boolean): Is the property value itself zakatable? (Usually `false`).
    - `income_zakatable` (boolean): Is the rental income zakatable? (Usually `true`).

### 4. Liabilities (`liabilities`)
Defines how debts are deducted from wealth.
- `method` ("no_deduction" | "full_deduction" | "12_month_rule"):
    - `"no_deduction"`: Debts do not reduce Zakat liability (Shafi'i).
    - `"full_deduction"`: All debts reduce liability (Hanafi).
    - `"12_month_rule"`: Only debts due within the coming year reduce liability (Maliki/Bradford).
- `commercial_debt`: Treatment of business debts.
- `personal_debt`:
    - `deductible` (boolean): Are personal debts deductible?
    - `types`: Granular control for `housing`, `student_loans`, etc. (e.g., "full", "12_months", "current_due", "none").

## Example Configuration (Hanafi)
```json
{
  "meta": { "id": "hanafi", "name": "Hanafi Standard" },
  "assets": {
    "gold_jewelry": { "zakatable": true },
    "retirement": { "zakatability": "net_accessible" }
  },
  "liabilities": { "method": "full_deduction" }
}
```
