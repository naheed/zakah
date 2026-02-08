# Open Source Security Guide

This document explains the security architecture of ZakatFlow for open-source contributors and reviewers.

## Security Architecture Summary

ZakatFlow is designed with a **zero-trust, secrets-never-in-code** architecture:

| Layer | Protection |
|-------|------------|
| **Client-side** | Only publishable keys (Supabase anon key, GA ID) |
| **Edge Functions** | Secrets stored in Supabase Vault, never in code |
| **Database** | Row Level Security (RLS) on all user tables |
| **Encryption** | AES-256-GCM for sensitive data (Plaid tokens) |

## What's Safe to Commit

✅ **Safe to commit:**
- `.env.example` (template with placeholder values)
- Supabase anon key (publishable, designed for client-side)
- Google Analytics Measurement ID (publishable)
- All application source code

❌ **Never commit:**
- `.env` or `.env.local` with real values
- Service role keys
- API secrets (Gemini, Plaid, etc.)
- Encryption keys

## Secret Management

All sensitive secrets are managed through **Supabase Secrets** (edge function environment variables):

| Secret | Purpose | Where to Get It |
|--------|---------|-----------------|
| `GEMINI_API_KEY` | AI document parsing | [Google AI Studio](https://aistudio.google.com/) |
| `PLAID_CLIENT_ID` | Bank connections | [Plaid Dashboard](https://dashboard.plaid.com/) |
| `PLAID_SECRET` | Bank connections | [Plaid Dashboard](https://dashboard.plaid.com/) |
| `PLAID_ENV` | Plaid environment | `sandbox`, `development`, or `production` |
| `PLAID_ENCRYPTION_KEY` | Token encryption | Generate with `openssl rand -hex 32` |

## Row Level Security

All user-facing tables have RLS policies ensuring users can only access their own data:

```sql
-- Example: Users can only view their own calculations
CREATE POLICY "Users can view own calculations"
  ON zakat_calculations FOR SELECT
  USING (auth.uid() = user_id);
```

## Encryption at Rest

Sensitive data (Plaid access tokens) is encrypted using:
- **Algorithm:** AES-256-GCM
- **Key Derivation:** PBKDF2 with 100,000 iterations
- **Per-record:** Random salt + IV for each encrypted value

## Security Scan Results

Run the security scanner to check for issues:
1. Open Lovable project settings
2. Navigate to Security tab
3. Review findings

Current status: **No critical issues**

## Contributing Security Fixes

If you discover a security vulnerability:
1. **Do NOT open a public issue**
2. Email security@vora.dev with details
3. We'll respond within 48 hours

## For Self-Hosters

If you fork and self-host ZakatFlow:

1. **Create your own Supabase project**
2. **Run all migrations** from `supabase/migrations/`
3. **Configure secrets** in Supabase Dashboard → Edge Functions → Secrets
4. **Enable RLS** on all tables (migrations do this automatically)
5. **Review security settings** before going to production

## Audit Trail

- Last security audit: February 2026
- Dependency scanning: Automated via GitHub Dependabot
- Vulnerability patching: Within 72 hours for critical issues
