import { create } from 'zustand';
import { loginRequest, logoutRequest, sessionRequest } from '../api/auth';
import { ApiError, getToken } from '../api/client';

/**
 * Admin session state.
 *
 * The server owns the decision — this store only mirrors it. `hydrate()` asks
 * the API whether the stored bearer token is still live, so a refresh inside a
 * valid session lands straight back in the panel.
 */
interface AdminAuthState {
  isAdmin: boolean;
  username: string | null;
  isChecking: boolean;
  hydrate: () => Promise<void>;
  login: (user: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

/** Shown on the login card so a fresh checkout can get in. Override with ADMIN_USER / ADMIN_PASS. */
export const ADMIN_CREDENTIALS = {
  user: 'admin',
  pass: 'admin123',
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  isAdmin: false,
  username: null,
  isChecking: Boolean(getToken()),

  hydrate: async () => {
    if (!getToken()) {
      set({ isAdmin: false, username: null, isChecking: false });
      return;
    }

    set({ isChecking: true });
    try {
      const session = await sessionRequest();
      set({ isAdmin: true, username: session.username, isChecking: false });
    } catch {
      set({ isAdmin: false, username: null, isChecking: false });
    }
  },

  login: async (user, pass) => {
    try {
      const session = await loginRequest(user, pass);
      set({ isAdmin: true, username: session.username, isChecking: false });
      return { success: true, message: 'Welcome to the admin portal.' };
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'Could not reach the server. Is the API running?';
      set({ isAdmin: false, username: null, isChecking: false });
      return { success: false, message };
    }
  },

  logout: async () => {
    await logoutRequest();
    set({ isAdmin: false, username: null, isChecking: false });
  },
}));
