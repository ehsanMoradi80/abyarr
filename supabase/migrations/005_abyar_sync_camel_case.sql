-- Match the mobile API contract (amountMl/loggedAt) when decoding sync logs.

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

grant execute on function public.app_push_sync(text, jsonb) to anon, authenticated;