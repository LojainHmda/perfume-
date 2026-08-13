import { Router } from "express";
import type { SiteSettings } from "../../src/types/settings";
import { requireAdmin } from "../lib/auth";
import { EMPTY_SETTINGS, mutateStore, readStore } from "../lib/db";

export const settingsRouter = Router();

const SETTING_KEYS = Object.keys(EMPTY_SETTINGS) as (keyof SiteSettings)[];

settingsRouter.get("/", (_req, res) => {
  res.json({ settings: readStore().settings });
});

/**
 * Partial update. Sending `null` for a key clears the override and returns that
 * surface to the built-in default — that is how "remove the custom hero image"
 * is expressed.
 */
settingsRouter.patch("/", requireAdmin, (req, res) => {
  const patch = req.body?.settings;
  if (typeof patch !== "object" || patch === null) {
    res.status(400).json({ error: "A settings object is required." });
    return;
  }

  const next = mutateStore((draft) => {
    for (const key of SETTING_KEYS) {
      if (!(key in patch)) continue;
      const value = patch[key];
      draft.settings[key] = typeof value === "string" && value.trim() !== "" ? value.trim() : null;
    }
  });

  res.json({ settings: next.settings });
});

settingsRouter.post("/reset", requireAdmin, (_req, res) => {
  const next = mutateStore((draft) => {
    draft.settings = { ...EMPTY_SETTINGS };
  });
  res.json({ settings: next.settings });
});
