import crypto from "crypto";
import type { NextFunction, Request, Response } from "express";

/**
 * Admin authentication.
 *
 * Credentials come from the environment; the fallback pair exists so a fresh
 * checkout can open the panel without setup. Sessions are in-memory bearer
 * tokens — they die with the process, which is the honest behaviour for a
 * single-operator panel with no user database behind it.
 */
const ADMIN_USER = (process.env.ADMIN_USER ?? "admin").toLowerCase();
const ADMIN_PASS = process.env.ADMIN_PASS ?? "admin123";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

interface Session {
  username: string;
  expiresAt: number;
}

const sessions = new Map<string, Session>();

const prune = (): void => {
  const now = Date.now();
  for (const [token, session] of sessions) {
    if (session.expiresAt <= now) sessions.delete(token);
  }
};

export const verifyCredentials = (username: string, password: string): boolean => {
  const user = String(username ?? "").trim().toLowerCase();
  const pass = String(password ?? "").trim();
  return user === ADMIN_USER && pass === ADMIN_PASS;
};

export const createSession = (username: string): { token: string; expiresAt: number } => {
  prune();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, { username: username.trim().toLowerCase(), expiresAt });
  return { token, expiresAt };
};

export const readSession = (token: string | undefined): Session | null => {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
};

export const destroySession = (token: string | undefined): void => {
  if (token) sessions.delete(token);
};

export const tokenFromRequest = (req: Request): string | undefined => {
  const header = req.headers.authorization;
  if (typeof header === "string" && header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }
  return undefined;
};

/** Gate for every write route in the admin surface. */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const session = readSession(tokenFromRequest(req));
  if (!session) {
    res.status(401).json({ error: "Admin authentication required." });
    return;
  }
  (req as Request & { adminUser?: string }).adminUser = session.username;
  next();
};

export const ADMIN_USERNAME_HINT = ADMIN_USER;
