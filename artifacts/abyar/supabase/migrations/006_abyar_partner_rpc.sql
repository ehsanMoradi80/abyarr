-- Companion invitations and sharing controls. Pending invitations have no
-- partner_id; active relationships always have both participants.

alter table public.relationships alter column partner_id drop not null;
alter table public.relationships add column if not exists invite_code text;
alter table public.relationships add column if not exists invite_expires_at timestamptz;
create unique index if not exists relationships_invite_code_idx
  on public.relationships(invite_code) where invite_code is not null;

create or replace function public.app_get_partner(p_token_hash text)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid;
  v_relationship public.relationships%rowtype;
  v_partner_id uuid;
  v_partner_name text;
  v_role text;
  v_settings public.sharing_settings%rowtype;
begin
  v_user_id := private.abyar_session_user(p_token_hash);
  if v_user_id is null then
    raise exception 'invalid session' using errcode = '42501';
  end if;

  select r.* into v_relationship
  from public.relationships r
  where r.status in ('pending', 'active')
    and (r.owner_id = v_user_id or r.partner_id = v_user_id)
  order by case when r.status = 'active' then 0 else 1 end, r.created_at desc
  limit 1;

  if v_relationship.id is null then return null; end if;
  v_role := case when v_relationship.owner_id = v_user_id then 'owner' else 'partner' end;
  v_partner_id := case when v_role = 'owner' then v_relationship.partner_id else v_relationship.owner_id end;

  if v_partner_id is not null then
    select u.name into v_partner_name from public.app_users u where u.id = v_partner_id;
  end if;
  select s.* into v_settings from public.sharing_settings s where s.relationship_id = v_relationship.id;

  return jsonb_build_object(
    'id', v_relationship.id,
    'status', v_relationship.status,
    'role', v_role,
    'partnerName', v_partner_name,
    'inviteCode', case when v_role = 'owner' and v_relationship.status = 'pending' then v_relationship.invite_code else null end,
    'canManageSharing', v_role = 'owner' and v_relationship.status = 'active',
    'shareProgress', coalesce(v_settings.share_daily_progress, false),
    'shareLastDrink', coalesce(v_settings.share_last_drink, false),
    'shareHistory', coalesce(v_settings.share_history, false)
  );
end
$$;

create or replace function public.app_create_partner_invite(
  p_token_hash text,
  p_invite_code text,
  p_expires_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid;
  v_existing public.relationships%rowtype;
begin
  v_user_id := private.abyar_session_user(p_token_hash);
  if v_user_id is null then raise exception 'invalid session' using errcode = '42501'; end if;

  select r.* into v_existing from public.relationships r
  where r.owner_id = v_user_id and r.status = 'active' limit 1;
  if v_existing.id is not null then return public.app_get_partner(p_token_hash); end if;

  select r.* into v_existing from public.relationships r
  where r.owner_id = v_user_id and r.status = 'pending' limit 1;
  if v_existing.id is not null then
    update public.relationships
    set invite_code = upper(trim(p_invite_code)), invite_expires_at = p_expires_at
    where id = v_existing.id;
  else
    insert into public.relationships (owner_id, status, invite_code, invite_expires_at)
    values (v_user_id, 'pending', upper(trim(p_invite_code)), p_expires_at);
  end if;
  return public.app_get_partner(p_token_hash);
end
$$;

create or replace function public.app_connect_partner(p_token_hash text, p_invite_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid;
  v_relationship_id uuid;
  v_owner_id uuid;
begin
  v_user_id := private.abyar_session_user(p_token_hash);
  if v_user_id is null then raise exception 'invalid session' using errcode = '42501'; end if;

  select r.id, r.owner_id into v_relationship_id, v_owner_id
  from public.relationships r
  where r.invite_code = upper(trim(p_invite_code))
    and r.status = 'pending'
    and r.partner_id is null
    and r.invite_expires_at > now()
  for update limit 1;

  if v_relationship_id is null or v_owner_id = v_user_id then
    raise exception 'invalid invitation' using errcode = '22023';
  end if;

  update public.relationships
  set partner_id = v_user_id, status = 'active', invite_code = null, invite_expires_at = null
  where id = v_relationship_id;
  insert into public.sharing_settings (relationship_id)
  values (v_relationship_id)
  on conflict (relationship_id) do nothing;
  return public.app_get_partner(p_token_hash);
end
$$;

create or replace function public.app_update_partner_sharing(
  p_token_hash text,
  p_share_progress boolean,
  p_share_last_drink boolean,
  p_share_history boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user_id uuid;
  v_relationship_id uuid;
begin
  v_user_id := private.abyar_session_user(p_token_hash);
  if v_user_id is null then raise exception 'invalid session' using errcode = '42501'; end if;
  select r.id into v_relationship_id from public.relationships r
  where r.owner_id = v_user_id and r.status = 'active' limit 1;
  if v_relationship_id is null then return null; end if;

  insert into public.sharing_settings (relationship_id, share_daily_progress, share_last_drink, share_history)
  values (v_relationship_id, p_share_progress, p_share_last_drink, p_share_history)
  on conflict (relationship_id) do update set
    share_daily_progress = excluded.share_daily_progress,
    share_last_drink = excluded.share_last_drink,
    share_history = excluded.share_history;
  return public.app_get_partner(p_token_hash);
end
$$;

create or replace function public.app_revoke_partner(p_token_hash text)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
declare v_user_id uuid;
begin
  v_user_id := private.abyar_session_user(p_token_hash);
  if v_user_id is null then raise exception 'invalid session' using errcode = '42501'; end if;
  update public.relationships
  set status = 'revoked', invite_code = null, invite_expires_at = null
  where status in ('pending', 'active')
    and (owner_id = v_user_id or partner_id = v_user_id);
end
$$;

grant execute on function public.app_get_partner(text) to anon, authenticated;
grant execute on function public.app_create_partner_invite(text, text, timestamptz) to anon, authenticated;
grant execute on function public.app_connect_partner(text, text) to anon, authenticated;
grant execute on function public.app_update_partner_sharing(text, boolean, boolean, boolean) to anon, authenticated;
grant execute on function public.app_revoke_partner(text) to anon, authenticated;