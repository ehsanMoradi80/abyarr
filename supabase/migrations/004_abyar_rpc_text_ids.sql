-- PostgREST can bind UUID parameters inconsistently through the connector
-- proxy. Accept text at the RPC boundary and cast inside trusted SQL.

drop function if exists public.app_bootstrap_user(uuid, text);
drop function if exists public.app_create_session(text, uuid, timestamptz);

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

grant execute on function public.app_bootstrap_user(text, text) to anon, authenticated;
grant execute on function public.app_create_session(text, text, timestamptz) to anon, authenticated;