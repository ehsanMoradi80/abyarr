import { Router, type IRouter } from "express";
import { createSession, hashSession, normalizePhone, stableUserId } from "../lib/auth";
import { requireAuth } from "../middlewares/authMiddleware";
import { supabaseErrorMessage, supabaseJson, supabaseRequest } from "../lib/supabase";

type AppUser = { id: string; phone: string; name: string | null };
type SupabaseAuthResponse = { user?: { id?: string; phone?: string }; access_token?: string };

const router: IRouter = Router();

function isProduction() {
  return process.env["NODE_ENV"] === "production";
}

async function upsertUser(phone: string, id?: string) {
  return supabaseJson<AppUser>(
    "/rest/v1/rpc/app_bootstrap_user",
    {
      method: "POST",
      body: { p_id: id ?? stableUserId(phone), p_phone: phone },
    },
  );
}

async function createCloudOtp(phone: string) {
  await supabaseRequest("/auth/v1/otp", {
    method: "POST",
    body: { phone, create_user: true },
  });
}

async function verifyCloudOtp(phone: string, code: string) {
  return supabaseJson<SupabaseAuthResponse>("/auth/v1/verify", {
    method: "POST",
    body: { phone, token: code, type: "sms" },
  });
}

router.post("/auth/otp/request", async (req, res) => {
  try {
    const phone = normalizePhone(String(req.body?.phone ?? ""));
    if (isProduction()) await createCloudOtp(phone);
    res.json({ accepted: true, devMode: !isProduction() });
  } catch (error) {
    req.log?.warn({ err: error }, "OTP request failed");
    res.status(400).json({ error: isProduction() ? supabaseErrorMessage(error) : "Invalid phone number" });
  }
});

router.post("/auth/otp/verify", async (req, res) => {
  try {
    const phone = normalizePhone(String(req.body?.phone ?? ""));
    const code = String(req.body?.code ?? "").trim();
    if (!/^\d{5,6}$/.test(code)) {
      res.status(401).json({ error: "INVALID_CODE" });
      return;
    }

    let user: AppUser;
    if (isProduction()) {
      const verified = await verifyCloudOtp(phone, code);
      const userId = verified.user?.id;
      if (!userId) {
        res.status(401).json({ error: "INVALID_CODE" });
        return;
      }
      user = await upsertUser(phone, userId);
    } else {
      if (code !== "11111") {
        res.status(401).json({ error: "INVALID_CODE" });
        return;
      }
      user = await upsertUser(phone);
    }

    const token = createSession(user.id, user.phone);
    await supabaseRequest("/rest/v1/rpc/app_create_session", {
      method: "POST",
      body: {
        p_token_hash: hashSession(token),
        p_user_id: user.id,
        p_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
    res.json({ token, user });
  } catch (error) {
    req.log?.error({ err: error }, "OTP verification failed");
    res.status(400).json({ error: supabaseErrorMessage(error) });
  }
});

router.get("/auth/user", requireAuth, async (req, res) => {
  const auth = req.auth;
  if (!auth) return;
  try {
    const user = await supabaseJson<AppUser | null>("/rest/v1/rpc/app_get_current_user", {
      method: "POST",
      body: { p_token_hash: hashSession(req.authToken ?? "") },
    });
    if (!user) {
      res.status(401).json({ error: "UNAUTHORIZED" });
      return;
    }
    res.json(user);
  } catch (error) {
    req.log?.error({ err: error }, "Auth user lookup failed");
    res.status(503).json({ error: supabaseErrorMessage(error) });
  }
});

router.post("/auth/logout", requireAuth, async (req, res) => {
  try {
    if (req.authToken) {
      await supabaseRequest("/rest/v1/rpc/app_revoke_session", {
        method: "POST",
        body: { p_token_hash: hashSession(req.authToken) },
      });
    }
  } catch (error) {
    req.log?.warn({ err: error }, "Session revoke failed");
  }
  res.json({ success: true });
});

export default router;