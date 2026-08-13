import React, { createContext, useContext } from 'react';
import { Toast, useToast } from './shared/Toast';

interface AdminToastValue {
  notify: (message: string) => void;
  fail: (message: string) => void;
}

const AdminToastContext = createContext<AdminToastValue | null>(null);

/**
 * One toast slot for the whole admin area, mounted by the layout so a message
 * raised on any page survives navigation to another one.
 */
export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast, notify, fail } = useToast();

  return (
    <AdminToastContext.Provider value={{ notify, fail }}>
      <Toast toast={toast} />
      {children}
    </AdminToastContext.Provider>
  );
};

export const useAdminToast = (): AdminToastValue => {
  const value = useContext(AdminToastContext);
  if (!value) throw new Error('useAdminToast must be used inside AdminToastProvider');
  return value;
};
