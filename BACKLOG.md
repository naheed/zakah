# ZakatFlow V2 Migration Backlog

**Architecture Migration:** From Form-Centric Calculator → Asset-Centric Wealth OS

---

## Phase 1: Foundation (Data Layer) ✅ COMPLETE

> **Goal:** Create new tables and Types without breaking the existing UI.

- [x] **Schema Migration** - Created `portfolios`, `asset_accounts`, `asset_snapshots`, `asset_line_items` tables
- [x] **TypeScript Interfaces** - Created `src/types/assets.ts` with `AssetPortfolio`, `AssetAccount`, `AssetSnapshot`, `AssetLineItem`
- [x] **Adapter Pattern** - Built `useZakatFormAdapter` hook to bridge new data → old `ZakatFormData`
- [x] **Debug Component** - Created `ZakatAdapterTest.tsx` for verifying adapter logic

---

## Phase 2: Ingestion Engine (AI Extraction) ✅ COMPLETE

> **Goal:** High-fidelity line-item extraction from financial documents.

- [x] **Prompt Engineering** - Updated Gemini system prompt for granular line-item extraction
- [x] **Edge Function Update** - `parse-financial-document` returns `lineItems[]` with `inferredCategory` and `confidence`
- [x] **Category Mapping** - Built `mapLineItemToLegacyField()` for backward compatibility
- [x] **Frontend Hook** - Created `useDocumentParsingV2` for V2 extraction
- [x] **Test Page** - Created `ExtractionTest.tsx` with pagination & category summary
- [x] **V2 Persistence** - `useAssetPersistence` hook stores to V2 tables on upload
- [x] **Deploy & Verify** - Deployed via Lovable

---

## Phase 3: Asset Dashboard (UI Overhaul) ✅ COMPLETE

> **Goal:** User visibility and control over extracted data.

- [x] Delete all data
- [x] Delete account
- [ ] **Compliance:** Send confirmation email upon account deletion (Policy 3.2)
- [x] New route `/assets` showing cards for each connected account
- [x] AccountCard component with icons, badges, stale indicators
- [x] `/assets/add` with modular Add flow (Upload/Manual/API stub)
- [x] `/assets/:accountId` detail page with snapshots and line items
- [x] V2 persistence integrated into wizard upload with toast
- [ ] **Deferred:** Smart Confidence Flagging
- [ ] **Deferred:** Zakat category editing per line item

---

## Phase 3.5: Post-Login Dashboard Polish ✅ COMPLETE

> **Goal:** Improve returning user experience with clear information hierarchy.

- [x] Redesign `WelcomeStep.tsx` with priority-based layout
- [x] Add Assets preview section with "Add Account" card
- [x] Reorganized layout: P0 Resume → P1 Assets → P3 Referral
- [x] **BUG FIX:** Referral code regeneration (checks `userId` first, localStorage cache)
- [ ] Past reports placeholder (blocked on `/reports` route)

---

## Phase 3.6: Footer & Personal Metrics ✅ COMPLETE

> **Goal:** Consistent footer and motivational personal referral metrics.

- [x] Create `PersonalMetrics.tsx` with privacy threshold (>5 users)
- [x] Add Footer to WelcomeStep dashboard view
- [x] Integrate PersonalMetrics into LogoutSuccess
- [ ] **Deferred:** Wire up referral stats to PersonalMetrics on WelcomeStep

---

## Phase 9: Download Report Redesign ✅ COMPLETE

> **Goal:** Fix PDF bugs, add user info, madhab settings, referral metrics, and machine-readable YoY data.

### 9.1 Fix Font Bug (Blocking) ✅
- [x] Register WorkSans italic or remove italic usage
- [x] Verify PDF download works

### 9.2 Content Spec (For UX Designer) ✅
- [x] User name + Hijri date in header
- [x] Madhab setting in Configuration
- [x] Methodology summary (key rulings applied)

### 9.3 Implementation ✅
- [x] Update `ZakatPDFData` interface
- [x] Pass user info, madhab, referral stats to PDF (V2 generator)
- [x] Add CSV Export feature

---

## Phase 10: Visualization Improvements (Sankey) ✅ COMPLETE

> **Goal:** Make the Zakat flow visualization accurate, readable, and beautiful.

