# ZakatFlow — Product Guide

> The most accurate Zakat calculator available. Eight scholarly methodologies. AI-powered document import. Bank-grade encryption.

[![Live App](https://img.shields.io/badge/Live-zakatflow.org-blue.svg)](https://zakatflow.org)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

*Last updated: February 17, 2026 (v0.32.0)*

---

## Table of Contents

- [Who is ZakatFlow For?](#who-is-zakatflow-for)
- [Why ZakatFlow?](#why-zakatflow)
- [Feature Showcase](#feature-showcase)
  - [Zakat Calculation Engine](#zakat-calculation-engine-zmcs-v20)
  - [Supported Asset Classes](#supported-asset-classes)
  - [Asset Intelligence](#asset-intelligence-ai-document-extraction)
  - [Bank Sync](#bank-sync-plaid-integration)
  - [AI Companion](#ai-companion-model-context-protocol)
  - [Privacy and Security](#privacy-and-security)
  - [Visualization and Export](#visualization-and-export)
  - [Donation Tracking and Hawl Management](#donation-tracking-and-hawl-management)
  - [Accessibility and Inclusivity](#accessibility-and-inclusivity)
- [Architecture Overview](#architecture-overview)
- [Open Source](#open-source)
- [Documentation](#documentation)
- [Acknowledgments](#acknowledgments)

---

## Who is ZakatFlow For?

- Muslims with **complex portfolios** — 401(k)s, RSUs, crypto, rental properties, trusts
- Families who want to follow **their specific scholar's methodology**, not a one-size-fits-all answer
- Anyone who needs a **professional Zakat report** for personal records or a financial advisor
- Community leaders recommending a **trustworthy, transparent** calculator to their congregation

---

## Why ZakatFlow?

Most Zakat calculators are simple forms that apply one methodology with no transparency. ZakatFlow is different:

| Traditional Calculators | ZakatFlow |
|---|---|
| Single methodology, hardcoded | **8 scholarly methodologies**, each a full configuration |
| "Enter your assets" → one number | **Guided wizard** walking through every asset class |
| No source attribution | **Every rule traced** to a specific scholar and ruling |
| No document support | **AI extracts** line items from bank and brokerage statements |
| No bank integration | **Plaid bank sync** for real-time balances |
| No AI assistance | **MCP server** connects to ChatGPT and Claude for Q&A |
| Data stored in plaintext | **Two-tier encryption** — Managed or Sovereign mode |
| Closed source | **Fully open source** (AGPL-3.0) — audit every line |

---

## Feature Showcase

### Zakat Calculation Engine (ZMCS v1.0)

The engine is powered by the **Zakat Methodology Configuration Standard** — a JSON-based specification with **60+ configurable parameters** covering every Zakat calculation decision point. Each methodology is a validated configuration, not hardcoded logic.

**Eight Shipped Presets:**

| Methodology | Tradition | Key Position | Debt Approach |
|:---|:---|:---|:---|
| **Sheikh Joe Bradford** (Default) | Balanced Synthesis | Precautionary, AAOIFI-aligned | 12-month rule |
| **AMJA** | Institutional | North American standard, net-accessible retirement | Current due only |
| **Imam Tahir Anwar** | Hanafi | Strong ownership, full retirement zakatable | Full deduction |
| **Dr. Al-Qaradawi** | Progressive Ijtihad | Most influential modern text | 12-month rule |
| **Hanafi** | Classical | Jewelry zakatable, net worth approach | Full deduction |
| **Shafi'i** | Classical | No debt deduction, gross asset approach | No deduction |
| **Maliki** | Classical | Exploited-asset view, velocity economics | 12-month rule |
| **Hanbali** | Classical | Debt deductible, jewelry exempt | Full deduction |

**Active Methodology Indicator** — Always visible in the interface. Shows which scholar's rules are active. Switch methodologies from any screen with one click.

Explore all methodologies interactively at [zakatflow.org/methodology](https://zakatflow.org/methodology).

---

### Supported Asset Classes

ZakatFlow covers every major wealth category:

- **Cash and Bank Accounts** — Checking, savings, money market
- **Stocks, ETFs, and Mutual Funds** — Active and passive, with methodology-specific treatment
- **Retirement Accounts** — 401(k), IRA, Roth IRA, pension (five calculation modes)
- **Cryptocurrency and Digital Assets** — Including staking and DeFi positions
- **Gold, Silver, and Precious Metals** — Investment bullion and personal jewelry
- **Business Assets** — Inventory, receivables, fixed assets
- **Real Estate** — Rental income, property for sale, land banking
- **Trusts** — Revocable and irrevocable with distinct treatment
- **Debts Owed to You** — Good debt (collectible) and bad debt (doubtful)
- **Liabilities** — Housing, student loans, credit cards, living expenses, per-methodology rules

---

### Asset Intelligence (AI Document Extraction)

Upload bank statements, brokerage reports, or financial documents. AI extracts line items automatically.

- **Powered by Google Gemini 3.0 Flash** — Superior context window for tabular financial data
- **Smart Classification** — AI maps extracted items to the correct Zakat category
- **Extraction Review** — Review and correct all values before accepting
- **Ephemeral Processing** — Documents are processed in memory and immediately discarded; only extracted values are kept
- **Privacy-Safe** — Enterprise Gemini APIs; your data is never used for AI training

---

### Bank Sync (Plaid Integration)

Connect bank, brokerage, or investment accounts for real-time balances.

- **Industry Standard** — Plaid is the same provider used by Venmo, Robinhood, and other financial apps
- **Smart Account Classification** — Plaid account types automatically mapped to Zakat categories
- **User-Key Encrypted** — Account names, balances, and holding details encrypted with your key; the server cannot read this data
- **Token Security** — Plaid access tokens encrypted with AES-256-GCM using per-user derived keys
- **One-Click Cleanup** — Revoke all Plaid connections instantly, including API-level token revocation

---

### AI Companion (Model Context Protocol)

ZakatFlow includes an MCP server that connects the calculation engine to AI assistants. Ask your AI about Zakat rulings, and it calls ZakatFlow tools for accurate, methodology-aware answers.

- **ChatGPT and Claude Support** — Works with any MCP-compatible AI client
- **Real Calculations** — The AI calls the same `@zakatflow/core` engine that powers the web app
- **Methodology-Aware** — The AI receives the full agent protocol for the selected scholarly methodology
- **Deep Link Reports** — The AI can generate a link that opens ZakatFlow with your calculation pre-filled
- **Nine Tools** — `calculate_zakat`, `parse_blob_input`, `start_session`, `add_asset`, `get_agent_protocol`, `get_market_prices`, `list_methodologies`, `get_nisab_info`, `create_report_link`

See the [MCP Server Product Guide](../../apps/mcp-server/PRODUCT.md) for setup instructions and tool documentation.

---

### Privacy and Security

ZakatFlow handles sensitive financial data with a defense-in-depth architecture.

**Two-Tier Encryption:**

| Mode | Key Storage | Recovery | Best For |
|------|-------------|----------|----------|
| **Managed** (Default) | Key in database under RLS | Account recovery possible | Most users — frictionless security |
| **Sovereign** (Opt-in) | Key wrapped with 12-word phrase | Only you can recover | Maximum privacy — zero-knowledge |

**Security Features:**

- **AES-256-GCM** encryption for all saved data (calculations, Plaid data, metadata)
- **Privacy Shield** — One-click blur mode for using the app in public spaces
- **Guest Vault** — Use the full calculator without signing in; session-encrypted in your browser
- **Account Deletion** — Full cascade: data deletion, Plaid token revocation, auth identity removal
- **Open Source** — Entire codebase is AGPL-3.0; encryption and privacy claims are independently verifiable

For technical details, see [Security Architecture](docs/SECURITY_ARCHITECTURE.md).

---

### Visualization and Export

- **Sankey Flow Chart** — Interactive diagram showing how each asset class flows to your Zakat obligation
- **PDF Report** — Professional, printer-ready report with methodology attribution and line-item detail
- **CSV Baseline** — Spreadsheet-ready export with formulas for Google Sheets and Excel
- **Print-Friendly View** — Web-optimized print layout

---

### Donation Tracking and Hawl Management

- **Active Hawl Progress** — Visual progress bar tracking your lunar year
- **Donation Logging** — Record payments with amount, recipient, date, and notes
- **Receipt Scanning** — AI-powered receipt extraction (Gemini Flash)
- **Cloud Sync** — Donations sync across devices when signed in
- **Year-over-Year History** — Track Zakat obligations and payments across multiple years

---

### Accessibility and Inclusivity

- **Screen Reader Compatible** — Full keyboard navigation and ARIA attributes
- **WCAG 2.1 AA** — Tested for accessibility compliance on all public pages
- **Responsive Design** — Full functionality on mobile, tablet, and desktop
- **Simple and Detailed Modes** — Quick estimate or comprehensive analysis
- **Plain Language** — Clear, scannable copy written for diverse audiences
- **Fiqh Explanations** — Scholarly context for every asset class and ruling

---

## Architecture Overview

ZakatFlow is built as a monorepo with three packages:

| Package | Purpose |
|---------|---------|
| `apps/web` | React 18 web application (Vite, Tailwind CSS, shadcn/ui) |
| `apps/mcp-server` | MCP server for AI assistant integration (Express, SSE/Stdio) |
| `packages/core` | Shared calculation engine, ZMCS presets, types, and utilities |

The web application and MCP server both import from `@zakatflow/core`, ensuring identical calculation logic across all surfaces. The backend uses Supabase for authentication, database, and Edge Functions (AI parsing, Plaid integration, account management).

For a comprehensive technical breakdown, see [Engineering Design](docs/ENGINEERING_DESIGN.md).

---

## Open Source

ZakatFlow is licensed under **GNU Affero General Public License v3.0** (AGPL-3.0).

This means:

- **Free to use, modify, and distribute**
- **Full source code access** — verify every encryption and privacy claim
- **Community contributions welcome** — see [CONTRIBUTING.md](../../CONTRIBUTING.md)
- **Copyleft** — derivative works must also be open source under AGPL-3.0

---

## Documentation

| Document | Description |
|----------|-------------|
| [README](../../README.md) | Repository overview and getting started |
| [Contributing Guide](../../CONTRIBUTING.md) | Development workflow and coding standards |
| [Changelog](../../CHANGELOG.md) | Version history |
| [ZMCS Specification](docs/ZMCS_SPECIFICATION.md) | Methodology configuration standard |
| [Zakat Jurisprudence](docs/ZAKAT_JURISPRUDENCE.md) | Scholarly analysis and fiqh foundations |
| [Engineering Design](docs/ENGINEERING_DESIGN.md) | Technical architecture |
| [Security Architecture](docs/SECURITY_ARCHITECTURE.md) | Encryption and privacy |
| [Content Standards](docs/CONTENT_STANDARDS.md) | Writing guidelines |
| [Contributing Methodology](docs/CONTRIBUTING_METHODOLOGY.md) | Adding a new scholarly methodology |

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
