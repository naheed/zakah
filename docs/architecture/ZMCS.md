# Architecture: Zakat Methodology Configuration Schema (ZMCS)

## Conceptual Overview
ZMCS is the core calculation engine of ZakatFlow (`@zakatflow/core`). It operates on a **Configuration-Driven Strategy Pattern**. 

Instead of hardcoding fiqh (jurisprudence) rules as function logic, rules are extracted into standard JSON-like TypeScript configurations. This specific architectural choice was made to solve a primary domain problem: **Make it easy for Islamic scholars and domain experts to read, verify, and write config files without needing to know how to code.**

## The Three Layers

1. **User Input (`ZakatFormData`)**: A monolithic superset of all possible questions. It collects the raw financial data regardless of the active methodology.
2. **The Schema (`ZakatMethodologyConfig`)**: The human-readable preset. Contains semantic levers (e.g., `exemption_age: 59.5`) and string documentation (`scholarly_basis`).
3. **The Execution Engine (`calculators/` & `zakatCalculations.ts`)**: The interpreter. It evaluates the raw data against the selected schema's levers.

## Why Configuration-Driven?

If we built a pure, decoupled Strategy Pattern or a JSONLogic AST, scholars would have to write executable code or complex JSON trees to define a methodology.

By keeping the config "dumb" and readable:
```typescript
retirement: {
    zakatability: 'conditional_age',
    exemption_age: 59.5,
    post_threshold_rate: 0.30,
    description: '401k/IRA exempt under 59.5...'
}
```
A scholar can instantly verify that the `exemption_age` is `59.5`.

### Engine Responsibility
**Rule of Thumb:** The engine must absorb all technical complexity. If a new methodology requires logic that doesn't fit existing levers (e.g., "Current month debt deduction" vs "Annualized 12-month debt deduction"), engineers must update the Engine to support a new semantic lever (`housing: 'current_due'`) rather than forcing scholars to write code.

## File Structure
- `packages/core/src/config/presets/` - Home of the human-readable schemas (e.g., `bradford.ts`, `tahir_anwar.ts`).
- `packages/core/src/calculators/` - The execution engine that parses the config.
- `packages/core/src/zakatTypes.ts` - Central definitions.

## Schema Levers to Note
- **Multi-Rate Support**: Certain assets (like rental income) can be configured to be taxed at distinct rates (e.g., 10%) instead of the global lunar 2.5%, handled by `calculateRateOverrides`.
- **Debt Deductibility**: The `liabilities` config supports granular toggles for annualizing (×12) vs taking only the current month's due, allowing strict compliance with different fatwas.
