import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getSupabase } from './src/server/supabase';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Mock In-memory store for cloud accounts and sync
interface UserData {
  id: string;
  phone: string;
  name: string | null;
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

const users = new Map<string, UserData>();
const sessions = new Map<string, string>(); // token -> userId
const partners: PartnerRelation[] = [];

// Helper: Get user from cookie
const getUserFromReq = (req: express.Request): UserData | null => {
  const token = req.cookies?.abyar_session;
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;
  return users.get(userId) || null;
};

// API: Check Auth
app.get('/api/auth/me', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const relation = partners.find(
    (p) => p.ownerId === user.id || p.partnerId === user.id
  );

  let partnerInfo = null;
  if (relation) {
    const isOwner = relation.ownerId === user.id;
    const otherUserId = isOwner ? relation.partnerId : relation.ownerId;
    const otherUser = otherUserId ? users.get(otherUserId) : null;

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

// API: Logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies?.abyar_session;
  if (token) sessions.delete(token);
  res.clearCookie('abyar_session');
  res.json({ success: true });
});

// API: Sync state
app.post('/api/sync', (req, res) => {
  const user = getUserFromReq(req);
  const { state } = req.body;

  if (user && state) {
    user.state = state;
    if (state.profile?.name) {
      user.name = state.profile.name;
    }
  }

  res.json({ success: true, state: user?.state || state });
});

// API: Partner Create Invite
app.post('/api/partner/invite', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const inviteCode = 'AB-' + Math.floor(1000 + Math.random() * 9000);
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

  partners.push(relation);
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
app.post('/api/partner/connect', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const { inviteCode } = req.body;
  const relation = partners.find(
    (p) => p.inviteCode?.toUpperCase() === inviteCode?.trim().toUpperCase()
  );

  if (!relation || relation.ownerId === user.id) {
    return res.status(400).json({ error: 'Invalid invite code' });
  }

  relation.partnerId = user.id;
  relation.status = 'active';

  const owner = users.get(relation.ownerId);

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
app.put('/api/partner/sharing', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const relation = partners.find((p) => p.ownerId === user.id);
  if (!relation) return res.status(404).json({ error: 'No active connection' });

  const { shareProgress, shareLastDrink, shareHistory } = req.body;
  if (shareProgress !== undefined) relation.shareProgress = shareProgress;
  if (shareLastDrink !== undefined) relation.shareLastDrink = shareLastDrink;
  if (shareHistory !== undefined) relation.shareHistory = shareHistory;

  res.json({ success: true, relation });
});

// API: Disconnect partner
app.post('/api/partner/disconnect', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const idx = partners.findIndex(
    (p) => p.ownerId === user.id || p.partnerId === user.id
  );
  if (idx !== -1) {
    partners.splice(idx, 1);
  }

  res.json({ success: true });
});

// API: Get shared partner data
app.get('/api/partner/shared', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Login required' });

  const relation = partners.find(
    (p) => (p.ownerId === user.id || p.partnerId === user.id) && p.status === 'active'
  );

  if (!relation) return res.status(404).json({ error: 'No active partner' });

  const isOwner = relation.ownerId === user.id;
  const targetUserId = isOwner ? relation.partnerId : relation.ownerId;
  const targetUser = targetUserId ? users.get(targetUserId) : null;

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
