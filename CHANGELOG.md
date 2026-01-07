# Changelog

All notable changes to ZakatFlow are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- **Phase 9: Download Report Redesign**
  - Fix WorkSans italic font bug
  - Add user name, Hijri date, madhab settings to PDF
  - Add machine-readable QR for YoY scanning
  - Add referral metrics (privacy-safe)

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
