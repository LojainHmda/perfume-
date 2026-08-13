/**
 * Storefront-wide settings the admin can override.
 *
 * Every field is nullable on purpose: `null` means "no override — use what the
 * site ships with". That is what keeps the built-in hero plate and copy in
 * place until an admin deliberately replaces them.
 */

/**
 * One image in an ordered media track.
 *
 * The id is the reorder handle — array position alone would make React remount
 * a row every time it moves, losing the upload in flight.
 */
export interface MediaSlide {
  id: string;
  /** URL (usually /uploads/…). A slide with no src is dropped on save. */
  src: string;
  /** Alternative text. Null falls back to the linked product's name. */
  alt: string | null;
  /**
   * The catalogue entry this slide opens. Null leaves the slide inert —
   * a picture rather than a door. Set independently of the image, so an admin
   * can re-shoot a plate without re-pointing it, or re-point it without
   * re-shooting.
   */
  productId: string | null;
}

export interface SiteSettings {
  /** Replacement hero still. URL (usually /uploads/…) or null for the default plate. */
  heroImage: string | null;
  /** Optional hero film. When set it plays over the still. */
  heroVideo: string | null;
  /** Copy overrides for the hero block. Null falls back to the feature product. */
  heroEyebrow: string | null;
  heroHeadline: string | null;
  heroTagline: string | null;

  /** The collection section's full-bleed ground. Image or film. */
  collectionBackground: string | null;
  /** Copy overrides for the collection section. */
  collectionEyebrow: string | null;
  collectionHeadline: string | null;
  /** The scrolling track. Null keeps the shipped plates; [] hides the track. */
  collectionSlides: MediaSlide[] | null;
}

/**
 * What each setting holds, so validation is declared once rather than written
 * per key. The server sanitises straight from this map, which means a new
 * setting is one entry here plus one field above — no route surgery.
 */
export type SettingKind = 'text' | 'media' | 'slides';

export const SETTING_KINDS: Record<keyof SiteSettings, SettingKind> = {
  heroImage: 'media',
  heroVideo: 'media',
  heroEyebrow: 'text',
  heroHeadline: 'text',
  heroTagline: 'text',
  collectionBackground: 'media',
  collectionEyebrow: 'text',
  collectionHeadline: 'text',
  collectionSlides: 'slides',
};

export const EMPTY_SITE_SETTINGS: SiteSettings = {
  heroImage: null,
  heroVideo: null,
  heroEyebrow: null,
  heroHeadline: null,
  heroTagline: null,
  collectionBackground: null,
  collectionEyebrow: null,
  collectionHeadline: null,
  collectionSlides: null,
};

/** How many slides one track may hold. A guard on payload size, not a design limit. */
export const MAX_SLIDES = 24;

let slideCounter = 0;

/** Ids only have to be unique within a track, so a counter beats a uuid here. */
export const createSlide = (
  src = '',
  alt: string | null = null,
  productId: string | null = null,
): MediaSlide => ({
  id: `slide-${Date.now().toString(36)}-${(slideCounter += 1).toString(36)}`,
  src,
  alt,
  productId,
});
