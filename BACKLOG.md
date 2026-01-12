# ZakatFlow Product Roadmap

**Vision:** From Form-Centric Calculator → Asset-Centric Wealth OS

---

## 🚀 Active & Up Next

| Priority | Phase | Feature Area | Status | Goal |
|---|---|---|---|---|
| **P0** | **Phase 5** | **Reports & History** | ⬜ Planned | "Frozen" historical reports and PDF/CSV downloads |
| **P1** | **Phase 6** | **Charity Portal** | ⬜ Planned | Charity directory and verified recipient discovery |
| **P2** | **Phase 7** | **Feedback Loop** | ⬜ Planned | User feature voting and bug reporting |
| **P3** | **Phase 8** | **Mobile Ready** | ⬜ Future | Apple Auth & Mobile App foundations |

---

## 📅 Roadmap Breakdown

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
- **Smart Features:** Automated Hawl date detection
- **Migration:** Data import script for legacy V1 users
- **UI:** Smart Confidence Flagging for AI extraction
- **UI:** In-line Zakat category editing per line item

---

## ✅ Completed Milestones (History)

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
