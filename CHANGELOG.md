# Changelog

All notable changes to ZakatFlow are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 🌟 Feature Highlights (Quick Look)
| Version | Major Feature | Released |
|---|---|---|
| **v0.14.0** | 📚 **Jurisprudence Overhaul** (5 Distinct Madhabs) | Jan 11, 2026 |
| **v0.13.0** | 🏦 **Plaid Bank Sync** (Connect Bank Accounts) | Jan 11, 2026 |
| **v0.12.0** | ⚙️ **Settings Redesign** (Material 3 UI) | Jan 9, 2026 |
| **v0.11.0** | 🧾 **Donation Tracking** (Receipt Scanning) | Jan 6, 2026 |
| **v0.6.0** | 🕌 **Madhab Support** (4 Schools of Thought) | Jan 3, 2026 |
| **v0.1.0** | 🧠 **AI Extraction** (Asset Intelligence) | Dec 30, 2025 |

---

## [Unreleased]

### Planned
- **Phase 9: Download Report Redesign**
  - Fix WorkSans italic font bug
  - Add user name, Hijri date, madhab settings to PDF
  - Add machine-readable QR for YoY scanning
  - Add referral metrics (privacy-safe)

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
