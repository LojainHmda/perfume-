import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { SECTIONS_BY_ID } from '../../data/sections';
import { SectionPanel } from '../../components/admin/SectionPanel';
import { useAdminToast } from '../../components/admin/AdminToastContext';

/**
 * /admin/section/:sectionId — the editor for whichever section the route names.
 *
 * One page for every section: what used to be a file per surface is now a
 * lookup, so a new registry entry is reachable the moment it is written.
 */
export const SectionSettingsPage: React.FC = () => {
  const { sectionId = '' } = useParams();
  const { notify, fail } = useAdminToast();
  const section = SECTIONS_BY_ID[sectionId];

  // A stale bookmark to a section that no longer exists lands on the overview
  // rather than on an empty frame.
  if (!section) return <Navigate to="/admin" replace />;

  return <SectionPanel key={section.id} section={section} notify={notify} fail={fail} />;
};
