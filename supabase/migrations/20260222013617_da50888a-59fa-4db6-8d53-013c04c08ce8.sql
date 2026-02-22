
-- Migration 1: Plaid User-Key Encryption (encrypted_metadata on plaid_items)
ALTER TABLE public.plaid_items
ADD COLUMN IF NOT EXISTS encrypted_metadata TEXT;

COMMENT ON COLUMN public.plaid_items.encrypted_metadata IS 'Client-encrypted JSON: institution_id, institution_name, consent_expiration_time. Decrypt with user symmetric key.';

-- Migration 2: ChatGPT User Identity & Session Persistence
CREATE TABLE IF NOT EXISTS public.chatgpt_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chatgpt_user_id TEXT UNIQUE NOT NULL,
    display_name TEXT,
    preferred_madhab TEXT DEFAULT 'bradford',
    encrypted_profile TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chatgpt_users_chatgpt_user_id
    ON public.chatgpt_users(chatgpt_user_id);

CREATE TABLE IF NOT EXISTS public.chatgpt_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.chatgpt_users(id) ON DELETE CASCADE,
    session_data JSONB,
    methodology TEXT DEFAULT 'bradford',
    zakat_due NUMERIC,
    total_assets NUMERIC,
    is_above_nisab BOOLEAN,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chatgpt_sessions_user_id
    ON public.chatgpt_sessions(user_id);

ALTER TABLE public.chatgpt_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatgpt_sessions ENABLE ROW LEVEL SECURITY;

-- Migration 3: Analytics source column
ALTER TABLE public.zakat_anonymous_events
ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'web';

CREATE INDEX IF NOT EXISTS idx_anonymous_events_source
ON public.zakat_anonymous_events (source);
