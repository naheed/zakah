# Contributing a New Zakat Methodology

## Overview

The **Zakat Methodology Configuration Standard (ZMCS)** allows ZakatFlow to support diverse fiqh opinions through a data-driven configuration system. Rather than hardcoding scholarly rulings, each methodology is defined as a JSON-compatible TypeScript configuration validated against a Zod schema.

This guide details the steps to add a new methodology — whether a specific Madhab view, a scholar's opinion, or an institutional standard.

> Full schema reference: [ZMCS_SPECIFICATION.md](ZMCS_SPECIFICATION.md)

---

## The "Gold Standard" Contribution Process

### 1. Define the Configuration

Create a new TypeScript file in `src/lib/config/presets/` (e.g., `my_methodology.ts`).

- **Base Config**: Start by copying an existing preset (e.g., `hanafi.ts` or `amja.ts`)
- **Metadata**: Define the `meta` section with a unique ID, descriptive name, author, ZMCS version, and source attribution
- **Rules**: Configure `thresholds`, `assets`, and `liabilities` sections according to scholarly references
- **Documentation**: Every section must include `description` and `scholarly_basis` strings citing authoritative sources

```typescript
import { ZakatMethodologyConfig } from '../types';

/**
 * My Custom Methodology — ZMCS v2.0 Configuration
 *
 * Based on [source scholar/institution] rulings on Zakat calculation.
 * Key positions:
 *   - Jewelry: [zakatable/exempt]
 *   - Retirement: [method]
 *   - Debt: [method]
 *   - Passive Investments: [treatment]
 */
export const MY_METHODOLOGY_CONFIG: ZakatMethodologyConfig = {
  meta: {
    id: 'my-methodology-v1',
    name: 'My Custom Methodology',
    version: '1.0.0',
    zmcs_version: '2.0.0',
    author: 'Scholar Name / Institution',
    description: 'Brief summary of key positions and approach.',
    ui_label: 'My Methodology',
    scholar_url: 'https://example.com/scholar',
    certification: {
      certified_by: 'Scholar Name',
      date: '2026-01-01',
      url: 'https://example.com/fatwa',
    },
  },
  thresholds: {
    nisab: {
      default_standard: 'gold',  // or 'silver'
      gold_grams: 85,
      silver_grams: 595,
      description: 'Standard Nisab using [gold/silver] threshold.',
    },
    zakat_rate: {
      lunar: 0.025,
      solar: 0.02577,
      description: 'Standard 2.5% lunar rate.',
    },
  },
  assets: {
    cash: {
      zakatable: true,
      rate: 1.0,
      description: 'All liquid cash is zakatable.',
      scholarly_basis: 'Unanimous consensus across all schools.',
    },
    precious_metals: {
      investment_gold_rate: 1.0,
      investment_silver_rate: 1.0,
      jewelry: {
        zakatable: true,  // or false — key differentiator
        rate: 1.0,
        conditions: ['personal_use'],
        description: 'Explain the jewelry position.',
        scholarly_basis: 'Cite hadith or fiqh reference.',
      },
    },
    crypto: {
      currency_rate: 1.0,
      trading_rate: 1.0,
      staking: { principal_rate: 1.0, rewards_rate: 1.0, vested_only: true },
    },
    investments: {
      active_trading_rate: 1.0,
      passive_investments: {
        rate: 0.30,  // or 1.0 or 0.0
        treatment: 'underlying_assets',  // or 'market_value' or 'income_only'
        description: 'Explain passive investment treatment.',
        scholarly_basis: 'Cite AAOIFI, fiqh source, etc.',
      },
      reits_rate: 0.30,
      dividends: { zakatable: true, deduct_purification: true },
    },
    retirement: {
      zakatability: 'net_accessible',
      // Options: 'full', 'net_accessible', 'conditional_age', 'deferred_upon_access', 'exempt'
      penalty_rate: 0.10,
      roth_contributions_rate: 1.0,
      roth_earnings_follow_traditional: true,
      distributions_always_zakatable: true,
      description: 'Explain the retirement approach.',
      scholarly_basis: 'Cite fatwa or classical precedent.',
    },
    real_estate: {
      primary_residence: { zakatable: false },
      rental_property: { zakatable: false, income_zakatable: true },
      for_sale: { zakatable: true, rate: 1.0 },
      land_banking: { zakatable: true, rate: 1.0 },
    },
    business: {
      cash_receivables_rate: 1.0,
      inventory_rate: 1.0,
      fixed_assets_rate: 0.0,
    },
    debts_owed_to_user: {
      good_debt_rate: 1.0,
      bad_debt_rate: 0.0,
      bad_debt_on_recovery: true,
    },
  },
  liabilities: {
    method: '12_month_rule',
    // Options: 'full_deduction', 'no_deduction', '12_month_rule', 'current_due_only'
    commercial_debt: 'fully_deductible',
    personal_debt: {
      deductible: true,
      types: {
        housing: '12_months',
        student_loans: 'current_due',
        credit_cards: 'full',
        living_expenses: '12_months',
        insurance: 'current_due',
        unpaid_bills: 'full',
        taxes: 'full',
      },
      description: 'Explain the debt deduction philosophy.',
      scholarly_basis: 'Cite ruling on debt deduction.',
    },
  },
};
```

