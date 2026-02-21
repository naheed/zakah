# Backend Architecture & Security Rules

Standards for `apps/mcp-server`, `packages/core`, and Supabase Edge Functions.

## Core Backend Directives
- **Stateless Resilience**: Supabase Edge Functions must return structured JSON errors with correct HTTP status codes.
- **Dual Compliance**: Operations handling data must run through secular constraints (Privacy Policy) and Islamic Jurisprudence constraints (no arbitrary scholarly formulas).

## Input Validation
- **Zod schemas**: Validate *all* external inputs. This includes AI LLM outputs (Gemini `parse-financial-document` or MCP tools), API responses (Plaid), and User form data. 
- **Graceful degradation**: Handle AI hallucination or parsing edge-cases securely; log technical details internally via `console.error`.

## Security & Privacy Vault
- **AES-256-GCM (Web Crypto API)**: ZakatFlow handles sensitive financial data. Plaid sync tokens and account balances are protected by a client-side Two-Tier Encryption key system (Sovereign vs. Managed modes).
- **Audit Requirement**: Any PR touching `usePrivacyVault` or Plaid sync edge functions must trigger an architecture review by the `/senior-tech-lead`.
- **API Keys**: Never commit secrets. Always reference `process.env` (Node) or `Deno.env.get` (Edge Functions).

## Plaid Sync Integration
- Edge functions handle `plaid-link-token`, `plaid-exchange-token`, `plaid-cleanup-all`, and `delete-account`.
- Sync results must map cleanly to `ZakatFormData` to ensure downstream asset calculations run predictably through the ZMCS methodology engine.
