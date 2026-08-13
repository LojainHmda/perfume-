import { Router } from "express";
import {
  createSession,
  destroySession,
  readSession,
  tokenFromRequest,
  verifyCredentials,
} from "../lib/auth";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const { username, password } = req.body ?? {};

  if (!verifyCredentials(username, password)) {
    res.status(401).json({ error: "Invalid admin credentials." });
    return;
  }

  const { token, expiresAt } = createSession(username);
  res.json({ token, expiresAt, username: String(username).trim().toLowerCase() });
});

authRouter.get("/session", (req, res) => {
  const session = readSession(tokenFromRequest(req));
  if (!session) {
    res.status(401).json({ error: "No active admin session." });
    return;
  }
  res.json({ username: session.username, expiresAt: session.expiresAt });
});

authRouter.post("/logout", (req, res) => {
  destroySession(tokenFromRequest(req));
  res.json({ ok: true });
});
