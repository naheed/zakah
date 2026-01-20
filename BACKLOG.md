# ZakatFlow Product Roadmap

**Vision:** From Form-Centric Calculator → Asset-Centric Wealth OS

---

## 🚀 Active & Up Next

| Priority | Phase | Feature Area | Status | Goal |
|---|---|---|---|---|
| **P0** | **Phase 12** | **Analytics & Feedback** | 🏗️ Planned | GA4 tracking of engagement funnels + User Feedback Survey (Emojis/Qualitative) |
| **P1** | **Docs** | **Engineering Design** | 🏗️ In Progress | Comprehensive architectural documentation (Google-style EDD) |
| **P1** | **Phase 5** | **Reports & History** | ⬜ Planned | "Frozen" historical reports and PDF/CSV downloads |
| **P2** | **Phase 6** | **Charity Portal** | ⬜ Planned | Charity directory and verified recipient discovery |
| **P3** | **Phase 7** | **Feedback Loop** | ⬜ Planned | User feature voting and bug reporting |

---

## 📅 Roadmap Breakdown

### Phase 12: Analytics & Feedback (Top Priority)
> **Goal:** Understand user behavior and collect qualitative feedback to improve conversion.
- [ ] **Google Analytics 4**: Event tracking for Wizard Steps, Calculation Completion, and Errors.
- [ ] **Feedback Loop**: "Recommend to Friend" expansion with Emoji Reactions + Google Form Link.
- [ ] **Funnels**: Visualize drop-off rates from Landing -> Result.

### Phase 5: Reports & History
> **Goal:** Create a permanent record of past Zakat obligations.
- [ ] `/reports` route listing "Frozen" Zakat Reports
- [ ] Store frozen parameters (gold price, nisab, rules at time of calc)
- [ ] Idempotent PDF download from frozen data
- [ ] Year-over-year comparison charts

### Phase 6: Charity Discovery & Impact
> **Goal:** Guide the user from "Calculation" to "Distribution".
- [ ] Charity Directory (Search/Filter by Zakat-eligible)
- [ ] "Verified" Badge logic for recipients
- [ ] Deep dive content for the 8 Categories of Recipients
- [ ] **Strategy:** Embeddable Calculator widget for Charity partners

### Phase 7: Community Feeback
> **Goal:** Let users shape the product direction.
- [ ] `/feedback` page
- [ ] Submission Form (Bug vs Feature)
- [ ] Public Upvote List

### Phase 8: Platform Expansion
> **Goal:** Reduce friction for mobile users.
- [ ] **Apple Authentication** (Sign in with Apple)
- [ ] Mobile App (React Native) evaluation

---

## 🧊 Icebox & Deferred
> **Goal:** Great ideas that aren't critical for MVP.

### AMJA Calculation Mode (Research Complete)
> **Background:** AMJA (Assembly of Muslim Jurists of America) has distinct positions from Sheikh Joe Bradford.

| Issue | Bradford (Current) | AMJA (Proposed) |
|-------|-------------------|-----------------|
| **401k < 59.5** | Exempt (inaccessible) | **Zakatable annually** (net withdrawable) |
| **Passive Investments** | 30% proxy | No proxy rule (100%) |
| **Jewelry** | Exempt (majority view) | Zakatable (prudent view) |

**Implementation Tasks:**
- [ ] Add `amja` to `Madhab` and `CalculationMode` types
- [ ] Add AMJA entry to `MADHAB_RULES` with: `jewelryZakatable: true`, `debtDeductionMethod: 'twelve_month'`
- [ ] Add AMJA entry to `MODE_RULES` with: `retirementMethod: 'net_accessible'`, `passiveInvestmentRate: 1.0`
- [ ] Update Settings.tsx to show 6th option
- [ ] Add tests for AMJA calculation scenarios

**References:**
- [AMJA Fatwa on 401k](https://amjaonline.org) by Dr. Main Khalid Al-Qudah
- [AMJA Fatwa Bank](https://amjaonline.org)

---

- **Smart Features:** Automated Hawl date detection
- **Migration:** Data import script for legacy V1 users
- **UI:** Smart Confidence Flagging for AI extraction
- **UI:** In-line Zakat category editing per line item

---

## ✅ Completed Milestones (History)

### Phase 13: Product Reality & Design Polish ✅
> **Released: v0.18.0 (Jan 2026)**
- **Landing Page 2.0**: "Product Reality" demo with live animation and Sankey visualization.
- **Design Audit**: "Pixel-style" decluttering (removed noisy badges, high-signal copy).
- **Accessibility**: Dark Mode verification for marketing pages.
- **Sample Data**: Integrated "Ahmed Family" methodology benchmark into public demo.

### Phase 11: Stability & Legal Compliance ✅
> **Released: v0.17.0 (Jan 2026)**
- **Legal Standardization**: Unified "Last Updated" dates across legal docs for single-source truth.
- **Robust Automation**: Added `data-testid` architecture to core inputs, enabling 100% E2E test reliability.
- **Precision Audits**: Explicitly clarified annualization logic ("Multiply by 12") in UI and Tests to prevent user error.

### Phase 10: Stability & Polish ✅
> **Released: v0.16.0 (Jan 2026)**
- **Audit**: Comprehensive cleanup of Report UI redundancies.
- **Accuracy**: Critical fix for retirement tax handling (25 vs 0.25).
- **Visuals**: Responsive Sankey chart fixes for mobile & desktop.

### Phase 9: System Design & Accessibility ✅
> **Released: v0.15.0 (Jan 2026)**
- **Systemic Contrast:** Concept of "Container Tokens" (`bg-tertiary-container`) for fail-safe contrast in Light/Dark modes.
- **Theme Integrity:** Semantic Chart Palette restoring psychological color mapping (Blue=Investments, Purple=Retirement).
- **Quality Assurance:** 100% E2E Accessibility Coverage for all public static pages.

### Phase 4: Account Connections (Plaid) ✅
> **Released: v0.13.0 (Jan 2026)**
- **Bank Sync:** Plaid Link integration for automatic balance updates
- **Privacy:** Server-side encryption (AES-256-GCM) with `PLAID_ENCRYPTION_KEY`
- **Compliance:** Full token revocation on account deletion

### Phase 3: Donation Tracking & Distribution ✅
> **Released: v0.11.0 (Jan 2026)**
- **Tracking:** `/donations` route with Active Hawl progress bar
- **AI Scanning:** Gemini 2.0 Flash receipt parser
- **Hybrid Data:** Cloud sync + Local guest mode

### Phase 2: Settings & Security Redesign ✅
> **Released: v0.12.0 (Jan 2026)**
- **Expressive UI:** Material 3 design overhaul
- **Safety:** "Danger Zone" segregation and "Account Deleted" landing flow
- **Access:** Local Vault unauthenticated view

### Phase 1: Methodology & Madhabs ✅
> **Released: v0.6.0 - v0.10.0 (Jan 2026)**
- **Schools of Thought:** Hanafi, Maliki, Shafi'i, Hanbali calculation modes
- **Audit:** Alignment with Dr. Qaradawi and Joe Bradford rulings
- **Transparency:** "Evidence" fields for all rulings

### Phase 0: Foundation (Asset OS) ✅
> **Released: v0.1.0 - v0.5.0 (Dec 2025)**
- **Data Layer:** `portfolios`, `asset_accounts`, `line_items` schema
- **AI Engine:** Granular line-item extraction
- **Visualization:** Sankey Chart overhaul for net worth flow
- **Privacy:** Legal audit and privacy policy alignment
