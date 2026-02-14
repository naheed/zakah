# Security & Data Privacy

**Organization:** vora.dev (dba ZakatFlow)
**Owner:** Information Security Officer (security@vora.dev)
**Effective Date:** January 5, 2026
**Version:** 3.0

> This document consolidates ZakatFlow's security architecture, data privacy policies,
> and contributor security guidelines into a single authoritative reference.

---

## 1. Overview

ZakatFlow handles sensitive financial data to calculate Zakat obligations. This policy establishes the framework for securing the platform, aligned with industry best practices (NIST CSF, SOC 2 principles) to ensure the **confidentiality, integrity, and availability** of user data.

### 1.1 Shared Responsibility Model

ZakatFlow operates on a Serverless / Cloud-Native architecture. Security is managed through a Shared Responsibility Model:

| Party | Responsibility |
| :--- | :--- |
| **ZakatFlow** | Application logic, code security, IAM, data encryption configuration, API integration security |
| **Platform Providers** (Supabase, Vercel) | OS patching, database availability, network firewalls, physical data center security |
| **Infrastructure** (AWS / Google Cloud) | Physical hardware, power, environmental controls |

---

## 2. Security Architecture

ZakatFlow is designed with a **zero-trust, secrets-never-in-code** architecture:

| Layer | Protection |
| :--- | :--- |
| **Client-side** | Only publishable keys (Supabase anon key, GA Measurement ID) |
| **Edge Functions** | Secrets stored in Supabase Vault, never in code |
| **Database** | Row Level Security (RLS) on all user tables |
| **Encryption** | AES-256-GCM for sensitive data (Plaid tokens, guest vault) |

### 2.1 Trust Zones

| Zone | Data Type | Storage | Encryption | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Guest Vault** | Asset values, PII | `localStorage` | AES-256-GCM (Client-Side) | Device Only |
| **Cloud (User)** | Asset values | Postgres | TLS (Transit) + RLS (At Rest) | Authenticated User Only |
| **Secure Enclave** | Plaid Tokens | Postgres | AES-256-GCM (Server-Side) | Edge Function Only |

---

## 3. Data Classification

| Classification | Definition | Examples | Handling Requirements |
| :--- | :--- | :--- | :--- |
| **Level 1: Public** | Information intended for public release | Marketing site, open-source code, public docs | No restrictions |
| **Level 2: Internal** | Business operations data | Source code, roadmaps, internal analytics | MFA required for access |
| **Level 3: Restricted** | Highly sensitive consumer data | Plaid Access Tokens, financial transaction data, PII | Encryption at rest & in transit. Strict RBAC |

---

## 4. What's Safe to Commit

Since ZakatFlow is open-source, contributors must understand the boundary:

**Safe to commit:**
- `.env.example` (template with placeholder values)
- Supabase anon key (publishable, designed for client-side use)
- Google Analytics Measurement ID (publishable)
- All application source code

**Never commit:**
- `.env` or `.env.local` with real values
- Service role keys
- API secrets (Gemini, Plaid, etc.)
- Encryption keys

---

## 5. Secret Management

All sensitive secrets are managed through **Supabase Secrets** (edge function environment variables):

