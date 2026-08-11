import { create } from 'zustand';

const AUTH_KEY = 'bts_admin_auth_v1';

interface AdminAuthState {
  isAdmin: boolean;
  username: string | null;
  login: (user: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  autofillAdminCredentials: () => { user: string; pass: string };
}

export const ADMIN_CREDENTIALS = {
  user: 'admin',
  pass: 'admin123',
};

const getInitialAuth = (): { isAdmin: boolean; username: string | null } => {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isAdmin) {
        return { isAdmin: true, username: parsed.username || 'admin' };
      }
    }
  } catch (e) {
    console.error(e);
  }
  return { isAdmin: false, username: null };
};

export const useAdminAuthStore = create<AdminAuthState>((set) => {
  const initial = getInitialAuth();
  return {
    isAdmin: initial.isAdmin,
    username: initial.username,

    login: (user, pass) => {
      const cleanUser = user.trim().toLowerCase();
      const cleanPass = pass.trim();

      if (
        (cleanUser === 'admin' && (cleanPass === 'admin123' || cleanPass === 'admin')) ||
        (cleanUser === 'manager' && cleanPass === 'admin')
      ) {
        set({ isAdmin: true, username: cleanUser });
        try {
          localStorage.setItem(AUTH_KEY, JSON.stringify({ isAdmin: true, username: cleanUser }));
        } catch (e) {
          console.error(e);
        }
        return { success: true, message: 'Welcome to the Admin Portal' };
      }

      return { success: false, message: 'Invalid Admin Credentials. Please use username: admin / password: admin123' };
    },

    logout: () => {
      set({ isAdmin: false, username: null });
      try {
        localStorage.removeItem(AUTH_KEY);
      } catch (e) {
        console.error(e);
      }
    },

    autofillAdminCredentials: () => {
      return ADMIN_CREDENTIALS;
    },
  };
});
