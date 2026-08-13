import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { Fragrance } from '../types/fragrance';
import { CampaignHero } from '../components/hero/CampaignHero';
import { FragranceCompositions } from '../components/showcase/FragranceCompositions';
import { CollectionMosaic } from '../components/showcase/CollectionMosaic';
import { ArchiveDuo } from '../components/showcase/ArchiveDuo';
import { ManifestoBand } from '../components/showcase/ManifestoBand';
import { Newsletter } from '../components/showcase/Newsletter';

/**
 * Maison storefront layout:
 *   campaign frame → three equal fragrance tiles → 60/40 series mosaic →
 *   archive pair → correspondence.
 *
 * The long-form writing for each fragrance lives on its detail page rather than
 * on the home page, so this stays a set of doors rather than an essay.
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProductStore();

  const openFragrance = (fragrance: Fragrance) => navigate(`/fragrance/${fragrance.id}`);
  const scrollToCollection = () =>
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const [feature] = products;

  return (
    <div className="grain w-full bg-obsidian text-porcelain">
      {feature && <CampaignHero feature={feature} onDiscover={scrollToCollection} />}

      <FragranceCompositions fragrances={products} onOpen={openFragrance} />

      <ManifestoBand />

      <CollectionMosaic fragrances={products} />

      <ArchiveDuo fragrances={products} />

      <Newsletter />
    </div>
  );
};
