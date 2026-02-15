

## Fix: Supabase Connection After .env Removal

### What Happened

The `.env` file was previously committed to Git with your Supabase credentials. When you correctly removed it for security, the Lovable Cloud build environment lost the ability to inject those values, causing the app to fall back to `placeholder.supabase.co` -- a non-existent domain.

**Good news:** Your `.gitignore` already excludes `.env`, so the security fix was correct. The `.env` file in the Lovable Cloud build environment is auto-managed by the platform and does not need to be in your GitHub repo.

### The Fix

The `.env` file needs to be **recreated in the Lovable project only** (not in GitHub). Since this is a Lovable Cloud project, the platform auto-generates this file during builds. The fix is simply to re-trigger the auto-generation by writing the `.env` file with the correct Supabase credentials that are already known to the project:

**File: `.env`**
```
VITE_SUPABASE_PROJECT_ID="pcwdpsoheoiiavkeyeyx"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon-key>"
VITE_SUPABASE_URL="https://pcwdpsoheoiiavkeyeyx.supabase.co"
```

This file is auto-managed by Lovable Cloud and excluded from GitHub by `.gitignore` -- so it will NOT appear in your repo.

### Why This Is Secure

- The `.gitignore` already blocks `.env`, `.env.local`, and `.env.*.local` from being committed
- The anon key is a **publishable** key (designed for client-side use, protected by Row Level Security)
- All sensitive secrets (Gemini API key, Plaid credentials, encryption keys) are stored as backend secrets, never in code
- The `.env.example` template provides safe guidance for open-source contributors

### No Code Changes Needed

The `runtimeClient.ts` with its placeholder fallback is actually correct behavior -- it prevents crashes when env vars are missing during development. Once the `.env` is restored in the Lovable environment, the real credentials will be used automatically.

