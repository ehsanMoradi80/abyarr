-- آب‌یار: cloud persistence schema
-- Run with Supabase migrations. The Android app remains local-first; these
-- tables are only used for optional backup, sync, and explicit sharing.

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references public.app_users(id) on delete cascade,
  phone text unique,
  name text,
  daily_goal_ml integer not null default 2000 check (daily_goal_ml between 100 and 10000),
  timezone text not null default 'Asia/Tehran',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.water_logs (
  id text primary key,
  user_id uuid not null references public.app_users(id) on delete cascade,
  amount_ml integer not null check (amount_ml between 10 and 2000),
  logged_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists water_logs_user_logged_at_idx
  on public.water_logs(user_id, logged_at);

create table if not exists public.reminder_settings (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  enabled boolean not null default true,
  start_time time not null default '09:00',
  end_time time not null default '23:00',
  interval_minutes integer not null default 90 check (interval_minutes between 15 and 360),
  quiet_hours_enabled boolean not null default false,
  quiet_hours_start time,
  quiet_hours_end time
);

create table if not exists public.relationships (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.app_users(id) on delete cascade,
  partner_id uuid not null references public.app_users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'active', 'revoked')),
  created_at timestamptz not null default now(),
  constraint relationships_distinct_users check (owner_id <> partner_id)
);

create unique index if not exists relationships_pair_idx
  on public.relationships(least(owner_id, partner_id), greatest(owner_id, partner_id));

create table if not exists public.sharing_settings (
  relationship_id uuid primary key references public.relationships(id) on delete cascade,
  share_daily_progress boolean not null default false,
  share_last_drink boolean not null default false,
  share_history boolean not null default false
);

alter table public.profiles enable row level security;
alter table public.app_users enable row level security;
alter table public.water_logs enable row level security;
alter table public.reminder_settings enable row level security;
alter table public.relationships enable row level security;
alter table public.sharing_settings enable row level security;

create policy "profiles own row"
  on public.profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "water logs own rows"
  on public.water_logs for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "reminders own row"
  on public.reminder_settings for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "relationship participants can view"
  on public.relationships for select
  using (owner_id = auth.uid() or partner_id = auth.uid());

create policy "relationship owner can create"
  on public.relationships for insert
  with check (owner_id = auth.uid());

create policy "relationship participants can update"
  on public.relationships for update
  using (owner_id = auth.uid() or partner_id = auth.uid())
  with check (owner_id = auth.uid() or partner_id = auth.uid());

create policy "sharing follows relationship"
  on public.sharing_settings for all
  using (
    exists (
      select 1 from public.relationships r
      where r.id = relationship_id
        and (r.owner_id = auth.uid() or r.partner_id = auth.uid())
        and r.status = 'active'
    )
  )
  with check (
    exists (
      select 1 from public.relationships r
      where r.id = relationship_id
        and r.owner_id = auth.uid()
        and r.status = 'active'
    )
  );

-- Partner data is intentionally exposed through security-definer RPCs only
-- after a relationship and sharing flag are checked. Do not grant the client
-- broad access to another user's water_logs.