import type { NextFunction, Request, Response } from "express";
import { hashSession, verifySession, type AuthSession } from "../lib/auth";
import { supabaseJson } from "../lib/supabase";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthSession;
      authToken?: string;
      isAuthenticated(): this is Request & { auth: AuthSession };
    }
  }
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const raw = req.header("authorization");
  const token = raw?.startsWith("Bearer ") ? raw.slice("Bearer ".length).trim() : null;
  const session = token ? verifySession(token) : null;
  let activeSession = session;
  if (session && token) {
    try {
      const user = await supabaseJson<{ id?: string } | null>(
        "/rest/v1/rpc/app_get_current_user",
        { method: "POST", body: { p_token_hash: hashSession(token) } },
      );
      if (!user || user.id !== session.userId) activeSession = null;
    } catch {
      activeSession = null;
    }
  }
  req.auth = activeSession ?? undefined;
  req.authToken = token ?? undefined;
  req.isAuthenticated = function isAuthenticated(this: Request): this is Request & { auth: AuthSession } {
    return Boolean(this.auth);
  };
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "UNAUTHORIZED" });
    return;
  }
  next();
}