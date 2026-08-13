import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Fragrance } from '../types/fragrance';
import {
  DEFAULT_COLLECTION_BACKGROUND,
  DEFAULT_COLLECTION_EYEBROW,
  DEFAULT_COLLECTION_HEADLINE,
  DEFAULT_COLLECTION_SLIDES,
} from '../data/collection';
import { CampaignHero } from '../components/hero/CampaignHero';
import { CollectionFilmstrip } from '../components/showcase/CollectionFilmstrip';
import { FragranceCompositions } from '../components/showcase/FragranceCompositions';
import { CollectionMosaic } from '../components/showcase/CollectionMosaic';
import { ArchiveDuo } from '../components/showcase/ArchiveDuo';
import { ManifestoBand } from '../components/showcase/ManifestoBand';
import { Newsletter } from '../components/showcase/Newsletter';

/**
 * Maison storefront layout:
 *   campaign frame → three equal fragrance tiles → collection frame →
 *   60/40 series mosaic → archive pair → correspondence.
 *
 * The long-form writing for each fragrance lives on its detail page rather than
 * on the home page, so this stays a set of doors rather than an essay.
 */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProductStore();
  const settings = useSettingsStore((state) => state.settings);

  // Each field falls back on its own, so an admin can replace the ground
  // without touching the plates, or the plates without touching the words.
  const collection = {
    background: settings.collectionBackground || DEFAULT_COLLECTION_BACKGROUND,
    eyebrow: settings.collectionEyebrow || DEFAULT_COLLECTION_EYEBROW,
    headline: settings.collectionHeadline || DEFAULT_COLLECTION_HEADLINE,
    slides: settings.collectionSlides ?? DEFAULT_COLLECTION_SLIDES,
  };

  const openFragrance = (fragrance: Fragrance) => navigate(`/fragrance/${fragrance.id}`);
  const scrollToCollection = () =>
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const [feature] = products;

  return (
    <div className="grain w-full bg-obsidian text-porcelain">
      {feature && <CampaignHero feature={feature} onDiscover={scrollToCollection} />}

      <FragranceCompositions fragrances={products} onOpen={openFragrance} />

      {/* Sits below the seals rather than above them, so the two never compete. */}
      <CollectionFilmstrip {...collection} products={products} />

      <ManifestoBand />

      <CollectionMosaic fragrances={products} />

      <ArchiveDuo fragrances={products} />

      <Newsletter />
    </div>
  );
};
