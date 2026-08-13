import { Fragrance } from '../types/fragrance';
import { SiteSettings } from '../types/settings';
import { apiGet, apiSend } from './client';

/** `products: null` means the server has never been seeded. */
export interface CatalogResponse {
  products: Fragrance[] | null;
  settings: SiteSettings;
  updatedAt: string | null;
}

export const fetchCatalog = () => apiGet<CatalogResponse>('/api/catalog');

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
