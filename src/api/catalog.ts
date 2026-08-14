import { Fragrance } from '../types/fragrance';
import { MediaSlide, SETTING_KINDS, SiteSettings, TRACK_KINDS } from '../types/settings';
import { resolveMediaUrl } from '../utils/media';
import { apiGet, apiSend } from './client';

/** `products: null` means the server has never been seeded. */
export interface CatalogResponse {
  products: Fragrance[] | null;
  settings: SiteSettings;
  updatedAt: string | null;
}

/**
 * The static snapshot the Pages build ships, written by scripts/snapshot-content.mjs.
 *
 * A static host has no API, so without this the storefront would fall back to
 * the bundled defaults and none of the admin's work would ever be visible
 * there. The snapshot is the same payload the live API returns, frozen at build
 * time.
 */
const SNAPSHOT_URL = `${import.meta.env.BASE_URL}content.json`;

/**
 * Ask the server; fall back to the snapshot when there isn't one.
 *
 * Written as a fallback rather than as a build-time switch so a single build
 * works both ways: served by the house server the API answers and the snapshot
 * is never fetched, and on Pages the API 404s and the snapshot stands in.
 */
export const fetchCatalog = async (): Promise<CatalogResponse> => {
  try {
    return withResolvedMedia(await apiGet<CatalogResponse>('/api/catalog'));
  } catch (error) {
    const response = await fetch(SNAPSHOT_URL);
    // Nothing to fall back to either — let the original API failure be the one
    // reported, since that is the one worth acting on where a server exists.
    if (!response.ok) throw error;
    return withResolvedMedia((await response.json()) as CatalogResponse);
  }
};

/**
 * Rewrite stored media paths for wherever this build is mounted.
 *
 * Done once, at the boundary, so no component has to remember to resolve a URL
 * before rendering it. Safe to apply to admin state as well: on the server the
 * base is `/` and this is a no-op, and a static host has no API to save back
 * to, so a prefixed path can never be written into the store.
 */
const withResolvedMedia = (payload: CatalogResponse): CatalogResponse => ({
  ...payload,
  products: payload.products?.map(resolveProductMedia) ?? null,
  settings: resolveSettingsMedia(payload.settings),
});

const resolveProductMedia = (product: Fragrance): Fragrance => ({
  ...product,
  image: product.image ? resolveMediaUrl(product.image) : product.image,
  mediaPanels: product.mediaPanels?.map((panel) => ({
    ...panel,
    image: panel.image ? resolveMediaUrl(panel.image) : panel.image,
    videoUrl: panel.videoUrl ? resolveMediaUrl(panel.videoUrl) : panel.videoUrl,
    posterUrl: panel.posterUrl ? resolveMediaUrl(panel.posterUrl) : panel.posterUrl,
  })),
});

/**
 * Media lives in two shapes in settings: a key that is itself a URL, and a
 * track whose every row carries one. Both are found by asking the shared kind
 * map rather than by listing keys, so a new media setting is covered the moment
 * it is declared.
 */
const resolveSettingsMedia = (settings: SiteSettings): SiteSettings => {
  const next = { ...settings };

  for (const [key, kind] of Object.entries(SETTING_KINDS) as [keyof SiteSettings, string][]) {
    const value = next[key];

    if (kind === 'media' && typeof value === 'string') {
      Object.assign(next, { [key]: resolveMediaUrl(value) });
      continue;
    }

    if (TRACK_KINDS.includes(kind as never) && Array.isArray(value)) {
      const track = (value as MediaSlide[]).map((slide) => ({
        ...slide,
        src: resolveMediaUrl(slide.src),
      }));
      Object.assign(next, { [key]: track });
    }
  }

  return next;
};

export const seedCatalog = (products: Fragrance[]) =>
  apiSend<{ products: Fragrance[] }>('POST', '/api/catalog/seed', { products });

export const createProduct = (product: Fragrance) =>
  apiSend<{ products: Fragrance[] }>('POST', '/api/catalog/products', { product });

export const patchProduct = (id: string, product: Partial<Fragrance>) =>
  apiSend<{ products: Fragrance[] }>('PATCH', `/api/catalog/products/${encodeURIComponent(id)}`, {
    product,
  });

export const removeProduct = (id: string) =>
  apiSend<{ products: Fragrance[] }>('DELETE', `/api/catalog/products/${encodeURIComponent(id)}`);

export const replaceProducts = (products: Fragrance[]) =>
  apiSend<{ products: Fragrance[] }>('PUT', '/api/catalog/products', { products });

export const resetCatalog = () =>
  apiSend<{ products: Fragrance[] | null; settings: SiteSettings }>('POST', '/api/catalog/reset');

export const patchSettings = (settings: Partial<SiteSettings>) =>
  apiSend<{ settings: SiteSettings }>('PATCH', '/api/settings', { settings });

export const resetSettings = () => apiSend<{ settings: SiteSettings }>('POST', '/api/settings/reset');
