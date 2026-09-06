-- Enable Supabase Realtime for partner watching
-- Partners can see live updates when the other person drinks water

-- Enable Realtime on water_logs table so partners see drink updates
alter publication supabase_realtime add table water_logs;

-- Enable Realtime on profiles table so partners see goal/name changes
alter publication supabase_realtime add table profiles;

-- Create a view for real-time partner status that can be subscribed to
create or replace view public.partner_realtime_status as
select
  r.id as relationship_id,
  r.owner_id,
  r.partner_id,
  r.status,
  u_owner.name as owner_name,
  u_partner.name as partner_name,
  p_owner.daily_goal_ml as owner_goal_ml,
  p_partner.daily_goal_ml as partner_goal_ml,
  coalesce(
    (select sum(w.amount_ml)
     from water_logs w
     where w.user_id = r.owner_id
       and w.deleted_at is null
       and w.logged_at >= current_date::timestamp at time zone coalesce(p_owner.timezone, 'Asia/Tehran')
    ), 0
  ) as owner_today_ml,
  coalesce(
    (select sum(w.amount_ml)
     from water_logs w
     where w.user_id = r.partner_id
       and w.deleted_at is null
       and w.logged_at >= current_date::timestamp at time zone coalesce(p_partner.timezone, 'Asia/Tehran')
    ), 0
  ) as partner_today_ml,
  (select w.logged_at
   from water_logs w
   where w.user_id = r.owner_id and w.deleted_at is null
   order by w.logged_at desc
   limit 1
  ) as owner_last_drink_at,
  (select w.logged_at
   from water_logs w
   where w.user_id = r.partner_id and w.deleted_at is null
   order by w.logged_at desc
   limit 1
  ) as partner_last_drink_at
from relationships r
left join app_users u_owner on u_owner.id = r.owner_id
left join app_users u_partner on u_partner.id = r.partner_id
left join profiles p_owner on p_owner.id = r.owner_id
left join profiles p_partner on p_partner.id = r.partner_id
where r.status = 'active';

-- Grant access to authenticated users
grant select on public.partner_realtime_status to authenticated;
