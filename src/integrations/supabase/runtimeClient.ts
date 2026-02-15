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

// NOTE:
// Lovable Cloud injects these via Vite env vars at build time.
// For local development, create a .env.local file with your Supabase credentials.
// For open-source contributors: You'll need your own Supabase project.
// See README.md for setup instructions.

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
const derivedUrl = projectId ? `https://${projectId}.supabase.co` : undefined;

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  derivedUrl ??
  "";

const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  "";

if (!SUPABASE_URL) {
  console.error(
    "Missing VITE_SUPABASE_URL environment variable. " +
    "Backend features will not work. " +
    "Create a .env.local with your Supabase credentials."
  );
}

export const supabase = createClient<Database>(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_PUBLISHABLE_KEY || "placeholder-key",
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
