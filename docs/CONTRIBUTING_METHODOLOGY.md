# Contributing a New Zakat Methodology

## Overview
The **Zakat Methodology Configuration Standard (ZMCS)** allows ZakatFlow to support diverse fiqh opinions through a data-driven configuration system. This guide details the steps to add a new methodology (e.g., a specific Madhab view, a scholar's opinion, or an organizational standard).

## The "Gold Standard" Contribution Process

To ensure accuracy and trust, every new methodology must adhere to the following steps:

### 1. Define the Configuration
Create a new TypeScript file in `src/lib/config/presets/` (e.g., `my_methodology.ts`).
- **Base Config**: Start by copying an existing preset (like `hanafi.ts` or `shafii.ts`).
- **Metadata**: strictly define the `meta` section with a unique ID, descriptive name, and source attribution.
- **Rules**: Adjust the `assets`, `liabilities`, and `thresholds` sections according to the valid references.

```typescript
export const MY_METHODOLOGY_CONFIG: ZakatMethodologyConfig = {
  meta: {
    id: 'my-methodology-v1',
    name: 'My Custom View',
    version: '1.0.0',
    calculators: { ... }
  },
  // ... rules
};
```

### 2. Register the Preset
Add your new config to `src/lib/config/presets/index.ts`:
```typescript
import { MY_METHODOLOGY_CONFIG } from './my_methodology';

export const ZAKAT_PRESETS = {
  // ...
  'my-methodology': MY_METHODOLOGY_CONFIG,
};
```

### 3. Verify Compliance
We use a **Compliance Test Suite** to ensure all methodologies meet the system's standards.
Run the compliance test:
```bash
npm test src/lib/__tests__/zmcs_compliance.test.ts
```
This ensures:
- The config object is structurally valid (Schema check).
- It produces a calculation > 0 for our canonical "Super Ahmed" test case.
- It does not crash the calculator.

### 4. Add Canonical Test Case (Optional but Recommended)
If your methodology has unique rules (e.g., "Tax 401k at 50%"), add a specific test case in the `Specific Rule Checks` section of `src/lib/__tests__/zmcs_compliance.test.ts` to verify this behavior.

### 5. Update Documentation
Add a brief description of your methodology and its key distinguishing rules to the user-facing documentation (to be added in `/docs/methodologies.md`).

## Reference: The "Super Ahmed" Canonical Profile
We test all methodologies against "Super Ahmed" to ensure baseline rationality.
- **Cash**: $100,000
- **401k**: $100,000 (Vested)
- **Investments**: $100,000 (Passive)
- **Gold**: $5,000 (Jewelry)
- **Age**: 30

*Expected Output*: Zakat Due > $0 and Zakat Rate = 2.5% (usually).
