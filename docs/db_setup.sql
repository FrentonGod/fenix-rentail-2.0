-- Supabase DB setup for profiles + first-login pre-registration
-- Run this in Supabase SQL Editor (project > SQL > New query)

-- 1) profiles table (user profile data)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Unique email (case-insensitive), optional when email is present
create unique index if not exists profiles_email_unique_idx
  on public.profiles (lower(email))
  where email is not null;

-- 2) updated_at trigger
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 3) RLS policies (users can read/insert/update ONLY their own profile)
alter table public.profiles enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Can view own profile') then
    create policy "Can view own profile" on public.profiles
      for select using (auth.uid() = id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Can insert own profile') then
    create policy "Can insert own profile" on public.profiles
      for insert with check (auth.uid() = id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'Can update own profile') then
    create policy "Can update own profile" on public.profiles
      for update using (auth.uid() = id);
  end if;
end $$;

-- 4) Auto-create profile on new auth user (optional but recommended)
create or replace function public.handle_new_user() returns trigger
security definer
set search_path = public
language plpgsql as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''))
  on conflict (id) do nothing;
  return new;
end; $$;

-- Create trigger on auth.users (if not existing yet)
-- Note: This is supported on Supabase; auth schema is accessible.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) (Optional) Allowlist tables to manage who can register (enforced app-side; DB reference only)
-- create table if not exists public.allowed_emails (email text primary key);
-- create table if not exists public.allowed_domains (domain text primary key);
-- You can keep these as reference lists and enforce on the app or via Edge Functions.
