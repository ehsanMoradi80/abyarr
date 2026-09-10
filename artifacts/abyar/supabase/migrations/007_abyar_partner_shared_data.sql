-- Return only the owner's explicitly shared data to the connected partner.
-- The caller must be the partner side of an active relationship.

create or replace function public.app_get_shared_partner(p_token_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid;
  v_relationship public.relationships%rowtype;
  v_profile public.profiles%rowtype;
  v_settings public.sharing_settings%rowtype;
  v_owner_name text;
  v_today_start timestamptz;
  v_total integer;
  v_last_drink jsonb;
  v_history jsonb;
begin
  v_user_id := private.abyar_session_user(p_token_hash);
  if v_user_id is null then
    raise exception 'invalid session' using errcode = '42501';
  end if;

  select r.* into v_relationship
  from public.relationships r
  where r.partner_id = v_user_id and r.status = 'active'
  order by r.created_at desc
  limit 1;
  if v_relationship.id is null then return null; end if;

  select p.* into v_profile from public.profiles p where p.id = v_relationship.owner_id;
  select s.* into v_settings from public.sharing_settings s where s.relationship_id = v_relationship.id;
  select coalesce(v_profile.name, u.name) into v_owner_name
  from public.app_users u where u.id = v_relationship.owner_id;

  v_today_start := current_date::timestamp at time zone coalesce(v_profile.timezone, 'Asia/Tehran');
  select coalesce(sum(w.amount_ml), 0)::integer into v_total
  from public.water_logs w
  where w.user_id = v_relationship.owner_id
    and w.deleted_at is null
    and w.logged_at >= v_today_start;

  select jsonb_build_object('id', w.id, 'amountMl', w.amount_ml, 'loggedAt', w.logged_at)
  into v_last_drink
  from public.water_logs w
  where w.user_id = v_relationship.owner_id and w.deleted_at is null
  order by w.logged_at desc
  limit 1;

  select coalesce(jsonb_agg(jsonb_build_object('id', w.id, 'amountMl', w.amount_ml, 'loggedAt', w.logged_at) order by w.logged_at desc), '[]'::jsonb)
  into v_history
  from public.water_logs w
  where w.user_id = v_relationship.owner_id and w.deleted_at is null;

  return jsonb_build_object(
    'partnerName', v_owner_name,
    'progress', case
      when coalesce(v_settings.share_daily_progress, false) then jsonb_build_object(
        'totalMl', v_total,
        'goalMl', coalesce(v_profile.daily_goal_ml, 2000),
        'percent', least(100, round(v_total * 100.0 / greatest(coalesce(v_profile.daily_goal_ml, 2000), 1)))
      )
      else null
    end,
    'lastDrink', case when coalesce(v_settings.share_last_drink, false) then v_last_drink else null end,
    'history', case when coalesce(v_settings.share_history, false) then v_history else '[]'::jsonb end
  );
end
$$;

grant execute on function public.app_get_shared_partner(text) to anon, authenticated;