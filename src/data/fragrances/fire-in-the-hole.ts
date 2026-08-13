import { Fragrance } from '../../types/fragrance';
import { BOTTLES } from '../assets';

export const fireInTheHole: Fragrance = {
  id: 'fire-in-the-hole',
  name: 'Fire in the Hole',
  subtitle: 'CHECKMATE',
  collection: 'The Grandmaster Series',
  moveNotation: '02 · F5',
  chapterQuote: 'Heat arrives first.',
  concentration: 'Extrait de Parfum',
  presentation: 'float',
  tagline: 'A detonation of black pepper, smouldering incense, and molten amber.',
  price50ml: 230,
  price100ml: 360,
  image: BOTTLES.fireInTheHole,
  colorTheme: '#C1440E',
  accentGlow: 'rgba(193, 68, 14, 0.4)',
  bgGradient: 'from-black via-[#140803] to-[#0a0301]',
  description:
    'A fragrance built on controlled combustion. Fire in the Hole opens on a blast of crushed black pepper and pink chili, settling into a smouldering heart of frankincense and charred cedar before a molten amber base takes hold.',
  story:
    'Named for the split second before the fuse reaches its end. Housed in the obsidian Grandmaster silhouette, it turns heat into strategy—loud on arrival, calculated in the drydown.',
  inspiration: 'Gunpowder smoke drifting over a polished black chess piece under a single hard spotlight.',
  mood: 'Explosive, Commanding, Spiced, Unapologetic',
  seasonality: ['Autumn', 'Winter', 'Nocturnal Evenings'],
  longevity: '12+ Hours (Haute Concentration)',
  sillage: 'Radiant & Combustive',
  topNotes: ['Crushed Black Pepper', 'Pink Chili Accord', 'Blood Orange Zest'],
  heartNotes: ['Somali Frankincense', 'Charred Cedarwood', 'Smoked Cardamom'],
  baseNotes: ['Molten Amber', 'Burnt Tonka Bean', 'Black Leather Musk'],
  gridPanels: [
    {
      id: 'panel-1',
      title: 'Crushed Black Pepper',
      subtitle: 'The Ignition',
      category: 'Ingredient',
      description:
        'Malabar peppercorns cracked at the moment of blending, releasing a dry volatile heat that hits before anything else.',
      videoType: 'crimson_smoke',
      overlayQuote: 'Heat arrives first.',
    },
    {
      id: 'panel-2',
      title: 'Somali Frankincense',
      subtitle: 'The Smouldering Heart',
      category: 'Fragrance Note',
      description:
        'Hand-tapped resin tears burned low and slow, lending a sacred smoke that carries the spice without dulling it.',
      videoType: 'noir_ripples',
      overlayQuote: 'Smoke that refuses to clear.',
    },
    {
      id: 'panel-3',
      title: 'Controlled Detonation',
      subtitle: 'The Psychological State',
      category: 'Emotion',
      description:
        'The composure of knowing exactly when to strike—and holding the match a beat longer than anyone expects.',
      videoType: 'ruby_essence',
      overlayQuote: 'Power is timing.',
    },
    {
      id: 'panel-4',
      title: 'Obsidian Grandmaster',
      subtitle: 'The Aesthetic Vision',
      category: 'Inspiration',
      description:
        'The lacquered black vessel absorbing every point of light, gold lettering the only thing permitted to shine.',
      videoType: 'chess_monochrome',
      overlayQuote: 'Checkmate.',
    },
  ],
  engravingAvailable: true,
  sampleAvailable: true,
};
