-- Migration: Create Asset V2 Tables
-- Description: Creates portfolios, accounts, snapshots, and line_items tables with RLS policies.

-- 1. Portfolios Table
create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  currency text default 'USD' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS: Users can only see their own portfolio
alter table portfolios enable row level security;

create policy "Users can view their own portfolio"
  on portfolios for select
  using (auth.uid() = user_id);

create policy "Users can insert their own portfolio"
  on portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own portfolio"
  on portfolios for update
  using (auth.uid() = user_id);

-- 2. Asset Accounts Table
create table if not exists asset_accounts (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid references portfolios(id) on delete cascade not null,
  name text not null,
  institution_name text not null,
  mask text, -- Last 4 digits
  type text not null, -- 'CHECKING', 'BROKERAGE', etc.
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS: Inherited from portfolio ownership
alter table asset_accounts enable row level security;

create policy "Users can view accounts via portfolio"
  on asset_accounts for select
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = asset_accounts.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can insert accounts via portfolio"
  on asset_accounts for insert
  with check (
    exists (
      select 1 from portfolios
      where portfolios.id = portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can update accounts via portfolio"
  on asset_accounts for update
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = asset_accounts.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can delete accounts via portfolio"
  on asset_accounts for delete
  using (
    exists (
      select 1 from portfolios
      where portfolios.id = asset_accounts.portfolio_id
      and portfolios.user_id = auth.uid()
    )
  );

-- 3. Snapshots Table
create table if not exists asset_snapshots (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references asset_accounts(id) on delete cascade not null,
  statement_date date not null,
  total_value numeric not null default 0,
  method text not null, -- 'MANUAL', 'AI', 'API'
  source_document_path text,
  status text default 'DRAFT' not null, -- 'DRAFT', 'CONFIRMED'
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS
alter table asset_snapshots enable row level security;

create policy "Users can view snapshots via account portfolio"
  on asset_snapshots for select
  using (
    exists (
      select 1 from asset_accounts
      join portfolios on portfolios.id = asset_accounts.portfolio_id
      where asset_accounts.id = asset_snapshots.account_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can insert snapshots via account portfolio"
  on asset_snapshots for insert
  with check (
    exists (
      select 1 from asset_accounts
      join portfolios on portfolios.id = asset_accounts.portfolio_id
      where asset_accounts.id = account_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can update snapshots via account portfolio"
  on asset_snapshots for update
  using (
    exists (
      select 1 from asset_accounts
      join portfolios on portfolios.id = asset_accounts.portfolio_id
      where asset_accounts.id = asset_snapshots.account_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can delete snapshots via account portfolio"
  on asset_snapshots for delete
  using (
    exists (
      select 1 from asset_accounts
      join portfolios on portfolios.id = asset_accounts.portfolio_id
      where asset_accounts.id = asset_snapshots.account_id
      and portfolios.user_id = auth.uid()
    )
  );

-- 4. Line Items Table
create table if not exists asset_line_items (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid references asset_snapshots(id) on delete cascade not null,
  description text not null,
  amount numeric not null,
  currency text default 'USD' not null,
  raw_category text, -- AI guessed category
  inferred_category text, -- Standardized internal category
  zakat_category text not null, -- 'LIQUID', 'PROXY_30', etc.
  zakat_rule_override numeric, -- User override for specific proxy rate
  created_at timestamptz default now() not null
);

-- RLS
alter table asset_line_items enable row level security;

create policy "Users can view line items via hierarchy"
  on asset_line_items for select
  using (
    exists (
      select 1 from asset_snapshots
      join asset_accounts on asset_accounts.id = asset_snapshots.account_id
      join portfolios on portfolios.id = asset_accounts.portfolio_id
      where asset_snapshots.id = asset_line_items.snapshot_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can manage line items via hierarchy"
  on asset_line_items for insert
  with check (
    exists (
      select 1 from asset_snapshots
      join asset_accounts on asset_accounts.id = asset_snapshots.account_id
      join portfolios on portfolios.id = asset_accounts.portfolio_id
      where asset_snapshots.id = snapshot_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can update line items via hierarchy"
  on asset_line_items for update
  using (
    exists (
      select 1 from asset_snapshots
      join asset_accounts on asset_accounts.id = asset_snapshots.account_id
      join portfolios on portfolios.id = asset_accounts.portfolio_id
      where asset_snapshots.id = asset_line_items.snapshot_id
      and portfolios.user_id = auth.uid()
    )
  );

create policy "Users can delete line items via hierarchy"
  on asset_line_items for delete
  using (
    exists (
      select 1 from asset_snapshots
      join asset_accounts on asset_accounts.id = asset_snapshots.account_id
      join portfolios on portfolios.id = asset_accounts.portfolio_id
      where asset_snapshots.id = asset_line_items.snapshot_id
      and portfolios.user_id = auth.uid()
    )
  );