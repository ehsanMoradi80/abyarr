import { Router, type IRouter } from "express";
import { hashSession } from "../lib/auth";
import { requireAuth } from "../middlewares/authMiddleware";
import { supabaseJson, supabaseRequest } from "../lib/supabase";

type IncomingLog = { id: string; amountMl: number; loggedAt: string };
type IncomingState = {
  profile: { name: string; dailyGoalMl: number };
  reminder: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    intervalMinutes: number;
    quietHoursEnabled: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  logs: IncomingLog[];
};

const router: IRouter = Router();

function validateState(value: unknown): value is IncomingState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<IncomingState>;
  return Boolean(
    state.profile &&
      typeof state.profile.name === "string" &&
      Number.isInteger(state.profile.dailyGoalMl) &&
      state.reminder &&
      typeof state.reminder.enabled === "boolean" &&
      typeof state.reminder.startTime === "string" &&
      typeof state.reminder.endTime === "string" &&
      Number.isInteger(state.reminder.intervalMinutes) &&
      Array.isArray(state.logs) &&
      state.logs.every((log) => Boolean(
        log &&
          typeof log.id === "string" &&
          Number.isInteger(log.amountMl) &&
          typeof log.loggedAt === "string",
      )),
  );
}

async function pullState(userId: string) {
  return supabaseJson<IncomingState>("/rest/v1/rpc/app_pull_sync", {
    method: "POST",
    body: { p_token_hash: userId },
  });
}

router.get("/sync", requireAuth, async (req, res) => {
  const auth = req.auth;
  if (!auth) return;
  try {
    res.json(await pullState(hashSession(req.authToken ?? "")));
  } catch (error) {
    req.log?.error({ err: error }, "Sync pull failed");
    res.status(503).json({ error: "SYNC_UNAVAILABLE" });
  }
});

router.post("/sync", requireAuth, async (req, res) => {
  const auth = req.auth;
  if (!auth) return;
  if (!validateState(req.body)) {
    res.status(400).json({ error: "INVALID_SYNC_STATE" });
    return;
  }

  const state = req.body;
  try {
    await Promise.all([
      supabaseRequest("/rest/v1/rpc/app_push_sync", {
        method: "POST",
        body: {
          p_token_hash: hashSession(req.authToken ?? ""),
          p_state: state,
        },
      }),
    ]);
    res.json(await pullState(hashSession(req.authToken ?? "")));
  } catch (error) {
    req.log?.error({ err: error }, "Sync push failed");
    res.status(503).json({ error: "SYNC_UNAVAILABLE" });
  }
});

export default router;