-- Payments table for tracking Stripe charges
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  provider text not null default 'stripe',
  provider_session_id text,
  amount integer not null, -- in cents
  currency text not null default 'mxn',
  description text,
  status text not null default 'created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Basic RLS: users can see their own payments
alter table public.payments enable row level security;
create policy "users can select own payments" on public.payments
for select using (auth.uid() = user_id);

-- trigger to update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.payments
for each row execute procedure public.set_updated_at();
