import { Fragrance } from '../../types/fragrance';

/**
 * The starting point for "Add product".
 *
 * Media fields are deliberately empty: the four panels fall back to the
 * generated reels until the admin uploads films, so a brand-new product is
 * presentable before a single asset is attached.
 */
export const createBlankProduct = (): Fragrance => {
  const id = `fragrance-${Date.now().toString(36)}`;

  return {
    id,
    name: 'New Fragrance',
    subtitle: 'HAUTE ATELIER',
    collection: 'Private Reserve',
    moveNotation: '',
    concentration: 'Extrait de Parfum',
    presentation: 'float',
    tagline: 'An exclusive composition from the atelier.',
    price50ml: 180,
    price100ml: 290,
    image: '',
    colorTheme: '#D4AF37',
    accentGlow: 'rgba(212, 175, 55, 0.4)',
    bgGradient: 'from-black via-[#111] to-[#050505]',
    description: 'A bespoke scent blended with rare botanicals and rich amber accords.',
    story: 'Crafted for collectors seeking a signature no one else wears.',
    inspiration: 'Subtle elegance and modern luxury in equilibrium.',
    mood: 'Sophisticated & Memorable',
    seasonality: ['All Seasons'],
    longevity: '12+ Hours',
    sillage: 'Refined Sillage',
    topNotes: ['Bergamot', 'Saffron'],
    heartNotes: ['Jasmine', 'Amber'],
    baseNotes: ['Sandalwood', 'Musk'],
    gridPanels: [
      {
        id: `${id}-p1`,
        title: 'Botanical Distillation',
        subtitle: 'Scenario 01',
        category: 'Ingredient',
        description: 'Extract of rare flowers, drawn slowly.',
        videoType: 'ruby_essence',
        overlayQuote: 'Purity in every drop',
      },
      {
        id: `${id}-p2`,
        title: 'Atelier Process',
        subtitle: 'Scenario 02',
        category: 'Fragrance Note',
        description: 'Hand blended in small batches.',
        videoType: 'crimson_smoke',
        overlayQuote: 'Craftsmanship',
      },
      {
        id: `${id}-p3`,
        title: 'Velvet Accord',
        subtitle: 'Scenario 03',
        category: 'Emotion',
        description: 'Smooth warmth held on skin.',
        videoType: 'noir_ripples',
        overlayQuote: 'Timeless luxury',
      },
      {
        id: `${id}-p4`,
        title: 'The Bottle Exhibit',
        subtitle: 'Scenario 04',
        category: 'Inspiration',
        description: 'Hand polished glass vessel.',
        videoType: 'chess_monochrome',
        overlayQuote: 'Haute Parfumerie',
      },
    ],
    engravingAvailable: true,
    sampleAvailable: true,
    mediaPanels: [],
  };
};
