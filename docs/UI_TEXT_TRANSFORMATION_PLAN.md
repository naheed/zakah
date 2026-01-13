# UI Text Transformation Plan (v3.0)

> **Objective**: Decouple UI text from visualization code to enable i18n and enforce consistent "Writing Principles" (The "Dignified Guide" voice).

---

## 🚨 Audit Feedback (Self-Review)

### 🧑‍💻 Senior SWE Critique
| Gap | Issue | Resolution in v3.0 |
|-----|-------|-------------------|
| **No Inventory** | We don't know how many strings exist or where they are. This leads to "scope creep". | Added **Phase 0: Content Audit** to enumerate all strings first. |
| **Hook is Overkill** | A `useContent` React hook adds indirection. Direct import is simpler and sufficient for single-language MVP. | Removed hook recommendation; recommend direct import. |
| **No Rollback** | If a migration breaks production, there's no easy "undo" plan. | Added **Rollback Strategy** section. |
| **Missing Naming Convention** | Keys like `common.ts` are too vague. No standard for key naming. | Added **Key Naming Convention**. |

### 📝 UX Writer Critique
| Gap | Issue | Resolution in v3.0 |
|-----|-------|-------------------|
| **Audit Checklist Too Abstract** | "Does it explain concept first?" is hard to verify objectively. | Added a **Content Review Rubric** with concrete pass/fail criteria. |
| **Missing String Categories** | Not all strings are equal:  headlines vs. tooltips vs. error messages need distinct review approaches. | Added **String Taxonomy** section. |
| **No Review Gate** | Plan has no formal stage for a human UX Writer to sign off. | Added **UX Writer Sign-Off** stage before slice is considered complete. |

### 🎯 Product Owner Critique
| Gap | Issue | Resolution in v3.0 |
|-----|-------|-------------------|
| **No Success Metric** | What does "done" look like? | Added **Exit Criteria** for each Slice. |
| **No Risk Assessment** | This is "core thesis" work. There's no identified risk table. | Added **Risks & Mitigations** table. |
| **No Prioritization Rationale** | Why is Slice A before Slice D? | Added **Prioritization Logic**. |

---

## NEW: Phase 0 — Content Inventory

**Goal:** Before any code changes, create a complete manifest of all user-facing strings.

### 0.1 Audit Scope
We will identify strings in:
1.  `src/components/zakat/**/*.tsx` (Wizard, Steps, Report)
2.  `src/pages/**/*.tsx` (Landing, Settings, etc.)
3.  `src/components/ui/**/*.tsx` (Reusable components like Tooltips, Dialogs)

### 0.2 Output: `docs/CONTENT_INVENTORY.md`
A table listing:
| File | String (first 50 chars) | Category | Priority |
|------|-------------------------|----------|----------|
| `WelcomeStep.tsx` | "Welcome back, {firstName}" | Headline | High |
| `WelcomeStep.tsx` | "Continue where you left off" | CTA Button | High |
| `LiabilitiesStep.tsx` | "Debts that will come due..." | Tooltip | Medium |

This inventory becomes our "scope contract".

---

## Phase 1: Separation (Extraction)

### 1.1 Key Naming Convention
```
[Category].[Component].[Element]
```
Examples:
- `wizard.welcome.headline`
- `wizard.welcome.cta_continue`
- `report.hero.zakat_due_label`
- `common.buttons.sign_in`

### 1.2 File Structure
```
src/
  content/
    en/
      common.ts    // Globally reused (buttons, labels)
      wizard.ts    // All ~15 wizard step content
      marketing.ts // Landing page, features
      report.ts    // Results, PDF text
      settings.ts  // Settings page
    index.ts       // Barrel export
```

### 1.3 Usage Pattern (Direct Import)
```tsx
// WelcomeStep.tsx
import * as c from '@/content/en/wizard';

<h1>{c.welcome.headline}</h1>
```
No hook indirection for now. This is the simplest, most type-safe pattern.

