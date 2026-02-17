# Encryption & Privacy Copy Framing

**Purpose:** Keep sign-in, encryption, and privacy claims accurate and consistent across all user-facing surfaces (Auth, Settings, Share, Logout, Privacy Policy, etc.).

---

## Principles

1. **Accurate:** We encrypt data in the browser before storage; we only store ciphertext. We do not read or use decrypted data. In Managed mode we store the user's key (for recovery); in Sovereign mode only the user has the key.
2. **Consistent:** Use the same framing everywhere: "We don't have access to your decrypted data" / "Only you can decrypt it" rather than mixing "not even our team" with "we never see" and "only you can access."
3. **Tier-aware:** Where relevant, distinguish Managed (we can assist recovery; key in our DB under RLS) vs Sovereign (only you with recovery phrase). Don't overclaim "no one else" if we store a wrapped key in Managed mode — we still don't *access* the data.

---

## Preferred phrasing

| Claim | Use | Avoid |
|-------|-----|--------|
| **Encryption** | "End-to-end encrypted" / "encrypted in your browser before storage" / "We only store encrypted data" | "Full encryption" (vague) |
| **Access** | "We don't have access to your decrypted data" / "Only your account can decrypt it" / "Only you can decrypt it with your account" | "Not even our team" (can imply we have zero key material in Managed) |
| **Scope** | "Saved calculations and bank connection details" when listing what's encrypted | "Your financial data" alone (fine but less specific) |
| **Sign-in (Google)** | "Continue with Google" (primary CTA); "Sign in with Google to Share" (when action is sharing). Use `aria-label="Continue with Google"` on the button. | — |
| **Footer (Auth)** | "By signing in, you agree to our Privacy Policy. Your data is encrypted and only you can decrypt it." (link to /privacy) | "privacy-first approach" without linking to policy |

---

## Surfaces to keep aligned

- **Auth** (`pages/Auth.tsx`): Sign-in page bullets and footer
- **LogoutSuccess**: Post-logout reassurance
- **PersistenceChoiceModal**: Cloud vs local choice security note
- **ShareDrawer**: Spouse/partner sharing — "Only they can decrypt"; E2E encrypted; invitation toast and description
- **Invite page** (`pages/Invite.tsx`): Meta description (privacy-focused, encrypted); trust badge ("Save & resume with encrypted storage")
- **Referral / social share** (`ReferralWidget.tsx`, `ShareToolSection.tsx`): When mentioning saving, use "with encrypted storage" or "only you can decrypt it"; keep Twitter short ("your data stays encrypted")
- **SecuritySettings**: Managed vs Sovereign explanation (already accurate)
- **Privacy Policy** (`content/privacy.ts`): Full policy; keep Managed/Sovereign distinction

---

## Referral and social share messages

When copy mentions saving or privacy in share messages (WhatsApp, Twitter, Facebook, LinkedIn, email):

- Prefer **"save your calculation with encrypted storage"** over "save securely" so encryption is explicit.
- Where length allows (e.g. email, Facebook), add **"only you can decrypt it"** for consistency.
- Twitter: keep under character limit; use **"your data stays encrypted"** as a short privacy line.

---

## Last audit


---

## Audience Principles (Methodology & Docs)

### 1. The Giver (Consumer)
**Goal:** "Understand enough to feel confident."
*   **Tone:** Reassuring, Educational, Simple.
*   **Data Depth:** Focus on **Principles & Outcomes** (e.g., "Jewelry is exempt"). Avoid exposing raw parameters unless necessary.
*   **Key Surface:** `/methodology`
*   **Do:** Use "Scholarship differs on this..." / "ZakatFlow allows you to follow..."
*   **Don't:** Overwhelm with Fiqh jargon (Istihsan, 'Illah) without plain-English context.

### 2. The Contributor (Scholar/Dev)
**Goal:** "Verify mapping of Fiqh to Code."
*   **Tone:** Precise, Technical, Transparent.
*   **Data Depth:** Focus on **Parameters & Types** (e.g., `jewelry.zakatable: false`).
*   **Key Surface:** `/methodology/zmcs`
*   **Do:** Use exact JSON keys and ZMCS schema definitions.
*   **Don't:** Use marketing fluff. Be strictly factual about the logic.
