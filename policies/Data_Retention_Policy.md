# Data Retention and Disposal Policy

**Organization:** vora.dev (operating ZakatFlow)  
**Contact:** security@vora.dev  
**Effective Date:** January 5, 2026  
**Version:** 1.1

## 1. Policy Statement

ZakatFlow allows users to calculate their Zakat obligations by analyzing financial data. We adhere to the principle of Data Minimization—we only retain personal and financial data for as long as necessary to provide this service or as required by law.

## 2. Data Retention Schedules

| Data Category | Retention Period | Justification |
| :--- | :--- | :--- |
| **Plaid Access Tokens** | Duration of active account | Required to fetch balance/transaction data for ongoing Zakat calculation. |
| **Financial Transaction Data** | Duration of active account | Required to provide historical Zakat reports and year-over-year tracking. |
| **User Profile (Name, Email)** | Duration of active account | Essential for account identification and service communication. |
| **Zakat Calculation Reports** | 7 Years | Retained for user's tax and audit purposes. |
| **Application Logs** | 90 Days | Used for security auditing, debugging, and performance monitoring. |

## 3. Data Disposal & Deletion

Data is considered "disposed" when it is permanently deleted from our active databases (Supabase) and cannot be readily recovered.

### 3.1 User-Initiated Deletion

Users may request account deletion at any time via the application settings or by emailing support.

Upon request, ZakatFlow will:

1.  Delete the user's row from the `users` table in Supabase.
2.  Cascade delete all associated financial records and transaction history.
3.  Call the Plaid API `/item/remove` endpoint to invalidate and remove the associated Access Tokens.

This process is completed within 30 days of the request.

### 3.2 Plaid Connection Removal

If a user unlinks a specific bank account but keeps their ZakatFlow account active, we immediately delete the Access Token and all cached transaction data associated with that specific bank institution.

### 3.3 End of Life

If the ZakatFlow service is discontinued, all user data will be securely deleted within 90 days of service termination, and users will be notified prior to deletion to allow for data export.

## 4. Policy Review

This policy is reviewed annually by the Data Protection Officer (CEO) to ensure compliance with privacy regulations (GDPR/CCPA) and partner requirements (Plaid).
