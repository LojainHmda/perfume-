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

const run = (command, args, env) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env },
    cwd: ROOT,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

run('node', ['scripts/snapshot-content.mjs']);
run('npx', ['vite', 'build'], { GITHUB_PAGES: 'true' });

// A static host has no router: it looks for a file at the requested path and
// serves 404.html when there isn't one. Making that the app shell is what lets
// /perfume-/admin/layout load rather than dead-end.
const dist = path.join(ROOT, 'dist');
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));

console.log('[pages] built with base /perfume-/ and an SPA 404 fallback');