### 2. Register the Preset

Add your new config to `src/lib/config/presets/index.ts`:

```typescript
import { MY_METHODOLOGY_CONFIG } from './my_methodology';

export const ZAKAT_PRESETS: Record<string, ZakatMethodologyConfig> = {
  // ... existing presets
  'my-methodology': MY_METHODOLOGY_CONFIG,
};
```

Also add the methodology key to the `Madhab` type in `src/lib/zakatTypes.ts` and add a display entry in `src/lib/madhahRules.ts`.

### 3. Verify Compliance

We use a **Compliance Test Suite** to ensure all methodologies meet the system's standards. Run the tests:

```bash
npm test src/lib/__tests__/zmcs_compliance.test.ts
```

This validates:
- **Schema Validation**: Config passes the Zod schema
- **Metadata Completeness**: Required fields are populated, ZMCS version is declared
- **Calculation Sanity**: Zakat > $0 for the canonical "Super Ahmed" test profile
- **Documentation Completeness**: `description` and `scholarly_basis` fields are present in key sections
- **No Engine Crashes**: The calculator runs without errors

### 4. Add Specific Test Cases (Recommended)

If your methodology has unique rules, add targeted test cases in `src/lib/__tests__/zmcs_compliance.test.ts`. For example:

```typescript
it('should apply [your unique rule] for my-methodology', () => {
  const config = ZAKAT_PRESETS['my-methodology'];
  // Test specific behavior
  expect(config.assets.retirement.zakatability).toBe('net_accessible');
});
```

### 5. Update Documentation

- Add your methodology to the cross-methodology comparison tables in [ZMCS_SPECIFICATION.md](ZMCS_SPECIFICATION.md)
- Update the methodology count in the [README](../README.md)
- If introducing a novel ruling or concept, add scholarly context to [ZAKAT_JURISPRUDENCE.md](ZAKAT_JURISPRUDENCE.md)

---

## Scholar Audit Process

ZakatFlow presets are authored based on published scholarly sources, but they carry greater authority when reviewed and certified by the relevant scholar or institution. We are actively seeking contributors to facilitate this process.

### How to Submit a Preset for Audit

1. **Open a GitHub issue** titled "ZMCS Audit Request: [Methodology Name]"
2. **Include in the issue:**
   - The preset file path (e.g., `packages/core/src/config/presets/hanafi.ts`)
   - The scholar or institution you are submitting for review
   - Relevant fatwa URLs, publication references, or contact information
3. **Tag the issue** with the `zmcs-audit` label
4. The maintainer will coordinate outreach to the scholar or institution

### Upon Certification

When a scholar or institution endorses a preset, the `meta.certification` field is populated:

```typescript
certification: {
  certified_by: 'Scholar Name or Institution',
  date: '2026-MM-DD',
  url: 'https://link-to-endorsement-or-fatwa',
}
```

The preset's status in the verification table (see [CONTRIBUTING.md](../../CONTRIBUTING.md)) is updated to "Verified."

---

## Preset Verification Status

| Preset Key | Scholar / Institution | Verification Status | Certified By |
|:---|:---|:---|:---|
| `balanced` | Sheikh Joe Bradford | Awaiting audit | — |
| `amja` | Assembly of Muslim Jurists of America | Awaiting audit | — |
| `tahir_anwar` | Imam Tahir Anwar (Hanafi) | Awaiting audit | — |
| `qaradawi` | Dr. Yusuf Al-Qaradawi | Awaiting audit | — |
| `hanafi` | Hanafi Classical | Awaiting audit | — |
| `shafii` | Shafi'i Classical | Awaiting audit | — |
| `maliki` | Maliki Classical | Awaiting audit | — |
| `hanbali` | Hanbali Classical | Awaiting audit | — |

If you are a scholar, student of knowledge, or representative of an Islamic body and would like to audit a preset, please contact [naheed@vora.dev](mailto:naheed@vora.dev) or open an issue on [GitHub](https://github.com/naheed/zakah/issues).

---

## Existing Presets for Reference

| Preset Key | File | Scholar/School |
| :--- | :--- | :--- |
| `balanced` | `defaults.ts` | Sheikh Joe Bradford |
| `amja` | `presets/amja.ts` | Assembly of Muslim Jurists of America |
| `tahir_anwar` | `presets/tahir_anwar.ts` | Imam Tahir Anwar (Hanafi) |
| `qaradawi` | `presets/qaradawi.ts` | Dr. Yusuf Al-Qaradawi (Fiqh al-Zakah) |
| `hanafi` | `presets/hanafi.ts` | Hanafi Classical |
| `shafii` | `presets/shafii.ts` | Shafi'i Classical |
| `maliki` | `presets/maliki.ts` | Maliki Classical |
| `hanbali` | `presets/hanbali.ts` | Hanbali Classical |

Study these presets to understand how different scholarly positions map to ZMCS fields.
