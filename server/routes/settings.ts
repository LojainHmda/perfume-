import { Router } from "express";
import type { MediaSlide, SettingKind, SiteSettings } from "../../src/types/settings";
import { MAX_SLIDES, SETTING_KINDS } from "../../src/types/settings";
import { requireAdmin } from "../lib/auth";
import { EMPTY_SETTINGS, mutateStore, readStore } from "../lib/db";

export const settingsRouter = Router();

const SETTING_KEYS = Object.keys(EMPTY_SETTINGS) as (keyof SiteSettings)[];

/** Trimmed string, or null when the admin cleared the field. */
const cleanText = (value: unknown): string | null =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : null;

/**
 * An ordered list of plain strings — manifesto phrases, hero notation, and the
 * layout keys. Blank entries are dropped the same way blank track rows are.
 */
const cleanLines = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) return null;
  return value
    .slice(0, MAX_SLIDES)
    .map(cleanText)
    .filter((line): line is string => line !== null);
};

/**
 * A media track. Rows carrying nothing are dropped rather than rejected — a
 * half-filled row in the panel is a work in progress, not a bad request. `null`
 * still means "no override"; an empty array is a deliberate "show nothing".
 *
 * `cards` rows keep the copy a plain `slides` row has no use for, and they
 * survive without artwork: an archive entry is a title and a door first, and
 * the plate behind it is optional.
 */
const cleanTrack = (value: unknown, kind: SettingKind): MediaSlide[] | null => {
  if (!Array.isArray(value)) return null;
  const isCards = kind === "cards";

  const slides: MediaSlide[] = [];
  value.slice(0, MAX_SLIDES).forEach((entry, index) => {
    if (typeof entry !== "object" || entry === null) return;
    const row = entry as MediaSlide;
    const src = cleanText(row.src);
    const title = cleanText(row.title);
    if (!src && !(isCards && title)) return;

    const id = cleanText(row.id) ?? `slide-${index + 1}`;
    const slide: MediaSlide = {
      id,
      src: src ?? "",
      alt: cleanText(row.alt),
      // Not checked against the catalogue here: products can be added, renamed
      // or removed independently, so the storefront resolves the link at render
      // and simply leaves the slide inert when the id no longer exists.
      productId: cleanText(row.productId),
    };

    if (isCards) {
      slide.eyebrow = cleanText(row.eyebrow);
      slide.title = title;
      slide.href = cleanText(row.href);
    }

    slides.push(slide);
  });

  return slides;
};

/** Route a value to the sanitiser its declared kind calls for. */
const cleanByKind = (value: unknown, kind: SettingKind) => {
  switch (kind) {
    case "slides":
    case "cards":
      return cleanTrack(value, kind);
    case "lines":
    case "ids":
      return cleanLines(value);
    default:
      return cleanText(value);
  }
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
        [key]: cleanByKind(value, SETTING_KINDS[key]),
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
