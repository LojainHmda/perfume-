import { Fragrance } from '../types/fragrance';
import bottleDanceDevil from '../assets/images/Screenshot 2026-08-04 082232.png';
import bottleBombshellSeduction from '../assets/images/Screenshot 2026-08-06 202940.png';
import bottleFrenchVanilla from '../assets/images/Screenshot 2026-08-06 203008.png';
import luxuryBoxIsolatedClosed from '../assets/images/lumiere_box_closed_exact_dim_1785955683764.jpg';
import luxuryBoxIsolatedOpen from '../assets/images/lumiere_box_open_velvet_1785955493665.jpg';
import horizontalBoxClosed from '../assets/images/horizontal_box_closed_1785855198110.jpg';
import horizontalBoxOpen from '../assets/images/horizontal_box_open_1785855211749.jpg';
import waxSealGold from '../assets/images/wax_seal_gold_1785690745616.jpg';

import discoveryGloveBottle from '../assets/images/discovery_glove_bottle_1785956116942.jpg';
import discoveryAppleBottle from '../assets/images/discovery_apple_bottle_1785956129374.jpg';
import discoveryHoneyBottle from '../assets/images/discovery_honey_bottle_1785956141749.jpg';
import discoveryWineBottle from '../assets/images/discovery_wine_bottle_1785956154381.jpg';

export const ASSETS = {
  boxClosed: luxuryBoxIsolatedClosed,
  boxSpotlightClosed: luxuryBoxIsolatedClosed,
  boxFrontClosed: luxuryBoxIsolatedClosed,
  boxFrontOpen: luxuryBoxIsolatedOpen,
  boxRealOpen: luxuryBoxIsolatedOpen,
  boxIsolatedClosed: luxuryBoxIsolatedClosed,
  boxIsolatedOpen: luxuryBoxIsolatedOpen,
  waxSeal: waxSealGold,
  bottleDanceDevil: bottleDanceDevil,
  bottleBombshellSeduction: bottleBombshellSeduction,
  bottleFrenchVanilla: bottleFrenchVanilla,
  discoveryGloveBottle,
  discoveryAppleBottle,
  discoveryHoneyBottle,
  discoveryWineBottle,
};

