import { create } from 'zustand';
import { fetchCatalog, patchSettings, resetSettings } from '../api/catalog';
import { EMPTY_SITE_SETTINGS, SiteSettings } from '../types/settings';

/**
 * Storefront settings the admin controls — currently the hero surface.
 *
 * Every value is an override: `null` means the site keeps what it ships with,
 * so clearing a field in the panel restores the built-in campaign plate.
 */
interface SettingsState {
  settings: SiteSettings;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  load: () => Promise<void>;
  save: (patch: Partial<SiteSettings>) => Promise<void>;
  reset: () => Promise<void>;
}

const message = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: { ...EMPTY_SITE_SETTINGS },
  isLoading: false,
  isSyncing: false,
  error: null,

  load: async () => {
    set({ isLoading: true, error: null });
    try {
      const catalog = await fetchCatalog();
      set({ settings: { ...EMPTY_SITE_SETTINGS, ...catalog.settings }, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: message(error, 'Could not load site settings.') });
    }
  },

  save: async (patch) => {
    set({ isSyncing: true, error: null });
    try {
      const { settings } = await patchSettings(patch);
      set({ settings: { ...EMPTY_SITE_SETTINGS, ...settings }, isSyncing: false });
    } catch (error) {
      set({ isSyncing: false, error: message(error, 'Could not save site settings.') });
      throw error;
    }
  },

  reset: async () => {
    set({ isSyncing: true, error: null });
    try {
      const { settings } = await resetSettings();
      set({ settings: { ...EMPTY_SITE_SETTINGS, ...settings }, isSyncing: false });
    } catch (error) {
      set({ isSyncing: false, error: message(error, 'Could not reset site settings.') });
      throw error;
    }
  },
}));
