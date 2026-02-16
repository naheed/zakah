# Changelog

All notable changes to ZakatFlow are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 🌟 Feature Highlights (Quick Look)
| Version | Major Feature | Released |
|---|---|---|
| **v0.29.0** | 🎨 **Visual & UX Polish** — "Financial Statement" Hero, Scroll Cues, Phosphor Icons | Feb 15, 2026 |
| **v0.28.0** | 🔒 **Security & Classification Overhaul** — AGPL, Two-Tier Encryption, Upload & Plaid Fixes | Feb 15, 2026 |
| **v0.27.2** | 🔧 **ZMCS v2.0.1** — Multi-rate calculation + rental income override | Feb 14, 2026 |
| **v0.27.1** | 📖 **Docs Consolidation** + **Al-Qaradawi Methodology** (8 total) | Feb 14, 2026 |
| **v0.27.0** | 📐 **ZMCS v2.0** (Foundational Standard + 3 Scholar Configs) | Feb 14, 2026 |
| **v0.25.0** | 🧮 **Asset Class Expansion** (Service Business, Land Banking, REITs) | Feb 7, 2026 |
| **v0.18.0** | ✨ **Product Reality** (Live Interactive Demo) | Jan 20, 2026 |
| **v0.14.0** | 📚 **Jurisprudence Overhaul** (5 Distinct Madhabs) | Jan 11, 2026 |
| **v0.13.0** | 🏦 **Plaid Bank Sync** (Connect Bank Accounts) | Jan 11, 2026 |
| **v0.12.0** | ⚙️ **Settings Redesign** (Material 3 UI) | Jan 9, 2026 |
| **v0.11.0** | 🧾 **Donation Tracking** (Receipt Scanning) | Jan 6, 2026 |
| **v0.6.0** | 🕌 **Madhab Support** (4 Schools of Thought) | Jan 3, 2026 |
| **v0.1.0** | 🧠 **AI Extraction** (Asset Intelligence) | Dec 30, 2025 |

---

## [0.29.0] - 2026-02-15 (Visual & UX Polish)

### Changed
- **Hero "Financial Statement" Redesign**
  - Replaced "demo" look with a realistic, data-focused report card
  - Removed "Certified" visual fluff for a cleaner, professional aesthetic
  - Clearly displays `Total Assets - Liabilities = Zakatable Wealth`
- **Icon System Migration**
  - **Complete Phosphor Icons Migration**: Removed `lucide-react` dependency entirely
  - Standardized all icons to `@phosphor-icons/react` (Duotone weight default)
- **Scroll UX Standardization**
  - Added consistent `ArrowDown` scroll chevrons to `ThreeWaysIn` and `WhatsCovered` sections
  - Fixed mobile visibility issues for scroll indicators
- **Footer Refinement**
  - Condensed footer copy to "8 Scholarly Methodologies: Sheikh Joe Bradford (Default), AMJA & Classical Opinions"
  - Moved copy strings to centered `marketing.ts` configuration
- **Privacy Messaging**
  - Refined "Session Encrypted" vs "Zero-Knowledge" badges
  - Updated Trust Badges to "Open Source & Auditable"

### Fixed
- **Mobile Scroll Cues**: Scroll indicators are now visible on all device sizes
- **Design Consistency**: Unified icon styles across Landing, Dashboard, and Settings

## [0.28.0] - 2026-02-15 (Security & Classification Overhaul)

### Added
- **AGPL-3.0 Open Source License**
  - License headers added to 150+ source files across the entire codebase
  - New `LICENSE` file (GNU Affero General Public License v3.0)
  - `package.json` license field updated to `AGPL-3.0-or-later`
  - `scripts/add_license_headers.cjs` automation for future files
- **Two-Tier Encryption Architecture**
  - **Managed Key Mode**: New server-managed encryption key (`managed_key` in `user_profiles`) as a fallback for users who don't want to manage a recovery phrase
  - **CryptoService Upgrade**: `CryptoService.ts` extended with managed key derivation and hybrid encryption support
  - **Privacy Vault Refactor**: `usePrivacyVault.ts` rewritten (~233 lines) to support both Sovereign (user-key) and Managed encryption modes
  - **VaultGuard**: Updated to handle two-tier persistence choice flow
  - DB Migration: `20260214220000_managed_key_schema.sql`
- **Plaid User-Key Encryption**
  - **`plaidEncryptedPersistence.ts`** (290 lines): New encrypted persistence layer for Plaid access tokens using per-user keys
  - **`plaid-cleanup-all`** Edge Function (181 lines): Server-side cleanup that decrypts tokens and revokes all Plaid items
  - **`plaid-exchange-token`** refactor: Now encrypts tokens at exchange time using user-derived keys
  - DB Migration: `20260215100000_plaid_user_key_encryption.sql`
  - Documentation: `docs/PLAID_USER_KEY_ENCRYPTION.md` (143 lines)
