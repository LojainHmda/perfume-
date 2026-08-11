export interface FragranceNote {
  name: string;
  type: 'top' | 'heart' | 'base';
  description: string;
  ingredientIcon?: string;
}

export interface GridPanelData {
  id: string;
  title: string;
  subtitle: string;
  category: 'Ingredient' | 'Fragrance Note' | 'Emotion' | 'Inspiration';
  description: string;
  videoType: 'ruby_essence' | 'liquid_amber' | 'noir_ripples' | 'chess_monochrome' | 'white_velvet' | 'golden_suede' | 'crimson_smoke' | 'raw_honey';
  overlayQuote: string;
}

export interface MediaPanelConfig {
  id: string;
  title: string;
  subtitle: string;
  image: string; // URL or base64 string
  videoUrl?: string; // Optional direct video URL or base64
}

export interface Fragrance {
  id: string;
  name: string;
  subtitle: string;
  collection: string;
  tagline: string;
  price50ml: number;
  price100ml: number;
  image: string;
  colorTheme: string; // hex accent
  accentGlow: string;
  bgGradient: string;
  description: string;
  story: string;
  inspiration: string;
  mood: string;
  seasonality: string[];
  longevity: string; // e.g., '12+ Hours'
  sillage: string; // e.g., 'Intense Enveloping'
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  gridPanels: [GridPanelData, GridPanelData, GridPanelData, GridPanelData];
  engravingAvailable: boolean;
  sampleAvailable: boolean;
  mediaPanels?: MediaPanelConfig[];
}

export interface CartItem {
  fragrance: Fragrance;
  size: '50ml' | '100ml';
  price: number;
  quantity: number;
  engravingText?: string;
}
