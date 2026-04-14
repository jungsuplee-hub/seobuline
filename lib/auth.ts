import { randomBytes, createHmac } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export type Role = "user";

export type SessionUser = {
  id: number;
  email: string;
  role: Role;
  region: string;
  nickname: string | null;
};

const SESSION_COOKIE = "seobuline_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14;

function hashToken(token: string) {
  const secret = process.env.SESSION_SECRET || "dev-only-session-secret";
  return createHmac("sha256", secret).update(token).digest("hex");
}

async function isSecureRequest() {
  if (process.env.NODE_ENV !== "production") return false;
  const headerStore = await headers();
  const forwardedProto = headerStore.get("x-forwarded-proto");
  return forwardedProto ? forwardedProto.split(",").some((part) => part.trim() === "https") : true;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSession(userId: number) {
  const rawToken = randomBytes(32).toString("hex");
  const token = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  db.prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)").run(userId, token, expiresAt);

  const secure = await isSecureRequest();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, rawToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearSession() {
  const secure = await isSecureRequest();
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (rawToken) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(hashToken(rawToken));
  }
  const deleteCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  } as const;

  cookieStore.set(SESSION_COOKIE, "", { ...deleteCookieOptions, secure });
  cookieStore.set(SESSION_COOKIE, "", { ...deleteCookieOptions, secure: true });
  cookieStore.set(SESSION_COOKIE, "", { ...deleteCookieOptions, secure: false });
}

export function generateResetToken() {
  return randomBytes(32).toString("hex");
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!rawToken) return null;

  const now = new Date().toISOString();
  const session = db
    .prepare(
      `SELECT s.user_id, u.email, u.region, u.nickname
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(hashToken(rawToken), now) as { user_id: number; email: string; region: string; nickname: string | null } | undefined;

  if (!session) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return {
    id: session.user_id,
    email: session.email,
    role: "user",
    region: session.region,
    nickname: session.nickname,
  };
}

export async function requireAuth(nextPath = "/mypage") {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
