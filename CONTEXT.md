# ZakatFlow Global Context Index

This file is the **master index** for AI Agents operating in the ZakatFlow repository. 

To conserve context tokens and prevent hallucinations, **DO NOT** request monolithic files. Use this index to locate the specific, atomic Markdown file required for your current task.

## Key Root Files
- [AGENTS.md](./AGENTS.md) — Manifest of all AI agent personas, rules, and boundaries.
- [README.md](./README.md) — High-level project onboarding and setup.
- [CONTRIBUTING.md](./CONTRIBUTING.md) — Human/AI contribution workflows and PR processes.

## Rules & Standards (`apps/web/docs/rules/`)
When building features, refer to these strict guidelines:
- [React Style & CSS](apps/web/docs/rules/react-style.md) — UI logic, shadcn/ui, Tailwind semantic tokens, accessibility.
- [Content & Voice](apps/web/docs/rules/content-voice.md) — The "Dignified Guide" tone, methodology glossary, and number formatting.
- [Backend & Security](apps/web/docs/rules/backend-architecture.md) — Supabase Edge Functions, Row Level Security, Plaid handling.
- [Monorepo Contract](apps/web/docs/rules/monorepo.md) — Rules for dependencies, Lovable build constraints, and workspace resolution.

## Architecture & Fiqh
- [System Design](apps/web/docs/architecture/system-design.md) — End-to-end architecture diagrams and transport protocols.
- [ZMCS Specification](apps/web/docs/ZMCS_SPECIFICATION.md) — The core methodology configuration schema rules.
- [Zakat Jurisprudence](apps/web/docs/ZAKAT_JURISPRUDENCE.md) — Scholarly basis and fiqh foundations for calculations.
- [Web Product Guide](apps/web/PRODUCT.md) — Feature overview for the web app UI.
- [MCP Server Guide](apps/mcp-server/PRODUCT.md) — Tool registry and transport rules for the AI assistant server.
