-- Create Hawl Settings Table
create type calendar_type as enum ('gregorian', 'hijri');

create table public.hawl_settings (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    hawl_start_date date not null,
    calendar_type text not null default 'gregorian', -- using text to be flexible or enum
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (id),
    unique (user_id) -- One setting per user
);

alter table public.hawl_settings enable row level security;

create policy "Users can view their own hawl settings"
    on public.hawl_settings for select
    using (auth.uid() = user_id);

create policy "Users can insert their own hawl settings"
    on public.hawl_settings for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own hawl settings"
    on public.hawl_settings for update
    using (auth.uid() = user_id);

-- Create Zakat Years Table
create table public.zakat_years (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    hawl_start date not null,
    hawl_end date not null,
    calculated_amount numeric not null default 0,
    calculation_id uuid, -- Optional link to a calculation
    is_current boolean not null default false,
    is_superseded boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (id)
);

alter table public.zakat_years enable row level security;

create policy "Users can view their own zakat years"
    on public.zakat_years for select
    using (auth.uid() = user_id);

create policy "Users can insert their own zakat years"
    on public.zakat_years for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own zakat years"
    on public.zakat_years for update
    using (auth.uid() = user_id);

-- Create Donations Table
create table public.donations (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    zakat_year_id uuid references public.zakat_years(id) on delete set null,
    amount numeric not null,
    recipient_name text not null,
    recipient_category text not null,
    donation_date date not null,
    notes text,
    receipt_url text,
    extracted_via_ai boolean default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (id)
);

alter table public.donations enable row level security;

create policy "Users can view their own donations"
    on public.donations for select
    using (auth.uid() = user_id);

create policy "Users can insert their own donations"
    on public.donations for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own donations"
    on public.donations for update
    using (auth.uid() = user_id);

create policy "Users can delete their own donations"
    on public.donations for delete
    using (auth.uid() = user_id);

-- Functions to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_hawl_settings
  before update on public.hawl_settings
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_zakat_years
  before update on public.zakat_years
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at_donations
  before update on public.donations
  for each row execute procedure public.handle_updated_at();
