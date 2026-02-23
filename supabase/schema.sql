-- ISD Device Loaner – run this in Supabase SQL Editor (Dashboard → SQL Editor)

-- Profiles (one per auth user)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'student' check (role in ('admin', 'student')),
  preferred_lang text default 'en' check (preferred_lang in ('en', 'fr')),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Devices
create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  serial_number text not null,
  status text not null default 'available' check (status in ('available', 'loaned', 'repair')),
  condition text not null default 'good' check (condition in ('new', 'good', 'fair', 'poor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(serial_number)
);

-- Loans
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  device_id uuid not null references public.devices (id) on delete cascade,
  checkout_at timestamptz not null default now(),
  due_at timestamptz not null,
  returned_at timestamptz,
  notified_24h boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One active loan per device (returned_at is null)
create unique index if not exists loans_one_active_per_device
  on public.loans (device_id) where (returned_at is null);

-- When loan created, set device to loaned
create or replace function public.set_device_loaned()
returns trigger as $$
begin
  update public.devices set status = 'loaned', updated_at = now() where id = new.device_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_loan_created on public.loans;
create trigger on_loan_created after insert on public.loans
  for each row execute function public.set_device_loaned();

-- When loan returned, set device to available
create or replace function public.set_device_returned()
returns trigger as $$
begin
  if new.returned_at is distinct from old.returned_at and new.returned_at is not null then
    update public.devices set status = 'available', updated_at = now() where id = new.device_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_loan_returned on public.loans;
create trigger on_loan_returned after update on public.loans
  for each row execute function public.set_device_returned();

-- Create profile on signup. Everyone gets role 'student'. To make someone admin:
-- Option A: In Supabase Table Editor → profiles → set role = 'admin' for that user.
-- Option B: In .env.local set NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,other@example.com (comma-separated); those users get admin on next load.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'student')
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.loans enable row level security;

-- Profiles: users can read/update/insert own (insert for backfill if trigger missed)
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Helper: is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer stable;

-- Devices: admins all; others read available only
create policy "Admins manage devices" on public.devices for all using (public.is_admin());
create policy "Anyone can read available devices" on public.devices for select using (status = 'available');

-- Loans: admins all; users read own, insert own, update own (for return)
create policy "Admins manage loans" on public.loans for all using (public.is_admin());
create policy "Users read own loans" on public.loans for select using (auth.uid() = user_id);
create policy "Users create own loans" on public.loans for insert with check (auth.uid() = user_id);
create policy "Users update own loans" on public.loans for update using (auth.uid() = user_id);

-- Grant usage
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.devices to authenticated;
grant select, insert, update on public.loans to authenticated;
