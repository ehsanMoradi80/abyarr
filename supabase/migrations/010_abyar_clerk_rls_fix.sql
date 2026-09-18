-- Migration: Fix unsafe RLS policies and enforce Clerk-aware, user-scoped access
-- Replaces 009's anonymous unrestricted grants

-- Partners: only allow access to rows where the user is the owner or partner
create policy "partners_own_access"
  on public.partners for all
  using (owner_id = auth.jwt()->>'sub' or partner_id = auth.jwt()->>'sub')
  with check (owner_id = auth.jwt()->>'sub');

-- Profiles: users can only read/update their own profile row (scoped by clerk_user_id or id)
create policy "profiles_own_access"
  on public.profiles for all
  using (clerk_user_id = auth.jwt()->>'sub' or id::text = auth.jwt()->>'sub')
  with check (clerk_user_id = auth.jwt()->>'sub' or id::text = auth.jwt()->>'sub');

-- Water logs: users only see/update their own logs
create policy "water_logs_own_access"
  on public.water_logs for all
  using (clerk_user_id = auth.jwt()->>'sub' or user_id::text = auth.jwt()->>'sub')
  with check (clerk_user_id = auth.jwt()->>'sub' or user_id::text = auth.jwt()->>'sub');

-- Notification queue: only the recipient's token access (restricted via server function, not direct select)
-- Do not grant anon select on notification_queue; server-side edge functions process it.
revoke all on public.notification_queue from anon;

-- Revoke anonymous grants that were incorrectly added in migration 009
revoke all on public.partners from anon;
revoke all on public.notification_queue from anon;
revoke execute on function public.notify_partner_drink from anon;

-- Note: For Clerk JWT integration, set auth.jwt() claims mapping in Supabase Auth settings
-- or pass clerk_user_id as an app-level header when using anon keys with RLS bypass.
