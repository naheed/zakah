# Audit Report: ZakatFlow Methodology vs. Dr. Yusuf Al-Qaradawi (*Fiqh al-Zakah*)

**Status:** Completed
**Auditor:** Antigravity (Agentic AI)
**Reference Text:** *Fiqh al-Zakah* by Dr. Yusuf Al-Qaradawi

## Executive Summary
ZakatFlow's current methodology is largely aligned with standard contemporary practices but differs from Dr. Al-Qaradawi's specific rulings in several key areas. Al-Qaradawi tends to be more expansive in what is Zakatable (e.g., Professional Income "Zakat al-Mustafad") but offers specific nuance on "Worn Jewelry" that differs from the strict Hanafi view.

## 1. Jewelry (Gold & Silver)
**Current ZakatFlow:** 
*   **Hanafi Mode:** Zakatable (Worn & Hoarded).
*   **Bradford Mode:** Zakatable (Precautionary/Ahwat).
*   **Others (Maliki/Shafi'i/Hanbali):** Exempt (if worn).

**Al-Qaradawi's Position:**
*   **Worn for Adornment:** *Permissible* to pay but not strictly *Obligatory*. He leans towards the Majority view (Exempt) for women's permissible jewelry but says paying is "better & safer" (Ahwat).
*   **Hoarded/Investment:** Strictly Zakatable (Consensus).
*   **Prohibited (e.g. Men's Gold):** Strictly Zakatable.

**Discrepancy:**
*   Al-Qaradawi aligns closer to the **Majority (Exempt)** view for strictly regarding *obligation*, whereas our new "Bradford" mode (Precautionary) aligns more with his recommendation of what is "better".
*   *Action:* No major change needed, but we could add a "Qaradawi" view specifically that flags strictly worn jewelry as "Recommended but not Required".

## 2. Stocks & Shares
**Current ZakatFlow:**
*   **Active:** 100% Market Value.
*   **Passive:** 30% Rule (AAOIFI) or Net Current Assets.

**Al-Qaradawi's Position:**
*   **Active (Trading):** 100% Market Value (Same as ZakatFlow).
*   **Passive (Investment):**
    *   **Industrial Companies:** Zakat on *Net Profits* at 10% (analogy to agriculture/produce). **Major Difference**.
    *   **Commercial/Trading Companies:** Zakat on underlying assets (Net Current Assets) at 2.5%.
    *   **Alternative View:** He allows 2.5% on Market Value as a proxy if easier.

**Discrepancy:**
*   **Significant.** ZakatFlow uses the "Asset-Based" (Balance Sheet) approach for virtually all passive stocks (2.5% of 30% proxy). Al-Qaradawi introduces an "Income-Based" approach (10% of Dividends/Profits) for pure industrial companies (transport, hotels, etc.) where the machinery is the main asset.
*   *Implementation Note:* Supporting this would require users to categorize stocks by sector (Industrial vs Commercial), which is high friction.

## 3. Salaries & Professional Income (*Al-Mal Al-Mustafad*)
**Current ZakatFlow:**
*   Assumes Zakat is on *wealth held for a year* (Hawl). Income is part of "Cash" at the end of the year.

**Al-Qaradawi's Position:**
*   **Immediate Zakat:** Strong proponent of *Zakat al-Mustafad*—paying Zakat on salary/income *immediately upon receipt* if it meets Nisab, without waiting for the Hawl.
*   **Rate:** 2.5% of Net Income (after expenses).

**Discrepancy:**
*   **Fundamental.** ZakatFlow follows the "End of Year" balance method. Al-Qaradawi advocates for a "Pay as you Earn" model for high earners.
*   *Action:* Consider adding a "Zakat on Income" calculator in the future.

## 4. Retirement (Pensions/401k)
**Current ZakatFlow:**
*   **Bradford:** Exempt if < 59½ (Lack of Ownership/Access).
*   **Majority:** Zakatable on Net Accessible Value.

**Al-Qaradawi's Position:**
*   **Workplace Pensions (Equity):** Zakatable on a portion (approx 40% of fund value).
*   **Final Salary (Defined Benefit):** Not Zakatable until received (similar to "Debt owed to you").
*   **Nisab/Hawl:** Generally applies standard rules once access is established.

**Discrepancy:**
*   Al-Qaradawi does not seemingly support the "Total Exemption" view of Bradford for Defined Contribution plans (like 401ks) where the user *can* access funds with a penalty. He leans towards paying on the accessible portion or the "invested" portion.

## 5. Debts
**Current ZakatFlow:**
*   **Maliki/AMJA:** Deduct only *immediate* (12-month) debts.
*   **Hanafi:** Deduct all debts.

**Al-Qaradawi's Position:**
*   **Deductibility:** Deduct debts that reduce wealth below Nisab.
*   **Nuance:** Supports the view of prioritizing debt repayment, but for modern long-term debts (mortgages), he aligns with the view that only the *immediate* due amount should be deducted, not the entire 30-year principal.

**Discrepancy:**
*   ZakatFlow's "Standard/Maliki" mode (12-month deduction) is **fully aligned** with Al-Qaradawi's modern interpretation.

## Recommendations for Logic
1.  **Bradford Mode is Safe:** The update to make Bradford "Zakatable" for jewelry aligns with Qaradawi's "Better/Ahwat" preference.
2.  **Potential "Qaradawi" Mode?** A dedicated "Qaradawi" mode would be complex due to the "10% on Profits" rule for industrial stocks and "Immediate Zakat" on salary.
3.  **Retirement:** Qaradawi aligns closer to the "Majority" view (Net Accessible) rather than Bradford's "Exempt" view.

**Verdict:** The current "Bradford" vs "Majority" toggle covers the most critical deviation (Retirement). Implementing Qaradawi's specific "10% of Profits" rule for stocks would likely confuse users without deep breakdown of their portfolio sectors.