| Secret | Purpose | Source |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | AI document parsing | [Google AI Studio](https://aistudio.google.com/) |
| `PLAID_CLIENT_ID` | Bank connections | [Plaid Dashboard](https://dashboard.plaid.com/) |
| `PLAID_SECRET` | Bank connections | [Plaid Dashboard](https://dashboard.plaid.com/) |
| `PLAID_ENV` | Plaid environment | `sandbox`, `development`, or `production` |
| `PLAID_ENCRYPTION_KEY` | Token encryption | Generate: `openssl rand -hex 32` |

---

## 6. Encryption

### 6.1 Data in Transit

All data transmitted between clients, the application, and third-party APIs (Plaid, Google Gemini) uses **TLS 1.2 or higher** with strong cipher suites. Downgrade attacks are prevented via HSTS.

### 6.2 Data at Rest

All Level 3 data stored in databases (Supabase/PostgreSQL) is encrypted using **AES-256** (or stronger).

### 6.3 Guest Vault (Client-Side)

Allows guests to use the app without data leaking to other users of the same device:

- **Algorithm:** AES-256-GCM via `SubtleCrypto` (Web Crypto API)
- **Key Derivation:** Ephemeral session key generated on first visit, stored in `sessionStorage`
- **Storage:** `localStorage` payload is encrypted ciphertext
- **Threat Model:** Protects against casual snooping. Does not protect against a compromised device (malware)

### 6.4 Plaid Token Encryption (Server-Side)

Plaid `access_tokens` allow withdrawal of data and are treated as critical secrets:

- **Key:** 32-byte hex secret (`PLAID_ENCRYPTION_KEY`) injected as an environment variable into the Edge Runtime
- **Salt:** Unique 16-byte random salt generated per token
- **Algorithm:** AES-256-GCM with PBKDF2 key derivation (100,000 iterations)
- **Decryption:** Occurs strictly within the `plaid-exchange-token` and `delete-account` Edge Functions. The database administrator cannot read tokens without the runtime env var

### 6.5 Application Secrets

API keys (e.g., `PLAID_SECRET`, `SUPABASE_SERVICE_ROLE`) are managed exclusively via environment variables. Secrets are never committed to version control.

---

## 7. Identity and Access Management

We adhere to the **Principle of Least Privilege** and Zero Trust.

### 7.1 Authentication Standards

- **Administrative Access:** MFA is mandatory for all accounts with administrative access to production environments (Supabase, GitHub, Vercel, Google Workspace)
- **Service Accounts:** Machine-to-machine communication uses scoped API tokens with rotation policies, never user credentials
- **End-User Access:** Consumer authentication is delegated to Google OAuth 2.0 (OpenID Connect). ZakatFlow does not store, salt, or hash user passwords

### 7.2 Row Level Security

All user-facing tables have RLS policies ensuring users can only access their own data:

```sql
-- Example: Users can only view their own calculations
CREATE POLICY "Users can view own calculations"
  ON zakat_calculations FOR SELECT
  USING (auth.uid() = user_id);
```

### 7.3 Offboarding

Access to all systems is revoked immediately (within 2 hours) upon termination of an employee or contractor engagement.

---

## 8. Data Retention and Disposal

ZakatFlow adheres to the principle of **Data Minimization**. We collect only the data strictly necessary to perform Zakat calculations and retain it only as long as required.

### 8.1 Retention Schedules

| Data Domain | Specific Data | Retention Period | Rationale |
| :--- | :--- | :--- | :--- |
| **User Identity** | Name, email, OAuth ID | Duration of account | Required for authentication |
| **Banking Connectivity** | Plaid access tokens, item IDs | Duration of account | Tokens allow ongoing balance fetching |
| **Financial Records** | Transactions, asset valuations | Duration of account | Required for year-over-year comparison |
| **Raw Documents** | Uploaded PDFs/images | Ephemeral (max 1 hour) | Processed by AI then immediately discarded |
| **Audit Logs** | API logs, access logs | 1 year | Security auditing and forensics |

### 8.2 Deletion Protocols

- **Application Data:** "Hard Delete" (SQL `DELETE`). No soft deletion for sensitive financial data
- **Plaid Tokens:** Deletion triggers an immediate API call to `/item/remove` at Plaid, permanently invalidating the token

### 8.3 User Right to Erasure

Users may trigger account deletion via application settings. The automated process:

1. **Immediate:** User access is revoked
2. **T+0 to T+24 Hours:** All rows in user, account, and transaction tables are purged
3. **Plaid Revocation:** All Plaid tokens are decrypted, revoked via API, then deleted
4. **Confirmation:** Email dispatched confirming erasure

### 8.4 Backup Expiration

- Production databases are backed up automatically by Supabase for disaster recovery
- Backups are retained for 30 days
- Deleted data naturally ages out of the backup cycle after 30 days (industry standard)

### 8.5 Partial Deletion (Unlinking)

When a user unlinks a data source without deleting their account:

- **Raw Data (Deleted):** Access token, item ID, and cached transaction data are immediately hard-deleted
- **Derived Data (Retained):** Historical Zakat calculation reports and asset summaries are retained as part of the user's permanent record until explicitly deleted

### 8.6 Exceptions

Data may be retained beyond the standard schedule only for:
1. A legal hold or subpoena
2. An active security investigation requiring forensic preservation

---

## 9. AI and LLM Security (Google Gemini)

ZakatFlow uses Google Gemini for document parsing. Privacy protections:

- **Data Minimization:** Only specific document pages required for Zakat calculation are sent to the AI model
- **No Training:** Enterprise APIs are used; customer data is not used to train foundation models
- **Ephemeral Processing:** Data sent to the AI inference endpoint is processed in memory and not persistently stored by the provider

---

## 10. Development and Vulnerability Management

### 10.1 Secure Development Life Cycle

- **Code Review:** All changes require a pull request and review before merging to the main branch
- **Static Analysis:** Automated CI tools (GitHub Actions, Dependabot) scan for vulnerable dependencies (SCA) and code quality issues

### 10.2 Patch Management

- **Critical Vulnerabilities:** Patched within 72 hours of discovery
- **High/Medium Vulnerabilities:** Patched within 14 days
- **Platform Patching:** OS and database patching managed automatically by PaaS providers (Supabase)

---

## 11. Incident Response

In the event of a suspected breach:

1. **Identification:** Anomalies flagged via platform logs
2. **Containment:** Security Officer revokes compromised tokens and isolates affected services
3. **Notification:**
   - **Plaid/Partners:** Notified within 24 hours of confirmed unauthorized access to financial data
   - **Users:** Notified within 72 hours if PII is compromised, per GDPR/CCPA requirements

---

## 12. For Self-Hosters

If you fork and self-host ZakatFlow:

1. **Create your own Supabase project**
2. **Run all migrations** from `supabase/migrations/`
3. **Configure secrets** in Supabase Dashboard > Edge Functions > Secrets
4. **Enable RLS** on all tables (migrations do this automatically)
5. **Review security settings** before going to production

---

## 13. Vulnerability Disclosure

If you discover a security vulnerability:

1. **Do NOT open a public issue**
2. Email **security@vora.dev** with details
3. We will respond within 48 hours

---

## 14. Review Cycle

This policy is reviewed annually or upon significant architecture changes to ensure continued compliance with privacy laws (GDPR, CCPA) and partner requirements.

| Audit | Cadence |
| :--- | :--- |
| Security policy review | Annual |
| Dependency scanning | Automated (GitHub Dependabot) |
| Critical vulnerability patching | Within 72 hours |
| Full security audit | Annual |
