-- Mallory Alpha Streams usage ledger

create table if not exists alpha_usage (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade,
    tool_name text not null,
    cost_estimate numeric not null,
    currency text default 'USDC',
    receipt jsonb,
    input jsonb,
    created_at timestamptz default now()
);

alter table alpha_usage enable row level security;

drop policy if exists "Alpha usage - view own" on alpha_usage;
create policy "Alpha usage - view own"
    on alpha_usage
    for select
    using (auth.uid() = user_id);

