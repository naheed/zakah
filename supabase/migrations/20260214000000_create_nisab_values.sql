-- Create table for storing historical Nisab values
create table if not exists public.nisab_values (
    date date not null primary key,
    gold_price numeric not null, -- Price per ounce
    silver_price numeric not null, -- Price per ounce
    currency text not null default 'USD',
    meta jsonb default '{}'::jsonb, -- Store source, ratio, etc.
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.nisab_values enable row level security;

-- Policies
-- Everyone can read
create policy "Allow public read access"
    on public.nisab_values for select
    using (true);

-- Only service role (cron) can insert/update
-- (Implicitly denied for anon/authenticated unless we add policy, which we won't for now)
-- We might need a policy for the service role if RLS is strict, but service_role bypasses RLS usually.
-- Just in case we want to allow authenticated users to trigger updates (unlikely), we'll keep it locked.

-- Add comment
comment on table public.nisab_values is 'Historical Gold and Silver prices for Nisab calculation';

-- Create table for storing historical exchange rates
create table if not exists public.currency_rates (
    date date not null,
    currency text not null, -- e.g. 'EUR', 'GBP', 'PKR'
    rate_to_usd numeric not null, -- 1 USD = X Currency
    created_at timestamptz default now(),
    primary key (date, currency)
);

-- Enable RLS
alter table public.currency_rates enable row level security;

-- Policies
create policy "Allow public read access"
    on public.currency_rates for select
    using (true);
    
comment on table public.currency_rates is 'Historical Forex rates against USD';