- [x] **Granular Flows**: Assets flow individually to Zakat node (Rainbow output)
- [x] **Waterfall Logic**: Deduct liabilities from Cash first
- [x] **Safe Processing**: Sanitize IDs to prevent special character crashes
- [x] **Tooltip Cleanup**: Unified tooltips for Nodes and Links

---

## Phase 4: Account Connections (Plaid API) ⬜ PLANNED

> **Goal:** Enable automatic bank/brokerage sync via Plaid.

### 4.1 Plaid Integration
- [ ] Set up Plaid account and get API keys
- [ ] Create `/api/plaid/link-token` Edge Function
- [ ] Create `/api/plaid/exchange-token` Edge Function  
- [ ] Implement `PlaidMethod.tsx` in Add Account flow
- [ ] Store Plaid access tokens securely (encrypted)
- [ ] Fetch accounts and balances on demand
- [ ] Map Plaid account types to V2 `AccountType` enum
- [ ] **Compliance:** Implement `/item/remove` in `delete-account` function (Policy 3.1)

### 4.2 Recurring Sync
- [ ] Background job to refresh balances daily/weekly
- [ ] Handle Plaid webhook for real-time updates
- [ ] User controls: enable/disable auto-sync per account

---

## Phase 5: Charity Partner Program ⬜ PLANNED

> **Goal:** Enable charities to integrate ZakatFlow, maintain their lead gen while we handle calculation.

### Strategy Considerations
| Option | Charity Gets | We Get | Lead Gen |
|--------|--------------|--------|----------|
| **Embed Widget** | Calculator on their site | Traffic attribution | Charity keeps 100% |
| **White-Label** | Branded calculator | Subscription fee | Charity keeps 100% |
| **Referral Link** | Branded landing page | Free users | Shared (we capture email) |
| **API Integration** | Raw calculation engine | API fees | Charity keeps 100% |

### Recommended: Embed Widget + Attribution
- Low friction for charity adoption
- Co-branded experience ("Powered by ZakatFlow")
- We get SEO backlinks + brand awareness
- Charity retains full control of donor relationship

### 5.1 Charity Portal (`/charities`)
- [ ] Landing page explaining partnership options
- [ ] Self-serve embed code generator
- [ ] Attribution dashboard (how many calcs from their widget)
- [ ] Contact form for white-label inquiries

### 5.2 Embeddable Widget
- [ ] Standalone JS widget (`<script>` embed)
- [ ] Configurable branding (charity logo, colors)
- [ ] Callback when calculation complete (for charity CRM)
- [ ] Privacy-preserving: no PII shared, only calc totals

---

## Phase 6: Reports & History ⬜ PLANNED

> **Goal:** Historical record of Zakat calculations.

- [ ] `/reports` view listing "Frozen" Zakat Reports
- [ ] Each report stores frozen params (gold price, nisab, rules version)
- [ ] PDF download from frozen data (idempotent)
- [ ] Year-over-year comparison charts

---

## Phase 7: Migration & Smart Features ⬜ FUTURE

> **Goal:** Transition existing users and enable premium features.

- [ ] Consent flow: "Enable Smart Features?" vs "Stay Local (Vault Mode)"
- [ ] Data migration script for legacy users
- [ ] Multi-device sync for Smart Mode
- [ ] Automated Hawl date detection

---

## Phase 8: Madhab Support ✅ COMPLETE

> **Goal:** Support pure madhab calculations and hybrid modes with scholarly difference indicators.

### 8.1 Data Layer ✅
- [x] Add `Madhab` type: `hanafi | maliki | shafii | hanbali | balanced`
- [x] Add `madhab` field to `ZakatFormData`
- [x] Add `'pure'` mode to `CalculationMode`
- [x] Create `madhahRules.ts` with `MADHAB_RULES`, `MODE_RULES`

### 8.2 Scholarly Differences Detection ✅
- [x] Create `getScholarlyDifferences(madhab, mode)` function
- [x] Map differences to methodology sections
- [x] Include supporting scholars and basis

### 8.3 UI Integration ✅
- [x] Add madhab selector to Settings page
- [x] **Deferred:** Add optional madhab selector to Wizard Q1
- [x] **Deferred:** Display "Alternate Opinions Applied" in report

### 8.4 Methodology Update ✅
- [x] Added "Schools of Thought" section with jewelry/debt rulings
- [x] Hadith evidence for each school's position
- [x] References to Fiqh al-Zakah, Al-Mughni, AMJA fatwas
- [x] **Audit:** Verified and integrated aligned Qaradawi rulings (Jewelry, Debt, Retirement)
- [x] **Correction:** Updated Joe Bradford Jewelry ruling to "Zakatable"