- **Open Source Audit**: `docs/OPEN_SOURCE_AUDIT.md` (148 lines) documenting pre-launch findings and remediation strategies
- **Copy Framing Guide**: `docs/COPY_FRAMING.md` (52 lines) establishing accurate privacy claim language
- **Fiqh Explanations Content**: `src/content/fiqhExplanations.ts` (382 lines) — comprehensive scholarly explanations for UI tooltips

### Changed
- **AI Document Classification Rewrite**
  - `parse-financial-document` Edge Function overhauled (238 lines changed) with improved line-item extraction, better category inference, and source-aware classification
  - `ExtractionReview.tsx` upgraded with richer UI for reviewing and correcting AI classifications
  - `useAssetPersistence.ts` refactored for cleaner import flow
- **Plaid Account Classification**
  - `accountImportMapper.ts` rewritten (63 lines) with improved Zakat category mapping from Plaid account/subtype
  - `usePlaidLink.ts` expanded (91 lines) with encrypted persistence and better error handling
  - `AccountCard.tsx` updated to display classification quality indicators
- **Privacy & Terms Updates**
  - `privacy.ts`: Updated claims to accurately distinguish Managed vs. Sovereign encryption modes
  - `terms.ts`: Refreshed terms of service language
  - `PrivacyShield.tsx`: Updated trust badges and privacy claim strings
  - `common.ts`: Updated shared UI strings
  - Auth, Invite, and LogoutSuccess pages: Refined copy
- **PDF Report Updates**: `ZakatPDFDocumentV2.tsx` updated for latest methodology naming
- **Methodology UX**
  - `ActiveMethodologyIndicator.tsx` (125 lines): New persistent indicator showing active madhab
  - `MethodologyExplorer.tsx`: Enhanced visualization and content
  - `MethodologySelector.tsx`: Improved selection UX
  - ZMCS tooltip standardization across all asset steps
  - `MethodologyContributing.tsx`: Expanded contributing guide
- **Supabase Runtime Client**: `runtimeClient.ts` iterated for encrypted client support (multiple stabilization passes)

### Fixed
- **Upload Classification**: Document extraction now properly maps extracted line items to correct Zakat asset categories
- **Plaid Classification**: Bank accounts imported via Plaid now correctly categorize into Cash, Investments, Retirement, etc.
- **Test Cleanup**: Removed 195 lines of deprecated test code; consolidated integration tests

---

## [0.27.3] - 2026-02-14 (Methodology Hardening & Qardawi Verification)

### Changed
- **Terminology Standardization**: "Balanced" preset formally renamed to "**Sheikh Joe Bradford**" (ID: `bradford`) across all UI, Exports, and internal logic to credit the scholarly source.
- **Maliki Liability Logic**: Refined debt deduction to strictly follow config — Living Expenses now deduct 1 month (`current_due`) while Mortgage/Loans remain 12-months (`12_month_rule`).

### Fixed
- **Bradford Retirement Calculation**: Corrected post-59.5 rule to use **30% Proxy** (`market_value * 0.30`) instead of Net Accessible, aligning with the Sheikh's specific rulings.
- **Trust Calculation Safety**: Added robust fallback logic to `calculateTotalAssets` to ensure Trusts are always included in calculations, even if a preset (like Bradford) lacked an explicit trust config block.
- **Qardawi Config**: Added explicit 10% rental income rate (already present, but verified in tests).

### Added
- **Qardawi Test Suite**: Added comprehensive "Ahmed" profile permutation test verifying the interaction of all Qardawi rules (Exempt Jewelry + Net Accessible Retirement + 30% Investments + 12-Month Debts).
- **Export Consistency**: PDF and CSV exports now dynamically resolve methodology names, ensuring reports say "Sheikh Joe Bradford" instead of generic "Balanced".

---

### Added
- **ZMCS v2.0.1 Multi-Rate Calculation Architecture** — Asset-class-specific Zakat rate overrides
  - New optional `rental_property.income_rate` schema field for per-methodology rate override
  - When set, rental income is separated from the standard 2.5% pool and taxed at the override rate
  - Formula: `totalZakat = (standardPool × globalRate) + (overridePool × overrideRate)`
  - `calculateRateOverrides()` function in `src/lib/calculators/assets.ts` for extensible override extraction
  - Backward compatible: when no overrides configured, calculation is identical to v2.0.0
- **6 new rental income rate override tests** — Multi-rate path validation, comparison with standard-rate methodologies, edge case coverage
- **Rental Income Comparison Table** added to ZMCS Specification cross-methodology section

### Changed
- **Al-Qaradawi rental income** — Now **implemented** (was previously documented-only limitation)
  - `income_rate: 0.10` (10% agricultural analogy) in Qaradawi preset
  - $20,000 net rent → $2,000 Zakat (vs $500 at standard 2.5%)
- **`calculateZakat()` engine** — Refactored for multi-rate support with detailed logging
- **Scholarly Differences UI** — Rental property difference now shows "10% applied" instead of "2.5% approximated"
- **ZMCS Specification** updated to v2.0.1 with new `income_rate` field documentation

