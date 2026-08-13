import React from 'react';
import { DetailsTab } from '../../../components/admin/editor/DetailsTab';
import { ImageTab } from '../../../components/admin/editor/ImageTab';
import { MediaTab } from '../../../components/admin/editor/MediaTab';
import { PricingTab } from '../../../components/admin/editor/PricingTab';
import { useProductEditor } from './ProductEditorPage';

/**
 * The four sections of the product editor, each mounted at its own route.
 * They are thin on purpose: the forms themselves live in components/admin/editor
 * so they stay reusable and this file only binds them to the draft.
 */

export const ProductDetailsSection: React.FC = () => {
  const { draft, isNew, patch } = useProductEditor();
  return <DetailsTab product={draft} isNew={isNew} onChange={patch} />;
};

export const ProductPricingSection: React.FC = () => {
  const { draft, patch } = useProductEditor();
  return <PricingTab product={draft} onChange={patch} />;
};

export const ProductImageSection: React.FC = () => {
  const { draft, patch, fail } = useProductEditor();
  return <ImageTab product={draft} onChange={patch} fail={fail} />;
};

export const ProductFilmsSection: React.FC = () => {
  const { draft, patch, fail } = useProductEditor();
  return <MediaTab product={draft} onChange={patch} fail={fail} />;
};
