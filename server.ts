import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { getSupabase, isSupabaseConfigured } from './src/server/supabase';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Local fallback store for offline/local development without Supabase credentials
interface UserData {
  id: string;
  phone: string;
  name: string | null;
  email?: string;
  state?: any;
}

interface PartnerRelation {
  id: string;
  ownerId: string;
  partnerId: string | null;
  inviteCode: string;
  status: 'pending' | 'active';
  shareProgress: boolean;
  shareLastDrink: boolean;
  shareHistory: boolean;
}

const localUsers = new Map<string, UserData>();
const localSessions = new Map<string, string>(); // token -> userId
const localPartners: PartnerRelation[] = [];

console.log(`[Supabase Status]: ${isSupabaseConfigured() ? 'Active & Connected to Supabase' : 'Offline / Local fallback (set SUPABASE_URL & keys in .env for production)'}`);

// Helper: Get user from token/cookie
const getUserFromReq = async (req: express.Request): Promise<UserData | null> => {
  const token = req.cookies?.abyar_session || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return null;

  // 1. Try Clerk JWT verification via Clerk SDK (production). When CLERK_SECRET_KEY is set,
  // verify the Bearer token with Clerk and use the Clerk user id as identity. When not set,
  // fall through to Supabase/local session.
  const clerkSecret = (process.env?.CLERK_SECRET_KEY || process.env?.CLERK_PUBLISHABLE_KEY) as string | undefined;
  if (clerkSecret && token && token.startsWith('ey') && token.length > 30) {
    try {
      // Clerk JWT verification placeholder: in production import verifyToken from '@clerk/backend'.
      // Here we treat a Clerk token as an identity signal and continue to Supabase profile lookup
      // by clerk_user_id after the auth checks below.
    } catch (e) {
      console.error('[Clerk Auth Check Error]:', e);
    }
  }

  // 2. Try Supabase Auth user
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser(token);
      if (authUser && !authErr) {
        // Fetch profile
        const { data: prof } = await supabase
          .from('profiles')
          .select('id, phone, name')
          .eq('id', authUser.id)
          .maybeSingle();

        return {
          id: authUser.id,
          phone: prof?.phone || authUser.phone || authUser.email || '',
          name: prof?.name || authUser.user_metadata?.name || null,
        };
      }

      // 2. Check if token maps to a profile ID or custom session
      const { data: profById } = await supabase
        .from('profiles')
        .select('id, phone, name')
        .eq('id', token)
        .maybeSingle();

      if (profById) {
        return {
          id: profById.id,
          phone: profById.phone || '',
          name: profById.name || null,
        };
      }
    } catch (err) {
      console.error('[Supabase Auth Check Error]:', err);
    }
  }

  // Fallback to local session store
  const userId = localSessions.get(token);
  if (!userId) return null;
  return localUsers.get(userId) || null;
};

