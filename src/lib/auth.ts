import { db } from "./db";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "ozaib_admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createAdminSession(): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.adminSession.create({
    data: {
      token,
      expiresAt,
    },
  });

  return token;
}

export async function validateAdminSession(token?: string): Promise<boolean> {
  if (!token) return false;

  const session = await db.adminSession.findUnique({
    where: { token },
  });

  if (!session) return false;
  if (session.expiresAt < new Date()) {
    await db.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return false;
  }

  return true;
}

export async function destroyAdminSession(token: string): Promise<void> {
  await db.adminSession.deleteMany({ where: { token } }).catch(() => {});
}

export async function getAdminToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAdminToken();
  return validateAdminSession(token);
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function getSessionDuration(): number {
  return SESSION_DURATION;
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  // Use timing-safe comparison to prevent timing attacks
  const a = Buffer.from(password);
  const b = Buffer.from(adminPassword);

  // Lengths must match for timingSafeEqual
  if (a.length !== b.length) {
    // Still do a comparison to maintain constant time
    // (don't return early - prevents timing-based password guessing)
    crypto.timingSafeEqual(a, a);
    return false;
  }

  return crypto.timingSafeEqual(a, b);
}
