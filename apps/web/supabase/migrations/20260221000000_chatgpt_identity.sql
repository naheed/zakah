-- ============================================================================
-- ChatGPT User Identity & Session Persistence
-- Migration for ZakatFlow MCP Server (Apps SDK Integration)
-- Issue #26 — https://github.com/naheed/zakah/issues/26
-- ============================================================================

-- 1. ChatGPT Users Table
-- Maps ChatGPT user IDs to ZakatFlow user records.
-- The chatgpt_user_id is the primary identity from the OpenAI Apps SDK.
-- Future: can be linked to auth.users for "Login with ChatGPT" on web.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.chatgpt_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatgpt_user_id TEXT UNIQUE NOT NULL,
    display_name TEXT,
    preferred_madhab TEXT DEFAULT 'bradford',
    encrypted_profile TEXT,  -- Future: Privacy Vault encrypted profile data
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by ChatGPT user ID
CREATE INDEX IF NOT EXISTS idx_chatgpt_users_chatgpt_user_id
    ON public.chatgpt_users(chatgpt_user_id);

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER handle_updated_at_chatgpt_users
    BEFORE UPDATE ON public.chatgpt_users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================================
-- 2. ChatGPT Sessions Table
-- Stores Zakat calculation sessions for ChatGPT users.
-- Session data is stored as encrypted JSON (Privacy Vault pattern in #27).
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.chatgpt_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.chatgpt_users(id) ON DELETE CASCADE,
    session_data JSONB,            -- Plaintext for now; encrypted_data TEXT in #27
    methodology TEXT DEFAULT 'bradford',
    zakat_due NUMERIC,
    total_assets NUMERIC,
    is_above_nisab BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookups by user_id
CREATE INDEX IF NOT EXISTS idx_chatgpt_sessions_user_id
    ON public.chatgpt_sessions(user_id);

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER handle_updated_at_chatgpt_sessions
    BEFORE UPDATE ON public.chatgpt_sessions
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================================
-- 3. RLS Policies
-- The MCP server uses the service-role key which bypasses RLS.
-- These policies restrict access from the anon key (public API, web clients)
-- to prevent unauthorized access to ChatGPT user data.
-- ============================================================================

-- Enable RLS on both tables
ALTER TABLE public.chatgpt_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatgpt_sessions ENABLE ROW LEVEL SECURITY;

-- chatgpt_users: No public access (only service-role can read/write)
-- No SELECT/INSERT/UPDATE/DELETE policies for anon = fully locked down

-- chatgpt_sessions: No public access (only service-role can read/write)
-- No policies = anon key cannot access at all

-- FUTURE (#27): When "Login with ChatGPT" is implemented, add policies like:
-- CREATE POLICY "Users can view their own ChatGPT profile"
--     ON public.chatgpt_users FOR SELECT
--     USING (id IN (SELECT chatgpt_user_id FROM auth.users_metadata WHERE auth.uid() = user_id));
