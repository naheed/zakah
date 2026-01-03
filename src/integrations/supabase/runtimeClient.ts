import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// NOTE:
// Lovable Cloud normally injects these via Vite env vars.
// We keep a safe fallback here to prevent the app from hard-crashing
// when env injection temporarily fails (e.g. after a sync/rebuild issue).
const FALLBACK_SUPABASE_URL = "https://pcwdpsoheoiiavkeyeyx.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjd2Rwc29oZW9paWF2a2V5ZXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTc4NTksImV4cCI6MjA4MjQzMzg1OX0.rynCiAyR1LCfUzp2ytXPSAmpVm5AsSi0ta_1Y03uru4";

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
const derivedUrl = projectId ? `https://${projectId}.supabase.co` : undefined;

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  derivedUrl ??
  FALLBACK_SUPABASE_URL;

const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  FALLBACK_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
