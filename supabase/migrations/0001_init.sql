-- Empire Projects — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) for a new project.

-- ============================================================================
-- Extensions
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- Enums
-- ============================================================================
create type public.building_stage as enum (
  'Targeting',
  'Pending Pricing',
  'Pending Proposal',
  'Submitted',
  'Won',
  'Lost',
  'Executed'
);

create type public.service_type as enum (
  'Windows',
  'Facade',
  'Windows + Facade'
);

create type public.app_role as enum ('admin', 'sub');

-- ============================================================================
-- Tables
-- ============================================================================

-- user_roles: maps an authenticated user to admin/sub. New users default to
-- 'sub' via the handle_new_user trigger below; promote to admin manually.
create table public.user_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role public.app_role not null default 'sub',
  created_at timestamptz not null default now()
);

-- buildings: one row per tracked building/deal.
create table public.buildings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_type public.service_type not null default 'Windows',
  stage public.building_stage not null default 'Targeting',
  sub_price numeric(12, 2),
  customer_price numeric(12, 2),
  notes text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- stage_logs: append-only history of stage transitions per building, used to
-- auto-stamp the date a building entered a stage and to compute time-in-stage.
-- Rows are inserted/closed automatically by the trigger below, never by the app.
create table public.stage_logs (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings (id) on delete cascade,
  stage public.building_stage not null,
  entered_at timestamptz not null default now(),
  exited_at timestamptz
);

create index stage_logs_building_id_idx on public.stage_logs (building_id);
create unique index stage_logs_open_per_building_idx
  on public.stage_logs (building_id)
  where exited_at is null;

-- settings: per-field visibility toggle for the 'sub' role. Admins always see
-- everything; this only affects what subs are shown in the UI.
create table public.settings (
  field_name text primary key,
  visible_to_sub boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.settings (field_name, visible_to_sub) values
  ('service_type', true),
  ('stage', true),
  ('date_logged', true),
  ('time_in_stage', true),
  ('sub_price', true),
  ('customer_price', true),
  ('notes', true);

-- ============================================================================
-- Helper functions
-- ============================================================================

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = uid and role = 'admin'
  );
$$;

-- Creates a user_roles row (default 'sub') the first time a user signs in.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, email, role)
  values (new.id, new.email, 'sub')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-stamps stage_logs when a building is created or its stage changes,
-- and closes out the previous open log so duration can be computed.
create or replace function public.handle_building_stage_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.stage_logs (building_id, stage, entered_at)
    values (new.id, new.stage, now());
  elsif tg_op = 'UPDATE' and new.stage is distinct from old.stage then
    update public.stage_logs
      set exited_at = now()
      where building_id = new.id and exited_at is null;

    insert into public.stage_logs (building_id, stage, entered_at)
    values (new.id, new.stage, now());
  end if;

  new.updated_at = now();
  return new;
end;
$$;

-- Must run AFTER insert: the trigger body inserts a child stage_logs row
-- referencing the new building's id, which only satisfies stage_logs' FK
-- constraint once the buildings row itself has been written.
create trigger on_building_insert
  after insert on public.buildings
  for each row execute function public.handle_building_stage_change();

create trigger on_building_stage_update
  before update on public.buildings
  for each row execute function public.handle_building_stage_change();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.user_roles enable row level security;
alter table public.buildings enable row level security;
alter table public.stage_logs enable row level security;
alter table public.settings enable row level security;

-- user_roles: everyone can read their own row (to learn their role) and
-- admins can read/manage every row.
create policy "user_roles: read own row" on public.user_roles
  for select using (auth.uid() = user_id);

create policy "user_roles: admins read all" on public.user_roles
  for select using (public.is_admin(auth.uid()));

create policy "user_roles: admins manage" on public.user_roles
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- buildings: any authenticated user (admin or sub) can read every row —
-- per-field hiding for subs is enforced in the app using the settings table.
-- Only admins may write.
create policy "buildings: authenticated read" on public.buildings
  for select using (auth.uid() is not null);

create policy "buildings: admins insert" on public.buildings
  for insert with check (public.is_admin(auth.uid()));

create policy "buildings: admins update" on public.buildings
  for update using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "buildings: admins delete" on public.buildings
  for delete using (public.is_admin(auth.uid()));

-- stage_logs: read-only from the app; rows are written exclusively by the
-- handle_building_stage_change trigger (security definer).
create policy "stage_logs: authenticated read" on public.stage_logs
  for select using (auth.uid() is not null);

-- settings: everyone reads (needed to know what to hide), only admins write.
create policy "settings: authenticated read" on public.settings
  for select using (auth.uid() is not null);

create policy "settings: admins manage" on public.settings
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ============================================================================
-- Realtime
-- ============================================================================
alter publication supabase_realtime add table public.buildings;
alter publication supabase_realtime add table public.stage_logs;

-- ============================================================================
-- Seed the first admin
-- ============================================================================
-- After you sign in once via Google, run this (replace the email if needed)
-- to promote your own account to admin:
--
--   update public.user_roles set role = 'admin' where email = 'hershylowy1@gmail.com';
