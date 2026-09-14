"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.use((0, import_cookie_parser.default)());
app.use((0, import_cors.default)());
var users = /* @__PURE__ */ new Map();
var sessions = /* @__PURE__ */ new Map();
var partners = [];
var getUserFromReq = (req) => {
  const token = req.cookies?.abyar_session;
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;
  return users.get(userId) || null;
};
app.get("/api/auth/me", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
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
      role: isOwner ? "owner" : "partner",
      partnerName: otherUser?.name || otherUser?.phone || null,
      inviteCode: relation.inviteCode,
      canManageSharing: isOwner,
      shareProgress: relation.shareProgress,
      shareLastDrink: relation.shareLastDrink,
      shareHistory: relation.shareHistory
    };
  }
  res.json({
    user: { id: user.id, phone: user.phone, name: user.name },
    partner: partnerInfo
  });
});
app.post("/api/auth/logout", (req, res) => {
  const token = req.cookies?.abyar_session;
  if (token) sessions.delete(token);
  res.clearCookie("abyar_session");
  res.json({ success: true });
});
app.post("/api/sync", (req, res) => {
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
app.post("/api/partner/invite", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Login required" });
  const inviteCode = "AB-" + Math.floor(1e3 + Math.random() * 9e3);
  const relation = {
    id: "rel_" + Date.now(),
    ownerId: user.id,
    partnerId: null,
    inviteCode,
    status: "pending",
    shareProgress: true,
    shareLastDrink: true,
    shareHistory: false
  };
  partners.push(relation);
  res.json({
    inviteCode,
    partner: {
      id: relation.id,
      status: "pending",
      role: "owner",
      partnerName: null,
      inviteCode,
      canManageSharing: true,
      shareProgress: true,
      shareLastDrink: true,
      shareHistory: false
    }
  });
});
app.post("/api/partner/connect", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Login required" });
  const { inviteCode } = req.body;
  const relation = partners.find(
    (p) => p.inviteCode?.toUpperCase() === inviteCode?.trim().toUpperCase()
  );
  if (!relation || relation.ownerId === user.id) {
    return res.status(400).json({ error: "Invalid invite code" });
  }
  relation.partnerId = user.id;
  relation.status = "active";
  const owner = users.get(relation.ownerId);
  res.json({
    success: true,
    partner: {
      id: relation.id,
      status: "active",
      role: "partner",
      partnerName: owner?.name || owner?.phone || "\u06A9\u0627\u0631\u0628\u0631 \u0622\u0628\u200C\u06CC\u0627\u0631",
      inviteCode: relation.inviteCode,
      canManageSharing: false,
      shareProgress: relation.shareProgress,
      shareLastDrink: relation.shareLastDrink,
      shareHistory: relation.shareHistory
    }
  });
});
app.put("/api/partner/sharing", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Login required" });
  const relation = partners.find((p) => p.ownerId === user.id);
  if (!relation) return res.status(404).json({ error: "No active connection" });
  const { shareProgress, shareLastDrink, shareHistory } = req.body;
  if (shareProgress !== void 0) relation.shareProgress = shareProgress;
  if (shareLastDrink !== void 0) relation.shareLastDrink = shareLastDrink;
  if (shareHistory !== void 0) relation.shareHistory = shareHistory;
  res.json({ success: true, relation });
});
app.post("/api/partner/disconnect", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Login required" });
  const idx = partners.findIndex(
    (p) => p.ownerId === user.id || p.partnerId === user.id
  );
  if (idx !== -1) {
    partners.splice(idx, 1);
  }
  res.json({ success: true });
});
app.get("/api/partner/shared", (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Login required" });
  const relation = partners.find(
    (p) => (p.ownerId === user.id || p.partnerId === user.id) && p.status === "active"
  );
  if (!relation) return res.status(404).json({ error: "No active partner" });
  const isOwner = relation.ownerId === user.id;
  const targetUserId = isOwner ? relation.partnerId : relation.ownerId;
  const targetUser = targetUserId ? users.get(targetUserId) : null;
  if (!targetUser || !targetUser.state) {
    return res.json({ partnerName: targetUser?.name || "\u0647\u0645\u0631\u0627\u0647", progress: null });
  }
  const { profile, logs = [] } = targetUser.state;
  const goalGlasses = profile?.dailyGoal || (profile?.dailyGoalMl ? Math.round(profile.dailyGoalMl / 250) : 8);
  const totalGlasses = logs.reduce((sum, l) => sum + (l.amount !== void 0 ? l.amount : l.amountMl ? l.amountMl / 250 : 1), 0);
  const percent = goalGlasses > 0 ? Math.min(Math.round(totalGlasses / goalGlasses * 100), 100) : 0;
  const sharedResult = {
    partnerName: targetUser.name || "\u0647\u0645\u0631\u0627\u0647"
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
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
start();
//# sourceMappingURL=server.cjs.map
