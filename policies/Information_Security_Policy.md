# Information Security Policy

**Organization:** vora.dev (dba ZakatFlow)  
**Owner:** Information Security Officer (security@vora.dev)  
**Effective Date:** January 5, 2026  
**Version:** 2.0 (Enterprise Revision)

## 1. Overview and Purpose

The purpose of this Information Security Policy (ISP) is to establish the framework for securing the ZakatFlow platform. This policy aligns with industry best practices (NIST CSF, SOC 2 principles) to ensure the confidentiality, integrity, and availability of consumer financial data.

## 2. Scope and Shared Responsibility

This policy applies to all production assets, data, and personnel associated with ZakatFlow.

ZakatFlow operates on a Serverless / Cloud-Native architecture. Security is managed through a Shared Responsibility Model:

*   **ZakatFlow (Us):** Responsible for application logic, code security, identity management (IAM), data encryption configuration, and API integration security.
*   **Platform Providers (Supabase, Lovable, Vercel):** Responsible for OS patching, database availability, network firewalls, and physical security of data centers.
*   **Infrastructure (AWS / Google Cloud):** Responsible for the physical hardware, power, and environmental controls.

## 3. Data Classification and Handling

Data is categorized to ensure appropriate protection levels:

| Classification | Definition | Examples | Handling Requirements |
| :--- | :--- | :--- | :--- |
| **Level 1: Public** | Information intended for public release. | Marketing site, Public Docs. | No restrictions. |
| **Level 2: Internal** | Business operations data. | Source code, Roadmaps. | MFA required for access. |
| **Level 3: Restricted** | Highly sensitive consumer data. | Plaid Access Tokens, Financial Transaction Data, PII. | Encryption at rest & in transit required. Strict RBAC. |

## 4. Identity and Access Management (IAM)

We adhere to the Principle of Least Privilege and Zero Trust concepts.

### 4.1 Authentication Standards

*   **Administrative Access:** Multi-Factor Authentication (MFA) is mandatory for all accounts with administrative access to production environments (Supabase, GitHub, Vercel, Google Workspace).
*   **Service Accounts:** Machine-to-machine communication uses scoped API tokens with rotation policies, never user credentials.
*   **End-User Access:** Consumer authentication is delegated to Google OAuth 2.0 (OpenID Connect). ZakatFlow does not store, salt, or hash user passwords.

### 4.2 Offboarding

Access to all systems is revoked immediately (within 2 hours) upon the termination of an employee or contractor engagement.

## 5. Cryptography and Secret Management

### 5.1 Encryption Standards

*   **Data in Transit:** All data transmitted between clients, the application, and third-party APIs (Plaid, Google Gemini) must use TLS 1.2 or higher with strong cipher suites. Downgrade attacks are prevented via HSTS.
*   **Data at Rest:** All Level 3 data stored in databases (Supabase/PostgreSQL) is encrypted using AES-256 (or stronger).
*   **Application Secrets:** API Keys (e.g., PLAID_SECRET, SUPABASE_SERVICE_ROLE) are managed via environment variables. Secrets are never committed to version control.

## 6. Development and Vulnerability Management

### 6.1 Secure Development Life Cycle (SDLC)

*   **Code Review:** All changes to the codebase require a pull request and review before merging to the main branch.
*   **Static Analysis:** We utilize automated CI tools (e.g., GitHub Actions, Dependabot) to scan for vulnerable dependencies (SCA) and code quality issues.

### 6.2 Patch Management

*   **Critical Vulnerabilities:** Patched within 72 hours of discovery.
*   **High/Medium Vulnerabilities:** Patched within 14 days.
*   **Platform Patching:** OS and Database patching is managed automatically by our PaaS providers (Supabase).

## 7. AI and LLM Security (Google Gemini)

ZakatFlow utilizes Google Gemini for document parsing. To protect user privacy:

*   **Data Minimization:** Only specific document pages required for Zakat calculation are sent to the AI model.
*   **No Training:** We utilize enterprise APIs that do not use customer data to train foundation models.
*   **Ephemeral Processing:** Data sent to the AI inference endpoint is processed in memory and not persistently stored by the AI provider.

## 8. Incident Response

In the event of a suspected breach:

*   **Identification:** Anomalies are flagged via platform logs.
*   **Containment:** The Security Officer will revoke compromised tokens and isolate affected services.
*   **Notification:**
    *   **Plaid/Partners:** Notified within 24 hours of confirmed unauthorized access to financial data.
    *   **Users:** Notified within 72 hours if PII is compromised, per GDPR/CCPA requirements.
