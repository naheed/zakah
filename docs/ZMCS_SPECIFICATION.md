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
- `zakatable` (boolean): Is the fund zakatable?
- `valuation_method` ("accessible_value" | "total_value"):
    - `total_value`: 100% of the balance.
    - `accessible_value`: Balance minus taxes and penalties (Net withdrawal value).

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
- `method`:
    - `"no_deduction"`: Debts do not reduce Zakat liability (Shafi'i/Hanbali common view).
    - `"deduct_all_debts"`: All debts reduce liability.
    - `"deduct_commercial_only"`: Only business debts reduce liability.
    - `"deduct_immediate_only"`: Only debts due immediately reduce liability.
- `deferred_cap_months` (number): If deducting deferred debts (like mortgage), how many months are allowed? (e.g., 12 months).

## Example Configuration (Hanafi)
```json
{
  "meta": { "id": "hanafi", "name": "Hanafi Standard" },
  "assets": {
    "gold_jewelry": { "zakatable": true },
    "retirement": { "valuation_method": "accessible_value" }
  },
  "liabilities": { "method": "deduct_all_debts" }
}
```
