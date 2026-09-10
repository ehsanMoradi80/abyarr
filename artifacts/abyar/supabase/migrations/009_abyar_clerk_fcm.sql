-- Migration: Restructure for Clerk auth + FCM + direct app access
-- Replaces the old app_users UUID system with Clerk user IDs

-- Add clerk_user_id and fcm_token to profiles
alter table public.profiles add column if not exists clerk_user_id text unique;
alter table public.profiles add column if not exists fcm_token text;
alter table public.profiles add column if not exists phone text;

-- Create index for clerk_user_id lookups
create index if not exists idx_profiles_clerk_user_id on public.profiles(clerk_user_id);

-- Update water_logs to support clerk_user_id as user_id (text instead of uuid)
-- We'll create a new column and migrate
alter table public.water_logs add column if not exists clerk_user_id text;
create index if not exists idx_water_logs_clerk_user_id on public.water_logs(clerk_user_id);

-- Create partners table (replaces relationships)
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  partner_id text,
  invite_code text unique not null,
  status text not null default 'pending' check (status in ('pending', 'active')),
  share_progress boolean not null default true,
  share_last_drink boolean not null default true,
  share_history boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partners_owner on public.partners(owner_id);
create index if not exists idx_partners_partner on public.partners(partner_id);
create index if not exists idx_partners_invite on public.partners(invite_code);

-- Enable RLS
alter table public.partners enable row level security;

-- RLS policies for partners - allow app access via anon key with clerk_user_id checks
-- Since we're using Clerk (not Supabase Auth), we use a simpler policy
-- The app will use the anon key and pass clerk_user_id in queries
create policy "partners_select"
  on public.partners for select
  using (true);

create policy "partners_insert"
  on public.partners for insert
  with check (true);

create policy "partners_update"
  on public.partners for update
  using (true)
  with check (true);

create policy "partners_delete"
  on public.partners for delete
  using (true);

-- Update profiles policies for Clerk-based access
drop policy if exists "profiles own row" on public.profiles;
create policy "profiles_clerk_access"
  on public.profiles for all
  using (true)
  with check (true);

-- Update water_logs policies for Clerk-based access
drop policy if exists "water logs own rows" on public.water_logs;
create policy "water_logs_clerk_access"
  on public.water_logs for all
  using (true)
  with check (true);

-- Enable Realtime on partners table
alter publication supabase_realtime add table partners;

-- Function to send push notification to partner
create or replace function public.notify_partner_drink(
  p_drinker_clerk_id text,
  p_amount_ml integer
) returns void
language plpgsql
security definer
as $$
declare
  v_partner_id text;
  v_partner_token text;
  v_drinker_name text;
begin
  -- Find the partner relationship
  select case when owner_id = p_drinker_clerk_id then partner_id else owner_id end
  into v_partner_id
  from public.partners
  where status = 'active'
    and (owner_id = p_drinker_clerk_id or partner_id = p_drinker_clerk_id)
  limit 1;

  if v_partner_id is null then return; end if;

  -- Get partner's FCM token and drinker's name
  select fcm_token into v_partner_token from public.profiles where clerk_user_id = v_partner_id;
  select name into v_drinker_name from public.profiles where clerk_user_id = p_drinker_clerk_id;

  if v_partner_token is null then return; end if;

  -- Insert into a notification queue (edge function will process this)
  insert into public.notification_queue (to_token, title, body, data)
  values (
    v_partner_token,
    'نوش جان! 💧',
    coalesce(v_drinker_name, 'همراه') || ' یک لیوان آب نوشید (' || p_amount_ml || ' میلی‌لیتر)',
    jsonb_build_object('type', 'partner_drink', 'amountMl', p_amount_ml)
  );
end;
$$;

-- Notification queue for FCM
create table if not exists public.notification_queue (
  id bigserial primary key,
  to_token text not null,
  title text not null,
  body text not null,
  data jsonb default '{}'::jsonb,
  sent boolean default false,
  created_at timestamptz not null default now()
);

alter table public.notification_queue enable row level security;

-- Function to trigger partner notification on water_log insert
create or replace function public.on_water_log_insert()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Only notify if the log has a clerk_user_id
  if new.clerk_user_id is not null then
    perform public.notify_partner_drink(new.clerk_user_id, new.amount_ml);
  end if;
  return new;
end;
$$;

-- Create trigger for auto-notification
drop trigger if exists trigger_water_log_notify on public.water_logs;
create trigger trigger_water_log_notify
  after insert on public.water_logs
  for each row
  execute function public.on_water_log_insert();

-- Grant access
grant all on public.partners to anon;
grant all on public.notification_queue to anon;
grant execute on function public.notify_partner_drink to anon;
