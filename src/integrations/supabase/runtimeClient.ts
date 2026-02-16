/*
 * Copyright (C) 2026 ZakatFlow
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Lovable Cloud injects these via Vite env vars at build time.
// For open-source contributors: create a .env.local with your Supabase credentials.
// See .env.example for required variables.

// Publishable fallbacks — these are the anon (public) credentials,
// safe to ship in client bundles.  They match what .env / .env.example contain.
const FALLBACK_PROJECT_ID = "pcwdpsoheoiiavkeyeyx";
const FALLBACK_URL = `https://${FALLBACK_PROJECT_ID}.supabase.co`;
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjd2Rwc29oZW9paWF2a2V5ZXl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTc4NTksImV4cCI6MjA4MjQzMzg1OX0.rynCiAyR1LCfUzp2ytXPSAmpVm5AsSi0ta_1Y03uru4";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_PROJECT_ID
    ? `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`
    : undefined) ??
  FALLBACK_URL;

const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  FALLBACK_KEY;

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