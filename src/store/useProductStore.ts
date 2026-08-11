import { create } from 'zustand';
import { Fragrance, MediaPanelConfig } from '../types/fragrance';
import { FRAGRANCES, ASSETS } from '../data/fragrances';

const LOCAL_STORAGE_KEY = 'bts_admin_fragrances_v1';

const getInitialProducts = (): Fragrance[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load products from localStorage:', e);
  }
  return FRAGRANCES;
};

interface ProductState {
  products: Fragrance[];
  addProduct: (product: Fragrance) => void;
  updateProduct: (id: string, updatedFields: Partial<Fragrance>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
  getProductById: (id: string) => Fragrance | undefined;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: getInitialProducts(),

  addProduct: (newProduct) => {
    set((state) => {
      const updated = [newProduct, ...state.products];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return { products: updated };
    });
  },

  updateProduct: (id, updatedFields) => {
    set((state) => {
      const updated = state.products.map((p) =>
        p.id === id ? { ...p, ...updatedFields } : p
      );
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return { products: updated };
    });
  },

  deleteProduct: (id) => {
    set((state) => {
      const updated = state.products.filter((p) => p.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage', e);
      }
      return { products: updated };
    });
  },

  resetToDefaults: () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    set({ products: FRAGRANCES });
  },

  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },
}));

export const getDefaultMediaPanels = (fragrance: Fragrance): MediaPanelConfig[] => {
  if (fragrance.mediaPanels && fragrance.mediaPanels.length === 4) {
    return fragrance.mediaPanels;
  }
  return [
    {
      id: 'panel-1',
      title: fragrance.name,
      subtitle: 'SCENARIO 01 • UNBOXING',
      image: ASSETS.discoveryGloveBottle,
    },
    {
      id: 'panel-2',
      title: fragrance.subtitle || 'FRAGRANCE FILM',
      subtitle: 'SCENARIO 02 • ATMOSPHERE',
      image: ASSETS.discoveryAppleBottle,
    },
    {
      id: 'panel-3',
      title: 'INGREDIENTS IN MOTION',
      subtitle: 'SCENARIO 03 • ACCORDS',
      image: ASSETS.discoveryHoneyBottle,
    },
    {
      id: 'panel-4',
      title: 'HAUTE BOTTLE EXHIBIT',
      subtitle: 'SCENARIO 04 • ATELIER',
      image: ASSETS.discoveryWineBottle,
    },
  ];
};