### Fixed
- Al-Qaradawi's unique rental income position is no longer approximated; it is now precisely calculated

## [0.27.1] - 2026-02-14 (Docs Consolidation + Al-Qaradawi)

### Added
- **Dr. Yusuf Al-Qaradawi Methodology** — 8th ZMCS preset based on *Fiqh al-Zakah*, the most influential modern Zakat treatise
  - Jewelry: Exempt (majority view) but paying recommended (Ahwat)
  - Passive investments: 30% underlying-assets proxy; uniquely advocates 10% on industrial company profits (documented)
  - Retirement: Net accessible value (rejects total exemption)
  - Debt: 12-month rule for modern amortized debts
  - Nisab: Gold standard for stronger economies
  - Rental income: Uniquely 5-10% via agricultural analogy (now implemented at 10% in v0.27.2)
  - Professional income (Zakat al-Mustafad): Immediate Zakat on salary (documented as limitation)
  - Scholarly differences UI: 3 unique positions displayed (industrial profits, rental rate, salary Zakat)
- **Consolidated `docs/SECURITY.md`** — Single authoritative security reference merging OPEN_SOURCE_SECURITY.md, INFORMATION_SECURITY_POLICY.md, and DATA_RETENTION_POLICY.md

### Changed
- **Documentation Consolidation** — Reduced from 18 files to 11 with zero content loss:
  - 3 security/privacy docs → `docs/SECURITY.md`
  - Donation Best Practices → merged into `docs/ZAKAT_JURISPRUDENCE.md` (Section 8)
  - Analytics Setup → merged into `docs/ENGINEERING_DESIGN.md` (Section 5.3)
  - Design System Exceptions → merged into `docs/ENGINEERING_DESIGN.md` (Section 7)
- **`docs/ENGINEERING_DESIGN.md`** — Updated to v0.27.0, ZMCS engine architecture, 8 presets
- **`docs/ZAKAT_JURISPRUDENCE.md`** — Retirement section expanded for all 5 scholar positions (Bradford, AMJA, Tahir Anwar, Al-Qaradawi, Classical). Added distribution best practices
- **`docs/CONTRIBUTING_METHODOLOGY.md`** — Rewritten for ZMCS v2.0 schema with full example config
- **`docs/ZMCS_SPECIFICATION.md`** — Cross-methodology tables updated with Al-Qaradawi
- **`README.md`** — 8 methodologies, ZMCS feature, updated acknowledgments

### Removed
- `walkthrough.md` (obsolete feature walkthrough)
- `docs/UI_TEXT_TRANSFORMATION_PLAN.md` (unimplemented i18n plan)
- `docs/DESIGN_SYSTEM_EXCEPTIONS.md` (content absorbed into Engineering Design)
- `docs/OPEN_SOURCE_SECURITY.md` (merged into SECURITY.md)
- `docs/INFORMATION_SECURITY_POLICY.md` (merged into SECURITY.md)
- `docs/DATA_RETENTION_POLICY.md` (merged into SECURITY.md)
- `docs/DONATION_BEST_PRACTICES.md` (merged into Jurisprudence doc)
- `docs/ANALYTICS_SETUP.md` (merged into Engineering Design)
- `src/content/qaradawi_audit.md` (converted to full ZMCS preset)

---

## [Unreleased]
### Planned
- **Phase 9: Download Report Redesign**
  - Fix WorkSans italic font bug
  - Add machine-readable QR for YoY scanning

## [0.27.0] - 2026-02-14 (ZMCS v2.0 — Foundational Standard)

### Added
- **ZMCS v2.0 Schema Overhaul**
  - **Exhaustive Parameter Model**: 60+ configurable parameters covering every Zakat calculation decision point, each with documentation strings (`description`, `scholarly_basis`).
  - **3 New Scholar Methodologies**:
    - **AMJA** (Assembly of Muslim Jurists of America): Net-withdrawable retirement, exploited-asset view for stocks (dividends only), currently-due debt deduction only.
    - **Imam Tahir Anwar** (Hanafi): Strong ownership — full retirement balance zakatable, all jewelry zakatable, 100% investments.
    - **Sheikh Joe Bradford** (Balanced): Corrected to match his actual positions — jewelry now zakatable, Roth IRA at 30% proxy, post-59.5 retirement uses 30% proxy.
  - **New Schema Fields**: `passive_investments.treatment` (market_value/underlying_assets/income_only), `retirement.post_threshold_method`, `retirement.post_threshold_rate`, `retirement.roth_contributions_rate`, `retirement.roth_earnings_follow_traditional`, `retirement.distributions_always_zakatable`, per-liability type rules for `insurance`, `unpaid_bills`, `taxes`.
  - **New Liability Method**: `current_due_only` for AMJA strict debt deduction.
  - **Rich Documentation**: Every preset carries `description` and `scholarly_basis` strings with hadith references, fiqh citations, and fatwa URLs.
