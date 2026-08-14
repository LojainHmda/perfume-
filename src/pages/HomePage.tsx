import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { Fragrance } from '../types/fragrance';
import { SiteContent, useSectionLayout, useSiteContent } from '../hooks/useSiteContent';
import { CampaignHero } from '../components/hero/CampaignHero';
import { CollectionFilmstrip } from '../components/showcase/CollectionFilmstrip';
import { FragranceCompositions } from '../components/showcase/FragranceCompositions';
import { CollectionMosaic } from '../components/showcase/CollectionMosaic';
import { ArchiveDuo } from '../components/showcase/ArchiveDuo';
import { ManifestoBand } from '../components/showcase/ManifestoBand';
import { Newsletter } from '../components/showcase/Newsletter';

/**
 * Maison storefront layout.
 *
 * The page no longer states its own running order: it renders whatever the
 * admin's saved layout resolves to, and each section is handed content read
 * through the same registry the editor writes. Adding a section is a registry
 * entry plus a renderer below — the page itself does not change.
 *
 * The long-form writing for each fragrance lives on its detail page rather than
 * on the home page, so this stays a set of doors rather than an essay.
 */
interface SectionViewProps {
  content: SiteContent;
  products: Fragrance[];
  openFragrance: (fragrance: Fragrance) => void;
  scrollToCompositions: () => void;
}

/**
 * Section id to the thing that draws it.
 *
 * Every renderer takes the same bag and pulls what it needs, so the map stays a
 * lookup rather than a switch with a growing list of props threaded through it.
 * A section described in the registry with no renderer here simply does not
 * draw, which is the right failure: it is visible and editable in the admin
 * while its component is still being built.
 */
const SECTION_VIEWS: Record<string, React.FC<SectionViewProps>> = {
  hero: ({ content, products, scrollToCompositions }) => {
    const [feature] = products;
    if (!feature) return null;
    return <CampaignHero feature={feature} content={content} onDiscover={scrollToCompositions} />;
  },

  compositions: ({ content, products, openFragrance }) => (
    <FragranceCompositions
      fragrances={products}
      onOpen={openFragrance}
      revealLabel={content.text('compositionsRevealLabel')}
      enterLabel={content.text('compositionsEnterLabel')}
    />
  ),

  filmstrip: ({ content, products }) => (
    <CollectionFilmstrip
      background={content.text('collectionBackground')}
      eyebrow={content.text('collectionEyebrow')}
      headline={content.text('collectionHeadline')}
      slides={content.track('collectionSlides')}
      products={products}
    />
  ),

  manifesto: ({ content }) => <ManifestoBand phrases={content.lines('manifestoPhrases')} />,

  mosaic: ({ content, products }) => (
    <CollectionMosaic
      fragrances={products}
      headline={content.text('mosaicHeadline')}
      notation={content.text('mosaicNotation')}
      cta={content.text('mosaicCta')}
      slides={content.track('mosaicSlides')}
    />
  ),

  archive: ({ content, products }) => (
    <ArchiveDuo
      fragrances={products}
      headline={content.text('archiveHeadline')}
      notation={content.text('archiveNotation')}
      cta={content.text('archiveCta')}
      cards={content.track('archiveCards')}
    />
  ),

  newsletter: ({ content }) => (
    <Newsletter
      eyebrow={content.text('newsletterEyebrow')}
      headline={content.text('newsletterHeadline')}
      body={content.text('newsletterBody')}
      placeholder={content.text('newsletterPlaceholder')}
      cta={content.text('newsletterCta')}
    />
  ),
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useProductStore();
  const content = useSiteContent();
  const layout = useSectionLayout();

  const openFragrance = (fragrance: Fragrance) => navigate(`/fragrance/${fragrance.id}`);
  const scrollToCompositions = () =>
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const props: SectionViewProps = { content, products, openFragrance, scrollToCompositions };

  return (
    <div className="grain w-full bg-obsidian text-porcelain">
      {layout.map((section) => {
        const View = SECTION_VIEWS[section.id];
        return View ? <View key={section.id} {...props} /> : null;
      })}
    </div>
  );
};
