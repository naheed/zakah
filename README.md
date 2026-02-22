# ZakatFlow

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Live App](https://img.shields.io/badge/Live-zakatflow.org-blue.svg)](https://zakatflow.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Accessibility: WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%20AA-success.svg)](https://www.w3.org/WAI/WCAG2AA-Conformance)

**The most accurate Zakat calculator available.** Eight scholarly methodologies. AI-powered document import. Bank-grade encryption. Open source.

[Live App](https://zakatflow.org) · [Product Guide](apps/web/PRODUCT.md) · [Methodology Explorer](https://zakatflow.org/methodology) · [Report an Issue](https://github.com/naheed/zakah/issues)

---

## Overview

ZakatFlow helps Muslims calculate their annual Zakat obligation with precision and confidence. The application walks users through each asset class — cash, investments, retirement accounts, precious metals, cryptocurrency, real estate, and more — ensuring nothing is missed. Eight scholarly methodologies power the calculation engine, each fully configurable and traceable to its source.

---

## Documentation Index

ZakatFlow's documentation is optimized for both Human and AI "Agent Swarm" workflows. We use atomic, isolated markdown files to prevent context-bloat.

### For Human Onboarding:
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Start here. Covers local dev setup, PR processes, and how to contribute methodologies.
- **[System Design](apps/web/docs/architecture/system-design.md)**: End-to-end architecture diagrams (React -> Edge Functions -> Postgres).
- **[Core ZMCS Architecture](docs/architecture/ZMCS.md)**: Why we chose Configuration-Driven schemas over code for scholars.
- **[Compute Pipeline](docs/architecture/COMPUTE_PIPELINE.md)**: How we compute all methodologies in O(1) pass.
- **[Presentation & Export Layer](docs/architecture/PRESENTATION_DATA.md)**: Visual conservation proofs (Sankey) and PDF/CSV parity.
- **[Web UI Product Guide](apps/web/PRODUCT.md)**: Feature overview for the web app frontend.
- **[MCP Server Guide](apps/mcp-server/PRODUCT.md)**: Connecting ZakatFlow tools to AI assistants (Claude, ChatGPT).
- **[Monorepo Contract](apps/web/docs/rules/monorepo.md)**: The strict build rules governing our Lovable `package.json` resolution.

### For AI Agents (LLMs):
- **[CONTEXT.md](CONTEXT.md)**: The master map. Agents should read this first to locate the exact syntax rules required for their task.
- **[AGENTS.md](AGENTS.md)**: The definitions and capabilities of our 7 custom Agent Personas (e.g. `/ui-designer`, `/backend-ai-engineer`).

---

## Supported Methodologies

| Methodology | Tradition | Key Position | Debt Approach |
|:---|:---|:---|:---|
| **Sheikh Joe Bradford** (Default) | Balanced Synthesis | Precautionary, AAOIFI-aligned | 12-month rule |
| **AMJA** | Institutional | North American standard | Current due only |
| **Imam Tahir Anwar** | Hanafi | Strong ownership, full retirement zakatable | Full deduction |
| **Dr. Al-Qaradawi** | Progressive Ijtihad | Most influential modern text | 12-month rule |
| **Hanafi** | Classical | Jewelry zakatable, net worth approach | Full deduction |
| **Shafi'i** | Classical | No debt deduction, gross asset approach | No deduction |
| **Maliki** | Classical | Exploited-asset view, velocity economics | 12-month rule |
| **Hanbali** | Classical | Debt deductible, jewelry exempt | Full deduction |

Each methodology is a complete ZMCS configuration. New methodologies can be added without changing the engine. See [ZMCS Specification](apps/web/docs/ZMCS_SPECIFICATION.md). 

> **Call for Scholar Auditors:** We are actively seeking scholars and Islamic institutions to audit these presets. See [CONTRIBUTING.md](CONTRIBUTING.md) or contact [naheed@vora.dev](mailto:naheed@vora.dev).

---

## Deployment

**Web Application (Static Host)**: `npm run build` from root. Deploy the `dist/` directory to Vercel/Netlify.
**Edge Functions (Supabase)**: `supabase functions deploy parse-financial-document`
**MCP Server (Docker)**: `cd apps/mcp-server && docker build -t zakatflow-mcp -f Dockerfile ../..`

---

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See [LICENSE](LICENSE) for the full text.

This means:
- Free to use, modify, and distribute
- Full source code access — verify every encryption and privacy claim
- Derivative works must also be open source under AGPL-3.0

---

<p align="center">
  <strong>May Allah accept your Zakat and purify your wealth. 🤲</strong>
</p>
