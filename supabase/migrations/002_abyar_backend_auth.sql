-- Transition existing installations from auth.users foreign keys to the
-- server-owned app_users identity used by the mobile OTP API.

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auth_sessions (
  token_hash text primary key,
  user_id uuid not null references public.app_users(id) on delete cascade,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists auth_sessions_user_idx
  on public.auth_sessions(user_id, expires_at);

alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles
  add constraint profiles_id_fkey foreign key (id) references public.app_users(id) on delete cascade;

alter table public.water_logs drop constraint if exists water_logs_user_id_fkey;
alter table public.water_logs
  add constraint water_logs_user_id_fkey foreign key (user_id) references public.app_users(id) on delete cascade;

alter table public.reminder_settings drop constraint if exists reminder_settings_user_id_fkey;
alter table public.reminder_settings
  add constraint reminder_settings_user_id_fkey foreign key (user_id) references public.app_users(id) on delete cascade;

alter table public.relationships drop constraint if exists relationships_owner_id_fkey;
alter table public.relationships drop constraint if exists relationships_partner_id_fkey;
alter table public.relationships
  add constraint relationships_owner_id_fkey foreign key (owner_id) references public.app_users(id) on delete cascade;
alter table public.relationships
  add constraint relationships_partner_id_fkey foreign key (partner_id) references public.app_users(id) on delete cascade;

alter table public.app_users enable row level security;
alter table public.auth_sessions enable row level security;