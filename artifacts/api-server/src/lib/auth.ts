import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type AuthSession = {
  userId: string;
  phone: string;
  exp: number;
};

function secret() {
  const value = process.env["SESSION_SECRET"];
  if (!value) throw new Error("SESSION_SECRET is required for authentication");
  return value;
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function normalizePhone(input: string) {
  const digits = input.replace(/[^\d+]/g, "");
  const normalized = digits.startsWith("00") ? `+${digits.slice(2)}` : digits;
  if (!/^\+\d{10,15}$/.test(normalized)) {
    throw new Error("Invalid phone number");
  }
  return normalized;
}

export function createSession(userId: string, phone: string) {
  const payload = encode(JSON.stringify({
    userId,
    phone,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  }));
  return `${payload}.${signature(payload)}`;
}

export function stableUserId(phone: string) {
  const chars = createHmac("sha256", secret()).update(`user:${phone}`).digest("hex").slice(0, 32).split("");
  chars[12] = "4";
  chars[16] = ((parseInt(chars[16], 16) & 0x3) | 0x8).toString(16);
  return `${chars.slice(0, 8).join("")}-${chars.slice(8, 12).join("")}-${chars.slice(12, 16).join("")}-${chars.slice(16, 20).join("")}-${chars.slice(20, 32).join("")}`;
}

export function verifySession(token: string): AuthSession | null {
  const [payload, providedSignature] = token.split(".");
  if (!payload || !providedSignature) return null;

  const expectedSignature = signature(payload);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  try {
    const session = JSON.parse(decode(payload)) as AuthSession;
    if (!session.userId || !session.phone || !Number.isFinite(session.exp)) return null;
    if (session.exp <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export function hashSession(token: string) {
  return createHmac("sha256", secret()).update(`session:${token}`).digest("hex");
}

export function createInviteCode() {
  return randomBytes(5).toString("hex").toUpperCase();
}