### 1.4 Migration Checklist (Per Slice)
- [ ] Run `grep` to find all literal text in target files.
- [ ] Add corresponding keys to `content/en/*.ts`.
- [ ] Replace hardcoded strings with imports.
- [ ] Run `tsc` to verify no missing keys.
- [ ] Run `npm run dev` and manually verify UI.

---

## Phase 2: The Rewrite (Dignified Guide Audit)

### 2.1 String Taxonomy
Not all strings are equal. We will audit by category:

| Category | Examples | Review Focus |
|----------|----------|--------------|
| **Headlines** | "Zakat, Clarified." | Brand voice, brevity. |
| **Body Copy** | Explanatory paragraphs | Concept-first, ESL-friendly. |
| **CTAs** | "Start Calculating", "View Full Report" | Action clarity, no slang. |
| **Tooltips** | Technical explanations | "Teacher" model, Adab. |
| **Error Messages** | "Please enter a valid amount" | Empathy, no "Oops!". |
| **Microcopy** | "Saved 2m ago", "Step 1" | Brevity, utility. |

### 2.2 Content Review Rubric
Each string will be graded on these criteria (Pass / Needs Work):

| Criterion | Pass | Fail |
|-----------|------|------|
| **Authoritative but Humble** | Uses "Based on..." for rulings | Claims "the correct ruling is..." |
| **Concept First** | Explains idea before technical term | Uses jargon without explanation |
| **Spiritual Framing** | "Zakatable Wealth" | "Taxable Assets" |
| **ESL Friendly** | Clear S-V-O structure | Uses idioms ("get the ball rolling") |
| **No Hallucinations** | Accurate claim | "We never see your data" (if servers log) |

### 2.3 UX Writer Sign-Off Gate
A Slice is not "done" until a human reviews the content file.
*   **For this project:** User (Product Owner) will review `content/en/wizard.ts` before Slice D is merged.

---

## Safety & Validation

### Rollback Strategy
*   **Git Branch per Slice**: Each slice is one feature branch.
*   **Revert Plan**: If a slice causes issues, `git revert <slice-commit>` restores original inline strings.
*   **Feature Flag (Optional)**: We can implement a `USE_CONTENT_SYSTEM` env var to toggle between inline/extracted if needed.

### Testing
1.  **TypeScript**: `tsc` catches missing keys at build time.
2.  **Visual Verification**: Dev server check per slice.
3.  **E2E**: Update Playwright tests to use `data-testid` or stable key patterns.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Scope Creep** | High | Med | Content Inventory locks scope. No new strings added mid-migration. |
| **Breaking E2E Tests** | Med | High | Refactor tests to `data-testid` before migration. |
| **Inconsistent Voice** | Med | High | UX Writer gate; single reviewer for final pass. |
| **Merge Conflicts** | Low | Med | One Slice at a time; no parallel work. |

---

## Prioritization Rationale

| Slice | Components | Rationale |
|-------|------------|-----------|
| **A** | Landing, Welcome | Highest visibility, relatively static. Low risk, high proof-of-concept value. |
| **B** | Dashboard, Assets | Medium complexity, tests hybrid logged-in/guest state. |
| **C** | Settings, Metrics | Lower visibility, but needed for completeness. |
| **D** | Wizard (All Steps) | Highest complexity. Done last to incorporate learnings from A-C. |

---

## Exit Criteria (Definition of Done)

| Slice | Technical | Content Quality |
|-------|-----------|-----------------|
| **A** | All strings in `marketing.ts` + `wizard.ts`. Compiles. No visual regressions. | All headlines pass Rubric. UX Writer approves. |
| **B** | All strings in `common.ts`. E2E tests for Dashboard pass. | Body copy is ESL-friendly. |
| **C** | Settings strings extracted. | Microcopy is consistent (e.g., date formats). |
| **D** | All 15 wizard steps use `content/`. 100% E2E coverage. | Full UX Writer pass. **Product Owner Final Sign-Off.** |
