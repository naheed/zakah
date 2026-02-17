-- Plaid Integration Schema
-- Migration: Add tables for Plaid data storage

-- Store Plaid Link items (one per user-institution connection)
CREATE TABLE IF NOT EXISTS plaid_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Plaid identifiers
    access_token TEXT NOT NULL,      -- Encrypted access token from Plaid
    item_id TEXT NOT NULL UNIQUE,    -- Plaid's item_id
    
    -- Institution info
    institution_id TEXT,
    institution_name TEXT,
    
    -- Status
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING', 'ERROR', 'DISCONNECTED')),
    error_code TEXT,
    error_message TEXT,
    
    -- Consent tracking
    consent_expiration_time TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Store accounts from Plaid (maps to our asset_accounts)
CREATE TABLE IF NOT EXISTS plaid_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plaid_item_id UUID NOT NULL REFERENCES plaid_items(id) ON DELETE CASCADE,
    asset_account_id UUID REFERENCES asset_accounts(id) ON DELETE SET NULL, -- Link to our accounts
    
    -- Plaid identifiers
    account_id TEXT NOT NULL,        -- Plaid's account_id
    
    -- Account info from Plaid
    name TEXT,
    official_name TEXT,
    type TEXT,                       -- investment, brokerage, checking, etc.
    subtype TEXT,                    -- 401k, ira, roth, etc.
    mask TEXT,                       -- Last 4 digits
    
    -- Balances (updated on sync)
    balance_current DECIMAL,
    balance_available DECIMAL,
    balance_iso_currency_code TEXT DEFAULT 'USD',
    
    -- Classification helper
    is_active_trader BOOLEAN DEFAULT FALSE,  -- User toggle: active vs passive
    
    -- Timestamps
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(plaid_item_id, account_id)
);

-- Store investment holdings from Plaid
CREATE TABLE IF NOT EXISTS plaid_holdings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plaid_account_id UUID NOT NULL REFERENCES plaid_accounts(id) ON DELETE CASCADE,
    
    -- Plaid identifiers
    security_id TEXT,               -- Plaid's security_id
    
    -- Security info
    name TEXT,
    ticker_symbol TEXT,
    security_type TEXT,              -- cash, cryptocurrency, equity, etf, fixed_income, derivative
    
    -- Holding data
    quantity DECIMAL,
    cost_basis DECIMAL,              -- Total cost basis
    institution_price DECIMAL,       -- Price per share from institution
    institution_value DECIMAL,       -- Total value (quantity * price)
    iso_currency_code TEXT DEFAULT 'USD',
    
    -- Derived fields
    unofficial_currency_code TEXT,   -- For crypto
    
    -- Timestamps
    price_as_of TIMESTAMPTZ,         -- When the price was last updated
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Store classification feedback for ML training
CREATE TABLE IF NOT EXISTS classification_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- What was classified
    line_item_id UUID REFERENCES asset_line_items(id) ON DELETE SET NULL,
    description TEXT,
    
    -- Prediction
    predicted_category TEXT NOT NULL,
    predicted_confidence DECIMAL,
    signals_used JSONB,              -- Array of signals that contributed
    
    -- User correction (if any)
    corrected_category TEXT,
    apply_always BOOLEAN DEFAULT FALSE,  -- "Always apply to this description?"
    
    -- Context for training
    account_type TEXT,
    institution_name TEXT,
    source_type TEXT,                -- 'plaid', 'ai_extract', 'manual'
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    corrected_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_plaid_items_user_id ON plaid_items(user_id);
CREATE INDEX IF NOT EXISTS idx_plaid_accounts_item_id ON plaid_accounts(plaid_item_id);
CREATE INDEX IF NOT EXISTS idx_plaid_holdings_account_id ON plaid_holdings(plaid_account_id);
CREATE INDEX IF NOT EXISTS idx_classification_feedback_user_id ON classification_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_classification_feedback_description ON classification_feedback(description) WHERE apply_always = TRUE;

-- RLS Policies
ALTER TABLE plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaid_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaid_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE classification_feedback ENABLE ROW LEVEL SECURITY;

-- Users can only see their own Plaid data
CREATE POLICY "Users can view own plaid_items"
    ON plaid_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plaid_items"
    ON plaid_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plaid_items"
    ON plaid_items FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plaid_items"
    ON plaid_items FOR DELETE
    USING (auth.uid() = user_id);

-- Plaid accounts inherit from items (joined access)
CREATE POLICY "Users can view own plaid_accounts"
    ON plaid_accounts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM plaid_items
            WHERE plaid_items.id = plaid_accounts.plaid_item_id
            AND plaid_items.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own plaid_accounts"
    ON plaid_accounts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM plaid_items
            WHERE plaid_items.id = plaid_accounts.plaid_item_id
            AND plaid_items.user_id = auth.uid()
        )
    );

-- Plaid holdings inherit from accounts
CREATE POLICY "Users can view own plaid_holdings"
    ON plaid_holdings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM plaid_accounts
            JOIN plaid_items ON plaid_items.id = plaid_accounts.plaid_item_id
            WHERE plaid_accounts.id = plaid_holdings.plaid_account_id
            AND plaid_items.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own plaid_holdings"
    ON plaid_holdings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM plaid_accounts
            JOIN plaid_items ON plaid_items.id = plaid_accounts.plaid_item_id
            WHERE plaid_accounts.id = plaid_holdings.plaid_account_id
            AND plaid_items.user_id = auth.uid()
        )
    );

-- Classification feedback
CREATE POLICY "Users can view own classification_feedback"
    ON classification_feedback FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own classification_feedback"
    ON classification_feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own classification_feedback"
    ON classification_feedback FOR UPDATE
    USING (auth.uid() = user_id);