---

## Phase 11: Privacy & Legal Audit ✅ COMPLETE

> **Goal:** Ensure 100% alignment between legal docs and engineering implementation.

- [x] **Audit:** Deep-dive review of Privacy Policy vs. Codebase (Encryption, Analytics, AI)
- [x] **Fix:** Implemented client-side rounding for analytics (zero raw data transmission)
- [x] **Docs:** Updated Privacy Policy with precise "Retention" vs "Collection" language
- [x] **Docs:** Clarified AI provider processing transparency

---

## Database Schema Reference

```
User → Portfolio → Account → Snapshot → LineItem
                         ↘        ↗
                       SourceDoc
                         ↓
                    ZakatReport (frozen)
```

**Key Tables:**
- `portfolios` - User's portfolio container
- `asset_accounts` - Bank, Brokerage, Crypto, etc.
- `asset_snapshots` - Point-in-time statement captures
- `asset_line_items` - Granular holdings

**Zakat Categories:**
- `LIQUID` - 100% Zakatable (Cash)  
- `PROXY_30` - 30% Zakatable (Stocks)
- `PROXY_100` - 100% Zakatable (Crypto)
- `EXEMPT` - 0% (Personal Use)
- `CUSTOM` - User override

---

---

## Phase 12: Knowledge & Trust (FAQ) ⬜ PLANNED

> **Goal:** Address common user questions directly on the landing page to build trust and reduce hesitation.

- [ ] Create `FAQ.tsx` component (Accordion style)
- [ ] Add "Frequently Asked Questions" section to Landing Page (below Hero/About)
- [ ] Content curation:
    - "Is my data private?"
    - "Which scholar approved this?" (Link to Methodology)
    - "How is Zakat calculated on 401k?"
    - "Can I save my progress?"

---

## Phase 13: Donation Tracking & Distribution ✅ PARTIAL
 
> **Goal:** Empower users to track their Zakat payments, scan receipts, and explore the 8 categories of recipients.
 
### 13.1 Donation Tracking (MVP) ✅ COMPLETE
- [x] Create `/donations` route and Dashboard widget
- [x] **Active Hawl Logic**: Track "Zakat Due" vs "Paid" with progress bar
- [x] **Robust Dates**: Hijri/Gregorian toggle and storage normalization
- [x] **AI Receipt Scanning**: Extract details from images/PDFs (Gemini 2.0 Flash)
- [x] **Persistence**: Dual-mode (Guest Local + Cloud Link) with auto-migration
 
### 13.2 Charity Discovery (Next) ⬜ PLANNED
- [ ] Charity Directory Integration (Search/Filter)
- [ ] "Verified" Badge logic
- [ ] Deep dive content for 8 Categories of Recipients
 
### 13.3 In-App Payments (Future) ⬜ PLANNED
- [ ] Stripe Connect Integration
- [ ] 1-Click Zakat payment
- [ ] Recurring donation setup
- [ ] **Mission**: Move beyond "donate and forget" to "strategic spiritual impact"

---

## Phase 14: Community Feedback ⬜ PLANNED

> **Goal:** Engage users in the product roadmap via a feedback/upvote system.

- [ ] Create `/feedback` page
- [ ] Simple internal implementation vs. Canny/Upvoty integration? 
    - *Decision*: Build simple internal version first (Submission Form + Upvote List)
- [ ] Features: "Submit Idea", "Report Bug", "Upvote Feature"

---

## Priority Order (Revised)

| # | Phase | Status | Next Action |
|---|-------|--------|-------------|
| 1 | Phase 12: Knowledge (FAQ) | ⬜ Planned | Create FAQ Component |
| 2 | Phase 13: Distribution (Charity) | ⬜ Planned | Design Charity Directory |
| 3 | Phase 14: Feedback | ⬜ Planned | Evaluate tools vs build |
| 4 | Phase 6: Reports | ⬜ Planned | Create `/reports` route |
| 5 | Phase 4: Plaid API | ⬜ Planned | Set up Plaid account |
| 6 | Phase 5: Charity Program | ⬜ Planned | Re-evaluate after Phase 13 |
| 7 | Phase 7: Migration | ⬜ Future | Design consent flow |
