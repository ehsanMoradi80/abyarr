-- ====================================================================
-- Supabase Schema for Abyar (آب‌یار) Water Tracker
-- ====================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT,
    daily_goal_glasses NUMERIC DEFAULT 8,
    theme_mode TEXT DEFAULT 'light',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Water Logs Table (ثبت‌های نوشیدن آب بر مبنای لیوان)
CREATE TABLE IF NOT EXISTS public.water_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount_glasses NUMERIC NOT NULL DEFAULT 1,
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Reminders Settings Table
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    enabled BOOLEAN DEFAULT TRUE,
    start_time TEXT DEFAULT '09:00',
    end_time TEXT DEFAULT '23:00',
    interval_minutes INTEGER DEFAULT 90,
    quiet_hours_enabled BOOLEAN DEFAULT TRUE,
    quiet_hours_start TEXT DEFAULT '23:30',
    quiet_hours_end TEXT DEFAULT '08:30',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Partner Connections Table (ارتباط با همراه)
CREATE TABLE IF NOT EXISTS public.partner_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    invite_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active')),
    share_progress BOOLEAN DEFAULT TRUE,
    share_last_drink BOOLEAN DEFAULT TRUE,
    share_history BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_water_logs_user_logged ON public.water_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_partner_owner ON public.partner_connections(owner_id);
CREATE INDEX IF NOT EXISTS idx_partner_code ON public.partner_connections(invite_code);
