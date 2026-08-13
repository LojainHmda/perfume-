import { Fragrance } from '../../types/fragrance';
import { BOTTLES } from '../assets';

export const fireInTheHoleII: Fragrance = {
  id: 'fire-in-the-hole-2',
  name: 'Fire in the Hole II',
  subtitle: 'CHECKMATE 2',
  collection: 'The Grandmaster Series',
  moveNotation: '03 · G7',
  chapterQuote: 'Warmth without weakness.',
  concentration: 'Extrait de Parfum',
  presentation: 'float',
  tagline: 'The second move—warm saffron, golden resin, and polished suede.',
  price50ml: 250,
  price100ml: 395,
  image: BOTTLES.fireInTheHoleII,
  colorTheme: '#D4AF37',
  accentGlow: 'rgba(212, 175, 55, 0.4)',
  bgGradient: 'from-black via-[#12100a] to-[#080703]',
  description:
    'The counterpart composition. Where the first burns, the second glows: saffron and toasted nutmeg over a golden resin heart, finished with polished suede and a long amber trail.',
  story:
    'A sequel written in warmer ink. Same obsidian silhouette, softer light—the follow-up move made once the board has already been claimed.',
  inspiration: 'The same black bottle photographed against pale studio light, casting one long deliberate shadow.',
  mood: 'Warm, Refined, Assured, Magnetic',
  seasonality: ['Autumn', 'Winter', 'All Seasons'],
  longevity: '14+ Hours (Haute Concentration)',
  sillage: 'Warm & Enveloping',
  topNotes: ['Persian Saffron', 'Toasted Nutmeg', 'Bergamot Rind'],
  heartNotes: ['Golden Labdanum', 'Orris Butter', 'Honeyed Tobacco Leaf'],
  baseNotes: ['Polished Suede', 'Amber Resin', 'Cashmere Woods'],
  gridPanels: [
    {
      id: 'panel-1',
      title: 'Persian Saffron',
      subtitle: 'The Golden Opening',
      category: 'Ingredient',
      description:
        'Hand-picked threads yielding a leathery warmth worth more per gram than the gold on the bottle.',
      videoType: 'golden_suede',
      overlayQuote: 'Worth its weight.',
    },
    {
      id: 'panel-2',
      title: 'Honeyed Tobacco Leaf',
      subtitle: 'The Amber Core',
      category: 'Fragrance Note',
      description:
        'Cured leaf steeped in raw honey and labdanum, giving the composition its slow golden burn.',
      videoType: 'raw_honey',
      overlayQuote: 'Warmth without weakness.',
    },
    {
      id: 'panel-3',
      title: 'The Second Move',
      subtitle: 'The Psychological State',
      category: 'Emotion',
      description:
        'Confidence after the fact—no need to raise your voice when the position is already won.',
      videoType: 'white_velvet',
      overlayQuote: 'Quiet after the strike.',
    },
    {
      id: 'panel-4',
      title: 'Light on Obsidian',
      subtitle: 'The Aesthetic Vision',
      category: 'Inspiration',
      description: 'A pale studio backdrop turning the black vessel into pure sculpted contour and shadow.',
      videoType: 'chess_monochrome',
      overlayQuote: 'Checkmate.',
    },
  ],
  engravingAvailable: true,
  sampleAvailable: true,
};