export const FRAGRANCES: Fragrance[] = [
  {
    id: 'dance-with-the-devil',
    name: 'Dance with the Devil',
    subtitle: 'CHECKMATE',
    collection: 'The Grandmaster Series',
    tagline: 'A provocative game of dark cherry, smoked oud, and forbidden velvet.',
    price50ml: 240,
    price100ml: 380,
    image: bottleDanceDevil,
    colorTheme: '#8B0000',
    accentGlow: 'rgba(139, 0, 0, 0.4)',
    bgGradient: 'from-black via-[#120406] to-[#0a0002]',
    description: 'An unapologetic olfactory masterpiece designed for those who command the room. Dance with the Devil opens with an intoxicating rush of black cherry drenched in vintage cognac, descending into a dark heart of smoked patchouli and velvet suede.',
    story: 'Born from a midnight challenge in an underground Parisian parlor, this fragrance defies traditional perfumery rules. It couples sweet sin with deep woody authority, creating an intoxicating trail that lingers like a tactical checkmate.',
    inspiration: 'The thrill of high-stakes tension; the shadow cast by an obsidian chess piece beneath a single spotlight.',
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
        description: 'Hand-harvested dark cherries soaked in aged French oak cognac barrels, yielding a rich liquorice sweetness.',
        videoType: 'ruby_essence',
        overlayQuote: 'Indulgence at first contact.'
      },
      {
        id: 'panel-2',
        title: 'Smoked Oud Bark',
        subtitle: 'The Olfactory Spine',
        category: 'Fragrance Note',
        description: 'A rare 30-year wild Cambodian oud resin, slowly steam-distilled to extract intense woody warmth.',
        videoType: 'crimson_smoke',
        overlayQuote: 'Uncompromising strength.'
      },
      {
        id: 'panel-3',
        title: 'Tactical Temptation',
        subtitle: 'The Psychological State',
        category: 'Emotion',
        description: 'The electrifying quiet right before making the final decisive move on the board.',
        videoType: 'noir_ripples',
        overlayQuote: 'Control is the ultimate aphrodisiac.'
      },
      {
        id: 'panel-4',
        title: 'Midnight Checkmate',
        subtitle: 'The Aesthetic Vision',
        category: 'Inspiration',
        description: 'Obsidian ceramic reflection under dim spotlighting, celebrating bold rebellion and quiet triumph.',
        videoType: 'chess_monochrome',
        overlayQuote: 'Born to stand out.'
      }
    ],
    engravingAvailable: true,
    sampleAvailable: true
  },
  {
    id: 'bombshell-seduction',
    name: 'Bombshell Seduction',
    subtitle: 'VICTORIA\'S SECRET',
    collection: 'The Velvet Blossom Series',
    tagline: 'An intoxicating veil of white peony, velvety sage, and sun-kissed skin musk.',
    price50ml: 195,
    price100ml: 295,
    image: bottleBombshellSeduction,
    colorTheme: '#E8B4B8',
    accentGlow: 'rgba(232, 180, 184, 0.4)',
    bgGradient: 'from-[#12080a] via-[#241015] to-[#0d0507]',
    description: 'Bombshell Seduction by Victoria\'s Secret is an alluring floral amber blend wrapped in satin warmth. Delicate white peonies mingle with aromatic French sage and velvet skin musk, creating an effortlessly romantic and sensual signature.',
    story: 'Stripping down to pure floral sensuality—a whispered secret of satin petals, velvety warmth, and magnetic attraction.',
    inspiration: 'A silk robe slipping off sun-warmed skin in a lush blossom garden at dusk.',
    mood: 'Alluring, Romantic, Feminine, Effortless',
    seasonality: ['Spring', 'Summer', 'All Seasons'],
    longevity: '10+ Hours',
    sillage: 'Graceful & Enveloping',
    topNotes: ['White Peony Petals', 'Lush French Sage', 'Sparkling Nectarine'],
    heartNotes: ['Velvet Passionflower', 'Sheer Magnolia', 'Cotton Blossom'],
    baseNotes: ['Skin Musk', 'Warm Amber Resin', 'Creamy Sandalwood'],
    gridPanels: [
      {
        id: 'panel-1',
        title: 'White Peony Blossom',
        subtitle: 'Floral Elegance',
        category: 'Ingredient',
        description: 'Freshly blooming spring peonies imparting a delicate, intoxicating floral sweetness.',
        videoType: 'white_velvet',
        overlayQuote: 'Beauty in full bloom.'
      },
      {
        id: 'panel-2',
        title: 'Aromatic French Sage',
        subtitle: 'Velvety Herbal Accent',
        category: 'Fragrance Note',
        description: 'Wild lavender sage adding a clean, airy sophistication to the warm floral core.',
        videoType: 'golden_suede',
        overlayQuote: 'An effortless whispered charm.'
      },
      {
        id: 'panel-3',
        title: 'Satin & Skin Musk',
        subtitle: 'The Romantic Heat',
        category: 'Emotion',
        description: 'The magnetic warmth of sun-kissed skin wrapped in luxurious pink silk.',
        videoType: 'ruby_essence',
        overlayQuote: 'Seduction without effort.'
      },
      {
        id: 'panel-4',
        title: 'Crystal Rose Facets',
        subtitle: 'Visual Identity',
        category: 'Inspiration',
        description: 'Prismatic pink glass capturing the soft twilight glow of a romantic evening.',
        videoType: 'chess_monochrome',
        overlayQuote: 'Born to stand out.'
      }
    ],
    engravingAvailable: true,
    sampleAvailable: true
  },
  {
    id: 'french-vanilla',
    name: 'French Vanilla',
    subtitle: 'NASEEM PARFUM',
    collection: 'The Golden Concentrated Edition',
    tagline: 'A decadent infusion of rich Madagascar vanilla, whipped caramel, and golden amber.',
    price50ml: 210,
    price100ml: 320,
    image: bottleFrenchVanilla,
    colorTheme: '#E5C158',
    accentGlow: 'rgba(229, 193, 88, 0.4)',
    bgGradient: 'from-[#0f0b03] via-[#261c06] to-[#0a0702]',
    description: 'French Vanilla by Naseem is a pure concentrated non-alcoholic parfum elixir radiating regal warmth. Smooth Madagascar vanilla pod is whipped with salted caramel, white florals, and deeply comforting golden amber.',
    story: 'Crafted in the noble tradition of fine oriental concentrated perfumery, French Vanilla envelopes the wearer in an opulent golden glow.',
    inspiration: 'Molten gold pouring over crushed vanilla bean pods and warm pastries in Paris.',
    mood: 'Warm, Luxurious, Comforting, Irresistible',
    seasonality: ['Autumn', 'Winter', 'Evenings'],
    longevity: '14+ Hours (Pure Concentrated Elixir)',
    sillage: 'Radiant & Gourmand',
    topNotes: ['French Vanilla Cream', 'Toasted Sugar', 'Golden Citrus Zest'],
    heartNotes: ['Salted Butter Caramel', 'White Jasmine Blossom', 'Sweet Almond'],
    baseNotes: ['Madagascar Vanilla Pods', 'Golden Ambergris', 'Silky White Musk'],
    gridPanels: [
      {
        id: 'panel-1',
        title: 'Madagascar Vanilla Pods',
        subtitle: 'Creamy Opulence',
        category: 'Ingredient',
        description: 'Aged Bourbon vanilla pods steeped in warm almond milk and brown sugar.',
        videoType: 'raw_honey',
        overlayQuote: 'Pure gourmand indulgence.'
      },
      {
        id: 'panel-2',
        title: 'Whipped Salted Caramel',
        subtitle: 'Golden Decadence',
        category: 'Fragrance Note',
        description: 'Rich caramel dripping over toasted almonds and velvet white amber.',
        videoType: 'golden_suede',
        overlayQuote: 'Golden warmth that lingers.'
      },
      {
        id: 'panel-3',
        title: 'Regal Euphoria',
        subtitle: 'The Scented Presence',
        category: 'Emotion',
        description: 'An aura of unshakeable confidence and comforting luxury.',
        videoType: 'noir_ripples',
        overlayQuote: 'Crown yourself in gold.'
      },
      {
        id: 'panel-4',
        title: 'Golden Vessel',
        subtitle: 'Monolithic Elegance',
        category: 'Inspiration',
        description: 'Sculptural metallic vessel reflecting warm studio lighting.',
        videoType: 'chess_monochrome',
        overlayQuote: 'Excellence in concentrated form.'
      }
    ],
    engravingAvailable: true,
    sampleAvailable: true
  }
];
