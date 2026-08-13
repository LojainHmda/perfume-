import { useEffect } from 'react';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useProductStore } from '../store/useProductStore';
import { useSettingsStore } from '../store/useSettingsStore';

/**
 * One place where the app asks the server what to render: the catalogue, the
 * site settings, and whether a stored admin token is still good for a session.
 * Called once from App so no page has to think about loading.
 */
export const useBootstrapContent = (): void => {
  const loadProducts = useProductStore((state) => state.load);
  const loadSettings = useSettingsStore((state) => state.load);
  const hydrateAuth = useAdminAuthStore((state) => state.hydrate);

  useEffect(() => {
    void loadProducts();
    void loadSettings();
    void hydrateAuth();
  }, [loadProducts, loadSettings, hydrateAuth]);
};