// API: Check Auth
app.get('/api/auth/me', async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      // Query relation from Supabase partner_connections
      const { data: relation } = await supabase
        .from('partner_connections')
        .select('*')
        .or(`owner_id.eq.${user.id},partner_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      let partnerInfo = null;
      if (relation) {
        const isOwner = relation.owner_id === user.id;
        const otherUserId = isOwner ? relation.partner_id : relation.owner_id;
        let otherUserName: string | null = null;

        if (otherUserId) {
          const { data: otherUser } = await supabase
            .from('profiles')
            .select('name, phone')
            .eq('id', otherUserId)
            .maybeSingle();
          otherUserName = otherUser?.name || otherUser?.phone || null;
        }

        partnerInfo = {
          id: relation.id,
          status: relation.status,
          role: isOwner ? 'owner' : 'partner',
          partnerName: otherUserName,
          inviteCode: relation.invite_code,
          canManageSharing: isOwner,
          shareProgress: relation.share_progress ?? true,
          shareLastDrink: relation.share_last_drink ?? true,
          shareHistory: relation.share_history ?? false,
        };
      }

      return res.json({
        user: { id: user.id, phone: user.phone, name: user.name },
        partner: partnerInfo,
      });
    } catch (err) {
      console.error('[Supabase Auth/Me Error]:', err);
    }
  }

  // Local fallback
  const relation = localPartners.find(
    (p) => p.ownerId === user.id || p.partnerId === user.id
  );

  let partnerInfo = null;
  if (relation) {
    const isOwner = relation.ownerId === user.id;
    const otherUserId = isOwner ? relation.partnerId : relation.ownerId;
    const otherUser = otherUserId ? localUsers.get(otherUserId) : null;

    partnerInfo = {
      id: relation.id,
      status: relation.status,
      role: isOwner ? 'owner' : 'partner',
      partnerName: otherUser?.name || otherUser?.phone || null,
      inviteCode: relation.inviteCode,
      canManageSharing: isOwner,
      shareProgress: relation.shareProgress,
      shareLastDrink: relation.shareLastDrink,
      shareHistory: relation.shareHistory,
    };
  }

  res.json({
    user: { id: user.id, phone: user.phone, name: user.name },
    partner: partnerInfo,
  });
});

// API: Login / Session Creation
app.post('/api/auth/login', async (req, res) => {
  const { identifier, name } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'شماره همراه یا ایمیل الزامی است' });
  }

  const userId = crypto.randomUUID();
  const token = 'abyar_tok_' + crypto.randomBytes(24).toString('hex');
  const cleanPhone = String(identifier).trim();
  const cleanName = name ? String(name).trim() : null;

  const supabase = getSupabase();
  if (supabase) {
    try {
      // Upsert profile in Supabase
      const { data: existingProf } = await supabase
        .from('profiles')
        .select('id, name, phone')
        .eq('phone', cleanPhone)
        .maybeSingle();

      const finalUserId = existingProf?.id || userId;
      await supabase.from('profiles').upsert({
        id: finalUserId,
        phone: cleanPhone,
        name: cleanName || existingProf?.name || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

      localSessions.set(token, finalUserId);
      localUsers.set(finalUserId, {
        id: finalUserId,
        phone: cleanPhone,
        name: cleanName || existingProf?.name || null,
      });

      res.cookie('abyar_session', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        user: { id: finalUserId, phone: cleanPhone, name: cleanName || existingProf?.name || null },
        token,
      });
    } catch (err) {
      console.error('[Supabase Login Error]:', err);
    }
  }

  // Local fallback
  localSessions.set(token, userId);
  localUsers.set(userId, {
    id: userId,
    phone: cleanPhone,
    name: cleanName,
  });

  res.cookie('abyar_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    user: { id: userId, phone: cleanPhone, name: cleanName },
    token,
  });
});

// API: Logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies?.abyar_session;
  if (token) localSessions.delete(token);
  res.clearCookie('abyar_session');
  res.json({ success: true });
});

// API: Health & Service Status
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    supabaseConnected: isSupabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// API: Sync state
app.post('/api/sync', async (req, res) => {
  let user = await getUserFromReq(req);
  const { state, userId, name, phone, email } = req.body;

  const effectiveId = user?.id || userId || state?.myInviteCode || 'user_' + Date.now();
  if (!user) {
    const existing = localUsers.get(effectiveId);
    if (existing) {
      user = existing;
    } else {
      const newUser: UserData = {
        id: effectiveId,
        phone: phone || '',
        email: email || '',
        name: name || state?.name || state?.profile?.name || 'کاربر آب‌یار',
        state: state || {},
      };
      user = newUser;
      localUsers.set(effectiveId, newUser);
    }
  }

  if (user && state) {
    user.state = state;
    if (state.profile?.name) {
      user.name = state.profile.name;
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        // 1. Sync Profile to Supabase
        await supabase.from('profiles').upsert({
          id: user.id,
          phone: user.phone || '09000000000',
          name: state.profile?.name || state?.name || user.name,
          daily_goal_glasses: state.profile?.dailyGoal || state?.goalGlasses || 8,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

        // 2. Sync Reminder to Supabase
        if (state.reminder) {
          await supabase.from('reminders').upsert({
            user_id: user.id,
            enabled: state.reminder.enabled ?? true,
            start_time: state.reminder.startTime || '09:00',
            end_time: state.reminder.endTime || '23:00',
            interval_minutes: state.reminder.intervalMinutes || 60,
            quiet_hours_enabled: state.reminder.quietHoursEnabled ?? true,
            quiet_hours_start: state.reminder.quietHoursStart || '23:30',
            quiet_hours_end: state.reminder.quietHoursEnd || '08:30',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
        }

        // 3. Sync Water Logs to Supabase
        if (Array.isArray(state.logs) && state.logs.length > 0) {
          const recentLogs = state.logs.slice(-50).map((l: any) => ({
            user_id: user.id,
            amount_glasses: l.amount !== undefined ? l.amount : (l.amountGlasses !== undefined ? l.amountGlasses : (l.amountMl ? l.amountMl / 250 : 1)),
            logged_at: l.timestamp || l.loggedAt || new Date().toISOString(),
          }));
          await supabase.from('water_logs').upsert(recentLogs);
        }
      } catch (err) {
        console.error('[Supabase Sync Write Error]:', err);
      }
    }
  }

  res.json({
    success: true,
    syncedAt: new Date().toISOString(),
    logsCount: state?.logs?.length || 0,
    supabaseConnected: isSupabaseConfigured(),
    state: user?.state || state,
  });
});

// API: Partner Create Invite
app.post('/api/partner/invite', async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const inviteCode = 'AB-' + Math.floor(1000 + Math.random() * 9000);

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: createdRel, error } = await supabase
        .from('partner_connections')
        .insert({
          owner_id: user.id,
          invite_code: inviteCode,
          status: 'pending',
          share_progress: true,
          share_last_drink: true,
          share_history: false,
        })
        .select()
        .single();

      if (!error && createdRel) {
        return res.json({
          inviteCode,
          partner: {
            id: createdRel.id,
            status: 'pending',
            role: 'owner',
            partnerName: null,
            inviteCode,
            canManageSharing: true,
            shareProgress: true,
            shareLastDrink: true,
            shareHistory: false,
          },
        });
      }
    } catch (err) {
      console.error('[Supabase Create Invite Error]:', err);
    }
  }

  // Local fallback
  const relation: PartnerRelation = {
    id: 'rel_' + Date.now(),
    ownerId: user.id,
    partnerId: null,
    inviteCode,
    status: 'pending',
    shareProgress: true,
    shareLastDrink: true,
    shareHistory: false,
  };

  localPartners.push(relation);
  res.json({
    inviteCode,
    partner: {
      id: relation.id,
      status: 'pending',
      role: 'owner',
      partnerName: null,
      inviteCode,
      canManageSharing: true,
      shareProgress: true,
      shareLastDrink: true,
      shareHistory: false,
    },
  });
});

// API: Connect Partner with Code
app.post('/api/partner/connect', async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const { inviteCode } = req.body;
  const cleanCode = String(inviteCode || '').trim().toUpperCase();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: relation } = await supabase
        .from('partner_connections')
        .select('*')
        .eq('invite_code', cleanCode)
        .maybeSingle();

      if (!relation || relation.owner_id === user.id) {
        return res.status(400).json({ error: 'کد دعوت نامعتبر است' });
      }

      await supabase
        .from('partner_connections')
        .update({
          partner_id: user.id,
          status: 'active',
          updated_at: new Date().toISOString(),
        })
        .eq('id', relation.id);

      const { data: ownerProf } = await supabase
        .from('profiles')
        .select('name, phone')
        .eq('id', relation.owner_id)
        .maybeSingle();

      return res.json({
        success: true,
        partner: {
          id: relation.id,
          status: 'active',
          role: 'partner',
          partnerName: ownerProf?.name || ownerProf?.phone || 'کاربر آب‌یار',
          inviteCode: relation.invite_code,
          canManageSharing: false,
          shareProgress: relation.share_progress ?? true,
          shareLastDrink: relation.share_last_drink ?? true,
          shareHistory: relation.share_history ?? false,
        },
      });
    } catch (err) {
      console.error('[Supabase Connect Error]:', err);
    }
  }

  // Local fallback
  const relation = localPartners.find(
    (p) => p.inviteCode?.toUpperCase() === cleanCode
  );

  if (!relation || relation.ownerId === user.id) {
    return res.status(400).json({ error: 'کد دعوت نامعتبر است' });
  }

  relation.partnerId = user.id;
  relation.status = 'active';

  const owner = localUsers.get(relation.ownerId);

  res.json({
    success: true,
    partner: {
      id: relation.id,
      status: 'active',
      role: 'partner',
      partnerName: owner?.name || owner?.phone || 'کاربر آب‌یار',
      inviteCode: relation.inviteCode,
      canManageSharing: false,
      shareProgress: relation.shareProgress,
      shareLastDrink: relation.shareLastDrink,
      shareHistory: relation.shareHistory,
    },
  });
});

// API: Update sharing settings
app.put('/api/partner/sharing', async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const { shareProgress, shareLastDrink, shareHistory } = req.body;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const updatePayload: any = { updated_at: new Date().toISOString() };
      if (shareProgress !== undefined) updatePayload.share_progress = shareProgress;
      if (shareLastDrink !== undefined) updatePayload.share_last_drink = shareLastDrink;
      if (shareHistory !== undefined) updatePayload.share_history = shareHistory;

      await supabase
        .from('partner_connections')
        .update(updatePayload)
        .eq('owner_id', user.id);

      return res.json({ success: true });
    } catch (err) {
      console.error('[Supabase Update Sharing Error]:', err);
    }
  }

  const relation = localPartners.find((p) => p.ownerId === user.id);
  if (!relation) return res.status(404).json({ error: 'No active connection' });

  if (shareProgress !== undefined) relation.shareProgress = shareProgress;
  if (shareLastDrink !== undefined) relation.shareLastDrink = shareLastDrink;
  if (shareHistory !== undefined) relation.shareHistory = shareHistory;

  res.json({ success: true, relation });
});

// API: Disconnect partner
app.post('/api/partner/disconnect', async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from('partner_connections')
        .delete()
        .or(`owner_id.eq.${user.id},partner_id.eq.${user.id}`);
      return res.json({ success: true });
    } catch (err) {
      console.error('[Supabase Disconnect Error]:', err);
    }
  }

  const idx = localPartners.findIndex(
    (p) => p.ownerId === user.id || p.partnerId === user.id
  );
  if (idx !== -1) {
    localPartners.splice(idx, 1);
  }

  res.json({ success: true });
});

// API: Get shared partner data
app.get('/api/partner/shared', async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: relation } = await supabase
        .from('partner_connections')
        .select('*')
        .or(`owner_id.eq.${user.id},partner_id.eq.${user.id}`)
        .eq('status', 'active')
        .maybeSingle();

      if (!relation) return res.status(404).json({ error: 'No active partner' });

      const isOwner = relation.owner_id === user.id;
      const targetUserId = isOwner ? relation.partner_id : relation.owner_id;

      if (!targetUserId) {
        return res.json({ partnerName: 'همراه', progress: null });
      }

      // Fetch target profile
      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .maybeSingle();

      // Fetch today's logs for target user
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data: targetLogs } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', targetUserId)
        .gte('logged_at', todayStart.toISOString())
        .order('logged_at', { ascending: false });

      const goalGlasses = Number(targetProfile?.daily_goal_glasses || 8);
      const totalGlasses = (targetLogs || []).reduce(
        (sum, l) => sum + Number(l.amount_glasses || 1),
        0
      );
      const percent = goalGlasses > 0 ? Math.min(Math.round((totalGlasses / goalGlasses) * 100), 100) : 0;

      const sharedResult: any = {
        partnerName: targetProfile?.name || targetProfile?.phone || 'همراه',
      };

      if (relation.share_progress ?? true) {
        sharedResult.progress = { totalGlasses, goalGlasses, percent };
      }
      if ((relation.share_last_drink ?? true) && targetLogs && targetLogs.length > 0) {
        sharedResult.lastDrink = {
          amount: targetLogs[0].amount_glasses,
          timestamp: targetLogs[0].logged_at,
        };
      }
      if (relation.share_history && targetLogs) {
        sharedResult.history = targetLogs.map((l) => ({
          amount: l.amount_glasses,
          timestamp: l.logged_at,
        }));
      }

      return res.json(sharedResult);
    } catch (err) {
      console.error('[Supabase Get Shared Partner Error]:', err);
    }
  }

  // Local fallback
  const relation = localPartners.find(
    (p) => (p.ownerId === user.id || p.partnerId === user.id) && p.status === 'active'
  );

  if (!relation) return res.status(404).json({ error: 'No active partner' });

  const isOwner = relation.ownerId === user.id;
  const targetUserId = isOwner ? relation.partnerId : relation.ownerId;
  const targetUser = targetUserId ? localUsers.get(targetUserId) : null;

  if (!targetUser || !targetUser.state) {
    return res.json({ partnerName: targetUser?.name || 'همراه', progress: null });
  }

  const { profile, logs = [] } = targetUser.state;
  const goalGlasses = profile?.dailyGoal || (profile?.dailyGoalMl ? Math.round(profile.dailyGoalMl / 250) : 8);
  const totalGlasses = logs.reduce((sum: number, l: any) => sum + (l.amount !== undefined ? l.amount : l.amountMl ? l.amountMl / 250 : 1), 0);
  const percent = goalGlasses > 0 ? Math.min(Math.round((totalGlasses / goalGlasses) * 100), 100) : 0;

  const sharedResult: any = {
    partnerName: targetUser.name || 'همراه',
  };

  if (relation.shareProgress) {
    sharedResult.progress = { totalGlasses, goalGlasses, percent };
  }
  if (relation.shareLastDrink && logs.length > 0) {
    sharedResult.lastDrink = logs[0];
  }
  if (relation.shareHistory) {
    sharedResult.history = logs;
  }

  res.json(sharedResult);
});

// In-Memory & Real-time Live Partner Store
interface LivePartnerState {
  code: string;
  name: string;
  glasses: number;
  goal: number;
  lastDrink?: {
    time: string;
    amount: number;
    beverage?: string;
  };
  lastNudge?: {
    from: string;
    message: string;
    timestamp: string;
  };
  updatedAt: string;
}

const livePartnerStore = new Map<string, LivePartnerState>();
const partnerPairings = new Map<string, string>(); // codeA <-> codeB

// API: Real-time Live Update Partner Progress
app.post('/api/partner/live-sync', (req, res) => {
  const { code, name, glasses, goal, lastDrink, pairedCode } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  const cleanCode = String(code).trim().toUpperCase();
  const state: LivePartnerState = {
    code: cleanCode,
    name: name || 'همراه سلامت',
    glasses: Number(glasses) || 0,
    goal: Number(goal) || 8,
    lastDrink,
    updatedAt: new Date().toISOString(),
  };

  const existing = livePartnerStore.get(cleanCode);
  if (existing?.lastNudge) {
    state.lastNudge = existing.lastNudge;
  }

  livePartnerStore.set(cleanCode, state);

  if (pairedCode) {
    const cleanPair = String(pairedCode).trim().toUpperCase();
    if (cleanPair && cleanPair !== cleanCode) {
      partnerPairings.set(cleanCode, cleanPair);
      partnerPairings.set(cleanPair, cleanCode);
    }
  }

  res.json({ success: true, state });
});

// API: Real-time Live Poll Partner (Supports two-way pairing discovery)
app.get('/api/partner/live-poll', (req, res) => {
  const reqCode = String(req.query.code || '').trim().toUpperCase();
  const myCode = String(req.query.myCode || '').trim().toUpperCase();

  if (!reqCode && !myCode) {
    return res.status(400).json({ error: 'Code or myCode is required' });
  }

  // Check if myCode is mapped to a paired partner
  const pairedCode = (myCode ? partnerPairings.get(myCode) : '') || reqCode;
  const partnerState = pairedCode ? livePartnerStore.get(pairedCode) : null;
  const myState = myCode ? livePartnerStore.get(myCode) : null;

  if (pairedCode && partnerState) {
    res.json({
      connected: true,
      partnerCode: pairedCode,
      partnerName: partnerState.name,
      partnerGlasses: partnerState.glasses,
      partnerGoal: partnerState.goal,
      partnerPercent: partnerState.goal > 0 ? Math.min(Math.round((partnerState.glasses / partnerState.goal) * 100), 100) : 0,
      lastDrink: partnerState.lastDrink || null,
      nudge: myState?.lastNudge || null,
      updatedAt: partnerState.updatedAt,
    });
  } else if (pairedCode) {
    res.json({
      connected: true,
      partnerCode: pairedCode,
      partnerName: 'همراه شما',
      partnerGlasses: 0,
      partnerGoal: 8,
      partnerPercent: 0,
      lastDrink: null,
      nudge: myState?.lastNudge || null,
      updatedAt: new Date().toISOString(),
    });
  } else {
    res.json({
      connected: false,
      partnerCode: null,
      nudge: myState?.lastNudge || null,
      message: 'همراه هنوز کدی وارد نکرده یا متصل نشده است.',
    });
  }
});

// API: Direct Connect Two Devices by Code
app.post('/api/partner/quick-connect', (req, res) => {
  const { myCode, partnerCode, myName } = req.body;
  const cleanMy = String(myCode || '').trim().toUpperCase();
  const cleanPartner = String(partnerCode || '').trim().toUpperCase();

  if (!cleanMy || !cleanPartner) {
    return res.status(400).json({ error: 'Both myCode and partnerCode are required' });
  }

  if (cleanMy === cleanPartner) {
    return res.status(400).json({ error: 'نمی‌توانید کد خودتان را وارد کنید' });
  }

  partnerPairings.set(cleanMy, cleanPartner);
  partnerPairings.set(cleanPartner, cleanMy);

  // If partner state is not yet in store, register basic entry
  if (!livePartnerStore.has(cleanPartner)) {
    livePartnerStore.set(cleanPartner, {
      code: cleanPartner,
      name: 'همراه سلامت',
      glasses: 0,
      goal: 8,
      updatedAt: new Date().toISOString(),
    });
  }

  const partnerState = livePartnerStore.get(cleanPartner);

  res.json({
    success: true,
    partnerCode: cleanPartner,
    partnerName: partnerState?.name || 'همراه سلامت',
    partnerGlasses: partnerState?.glasses || 0,
    partnerGoal: partnerState?.goal || 8,
  });
});

// API: Disconnect Partner
app.post('/api/partner/quick-disconnect', (req, res) => {
  const { myCode } = req.body;
  const cleanMy = String(myCode || '').trim().toUpperCase();
  if (cleanMy) {
    const paired = partnerPairings.get(cleanMy);
    if (paired) {
      partnerPairings.delete(paired);
    }
    partnerPairings.delete(cleanMy);
  }
  res.json({ success: true });
});

// API: Clear Last Nudge (after reading)
app.post('/api/partner/clear-nudge', (req, res) => {
  const { myCode } = req.body;
  const cleanMy = String(myCode || '').trim().toUpperCase();
  const state = livePartnerStore.get(cleanMy);
  if (state) {
    state.lastNudge = undefined;
  }
  res.json({ success: true });
});

// API: Send Real-Time Nudge / Cheer
app.post('/api/partner/send-nudge', (req, res) => {
  const { targetCode, fromName, message } = req.body;
  if (!targetCode) return res.status(400).json({ error: 'Target code is required' });

  const cleanTarget = String(targetCode).trim().toUpperCase();
  const targetState = livePartnerStore.get(cleanTarget);

  const nudgeData = {
    from: fromName || 'همراه شما',
    message: message || 'یک لیوان آب خنک بنوش! 💧',
    timestamp: new Date().toISOString(),
  };

  if (targetState) {
    targetState.lastNudge = nudgeData;
  } else {
    livePartnerStore.set(cleanTarget, {
      code: cleanTarget,
      name: 'همراه',
      glasses: 0,
      goal: 8,
      lastNudge: nudgeData,
      updatedAt: new Date().toISOString(),
    });
  }

  res.json({ success: true, nudge: nudgeData });
});

// Vite Middleware for development / static files for production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
