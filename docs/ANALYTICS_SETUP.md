# Google Analytics 4 Setup Guide

This project is instrumented with **GA4** to track user engagement while prioritizing privacy.

## 1. Create Account & Property
1. Go to [analytics.google.com](https://analytics.google.com).
2. Click **Admin** (Gear icon) -> **Create Account**.
3. **Account Name**: `ZakatFlow` (or your organization name).
4. **Property Name**: `ZakatFlow Web`.
5. **Timezone**: Set to your primary region.
6. **Currency**: `USD` (or your primary currency).

## 2. Create Data Stream
1. Select **Web** platform.
2. **Website URL**: `zakatflow.org` (or your production domain).
3. **Stream Name**: `ZakatFlow Production`.
4. Click **Create Stream**.

## 3. Get Measurement ID
1. Copy the **Measurement ID** (Format: `G-XXXXXXXXXX`).
2. Open your local `.env` file.
3. Add or update:
   ```bash
   VITE_GOOGLE_ANALYTICS_ID="G-YOUR-ID-HERE"
   ```
4. **Redeploy** your application.

## 4. (Optional) Custom Definitions
To see the segmented data in your GA4 dashboard, you must register these "User Properties":

1. Go to **Admin** -> **Data Display** -> **Custom Definitions**.
2. Click **Create custom dimension**.
3. Add the following **User-scoped** dimensions:

| Dimension Name | User Property | Description |
|---|---|---|
| Madhab | `madhab` | The user's school of thought (e.g., hanafi) |
| Mode | `simple_mode` | `true` if using Simple Mode, `false` for Detailed |
| Wealth Tier | `wealth_tier` | Privacy-safe bucket (e.g., "Tier 3") |

## 5. Verification
- Use the **Realtime** report in GA4.
- Visit your site and click around.
- You should see users appear in the "Last 30 minutes" card.