- **ZMCS Specification v2.0** (`docs/ZMCS_SPECIFICATION.md`): Complete rewrite with full field reference tables, cross-methodology comparison charts, and complete JSON example.
- **ZMCS UI Docs** (`src/content/zmcs-docs.ts`): Updated to match v2.0 schema with all new fields.

### Changed
- **Bradford Jewelry Fix**: Corrected from `false` (exempt) to `true` (zakatable) to match Bradford's actual precautionary (Ahwat) position.
- **Bradford Retirement Post-59.5**: Now uses 30% proxy on market value (was incorrectly using net-accessible).
- **Bradford Roth IRA**: Contributions now at 30% proxy rate (was 100%).
- **Madhab Type**: Extended with `'amja'` and `'tahir_anwar'` values.
- **All Classical Presets**: Updated to ZMCS v2.0 schema with new fields (`insurance`, `unpaid_bills`, `taxes` per-liability rules), documentation strings, and scholarly basis citations.

### Fixed
- **Critical: Liability Housing Bug**: Removed accidental `monthlyMortgage * 12 * 30` (360x multiplier) in housing 'full' deduction.
- **Critical: Student Loan Double-Add**: Fixed `studentLoansDue` being added twice for 'full' deduction type.
- **Insurance/Bills Uncontrolled**: Insurance and unpaid bills were always deducted regardless of config; now governed by per-category rules.
- **Tax Deductions**: Tax payments now governed by `liabilities.personal_debt.types.taxes` config (were outside config control).
- **Duplicate Field**: Removed duplicate `hsaBalance` in `ZakatFormData` interface.

---

## [0.26.0] - 2026-02-14 (Methodology Engine)

### Added
- **Dynamic Nisab Calculation**
  - **Live Gold/Silver Prices**: Automated daily fetching of precious metal prices via cron job.
  - **Historical Lookup**: New tool on Methodology page to check Nisab thresholds for any past date.
  - **Database Integration**: `nisab_values` table stores daily snapshots for immutable record-keeping.
- **ZMCS (Zakat Methodology Configuration Standard)**
  - **Schema-Driven Engine**: Replaced hardcoded logic with a flexible, data-driven calculation engine (`src/lib/config`).
  - **Standard Presets**: Official configurations for Hanafi, Shafi'i, Maliki, Hanbali, and Balanced methodologies.
  - **Specification Page**: New `/methodology/zmcs` route documenting the full configuration schema.
  - **Compliance Suite**: Automated tests ensuring all methodologies produce valid results against canonical test cases.

### Changed
- **Methodology Page**: Added "View ZMCS Specification" button and integrated Historical Nisab Lookup tool.
- **Deprecation**: Removed hardcoded `SILVER_PRICE_PER_OUNCE` constants in favor of dynamic fetching (with safe fallbacks).

---

## [0.25.0] - 2026-02-07 (Asset Class Expansion)

### Added
- **3 New Asset Fields**
  - **Service Business Toggle**: Consultants, freelancers, SaaS — hides inventory field and shows al-Qaradawi guidance for net profit calculation.
  - **Land Banking**: New input for undeveloped land held for appreciation. Includes WhyTooltip explaining majority scholarly view (zakatable annually).
  - **REITs**: Equity REITs input with Shariah compliance warning (avoid Mortgage REITs).
- **Test Coverage**
  - REITs madhab test: Balanced 30%, others 100% (follows passive investment rules)
  - Land Banking: 100% across all madhabs (trade goods)
  - Service Business: Confirms flag is UX-only, calculation unchanged
