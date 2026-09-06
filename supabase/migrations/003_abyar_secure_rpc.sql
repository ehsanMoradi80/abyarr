-- Keep the public schema locked down. The API server uses these narrowly scoped
-- RPCs with a hash of its own signed session token.

alter table public.water_logs alter column id type text using id::text;

create schema if not exists private;

create or replace function private.abyar_session_user(p_token_hash text)
returns uuid
language sql
security definer
set search_path = public, private
as $$
  select user_id
  from public.auth_sessions
  where token_hash = p_token_hash
    and revoked_at is null
    and expires_at > now()
  limit 1
$$;

create or replace function public.app_bootstrap_user(p_id text, p_phone text)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  result jsonb;
begin
  insert into public.app_users (id, phone)
  values (p_id::uuid, p_phone)
  on conflict (phone) do update set updated_at = now();

  select jsonb_build_object('id', id, 'phone', phone, 'name', name)
  into result
  from public.app_users
  where phone = p_phone;
  return result;
end
$$;

create or replace function public.app_create_session(
  p_token_hash text,
  p_user_id text,
  p_expires_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
begin
  insert into public.auth_sessions (token_hash, user_id, expires_at)
  values (p_token_hash, p_user_id::uuid, p_expires_at)
  on conflict (token_hash) do update set
    user_id = excluded.user_id,
    expires_at = excluded.expires_at,
    revoked_at = null;
end
$$;

create or replace function public.app_get_current_user(p_token_hash text)
returns jsonb
language sql
security definer
set search_path = public, private
as $$
  select case when u.id is null then null else
    jsonb_build_object('id', u.id, 'phone', u.phone, 'name', u.name)
  end
  from public.app_users u
  where u.id = private.abyar_session_user(p_token_hash)
  limit 1
$$;

create or replace function public.app_revoke_session(p_token_hash text)
returns void
language sql
security definer
set search_path = public, private
as $$
  update public.auth_sessions
  set revoked_at = now()
  where token_hash = p_token_hash
$$;

create or replace function public.app_pull_sync(p_token_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid;
  result jsonb;
begin
  v_user_id := private.abyar_session_user(p_token_hash);
  if v_user_id is null then
    raise exception 'invalid session' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'profile', coalesce(
      (select jsonb_build_object('name', coalesce(p.name, ''), 'dailyGoalMl', p.daily_goal_ml)
       from public.profiles p where p.id = v_user_id),
      jsonb_build_object('name', '', 'dailyGoalMl', 2000)
    ),
    'reminder', coalesce(
      (select jsonb_build_object(
        'enabled', r.enabled,
        'startTime', to_char(r.start_time, 'HH24:MI'),
        'endTime', to_char(r.end_time, 'HH24:MI'),
        'intervalMinutes', r.interval_minutes,
        'quietHoursEnabled', r.quiet_hours_enabled,
        'quietHoursStart', coalesce(to_char(r.quiet_hours_start, 'HH24:MI'), '14:00'),
        'quietHoursEnd', coalesce(to_char(r.quiet_hours_end, 'HH24:MI'), '16:00')
      ) from public.reminder_settings r where r.user_id = v_user_id),
      jsonb_build_object(
        'enabled', true, 'startTime', '09:00', 'endTime', '23:00',
        'intervalMinutes', 90, 'quietHoursEnabled', false,
        'quietHoursStart', '14:00', 'quietHoursEnd', '16:00'
      )
    ),
    'logs', coalesce(
      (select jsonb_agg(jsonb_build_object('id', w.id, 'amountMl', w.amount_ml, 'loggedAt', w.logged_at) order by w.logged_at desc)
       from public.water_logs w where w.user_id = v_user_id and w.deleted_at is null),
      '[]'::jsonb
    )
  ) into result;
  return result;
end
$$;

create or replace function public.app_push_sync(p_token_hash text, p_state jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid;
  v_log record;
begin
  v_user_id := private.abyar_session_user(p_token_hash);
  if v_user_id is null then
    raise exception 'invalid session' using errcode = '42501';
  end if;

  insert into public.profiles (id, name, daily_goal_ml, timezone, updated_at)
  values (
    v_user_id,
    nullif(p_state #>> '{profile,name}', ''),
    coalesce((p_state #>> '{profile,dailyGoalMl}')::integer, 2000),
    'Asia/Tehran',
    now()
  )
  on conflict (id) do update set
    name = excluded.name,
    daily_goal_ml = excluded.daily_goal_ml,
    updated_at = now();

  insert into public.reminder_settings (
    user_id, enabled, start_time, end_time, interval_minutes,
    quiet_hours_enabled, quiet_hours_start, quiet_hours_end
  )
  values (
    v_user_id,
    coalesce((p_state #>> '{reminder,enabled}')::boolean, true),
    coalesce((p_state #>> '{reminder,startTime}')::time, '09:00'),
    coalesce((p_state #>> '{reminder,endTime}')::time, '23:00'),
    coalesce((p_state #>> '{reminder,intervalMinutes}')::integer, 90),
    coalesce((p_state #>> '{reminder,quietHoursEnabled}')::boolean, false),
    nullif(p_state #>> '{reminder,quietHoursStart}', '')::time,
    nullif(p_state #>> '{reminder,quietHoursEnd}', '')::time
  )
  on conflict (user_id) do update set
    enabled = excluded.enabled,
    start_time = excluded.start_time,
    end_time = excluded.end_time,
    interval_minutes = excluded.interval_minutes,
    quiet_hours_enabled = excluded.quiet_hours_enabled,
    quiet_hours_start = excluded.quiet_hours_start,
    quiet_hours_end = excluded.quiet_hours_end;

  for v_log in
    select * from jsonb_to_recordset(coalesce(p_state->'logs', '[]'::jsonb))
      as x(id text, "amountMl" integer, "loggedAt" timestamptz)
  loop
    if v_log.id is not null and v_log."amountMl" between 10 and 2000 and v_log."loggedAt" is not null then
      insert into public.water_logs (id, user_id, amount_ml, logged_at, updated_at)
      values (v_log.id, v_user_id, v_log."amountMl", v_log."loggedAt", now())
      on conflict (id) do update set
        amount_ml = excluded.amount_ml,
        logged_at = excluded.logged_at,
        updated_at = now(),
        deleted_at = null
      where public.water_logs.user_id = v_user_id;
    end if;
  end loop;

  return public.app_pull_sync(p_token_hash);
end
$$;

grant usage on schema private to anon, authenticated;
grant execute on function public.app_bootstrap_user(text, text) to anon, authenticated;
grant execute on function public.app_create_session(text, text, timestamptz) to anon, authenticated;
grant execute on function public.app_get_current_user(text) to anon, authenticated;
grant execute on function public.app_revoke_session(text) to anon, authenticated;
grant execute on function public.app_pull_sync(text) to anon, authenticated;
grant execute on function public.app_push_sync(text, jsonb) to anon, authenticated;