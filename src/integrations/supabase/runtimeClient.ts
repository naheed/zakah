import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// NOTE:
// Lovable Cloud injects these via Vite env vars at build time.
// For local development, create a .env.local file with your Supabase credentials.
// For open-source contributors: You'll need your own Supabase project.
// See README.md for setup instructions.

// Fallback values for development - replace with your own Supabase project
const FALLBACK_SUPABASE_URL = "";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = "";

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
