import React from 'react';
import { CollectionSettingsPanel } from '../../components/admin/CollectionSettingsPanel';
import { useAdminToast } from '../../components/admin/AdminToastContext';

/** /admin/collection — the home page collection frame, and nothing else. */
export const CollectionSettingsPage: React.FC = () => {
  const { notify, fail } = useAdminToast();
  return <CollectionSettingsPanel notify={notify} fail={fail} />;
};
