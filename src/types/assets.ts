export type AccountType =
    | 'CHECKING'
    | 'SAVINGS'
    | 'BROKERAGE'
    | 'RETIREMENT_401K'
    | 'RETIREMENT_IRA'
    | 'ROTH_IRA'
    | 'CRYPTO_WALLET'
    | 'REAL_ESTATE'
    | 'TRUST'
    | 'METALS'
    | 'BUSINESS'
    | 'OTHER';

export type ExtractionMethod = 'MANUAL' | 'PDF_PARSE' | 'PLAID_API' | 'COINBASE_API';

export type ZakatCategory =
    | 'LIQUID' // 100% Cash Treatment
    | 'PROXY_30' // 30% Zakatable (Stocks)
    | 'PROXY_100' // 100% Zakatable (Active Trading, Crypto)
    | 'EXEMPT' // 0% (Personal Use, Unvested)
    | 'CUSTOM'; // User override

export interface AssetPortfolio {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    currency: string;
}

export interface AssetAccount {
    id: string;
    portfolio_id: string;
    name: string; // "Adv Plus Banking"
    institution_name: string; // "Bank of America"
    mask: string; // "...1918"
    type: AccountType;
    metadata?: Record<string, unknown>;
    balance?: number; // Computed from latest snapshot
    created_at: string;
    updated_at: string;
}

export interface AssetSnapshot {
    id: string;
    account_id: string;
    statement_date: string; // The date of the actual financial statement
    created_at: string; // When it was imported
    method: ExtractionMethod;
    source_document_path?: string; // Path to PDF in Supabase Storage
    total_value: number; // Verification sum
    status: 'DRAFT' | 'CONFIRMED';
}

export interface AssetLineItem {
    id: string;
    snapshot_id: string;
    description: string; // "Apple Inc (AAPL)"
    amount: number;
    currency: string;

    // Classification
    raw_category: string; // AI's guess: "EQUITY"
    inferred_category: string; // Internal: "STOCK_LONG_TERM"

    // Zakat Logic
    zakat_category: ZakatCategory;
    zakat_rule_override?: number; // E.g., 0.25 for 25% proxy
}
