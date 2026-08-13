import path from "path";
import fs from "fs";

/**
 * One place that knows where things live on disk. Everything else asks here so
 * dev (tsx from the repo root) and production (bundled dist/server.cjs, also
 * launched from the repo root) resolve to the same folders.
 */
export const ROOT_DIR = process.cwd();

/** Persisted content — catalogue + site settings. Git-ignored. */
export const DATA_DIR = path.join(ROOT_DIR, "data");
export const CONTENT_FILE = path.join(DATA_DIR, "content.json");

/** Admin uploads. Served read-only at /uploads/<file>. */
export const UPLOADS_DIR = path.join(ROOT_DIR, "public", "uploads");
export const UPLOADS_URL_PREFIX = "/uploads";

/** The built SPA, used in production only. */
export const DIST_DIR = path.join(ROOT_DIR, "dist");

export const ensureDirs = (): void => {
  for (const dir of [DATA_DIR, UPLOADS_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
};
