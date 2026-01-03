# Changelog

All notable changes to ZakatFlow are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

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

### Security
- Added `.env` to `.gitignore` (was previously tracked - CRITICAL FIX)
- Created `.env.example` with placeholder values for safe distribution
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
