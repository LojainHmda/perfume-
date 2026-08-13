import { Router } from "express";
import type { MediaSlide, SiteSettings } from "../../src/types/settings";
import { MAX_SLIDES, SETTING_KINDS } from "../../src/types/settings";
import { requireAdmin } from "../lib/auth";
import { EMPTY_SETTINGS, mutateStore, readStore } from "../lib/db";

export const settingsRouter = Router();

const SETTING_KEYS = Object.keys(EMPTY_SETTINGS) as (keyof SiteSettings)[];

/** Trimmed string, or null when the admin cleared the field. */
const cleanText = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : null;

/**
 * A media track. Slides without a source are dropped rather than rejected — a
 * half-filled row in the panel is a work in progress, not a bad request. `null`
 * still means "no override"; an empty array is a deliberate "show nothing".
 */
const cleanSlides = (value: unknown): MediaSlide[] | null => {
  if (!Array.isArray(value)) return null;

  const slides: MediaSlide[] = [];
  value.slice(0, MAX_SLIDES).forEach((entry, index) => {
    if (typeof entry !== "object" || entry === null) return;
    const src = cleanText((entry as MediaSlide).src);
    if (!src) return;
    const id = cleanText((entry as MediaSlide).id) ?? `slide-${index + 1}`;
    slides.push({
      id,
      src,
      alt: cleanText((entry as MediaSlide).alt),
      // Not checked against the catalogue here: products can be added, renamed
      // or removed independently, so the storefront resolves the link at render
      // and simply leaves the slide inert when the id no longer exists.
      productId: cleanText((entry as MediaSlide).productId),
    });
  });

  return slides;
};

settingsRouter.get("/", (_req, res) => {
  res.json({ settings: readStore().settings });
});

/**
 * Partial update. Sending `null` for a key clears the override and returns that
 * surface to the built-in default — that is how "remove the custom hero image"
 * is expressed. Each key is sanitised by its declared kind.
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
      const value = (patch as Record<string, unknown>)[key];
      draft.settings = {
        ...draft.settings,
        [key]: SETTING_KINDS[key] === "slides" ? cleanSlides(value) : cleanText(value),
      };
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
