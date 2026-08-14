import fs from 'fs';
import path from 'path';

/**
 * Freeze the admin's live content into the static build.
 *
 * GitHub Pages serves files and nothing else — there is no API there to answer
 * `/api/catalog`, so without this the deployed storefront falls back to the
 * bundled defaults and none of the admin's work is ever visible on it.
 *
 * The snapshot is written into `public/`, which means it is committed and a
 * clean clone rebuilds the same site. Regenerate it whenever the storefront
 * should catch up with what the admin has saved:
 *
 *     npm run snapshot
 *
 * Media paths are left exactly as the server stores them — root-relative, like
 * `/uploads/plate.png`. The client rewrites them for whatever root it is
 * mounted at (see `resolveMediaUrl`), so one snapshot serves both the server
 * deployment and Pages.
 */
const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'data', 'content.json');
const TARGET = path.join(ROOT, 'public', 'content.json');
const UPLOADS = path.join(ROOT, 'public', 'uploads');

if (!fs.existsSync(SOURCE)) {
  console.error(
    `[snapshot] no ${path.relative(ROOT, SOURCE)} — run the server and save something in the admin first.`,
  );
  process.exit(1);
}

const store = JSON.parse(fs.readFileSync(SOURCE, 'utf-8'));

const snapshot = {
  products: store.products ?? null,
  settings: store.settings ?? {},
  updatedAt: store.updatedAt ?? null,
};

fs.writeFileSync(TARGET, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf-8');

/**
 * Every upload the snapshot points at has to be in the build too, or the
 * deployed page renders a record whose pictures 404. Report the gap loudly
 * rather than shipping a half-broken deploy quietly.
 */
const referenced = new Set();
const walk = (value) => {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/')) referenced.add(path.basename(value));
    return;
  }
  if (Array.isArray(value)) return value.forEach(walk);
  if (value && typeof value === 'object') return Object.values(value).forEach(walk);
};
walk(snapshot);

const present = fs.existsSync(UPLOADS) ? new Set(fs.readdirSync(UPLOADS)) : new Set();
const missing = [...referenced].filter((file) => !present.has(file));

console.log(
  `[snapshot] wrote ${path.relative(ROOT, TARGET)} — ` +
    `${snapshot.products?.length ?? 0} products, ${referenced.size} uploads referenced`,
);

if (missing.length) {
  console.error(`[snapshot] MISSING from public/uploads: ${missing.join(', ')}`);
  process.exit(1);
}