- **Ahmed Example Enhancement**
  - Added REITs ($30k) and Land Banking ($75k) to methodology example
  - New Zakat range: $5,125 (Balanced) → $12,915 (Maliki/Shafi'i)
  - Demonstrates 30%/100% rule for passive investments

### Changed
- `ZakatFormData` interface: Added `isServiceBusiness`, `landBankingValue`, `reitsValue`
- `defaultFormData`: Added default values for new fields
- `fieldToStepMapping`: Added mappings for document extraction
- `calculateAssets()`: Updated to include new fields in calculations

---

## [0.19.0] - 2026-02-07 (Compliance & Clarity)

### Added
- **Jurisprudence Compliance Audit**
  - **Jewelry Governance**: Explicit handling of "Excessive vs Personal" jewelry. Added warning logic to guide users to input excessive amounts as "Investment" for proper Shafii/Maliki calculation.
  - **Precious Metals Split**: distinct input fields for "Investment Gold" vs "Jewelry Gold" to support granular zakatability rules.
  - **References**: Added authoritative citations (Reliance of the Traveller, Mukhtasar Khalil) to methodology content.
- **Content Strategy (3-Tier Model)**
  - **Intro Bar**: Context-aware preamble for each question group.
  - **Deep Links**: "Learn More" now links directly to specific referenced sections in the Methodology page.
  - **Methodology Anchors**: Implemented scroll-on-load for methodology deep links.

### Changed
- **Hanafi Retirement Logic**: Updated documentation to match "Net Accessible" calculation logic, correcting previous claim of total exemption.
- **Test Infrastructure**: Consolidated disjointed test files into `src/lib/__tests__` standard, fixing "0 tests found" error.

### Fixed
- **Precious Metals Bug**: Fixed critical logic error where `zakatableAmount` for metals was incorrectly summing gross value instead of zakatable portion (ignoring exemptions).

## [0.18.0] - 2026-01-20 (Product Reality)

### Added
- **"Product Reality" Landing Page**
  - **Interactive Demo**: A scripted, high-fidelity animation showcasing the app's capability to handle complex portfolios (e.g., "Ahmed's Data").
  - **Live Visualization**: Animated Nivo Sankey chart integrated directly into the hero section loop.
  - **Device Frame**: Custom Safari-style window (`DeviceFrame.tsx`) that adapts to theme while maintaining high contrast.
- **Accessibility Hardening**
  - **Dark Mode Support**: Landing page elements now pass `e2e/accessibility.spec.ts` in strictly emulated Dark Mode.
  - **Contrast Fixes**: Forced "Light Mode" aesthetic for demo frames to ensure text readability (WCAG AA) against any background.
- **Sample Data Downloads**: Direct links to `Preview PDF` and `Download CSV` on the landing page for immediate value proof.

### Changed
- **Design System Audit ("Pixel Style")**
  - **Signal-to-Noise Ratio**: Removed redundant "Pill Badges" (PDF/CSV/Methodology) that competed with primary CTAs.
  - **High-Signal Copy**: Replaced generic subheads with specific, professional value propositions ("Navigate your complex portfolio...").
  - **Visual Hierarchy**: Relocated "Community Metrics" to the Trust Badge cluster for better social proof visibility.
- **Sign-In UX**: Simplified "Sign in to Save" button to standard "Sign In" to reduce cognitive load.

### Fixed
- **Mobile Layout**: Fixed stacking order of Hero vs. Demo components on mobile viewports using `order-*` utilities.
- **Metric Visibility**: Fixed issue where "Community Impact" stats were hidden on smaller screens or below the fold.

## [0.17.0] - 2026-01-16

### Added
- **Legal Standardization**: Standardized "Last Updated" date across Privacy Policy and Terms of Service to a single source of truth (`January 16, 2026`).
- **Test Infrastructure Hardening**: Added `data-testid` attributes to all Currency Inputs and Wizard Steps to support robust E2E automation.

### Fixed
- **Living Expenses Annualization**: Added "We multiply by 12" tooltip and explicit field description to prevent users from accidentally double-annualizing expenses.
- **Unit Test Technical Debt**: Consolidated redundant test suites (`__tests__/zakatCalculations` integrated into main test file) and removed deprecated `calculationMode` logic.
- **E2E Flakiness**: Fixed Precious Metals "Value Tab" selection logic in E2E tests to prevent timeout errors.



### Fixed
- **Critical Calculation Bug (Retirement)**: Fixed tax deduction rate being treated as whole number (25) instead of decimal (0.25), which was zeroing out retirement assets.
- **Critical Calculation Bug (Liabilities)**: Monthly living expenses were not being properly annualized (multiplied by 12), leading to under-deduction of liabilities.
- **UI Redundancy**: Removed duplicate "Hanafi Mode" labels from Report UI, PDF, and CSV exports. Consolidated into single "School of Thought" badge.
- **Sankey Chart Visuals**:
  - **Mobile Layout**: Fixed "squished" chart by implementing dynamic margins.
  - **Asset Visibility**: Fixed bug where non-zakatable Precious Metals were hidden from chart; now flow to "Not Zakatable".
  - **Typography**: Unified footer font sizes.

### Added
- **AI Model Upgrade**: Upgraded document parsing engine to **Gemini 3.0 Flash** for improved accuracy and speed.
- **Refined Madhab Selection**: Updates to Settings and Wizard to properly partial-match madhab keys.

## [0.15.0] - 2026-01-11

### Added
- **Systemic Accessibility Architecture**
  - **Container Tokens**: Introduced Material 3-style tokens (e.g., `bg-tertiary-container`) to `index.css` and Tailwind config. This ensures scientifically calculated contrast ratios (WCAG AA) for tinted backgrounds in both Light and Dark modes, replacing fragile opacity hacks.
  - **Comprehensive Coverage**: New E2E test suite `static-pages-a11y.spec.ts` guaranteeing 0 violations on Auth, Methodology, Privacy, Terms, About, and Logout pages.
- **Semantic Chart Palette**
  - **Psychological Mapping**: Restored intuitive color coding for assets (Blue=Investments, Purple=Retirement, Emerald=Cash, Gold=Crypto) using new durability-focused `chart-*` tokens.
  - **Dark Mode Optimization**: Calibrated saturation/lightness for dark mode readability (~75% Lightness).

### Changed
- **Link Design**: Standardized body links to `text-foreground underline decoration-primary` for accessible high-contrast navigation.
- **Methodology Page**: Refactored status indicators (Include/Deductible) to use semantic `text-success` / `text-destructive` tokens.
- **Assets Page**: Unified icon styling to `text-primary` for a cleaner, brand-aligned visual rhythm.

### Fixed
- **Dark Mode Contrast**: Resolved persistent failures on "About" and "Logout" pages by fixing animation timing in tests and simplifying text color rules.
- **DOM Validity**: Fixed invalid `ul > div > li` nesting in `scroll-reveal` component.

## [0.14.0] - 2026-01-11

### Added
- **5 Distinct Madhab Calculation Modes**
  - Restored separate Shafi'i, Maliki, Hanbali options (previously merged)
  - Each school now has accurate debt deduction logic:
    - **Shafi'i**: No debt deduction (per Al-Nawawi's Al-Majmu')
    - **Hanafi/Hanbali**: Full debt deduction
    - **Maliki/Bradford**: 12-month rule (AAOIFI synthesis)
- **Canonical Jurisprudence Documentation**
  - Added `docs/ZAKAT_JURISPRUDENCE.md` with scholarly sources
  - Added `docs/DONATION_BEST_PRACTICES.md` (Fi Sabil Allah, Forgiving Debt FAQ)
- **Asset-Level Schema for Mudir/Muhtakir**
  - Added `passiveInvestmentIntent` field for Maliki trading distinction (UI pending)

### Changed
- **Renamed "Balanced (AMJA)" → "Balanced (Bradford)"**
  - Research confirmed AMJA and Sheikh Joe Bradford have **different** 401k positions
  - AMJA: Zakatable annually (net withdrawable)
  - Bradford: Exempt if under 59.5 (inaccessible wealth)
  - Label now accurately reflects methodology source

### Fixed
- **SettingsRow forwardRef**: Fixed React warning for Radix trigger compatibility
- **Text DOM nesting**: Fixed `<p>` inside `<div>` violations in typography component
- **Test expectations**: Corrected reversed Bradford/Hanafi investment rate tests

## [0.13.0] - 2026-01-11

### Added
- **Plaid Bank Integration (Phase 4)**
  - **Connect Bank Flow**: Users can now link bank accounts securely via Plaid Link (`PlaidMethod.tsx`).
  - **Automated Sync**: Fetches Account balances and Investment holdings (Stocks, Crypto, etc.).
  - **Smart Mapping**: Auto-maps Plaid asset subtypes to Zakat categories (e.g., `401k` -> `Retirement`, `CD` -> `Cash`).
- **Security Architecture (Critical Upgrade)**
  - **Server-Side Encryption**: Plaid Access Tokens are encrypted using AES-256-GCM with a unique 16-byte random salt per token.
  - **Key Management**: Introduced `PLAID_ENCRYPTION_KEY` (32-byte hex secret) for sovereign encryption control.
  - **Zero-Knowledge Hybrid**: Retains "Privacy Vault" (client-only encryption) for user data while using Server-Side encryption *only* for renewable infrastructure tokens (Plaid).
- **Compliance**
  - **Revocation**: `delete-account` Edge Function now decrypts tokens and calls Plaid's `/item/remove` API to permanently revoke bank access upon account deletion.

## [Unreleased]

### Added
- **Settings Page Redesign**
  - **Expressive Dashboard**: Complete overhaul of `/settings` using Material 3 Expressive design principles.
  - **New Components**: Semantic `SettingsSection`, `SettingsCard`, and `SettingsRow` for consistent UI.
  - **Unified "Danger Zone"**: Consolidated "Clear Local Data" and "Delete Account" into a distinct, high-friction area to prevent accidents.
  - **Interactive Sheets**: Complex selections (Madhab, Nisab, Hawl Date) now use modern bottom sheets/dialogs.
- **Data Deletion Compliance**
  - **Account Deleted Page**: New dedicated landing page (`/account-deleted`) providing confirmation and feedback collection after account deletion.
  - **Cascade Deletion**: Fixed backend logic to correctly cascade deletion to all related asset tables (`portfolios`, `asset_accounts`, etc.).
- **Local Asset Access**
  - **Unauthenticated Vault View**: Users can now view locally stored asset documents in `/assets` without signing in.
  - **Hybrid Dashboard**: "My Assets" page now cleanly separates "Local Documents" (device-only) from "Connected Accounts" (cloud).

### Changed
- **Icon System**: Strict enforcement of `@phosphor-icons/react` across the entire application (removed `lucide-react`).
- **Vault Guard**: Improved "Secure Your Data" modal to be dismissible, allowing guest access to local features without forced setup.
- **Landing Page**: Improved center alignment and responsiveness of the Hero section.

### Fixed
- **401 Deletion Error**: Resolved issue where deleting an account returned a 401 Unauthorized error due to race conditions in token invalidation.
- **Upload Regression**: Fixed regression where clicking "Uploaded Documents" falsely required login.

## [0.11.0] - 2026-01-06

### Added
- **Donation Tracking (Phase 1 MVP)**
  - **New Module**: Full `/donations` route for tracking Zakat payments.
  - **Active Hawl Tracking**: Interactive progress bar for current Zakat year goal vs. paid amount.
  - **AI Receipt Scanning**: Production integration with Gemini 2.0 Flash (via Edge Function) to extract Organization, Amount, Date, and Category from uploaded receipts.
  - **Robust Date System**: Hybrid Gregorian/Hijri support with "Smart Display" (e.g., "18 Rajab 1447 AH") and custom Hawl Date Picker.
  - **Cloud Sync & Migration**:
    - **Logged-in Users**: Data securely stored in Supabase (Postgres) with Row Level Security.
    - **Guest Protection**: LocalStorage encryption (AES-256-GCM).
    - **Magic Migration**: Auto-uploads guest data to cloud upon sign-in.
  - **Intelligent Categories**: Auto-inference of Quranic recipient categories (e.g., "Relief" → "Poor & Needy").

## [0.10.0] - 2026-01-04

### Added
- **Qaradawi Audit & Integration**: Integrated Dr. Yusuf Al-Qaradawi's scholarly opinions into Methodology (Jewelry, Debts, Retirement) where aligned with existing options.
- **Privacy Audit Compliance**: Full alignment between Privacy Policy and codebase.
  - **Client-Side Rounding**: Implemented strictly rounded analytics (Assets to nearest $1k, Zakat to nearest $100) *before* transmission.
  - **AI Transparency**: Explicitly documented AI provider usage in "Information Collection" section.

### Changed
- **Methodology Page**: 
  - Fixed "Joe Bradford" Jewelry ruling to "Zakatable" (Precautionary/Ahwat) to match his actual stance.
  - Added "Evidence" and "Scholarly Basis" fields to Methodology Explorer cards.
- **Privacy Policy**: Clarified "Retention" vs "Collection" language to be technically precise.

## [0.9.0] - 2026-01-03

### Added
- **Unified Guest History**
  - **Local Persistence**: Guest calculations are now securely stored in `localStorage` using session-based encryption.
  - **History Access**: Guests can now view their past reports on the Dashboard and History page, just like signed-in users.
  - **Auto-Save**: Progress is automatically saved locally for guests.
- **Enhanced Guest Dashboard**
  - Guests with history now see the full Dashboard (Hero + Past Reports) instead of the generic landing page.
  - Added "Start New Calculation" implementation that correctly preserves history while resetting active session.

### Fixed
- **History Page Bug**: Resolved issue where "Saved Calculations" page would show empty state despite data existing (restored missing auto-fetch logic).
- **Navigation Logic**: Fixed "Start New" button to correctly advance to the wizard instead of getting stuck on the dashboard.
- **Race Condition**: Added loading states to Dashboard to prevent "Landing Page Flash" while local history is loading.

---
## [0.8.0] - 2026-01-03

### Added
- **UI/UX Overhaul: Signout Experience**
  - **Redesigned Logout Page**: Material 3 Expressive layout with centered branding and "soulful" aesthetics.
  - **Universal Impact Widget**: New `ImpactStats` component unifying referral/impact metrics across the app.
  - **Delightful Animations**: Framer Motion spring animations for all key metrics (People, Assets, Zakat).
  - **Privacy Logic**: Smart thresholding (hides aggregates until 5+ referrals) to protect user privacy.
- **Results Page Polish**
  - **Animated Zakat Hero**: Final Zakat amount now counts up smoothly on load.
  - **Mobile Optimization**: Removed decimal animations for cleaner mobile display and layout stability.
- **Assets**
  - Updated OG Image to new logo for better social sharing previews.

### Changed
- **Visual Language**: Shifted towards "Material 3 Expressive" with softer ambers, rounded corners, and large typography.
- **Component Standardization**: Deprecated ad-hoc `PersonalMetrics` usages in favor of `ImpactStats`.

---
## [0.7.0] - 2026-01-03

### Added
- **Sankey Chart Overhaul**
  - **Granular Flows**: Implemented "Split Net Node" strategy for perfect horizontal alignment of asset flows.
  - **Waterfall Liability Deduction**: Liabilities are now deducted preferentially from Liquid Assets (Cash first -> Investments next) to reduce chart clutter.
  - **Safe ID System**: Internal node IDs are sanitized (e.g., `Cash_Savings`) to prevent crashes with special characters like `&`.
  - **Readability**: Increased default chart height (600px) and sorting by liquidity priority.
- **Report & Export Features**
  - **CSV Export**: Added "Export CSV" button to Results page for detailed offline analysis.
  - **Unified Report UI**: New "Hero" report component consolidating Web, PDF, and CSV data models.
  - **PDF Export Fixes**: Resolved react-pdf rendering issues and font loading bugs.

### Changed
- Refactored `ZakatSankeyChart.tsx` to use Nivo's `ResponsiveSankey` with custom layout engine removed.
- `ResultsStep.tsx` now uses modular Report components (`ReportHero`, `ReportAssetTable`, `ReportFooter`) instead of monolithic file.

---


## [0.6.0] - 2026-01-03

### Added
- **Phase 8: Madhab Support** 
  - `Madhab` type: `hanafi | maliki | shafii | hanbali | balanced`
  - `madhab` field in `ZakatFormData` (default: `balanced`)
  - `'pure'` calculation mode for strict madhab adherence
  - `madhahRules.ts` with `MADHAB_RULES`, `MODE_RULES`, `getScholarlyDifferences()`
  - Madhab selector in Settings page (Calculation Settings section)
- **Methodology: Schools of Thought section**
  - Comprehensive madhab overview with jewelry and debt rulings
  - Hadith evidence for each school's position
  - References to Fiqh al-Zakah, Al-Mughni, AMJA fatwas

### Changed
- Migrated all Supabase imports to `runtimeClient` for Lovable Cloud compatibility
- Restored `.env` to git for Lovable Cloud deployment

### Fixed
- Git repository corruption (force-pushed fresh history)

### Security
- Created `.env.example` with placeholder values
- Removed debug `console.log` statements from `usePresence.ts`
- Ran `npm audit fix` to address `esbuild` vulnerability


## [0.5.0] - 2026-01-02

### Added
- DevTools hub page (`/dev`) consolidating all testing utilities
- **Unified Home Page**: Anonymous users with localStorage sessions now see dashboard instead of landing page
- "Continue where you left off" banner for anonymous users with step progress and relative time
- Sign-in prompt card for anonymous users on dashboard

### Changed
- Updated BACKLOG.md priority table (removed stale entries)
- Updated README.md project structure (Documents → Assets)

### Removed
- Dead code: `useOptimisticUpdate.ts`, `NavLink.tsx`

## [0.4.0] - 2026-01-02

### Added
- **Account Deletion (Security Fix)**: `delete-account` Edge Function for true auth user deletion
- **DevTools Page**: Consolidated testing entry point at `/dev`

### Fixed
- **P0 Auth Bug**: Logout now properly clears all tokens and sessions
- **Account Deletion**: Previously only deleted data, not auth user (security risk)
- **Date Extraction**: AI now correctly extracts dates in YYYY-MM-DD format
- **Negative Days Bug**: Fixed "Updated -1764 days ago" display issue

### Changed
- Settings "Documents" link now points to Assets page
- Removed "Continue Calculation" popup on re-login

### Removed
- Legacy `Documents.tsx` page (replaced by Assets)
- `ContinueSessionDialog.tsx` (no longer needed)

---

## [0.3.0] - 2026-01-01

### Added
- **Logout Success Page**: Beautiful post-logout experience with community metrics
- **Account Deduplication**: AI now extracts `accountName` for proper account separation
- **Compact AccountCard**: Variant for dashboard preview
- **Personalized Welcome**: Dashboard shows user's first name

### Fixed
- Referral code regeneration bug for signed-in users
- Multiple Schwab accounts merging incorrectly

### Changed
- Post-logout redirects to `/logout` instead of home
- Dashboard shows actual account cards (not just "Add" button)

---

## [0.2.0] - 2025-12-31

### Added
- **Asset Dashboard** (`/assets`): View all connected accounts
- **Account Detail Page** (`/assets/:id`): Statement history and line items
- **Add Account Flow** (`/assets/add`): Upload, manual entry, API stub
- **V2 Persistence**: `useAssetPersistence` hook for new data model
- **Delete Account Feature**: Remove accounts with cascade delete

### Changed
- V2 extraction integrated into wizard upload flow
- Toast notifications for successful asset saves

---

## [0.1.0] - 2025-12-30

### Added
- **V2 Extraction Engine**: Granular line-item extraction from documents
- **ExtractionTest Page**: Testing UI with pagination and category summary
- **useDocumentParsingV2**: New hook for V2 document parsing
- **Category Mapping**: `mapLineItemToLegacyField()` for backward compatibility

### Changed
- Updated Gemini system prompt for detailed line-item extraction
- Edge function returns `lineItems[]` with `inferredCategory` and `confidence`

---

## [0.0.1] - 2025-12-29 (Foundation)

### Added
- Database schema: `portfolios`, `asset_accounts`, `asset_snapshots`, `asset_line_items`
- TypeScript interfaces in `src/types/assets.ts`
- `useZakatFormAdapter` hook for V2 → Legacy bridging
- Debug component `ZakatAdapterTest.tsx`

---

## Versioning Policy

- **Major (X.0.0)**: Breaking changes, major feature releases
- **Minor (0.X.0)**: New features, significant improvements
- **Patch (0.0.X)**: Bug fixes, documentation updates

## Milestone Checklist

Update this changelog when:
- [ ] Completing a BACKLOG phase
- [ ] Fixing P0/P1 bugs
- [ ] Deploying new Edge Functions
- [ ] Making breaking changes
- [ ] Before major releases
