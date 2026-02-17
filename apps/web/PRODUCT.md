# ZakatFlow — Product Guide

> **The most accurate Zakat calculator available.** 8 scholarly methodologies. AI-powered document import. Bank-grade encryption.

[![Live App](https://img.shields.io/badge/Try_It-zakatflow.org-blue.svg)](https://zakatflow.org)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

ZakatFlow has helped evaluate **millions of dollars** in assets and calculate Zakat obligations for Muslims with complex portfolios.

---

## Who is ZakatFlow For?

- Muslims with **complex portfolios** — 401(k)s, RSUs, crypto, rental properties, trusts
- Families who want to follow **their specific scholar's methodology**, not a one-size-fits-all answer
- Anyone who needs a **professional Zakat report** for personal records or a financial advisor
- Community leaders recommending a **trustworthy, transparent** calculator to their congregation

---

## Why ZakatFlow?

Most Zakat calculators are simple forms that apply one school's rules with no transparency. ZakatFlow is different:

| Traditional Calculators | ZakatFlow |
|---|---|
| Single methodology, hardcoded | **8 scholarly methodologies**, each a full configuration |
| "Enter your assets" → one number | **Guided wizard** walking through every asset class |
| No source attribution | **Every rule traced** to a specific scholar and ruling |
| No document support | **AI extracts** line items from bank & brokerage statements |
| No bank integration | **Plaid bank sync** for real-time balances |
| Data stored in plaintext | **Two-tier encryption** — you choose Managed or Sovereign mode |
| Closed-source | **Fully open-source** (AGPL-3.0) — audit every line |

---

## Feature Showcase

### 🧮 Zakat Calculation Engine (ZMCS v2.0)

The engine is powered by the **Zakat Methodology Configuration Standard** — a JSON-based specification with **60+ configurable parameters** covering every Zakat calculation decision point. Each methodology is a validated configuration, not hardcoded logic.

**8 Shipped Presets:**

| Methodology | Tradition | Key Position | Debt Approach |
| :--- | :--- | :--- | :--- |
| **Sheikh Joe Bradford** (Default) | Balanced Synthesis | Precautionary, AAOIFI-aligned | 12-month rule |
| **AMJA** | Institutional | North American standard, net-accessible retirement | Current due only |
| **Imam Tahir Anwar** | Hanafi | Strong ownership, full retirement zakatable | Full deduction |
| **Dr. Al-Qaradawi** | Progressive Ijtihad | Most influential modern text | 12-month rule |
| **Hanafi** | Classical | Jewelry zakatable, net worth approach | Full deduction |
| **Shafi'i** | Classical | No debt deduction, gross asset approach | No deduction |
| **Maliki** | Classical | Exploited-asset view, velocity economics | 12-month rule |
| **Hanbali** | Classical | Debt deductible, jewelry exempt | Full deduction |

**Active Methodology Indicator** — Always know which scholar's rules are active. Switch methodologies from any screen with one click.

---

### 📊 Supported Asset Classes

ZakatFlow covers every major wealth category:

- **Cash & Bank Accounts** — Checking, savings, money market
- **Stocks, ETFs & Mutual Funds** — Active and passive, with methodology-specific treatment
- **Retirement Accounts** — 401(k), IRA, Roth IRA, pension (5 calculation modes)
- **Cryptocurrency & Digital Assets** — Including staking and DeFi positions
- **Gold, Silver & Precious Metals** — Investment bullion and personal jewelry
- **Business Assets** — Inventory, receivables, fixed assets
- **Real Estate** — Rental income, property for sale, land banking
- **Trusts** — Revocable and irrevocable with distinct treatment
- **Debts Owed to You** — Good debt (collectible) and bad debt (doubtful)
- **Liabilities** — Housing, student loans, credit cards, living expenses, per-methodology rules

---

### 🤖 Asset Intelligence (AI Document Extraction)

Upload bank statements, brokerage reports, or financial documents — AI extracts line items automatically.

- **Powered by Google Gemini 3.0 Flash** — superior context window for tabular data
- **Smart Classification** — AI maps extracted items to the correct Zakat category
- **Extraction Review** — Always review and correct before accepting
- **Ephemeral Processing** — Documents are processed in memory and immediately discarded; only extracted values are kept
- **Privacy-Safe** — Enterprise Gemini APIs; your data is never used for AI training

---

### 🏦 Bank Sync (Plaid Integration)

Connect your bank, brokerage, or investment accounts for real-time balances.

- **Plaid-Powered** — Industry-standard bank connectivity (same provider as Venmo, Robinhood)
- **Smart Account Classification** — Plaid account types automatically mapped to Zakat categories
- **User-Key Encrypted** — Account names, balances, and holding details encrypted with *your* key; our server cannot read this data
- **Token Security** — Plaid access tokens encrypted with AES-256-GCM using per-user derived keys
- **One-Click Cleanup** — Revoke all Plaid connections instantly, including API-level token revocation

---

### 🔒 Privacy & Security

ZakatFlow handles sensitive financial data with a defense-in-depth architecture.

**Two-Tier Encryption:**

| Mode | Key Storage | Recovery | Best For |
|------|-------------|----------|----------|
| **Managed** (Default) | Key in database under RLS | Account recovery possible | Most users — frictionless security |
| **Sovereign** (Opt-in) | Key wrapped with 12-word phrase | Only you can recover | Maximum privacy — zero-knowledge |

- **AES-256-GCM** encryption for all saved data (calculations, Plaid data, metadata)
- **Privacy Shield** — One-click blur mode for using the app in public spaces
- **Guest Vault** — Use the full calculator without signing in; session-encrypted in your browser
- **Account Deletion** — Full cascade: data deletion, Plaid token revocation, auth identity removal
- **Open Source** — Entire codebase is AGPL-3.0; encryption and privacy claims are independently verifiable

---

### 📈 Visualization & Export

- **Sankey Flow Chart** — Interactive diagram showing how each asset class flows to your Zakat obligation
- **PDF Report** — Professional, printer-ready report with methodology attribution and line-item detail
- **CSV Baseline** — Spreadsheet-ready export with formulas for Google Sheets / Excel
- **Print-Friendly View** — Web-optimized print layout

---

### 🕌 Donation Tracking & Hawl Management

- **Active Hawl Progress** — Visual progress bar tracking your lunar year
- **Donation Logging** — Record payments with amount, recipient, date, and notes
- **Receipt Scanning** — AI-powered receipt extraction (Gemini Flash)
- **Cloud Sync** — Donations sync across devices when signed in
- **Year-over-Year History** — Track Zakat obligations and payments across multiple years

---

### 🌍 Accessibility & Inclusivity

- **Built for everyone** — Screen reader compatible, high-contrast themes, tested for accessibility compliance
- **Responsive Design** — Full functionality on mobile, tablet, and desktop
- **Simple & Detailed Modes** — Quick estimate or comprehensive analysis
- **Plain Language** — Clear, scannable copy written for diverse audiences
- **Fiqh Explanations** — Scholarly context for every asset class and ruling

---

## How We Built It

| What You Get | How It Works |
|---|---|
| **Any methodology, instantly** | Each methodology is a full configuration file — no hardcoded rules. New methodologies can be added without changing the engine. |
| **Live Nisab threshold** | Gold and silver prices fetched at calculation time, so your Nisab is always current |
| **Your data stays local** | Financial data never leaves your device for computation — only encrypted results are saved |
| **API secrets never exposed** | Plaid and AI credentials run in isolated server functions, never in your browser |

---

## Open Source

ZakatFlow is licensed under **GNU Affero General Public License v3.0** (AGPL-3.0).

This means:
- ✅ **Free to use, modify, and distribute**
- ✅ **Full source code access** — verify every encryption and privacy claim
- ✅ **Community contributions welcome** — see [CONTRIBUTING.md](CONTRIBUTING.md)
- ⚖️ **Copyleft** — derivative works must also be open-source under AGPL

---

## For Developers

ZakatFlow is fully documented. See the [README](README.md) for architecture, setup, contributing guidelines, and links to all technical documentation — including the ZMCS specification, security architecture, and engineering design.

---

## Acknowledgments

- **Sheikh Joe Bradford** — Primary methodology source, *Simple Zakat Guide*
- **AMJA** — Assembly of Muslim Jurists of America
- **Imam Tahir Anwar** — Hanafi methodology, Zaytuna College
- **Dr. Yusuf Al-Qaradawi** — *Fiqh al-Zakah*, the most influential modern Zakat treatise
- **AAOIFI** — Accounting and Auditing Organization for Islamic Financial Institutions

---

<p align="center">
  <strong>May Allah accept your Zakat and purify your wealth. 🤲</strong>
</p>
