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

/**
 * One tile of the product page's four-panel grid.
 *
 * Everything past `id` is an override. When a panel carries no `videoUrl` and
 * no `image`, the grid falls back to the generated atmosphere for that panel's
 * `videoType` — the canvas reels the site ships with. So an admin who uploads
 * one film replaces one tile, and the other three keep their defaults.
 */
export interface MediaPanelConfig {
  id: string;
  title?: string;
  subtitle?: string;
  /** Still image URL (served from /uploads/… once an admin uploads one). */
  image?: string;
  /** Film URL. Takes precedence over `image` when both are set. */
  videoUrl?: string;
  /** Poster frame shown while the film loads. */
  posterUrl?: string;
}

export interface Fragrance {
  id: string;
  name: string;
  subtitle: string;
  collection: string;
  /** Chess move notation used as the chapter index across the storefront, e.g. "01 · E4". */
  moveNotation?: string;
  /** Editorial one-liner used as the chapter's oversized pull quote. */
  chapterQuote?: string;
  /** Concentration label, e.g. "Extrait de Parfum". */
  concentration?: string;
  /**
   * How the bottle photograph should be composited in the showcase.
   * "float" — a pre-knocked-out cut-out, so the bottle floats in space.
   * "plate" — the photograph is used whole, as a full-bleed cinematic still.
   */
  presentation?: 'float' | 'plate';
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
