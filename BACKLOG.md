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

## Phase 2: Ingestion Engine (AI Extraction) 🟡 IN PROGRESS

> **Goal:** High-fidelity line-item extraction from financial documents.

- [x] **Prompt Engineering** - Updated Gemini system prompt for granular line-item extraction
- [x] **Edge Function Update** - `parse-financial-document` returns `lineItems[]` with `inferredCategory` and `confidence`
- [x] **Category Mapping** - Built `mapLineItemToLegacyField()` for backward compatibility
- [x] **Frontend Hook** - Created `useDocumentParsingV2` for V2 extraction
- [x] **Test Page** - Created `ExtractionTest.tsx` with pagination & category summary
- [x] **Large Dataset Handling** - Pagination (20 initial, load 50 more), scrollable table, category summary
- [x] **Mapping Fix** - `CASH_CHECKING` now correctly maps to `checkingAccounts`
- [ ] **Deploy & Verify** - Deploy Edge Function and test end-to-end in production

### Remaining Phase 2 Items:
- [ ] Store extraction results to V2 database tables (currently only returns data, doesn't persist)
- [ ] Link `SourceDocument` to `Snapshot` for provenance tracking

---

## Phase 3: Asset Dashboard (UI Overhaul) ✅ COMPLETE

> **Goal:** User visibility and control over extracted data.

- [x] New route `/assets` showing cards for each connected account
- [x] AccountCard component with icons, badges, stale indicators
- [x] `/assets/add` with modular Add flow (Upload/Manual/API stub)
- [x] `/assets/:accountId` detail page with snapshots and line items
- [x] V2 persistence integrated into wizard upload with toast
- [ ] **Deferred:** Smart Confidence Flagging (Phase 4+)
- [ ] **Deferred:** Zakat category editing per line item

### 3.3 Report History
- [ ] `/reports` view listing "Frozen" Zakat Reports
- [ ] Each report stores frozen params (gold price, nisab, rules version)
- [ ] PDF download from frozen data (not live recalculation)

### 3.4 Extraction Integration
- [ ] Update `DocumentUpload.tsx` in main app to use V2 extraction
- [ ] Replace inline extraction with V2 hook + persistence flow
- [ ] Graceful migration path for existing users

---

## Phase 3.5: Post-Login Dashboard Polish 🔴 HIGH PRIORITY

> **Goal:** Improve returning user experience with clear information hierarchy.

### Information Hierarchy (Stripe-inspired)
| Priority | Section | Rationale |
|----------|---------|-----------|
| **P0** | Resume Calculation | Unfinished work = highest urgency |
| **P1** | Assets Preview | Context for calculations (new V2 feature) |
| **P2** | Past Reports | Reference, not action-oriented |
| **P3** | Referral Widget | Social proof, lower priority |

### Tasks
- [ ] Redesign `WelcomeStep.tsx` with priority-based layout
- [ ] Add Assets preview cards (3 recent + "View All" → `/assets`)
- [ ] Add "Resume Calculation" card when incomplete calc exists
- [ ] **BUG FIX:** Referral code regeneration
  - Root cause: `userId` not checked in `generate-referral-code`
  - Fix: Check `referrer_user_id` before `sessionHash` in Edge Function
  - Fix: Cache referral code in localStorage for logged-in users
- [ ] Add past reports section placeholder

---

## Phase 4: Migration & Smart Features ⬜ PLANNED

> **Goal:** Transition existing users and enable premium features.

### 4.1 Consent Flow
- [ ] New onboarding screen: "Enable Smart Features?" vs "Stay Local (Vault Mode)"
- [ ] Smart Mode = Server-managed key wrapping for cloud sync + AI analysis
- [ ] Vault Mode = Client-only key, single device, max privacy

### 4.2 Data Migration
- [ ] Script to read old `ZakatFormData` blob
- [ ] Create "Legacy Account" in new system with single snapshot
- [ ] Preserve historical calculations as frozen reports
- [ ] Disable old storage method after migration

### 4.3 Multi-Device Sync
- [ ] Server-side key management for Smart Mode users
- [ ] Encrypted sync across devices
- [ ] Conflict resolution for simultaneous edits

### 4.4 Year-over-Year Analytics
- [ ] Portfolio value over time charts
- [ ] Automated Hawl date detection (when value crossed Nisab)
- [ ] Growth breakdown: Deposits vs Market Appreciation

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
- `asset_line_items` - Granular holdings (stocks, cash, etc.)

**Zakat Categories:**
- `LIQUID` - 100% Zakatable (Cash)  
- `PROXY_30` - 30% Zakatable (Stocks)
- `PROXY_100` - 100% Zakatable (Active Trading, Crypto)
- `EXEMPT` - 0% (Personal Use, Unvested)
- `CUSTOM` - User override

---

## Definition of Done (Google Quality Bar)

- **Privacy:** No unencrypted PII or Net Worth in logs/DB
- **Reliability:** Extraction handles failures gracefully (retries, manual fallback)
- **Scalability:** Schema supports 100+ snapshots per user (indexed on `user_id`, `statement_date`)
- **Compliance:** Frozen Reports yield exact same PDF 5 years later (idempotence)
