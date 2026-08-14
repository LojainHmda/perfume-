/** Media slots accept a film or a still, and only the URL tells them apart. */
export const isVideoUrl = (url: string | null | undefined): boolean =>
  /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url ?? '');

/**
 * Put an admin upload where the deployment actually serves it.
 *
 * The server hands back root-relative paths — `/uploads/plate.png` — because
 * that is what it serves them at, and that is the honest thing for it to store:
 * the same record has to survive being deployed twice, under different roots.
 *
 * On GitHub Pages the site is mounted at `/perfume-/`, so `/uploads/plate.png`
 * resolves above the site and 404s while the file sits one level down. Only the
 * client knows its own base, so the prefixing happens here.
 *
 * Absolute URLs, data URIs and paths that already carry the base are returned
 * untouched, which makes this safe to apply more than once.
 */
export const resolveMediaUrl = (url: string): string => {
  if (!url) return url;

  const base = import.meta.env.BASE_URL; // '/' on the server, '/perfume-/' on Pages
  if (base === '/') return url;
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (!url.startsWith('/') || url.startsWith(base)) return url;

  return `${base}${url.slice(1)}`;
};
