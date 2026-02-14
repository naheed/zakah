# ZakatFlow Product Roadmap

**Vision:** From Form-Centric Calculator → Asset-Centric Wealth OS

---

## 🚀 Active & Up Next

| Priority | Phase | Feature Area | Status | Goal |
|---|---|---|---|---|
| **P0** | **Phase 14** | **Open Source Launch** | ⬜ Planned | Public repo, AGPL-3.0, community contributions |
| **P1** | **Phase 15** | **Reports 2.0** | ⬜ Planned | Frozen historical reports, YoY comparison, QR codes |
| **P2** | **Phase 16** | **Charity Portal** | ⬜ Planned | Charity directory and verified recipient discovery |
| **P3** | **Phase 17** | **Analytics** | ⬜ Planned | GA4 funnels, user feedback surveys |

---

## 📅 Roadmap Breakdown

### Phase 14: Open Source Launch
> **Goal:** Make ZakatFlow transparent and community-driven.

**Pre-Requisites (Security):**
- [ ] Rotate Supabase anon key (Dashboard → Settings → API)
- [ ] Fix `.gitignore` to exclude `.env`
- [ ] Choose branching strategy (Fresh repo recommended)

**License & Docs:**
- [ ] Update LICENSE from MIT → AGPL-3.0
- [ ] Add CODE_OF_CONDUCT.md (Contributor Covenant)
- [ ] Add SECURITY.md (vulnerability reporting)

**GitHub Setup:**
- [ ] Enable Dependabot alerts
- [ ] Enable Code scanning / Secret scanning
- [ ] Configure branch protection (require PR reviews)
- [ ] Create issue templates (bug, feature request)

**References:**
- Security docs: `docs/OPEN_SOURCE_SECURITY.md`

---

### Phase 15: Reports 2.0
> **Goal:** Create permanent, verifiable records of Zakat obligations.

- [ ] `/reports` route listing "Frozen" Zakat Reports
- [ ] Store frozen parameters (gold price, nisab, rules at time of calc)
- [ ] Idempotent PDF download from frozen data
- [ ] Year-over-year comparison charts
- [ ] Machine-readable QR for YoY scanning
- [ ] Fix WorkSans italic font bug in PDF

---

### Phase 16: Charity Discovery & Impact
> **Goal:** Guide users from "Calculation" to "Distribution".

- [ ] Charity Directory (Search/Filter by Zakat-eligible)
- [ ] "Verified" Badge logic for recipients
- [ ] Deep dive content for the 8 Categories of Recipients
- [ ] **Strategy:** Embeddable Calculator widget for Charity partners

---

### Phase 17: Analytics & Feedback
> **Goal:** Understand user behavior and collect qualitative feedback.

- [ ] **Google Analytics 4**: Event tracking for Wizard Steps, Calculation Completion, and Errors
- [ ] **Feedback Loop**: Emoji Reactions + Google Form Link for NPS
- [ ] **Funnels**: Visualize drop-off rates from Landing → Result
- [ ] `/feedback` page with public upvote list

---

## 🧊 Icebox & Deferred
> **Goal:** Great ideas that aren't critical for current priorities.

### AMJA Calculation Mode (Research Complete)
> **Background:** AMJA has distinct positions from Sheikh Joe Bradford.

| Issue | Bradford (Current) | AMJA (Proposed) |
|-------|-------------------|-----------------|
| **401k < 59.5** | Exempt (inaccessible) | Zakatable annually (net withdrawable) |
| **Passive Investments** | 30% proxy | No proxy rule (100%) |
| **Jewelry** | Exempt (majority view) | Zakatable (prudent view) |

**Tasks:**
- [ ] Add `amja` to `Madhab` type
- [ ] Add AMJA to `MADHAB_RULES` and `MODE_RULES`
- [ ] Update Settings.tsx to show 6th option
- [ ] Add tests for AMJA scenarios

---

### Platform Expansion
- [ ] **Apple Authentication** (Sign in with Apple)
- [ ] Mobile App (React Native) evaluation

### Smart Features
- [ ] Automated Hawl date detection
- [ ] Smart Confidence Flagging for AI extraction
- [ ] In-line Zakat category editing per line item

---

## ✅ Completed Milestones

