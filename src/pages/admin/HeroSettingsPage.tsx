import React from 'react';
import { HeroSettingsPanel } from '../../components/admin/HeroSettingsPanel';
import { useAdminToast } from '../../components/admin/AdminToastContext';

/** /admin/hero — the home page campaign frame, and nothing else. */
export const HeroSettingsPage: React.FC = () => {
  const { notify, fail } = useAdminToast();
  return <HeroSettingsPanel notify={notify} fail={fail} />;
};
