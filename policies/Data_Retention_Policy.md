# Data Retention and Disposal Policy

**Organization:** vora.dev (dba ZakatFlow)  
**Owner:** Information Security Officer (security@vora.dev)  
**Effective Date:** January 5, 2026  
**Version:** 2.0 (Enterprise Revision)

## 1. Policy Statement

ZakatFlow adheres to the principle of Data Minimization. We collect only the data strictly necessary to perform Zakat calculations and retain it only as long as required to provide the service or meet legal obligations.

## 2. Retention Schedules

| Data Domain | Specific Data Elements | Retention Period | Rationale |
| :--- | :--- | :--- | :--- |
| **User Identity** | Name, Email, OAuth ID | Duration of Account | Required for authentication and service delivery. |
| **Banking Connectivity** | Plaid Access Tokens, Item IDs | Duration of Account | Tokens allow ongoing fetching of balance data. |
| **Financial Records** | Transactions, Asset Valuations | Duration of Account | Required for year-over-year Zakat comparison. |
| **Raw Documents** | Uploaded PDFs/Images | Ephemeral (Max 1 Hour) | Documents are processed by AI and then immediately discarded. We do not use ZakatFlow as a document storage locker. |
| **Audit Logs** | API Logs, Access Logs | 1 Year | Security auditing and forensic analysis. |

## 3. Data Disposal and Deletion Protocols

### 3.1 Hard Deletion vs. Soft Deletion

*   **Application Data:** When data is deleted, we execute a "Hard Delete" (SQL DELETE) operation. We do not use "Soft Deletion" (marking as hidden) for sensitive financial data.
*   **Plaid Tokens:** Deletion triggers an immediate API call to `/item/remove` at Plaid, invalidating the token permanently.

### 3.2 User Right to Erasure

Users may trigger account deletion via the application settings. This process is automated:

1.  **Immediate:** User access is revoked.
2.  **T+0 to T+24 Hours:** All rows in the `users`, `accounts`, and `transactions` tables associated with the `user_id` are purged.
3.  **Confirmation:** An email is dispatched confirming the erasure.

### 3.3 Backup Expiration

*   Production databases are backed up automatically by Supabase for disaster recovery.
*   Backups are retained for 30 days.
*   Data deleted from the live application will naturally age out of the backup cycle after 30 days. This is industry standard practice for disaster recovery compliance.

## 4. Exceptions

Data may be retained beyond the standard schedule only in the event of:

1.  A legal hold or subpoena.
2.  An active security investigation requiring forensic preservation.

## 5. Review Cycle

This policy is reviewed annually or upon significant architecture changes (e.g., changing database providers) to ensure continued compliance with privacy laws (GDPR, CCPA) and partner requirements.