### Phase 14: ZMCS & Nisab Engine ✅
> **Released: v0.26.0 (Feb 14, 2026)**
- **Dynamic Nisab**: Daily automated gold/silver price fetching and historical lookup.
- **ZMCS Engine**: Schema-driven calculation engine with standard presets (Hanafi, Shafi'i, etc.).
- **Transparency**: Public ZMCS specification page and compliance test suite.

### Phase 13B: Asset Class Expansion ✅
> **Released: v0.25.0 (Feb 7, 2026)**
- **Service Business Toggle**: Consultants, freelancers, SaaS — with al-Qaradawi guidance
- **Land Banking**: New input for undeveloped land held for appreciation
- **REITs**: Equity REITs with Shariah compliance warning
- **Ahmed Example**: Updated to show madhab differences ($5,125-$12,915 range)
- **Test Coverage**: 58 tests pass including new asset class tests

### Phase 13A: Jurisprudence Audit ✅
> **Released: v0.19.0 (Feb 7, 2026)**
- **Jewelry Governance**: Explicit handling of "Excessive vs Personal" jewelry
- **Precious Metals Split**: Distinct fields for "Investment Gold" vs "Jewelry Gold"
- **Content Strategy**: 3-tier model with Intro Bar, Deep Links, and Methodology Anchors
- **References**: Added authoritative citations to methodology content

### Phase 13: Product Reality & Design Polish ✅
> **Released: v0.18.0 (Jan 2026)**
- **Landing Page 2.0**: "Product Reality" demo with live animation and Sankey visualization
- **Design Audit**: "Pixel-style" decluttering (removed noisy badges, high-signal copy)
- **Accessibility**: Dark Mode verification for marketing pages
- **Sample Data**: Integrated "Ahmed Family" methodology benchmark into public demo

### Phase 11-12: Stability & Legal Compliance ✅
> **Released: v0.17.0, v0.16.0 (Jan 2026)**
- **Legal Standardization**: Unified "Last Updated" dates across legal docs
- **Robust Automation**: `data-testid` architecture for 100% E2E reliability
- **Accuracy Fixes**: Retirement tax handling, Sankey chart responsiveness

### Phase 9-10: System Design & Accessibility ✅
> **Released: v0.15.0 (Jan 2026)**
- **Systemic Contrast**: "Container Tokens" for fail-safe Light/Dark modes
- **Theme Integrity**: Semantic Chart Palette (Blue=Investments, Purple=Retirement)
- **Quality Assurance**: 100% E2E Accessibility Coverage for all static pages

### Phase 4: Account Connections (Plaid) ✅
> **Released: v0.13.0 (Jan 2026)**
- **Bank Sync**: Plaid Link integration for automatic balance updates
- **Privacy**: Server-side encryption (AES-256-GCM) with `PLAID_ENCRYPTION_KEY`
- **Compliance**: Full token revocation on account deletion

### Phase 3: Donation Tracking & Distribution ✅
> **Released: v0.11.0 (Jan 2026)**
- **Tracking**: `/donations` route with Active Hawl progress bar
- **AI Scanning**: Gemini 2.0 Flash receipt parser
- **Hybrid Data**: Cloud sync + Local guest mode

### Phase 2: Settings & Security Redesign ✅
> **Released: v0.12.0 (Jan 2026)**
- **Expressive UI**: Material 3 design overhaul
- **Safety**: "Danger Zone" and "Account Deleted" landing flow
- **Access**: Local Vault unauthenticated view

### Phase 1: Methodology & Madhabs ✅
> **Released: v0.6.0 - v0.10.0 (Jan 2026)**
- **Schools of Thought**: Hanafi, Maliki, Shafi'i, Hanbali, Bradford calculation modes
- **Audit**: Alignment with Dr. Qaradawi and Joe Bradford rulings
- **Transparency**: "Evidence" fields for all rulings

### Phase 0: Foundation (Asset OS) ✅
> **Released: v0.1.0 - v0.5.0 (Dec 2025)**
- **Data Layer**: `portfolios`, `asset_accounts`, `line_items` schema
- **AI Engine**: Granular line-item extraction with Gemini
- **Visualization**: Sankey Chart overhaul for net worth flow
- **Privacy**: Legal audit and privacy policy alignment
