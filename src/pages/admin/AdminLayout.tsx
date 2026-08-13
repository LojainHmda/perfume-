import React from 'react';
import { Outlet } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { AdminHeaderBar } from '../../components/admin/AdminHeaderBar';
import { AdminLoginCard } from '../../components/admin/AdminLoginCard';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminToastProvider, useAdminToast } from '../../components/admin/AdminToastContext';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';
import { useProductStore } from '../../store/useProductStore';
import { useSettingsStore } from '../../store/useSettingsStore';

/**
 * The shell every admin page renders inside: the session gate, the header
 * actions, the sidebar and one shared toast. Each feature — hero, products,
 * media — is its own route underneath, so nothing on this page knows what any
 * other page does.
 */
const AdminShell: React.FC = () => {
  const { username, logout } = useAdminAuthStore();
  const { resetToDefaults, isSyncing, error } = useProductStore();
  const resetSettings = useSettingsStore((state) => state.reset);
  const { notify, fail } = useAdminToast();

  const handleResetAll = async () => {
    if (!window.confirm('Restore the shipped catalogue and clear every hero override?')) return;
    try {
      await resetToDefaults();
      await resetSettings();
      notify('Catalogue and hero restored to defaults.');
    } catch (resetError) {
      fail(resetError instanceof Error ? resetError.message : 'Reset failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] px-4 pb-16 pt-20 font-sans text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminHeaderBar
          username={username}
          isSyncing={isSyncing}
          onReset={() => void handleResetAll()}
          onLogout={() => void logout()}
        />

        {error && (
          <p className="flex items-center gap-2 rounded-xl border border-red-900/60 bg-red-950/40 p-3 text-xs text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          <AdminSidebar />
          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const { isAdmin, isChecking } = useAdminAuthStore();

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070708] text-zinc-400">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <AdminToastProvider>
      {isAdmin ? <AdminShell /> : <LoginGate />}
    </AdminToastProvider>
  );
};

/** Separated so the login card can raise its own toast on success. */
const LoginGate: React.FC = () => {
  const { notify } = useAdminToast();
  return <AdminLoginCard onAuthenticated={notify} />;
};
