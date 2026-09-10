import { Router, type IRouter } from "express";
import { createInviteCode, hashSession } from "../lib/auth";
import { supabaseJson } from "../lib/supabase";
import { requireAuth } from "../middlewares/authMiddleware";

type PartnerConnection = {
  id: string;
  status: "pending" | "active";
  role: "owner" | "partner";
  partnerName: string | null;
  inviteCode: string | null;
  canManageSharing: boolean;
  shareProgress: boolean;
  shareLastDrink: boolean;
  shareHistory: boolean;
};

const router: IRouter = Router();

function tokenHash(req: Express.Request) {
  return hashSession(req.authToken ?? "");
}

function validInviteCode(value: unknown) {
  return typeof value === "string" && /^[A-Z0-9]{6,32}$/i.test(value.trim());
}

router.get("/partner", requireAuth, async (req, res) => {
  if (!req.auth) return;
  try {
    const relationship = await supabaseJson<PartnerConnection | null>("/rest/v1/rpc/app_get_partner", {
      method: "POST",
      body: { p_token_hash: tokenHash(req) },
    });
    if (!relationship) {
      res.status(404).json({ error: "NO_PARTNER" });
      return;
    }
    res.json(relationship);
  } catch (error) {
    req.log?.error({ err: error }, "Partner lookup failed");
    res.status(503).json({ error: "PARTNER_UNAVAILABLE" });
  }
});

router.get("/partner/shared", requireAuth, async (req, res) => {
  if (!req.auth) return;
  try {
    const shared = await supabaseJson<unknown | null>("/rest/v1/rpc/app_get_shared_partner", {
      method: "POST",
      body: { p_token_hash: tokenHash(req) },
    });
    if (!shared) {
      res.status(404).json({ error: "NO_SHARED_PARTNER" });
      return;
    }
    res.json(shared);
  } catch (error) {
    req.log?.error({ err: error }, "Shared partner data lookup failed");
    res.status(503).json({ error: "PARTNER_UNAVAILABLE" });
  }
});

router.post("/partner/invite", requireAuth, async (req, res) => {
  if (!req.auth) return;
  try {
    const relationship = await supabaseJson<PartnerConnection>("/rest/v1/rpc/app_create_partner_invite", {
      method: "POST",
      body: {
        p_token_hash: tokenHash(req),
        p_invite_code: createInviteCode(),
        p_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
    res.json(relationship);
  } catch (error) {
    req.log?.error({ err: error }, "Partner invite creation failed");
    res.status(503).json({ error: "PARTNER_UNAVAILABLE" });
  }
});

router.post("/partner/connect", requireAuth, async (req, res) => {
  if (!req.auth) return;
  const inviteCode = String(req.body?.inviteCode ?? "").trim().toUpperCase();
  if (!validInviteCode(inviteCode)) {
    res.status(400).json({ error: "INVALID_INVITE_CODE" });
    return;
  }
  try {
    const relationship = await supabaseJson<PartnerConnection>("/rest/v1/rpc/app_connect_partner", {
      method: "POST",
      body: { p_token_hash: tokenHash(req), p_invite_code: inviteCode },
    });
    res.json(relationship);
  } catch (error) {
    req.log?.warn({ err: error }, "Partner connection failed");
    res.status(400).json({ error: "INVALID_INVITE_CODE" });
  }
});

router.patch("/partner/sharing", requireAuth, async (req, res) => {
  if (!req.auth) return;
  const values = req.body ?? {};
  if (![values.shareProgress, values.shareLastDrink, values.shareHistory].every((value) => typeof value === "boolean")) {
    res.status(400).json({ error: "INVALID_SHARING_SETTINGS" });
    return;
  }
  try {
    const relationship = await supabaseJson<PartnerConnection | null>("/rest/v1/rpc/app_update_partner_sharing", {
      method: "POST",
      body: {
        p_token_hash: tokenHash(req),
        p_share_progress: values.shareProgress,
        p_share_last_drink: values.shareLastDrink,
        p_share_history: values.shareHistory,
      },
    });
    if (!relationship) {
      res.status(403).json({ error: "SHARING_NOT_ALLOWED" });
      return;
    }
    res.json(relationship);
  } catch (error) {
    req.log?.error({ err: error }, "Partner sharing update failed");
    res.status(503).json({ error: "PARTNER_UNAVAILABLE" });
  }
});

router.delete("/partner", requireAuth, async (req, res) => {
  if (!req.auth) return;
  try {
    await supabaseJson("/rest/v1/rpc/app_revoke_partner", {
      method: "POST",
      body: { p_token_hash: tokenHash(req) },
    });
    res.json({ success: true });
  } catch (error) {
    req.log?.error({ err: error }, "Partner revoke failed");
    res.status(503).json({ error: "PARTNER_UNAVAILABLE" });
  }
});

export default router;