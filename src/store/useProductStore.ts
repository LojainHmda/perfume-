import { create } from 'zustand';
import {
  createProduct,
  fetchCatalog,
  patchProduct,
  removeProduct,
  replaceProducts,
  resetCatalog,
  seedCatalog,
} from '../api/catalog';
import { FRAGRANCES } from '../data/fragrances';
import { Fragrance, MediaPanelConfig } from '../types/fragrance';

/**
 * The catalogue.
 *
 * The server is the source of truth once it has been seeded, so an edit made in
 * the admin panel is what every visitor sees. Until then — and whenever the API
 * is unreachable — the bundled catalogue stands in, which is what keeps the
 * storefront intact offline.
 */
interface ProductState {
  products: Fragrance[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  /** True once the server answered; false means these are the bundled defaults. */
  isServerBacked: boolean;

  load: () => Promise<void>;
  addProduct: (product: Fragrance) => Promise<void>;
  updateProduct: (id: string, updatedFields: Partial<Fragrance>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  reorderProducts: (products: Fragrance[]) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  getProductById: (id: string) => Fragrance | undefined;
}

const message = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const useProductStore = create<ProductState>((set, get) => ({
  products: FRAGRANCES,
  isLoading: false,
  isSyncing: false,
  error: null,
  isServerBacked: false,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const catalog = await fetchCatalog();

      if (catalog.products && catalog.products.length > 0) {
        set({ products: catalog.products, isServerBacked: true, isLoading: false });
        return;
      }

      // Never seeded. Show what ships and hand the server the same list so
      // per-product edits have something to work against.
      set({ products: FRAGRANCES, isLoading: false });
      try {
        const seeded = await seedCatalog(FRAGRANCES);
        set({ products: seeded.products, isServerBacked: true });
      } catch {
        /* a parallel tab won the race, or seeding is closed — defaults stand */
      }
    } catch (error) {
      set({
        products: FRAGRANCES,
        isServerBacked: false,
        isLoading: false,
        error: message(error, 'Could not load the catalogue from the server.'),
      });
    }
  },

  addProduct: async (product) => {
    set({ isSyncing: true, error: null });
    try {
      const { products } = await createProduct(product);
      set({ products, isServerBacked: true, isSyncing: false });
    } catch (error) {
      set({ isSyncing: false, error: message(error, 'Could not create the product.') });
      throw error;
    }
  },

  updateProduct: async (id, updatedFields) => {
    set({ isSyncing: true, error: null });
    try {
      const { products } = await patchProduct(id, updatedFields);
      set({ products, isServerBacked: true, isSyncing: false });
    } catch (error) {
      set({ isSyncing: false, error: message(error, 'Could not save the product.') });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isSyncing: true, error: null });
    try {
      const { products } = await removeProduct(id);
      set({ products, isServerBacked: true, isSyncing: false });
    } catch (error) {
      set({ isSyncing: false, error: message(error, 'Could not delete the product.') });
      throw error;
    }
  },

  reorderProducts: async (next) => {
    const previous = get().products;
    set({ products: next, isSyncing: true, error: null });
    try {
      const { products } = await replaceProducts(next);
      set({ products, isServerBacked: true, isSyncing: false });
    } catch (error) {
      set({ products: previous, isSyncing: false, error: message(error, 'Could not reorder.') });
      throw error;
    }
  },

  resetToDefaults: async () => {
    set({ isSyncing: true, error: null });
    try {
      await resetCatalog();
      set({ products: FRAGRANCES, isSyncing: false });
      // Put the shipped catalogue back on the server so it stays authoritative.
      try {
        const seeded = await seedCatalog(FRAGRANCES);
        set({ products: seeded.products, isServerBacked: true });
      } catch {
        set({ isServerBacked: false });
      }
    } catch (error) {
      set({ isSyncing: false, error: message(error, 'Could not reset the catalogue.') });
      throw error;
    }
  },

  getProductById: (id) => get().products.find((product) => product.id === id),
}));

/**
 * The four media slots for a fragrance, in grid order.
 *
 * Titles fall back to the fragrance's own grid panels, and `image`/`videoUrl`
 * stay empty unless an admin uploaded something — an empty slot is the signal
 * to render the generated atmosphere instead.
 */
export const getDefaultMediaPanels = (fragrance: Fragrance): MediaPanelConfig[] => {
  const saved = fragrance.mediaPanels ?? [];

  return fragrance.gridPanels.map((gridPanel, index) => {
    const override: Partial<MediaPanelConfig> = saved[index] ?? {};
    return {
      id: override.id || gridPanel.id || `panel-${index + 1}`,
      title: override.title ?? gridPanel.title,
      subtitle: override.subtitle ?? gridPanel.subtitle,
      image: override.image,
      videoUrl: override.videoUrl,
      posterUrl: override.posterUrl,
    };
  });
};

/** True when the slot carries admin media, i.e. the generated reel is overridden. */
export const panelHasCustomMedia = (panel: MediaPanelConfig | undefined): boolean =>
  Boolean(panel?.videoUrl?.trim() || panel?.image?.trim());
