import { Fragrance } from '../../types/fragrance';
import { BOTTLES } from '../assets';

export const danceWithTheDevil: Fragrance = {
  id: 'dance-with-the-devil',
  name: 'Dance with the Devil',
  subtitle: 'CHECKMATE',
  collection: 'The Grandmaster Series',
  moveNotation: '01 · E4',
  chapterQuote: 'Indulgence at first contact.',
  concentration: 'Extrait de Parfum',
  presentation: 'float',
  tagline: 'A provocative game of dark cherry, smoked oud, and forbidden velvet.',
  price50ml: 240,
  price100ml: 380,
  image: BOTTLES.danceWithTheDevil,
  colorTheme: '#8B0000',
  accentGlow: 'rgba(139, 0, 0, 0.4)',
  bgGradient: 'from-black via-[#120406] to-[#0a0002]',
  description:
    'An unapologetic olfactory masterpiece designed for those who command the room. Dance with the Devil opens with an intoxicating rush of black cherry drenched in vintage cognac, descending into a dark heart of smoked patchouli and velvet suede.',
  story:
    'Born from a midnight challenge in an underground Parisian parlor, this fragrance defies traditional perfumery rules. It couples sweet sin with deep woody authority, creating an intoxicating trail that lingers like a tactical checkmate.',
  inspiration:
    'The thrill of high-stakes tension; the shadow cast by an obsidian chess piece beneath a single spotlight.',
  mood: 'Seductive, Dominant, Mysterious, Unforgettable',
  seasonality: ['Autumn', 'Winter', 'Nocturnal Evenings'],
  longevity: '14+ Hours (Haute Concentration)',
  sillage: 'Enveloping & Hypnotic',
  topNotes: ['Black Cherry Liquer', 'Crushed Pink Pepper', 'Vintage Cognac Accord'],
  heartNotes: ['Smoked Oud Wood', 'Turkish Rose Absolute', 'Midnight Patchouli'],
  baseNotes: ['Bourbon Vanilla Bean', 'Raw Leather', 'Smoked Amber & Musk'],
  gridPanels: [
    {
      id: 'panel-1',
      title: 'Dark Cherry & Cognac',
      subtitle: 'The Seductive Opening',
      category: 'Ingredient',
      description:
        'Hand-harvested dark cherries soaked in aged French oak cognac barrels, yielding a rich liquorice sweetness.',
      videoType: 'ruby_essence',
      overlayQuote: 'Indulgence at first contact.',
    },
    {
      id: 'panel-2',
      title: 'Smoked Oud Bark',
      subtitle: 'The Olfactory Spine',
      category: 'Fragrance Note',
      description:
        'A rare 30-year wild Cambodian oud resin, slowly steam-distilled to extract intense woody warmth.',
      videoType: 'crimson_smoke',
      overlayQuote: 'Uncompromising strength.',
    },
    {
      id: 'panel-3',
      title: 'Tactical Temptation',
      subtitle: 'The Psychological State',
      category: 'Emotion',
      description: 'The electrifying quiet right before making the final decisive move on the board.',
      videoType: 'noir_ripples',
      overlayQuote: 'Control is the ultimate aphrodisiac.',
    },
    {
      id: 'panel-4',
      title: 'Midnight Checkmate',
      subtitle: 'The Aesthetic Vision',
      category: 'Inspiration',
      description:
        'Obsidian ceramic reflection under dim spotlighting, celebrating bold rebellion and quiet triumph.',
      videoType: 'chess_monochrome',
      overlayQuote: 'Checkmate.',
    },
  ],
  engravingAvailable: true,
  sampleAvailable: true,
};
