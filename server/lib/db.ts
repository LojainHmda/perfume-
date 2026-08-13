import fs from "fs";
import type { Fragrance } from "../../src/types/fragrance";
import type { SiteSettings } from "../../src/types/settings";
import { EMPTY_SITE_SETTINGS } from "../../src/types/settings";
import { CONTENT_FILE, ensureDirs } from "./paths";

/**
 * The persisted store.
 *
 * `products: null` means "never seeded" — the storefront then falls back to the
 * catalogue bundled with the client, which is what ships before an admin has
 * touched anything. The first admin write seeds this file and the server
 * becomes the source of truth from then on.
 */
export interface ContentStore {
  products: Fragrance[] | null;
  settings: SiteSettings;
  updatedAt: string | null;
}

/**
 * Re-exported from the shared type rather than restated, so a new setting can
 * never exist on the client while the store silently drops it here.
 */
export const EMPTY_SETTINGS: SiteSettings = EMPTY_SITE_SETTINGS;

const emptyStore = (): ContentStore => ({
  products: null,
  settings: { ...EMPTY_SETTINGS },
  updatedAt: null,
});

let cache: ContentStore | null = null;

export const readStore = (): ContentStore => {
  if (cache) return cache;

  ensureDirs();

  if (!fs.existsSync(CONTENT_FILE)) {
    cache = emptyStore();
    return cache;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf-8")) as Partial<ContentStore>;
    cache = {
      products: Array.isArray(parsed.products) ? parsed.products : null,
      settings: { ...EMPTY_SETTINGS, ...(parsed.settings ?? {}) },
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch (error) {
    console.error("[db] content.json unreadable, starting from empty store:", error);
    cache = emptyStore();
  }

  return cache;
};

export const writeStore = (next: Omit<ContentStore, "updatedAt">): ContentStore => {
  ensureDirs();
  const stamped: ContentStore = { ...next, updatedAt: new Date().toISOString() };
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(stamped, null, 2), "utf-8");
  cache = stamped;
  return stamped;
};

/** Read–modify–write helper so routes never juggle the whole store shape. */
export const mutateStore = (mutate: (draft: ContentStore) => void): ContentStore => {
  const current = readStore();
  const draft: ContentStore = {
    products: current.products ? [...current.products] : null,
    settings: { ...current.settings },
    updatedAt: current.updatedAt,
  };
  mutate(draft);
  return writeStore({ products: draft.products, settings: draft.settings });
};

export const resetStore = (): ContentStore =>
  writeStore({ products: null, settings: { ...EMPTY_SETTINGS } });
