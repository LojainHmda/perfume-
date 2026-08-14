import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * The GitHub Pages build, as one command.
 *
 * Three things separate it from `npm run build`, and each was previously a step
 * someone had to remember:
 *
 *   1. the content snapshot, without which the static site shows only defaults;
 *   2. `GITHUB_PAGES=true`, which moves the base to `/perfume-/`;
 *   3. `404.html`, which is how a static host serves an SPA's deep links.
 *
 * Written in node rather than as a shell one-liner so it behaves the same in
 * PowerShell and in bash — the env var alone would otherwise need `cross-env`.
 */
const ROOT = process.cwd();

/**
 * Always run the real JS entry point on this node, never a shell.
 *
 * `npx vite build` with shell:true on Windows completed the build and then sat
 * there: the cmd wrapper stayed alive after vite exited and spawnSync waited on
 * it. Resolving the bin ourselves removes the wrapper, and with it the hang.
 */
const run = (script, args, env) => {
  const result = spawnSync(process.execPath, [script, ...args], {
    stdio: 'inherit',
    env: { ...process.env, ...env },
    cwd: ROOT,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

const VITE_BIN = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
if (!fs.existsSync(VITE_BIN)) {
  console.error('[pages] vite is not installed — run npm install first.');
  process.exit(1);
}

run(path.join(ROOT, 'scripts', 'snapshot-content.mjs'), []);
run(VITE_BIN, ['build'], { GITHUB_PAGES: 'true' });

// A static host has no router: it looks for a file at the requested path and
// serves 404.html when there isn't one. Making that the app shell is what lets
// /perfume-/admin/layout load rather than dead-end.
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));

console.log('[pages] built with base /perfume-/ and an SPA 404 fallback');
