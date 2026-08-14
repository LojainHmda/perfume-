/**
 * Storefront-wide settings the admin can override.
 *
 * Every field is nullable on purpose: `null` means "no override — use what the
 * site ships with". That is what keeps the built-in hero plate and copy in
 * place until an admin deliberately replaces them.
 *
 * The shape is flat, one key per editable value, because the server sanitises
 * by key and the persisted store is a plain object. What each key *means* — the
 * section it belongs to, its label, its shipped default — lives in the section
 * registry (`src/data/sections.ts`), which is the single place a section is
 * described. This file stays the vocabulary; the registry is the grammar.
 */

/**
 * One entry in an ordered media track.
 *
 * The id is the reorder handle — array position alone would make React remount
 * a row every time it moves, losing the upload in flight.
 *
 * The copy fields are optional because two kinds of track share this shape: a
 * plain `slides` track is photographs only, while a `cards` track sets an
 * overline and a title over each plate. Keeping one type means one editor
 * component and one server sanitiser serve both.
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
  /** Small line above the title. `cards` tracks only. */
  eyebrow?: string | null;
  /** Display title set over the plate. `cards` tracks only. */
  title?: string | null;
  /**
   * Explicit destination, for entries that open something other than a
   * product — an editorial page, say. `productId` wins when both are set.
   */
  href?: string | null;
}

export interface SiteSettings {
  // ---- Hero ----
  /** Replacement hero still. URL (usually /uploads/…) or null for the default plate. */
  heroImage: string | null;
  /** Optional hero film. When set it plays over the still. */
  heroVideo: string | null;
  /** Copy overrides for the hero block. Null falls back to the feature product. */
  heroEyebrow: string | null;
  heroHeadline: string | null;
  heroTagline: string | null;
  /** The label on the button that hands over to the collection. */
  heroCta: string | null;
  /** The notation strip along the foot of the hero. */
  heroFooterNotes: string[] | null;

  // ---- Compositions (the three seals) ----
  compositionsRevealLabel: string | null;
  compositionsEnterLabel: string | null;

  // ---- Collection filmstrip ----
  /** The collection section's full-bleed ground. Image or film. */
  collectionBackground: string | null;
  /** Copy overrides for the collection section. */
  collectionEyebrow: string | null;
  collectionHeadline: string | null;
  /** The scrolling track. Null keeps the shipped plates; [] hides the track. */
  collectionSlides: MediaSlide[] | null;

  // ---- Manifesto band ----
  manifestoPhrases: string[] | null;

  // ---- Series mosaic ----
  mosaicHeadline: string | null;
  mosaicNotation: string | null;
  mosaicCta: string | null;
  /** Plates for the mosaic tiles, in grid order. */
  mosaicSlides: MediaSlide[] | null;

  // ---- Archive ----
  archiveHeadline: string | null;
  archiveNotation: string | null;
  archiveCta: string | null;
  /** The archive entries — each a plate with an overline, a title and a door. */
  archiveCards: MediaSlide[] | null;

  // ---- Newsletter ----
  newsletterEyebrow: string | null;
  newsletterHeadline: string | null;
  newsletterBody: string | null;
  newsletterPlaceholder: string | null;
  newsletterCta: string | null;

  // ---- Page layout ----
  /**
   * Section ids in the order the home page renders them. Null keeps the
   * shipped order. Ids the registry no longer knows are ignored at render, and
   * registered sections missing from the list are appended in registry order —
   * so a section added in a later release still appears without a re-save.
   */
  sectionOrder: string[] | null;
  /** Section ids the admin has switched off. Null and [] both mean "show all". */
  hiddenSections: string[] | null;
}

/**
 * What each setting holds, so validation is declared once rather than written
 * per key. The server sanitises straight from this map, which means a new
 * setting is one registry field — no route surgery.
 *
 * - `text`   — a trimmed single line, or null when cleared
 * - `media`  — a URL to an image or film
 * - `slides` — an ordered media track (photograph, alt, product link)
 * - `cards`  — a slides track that also carries an overline, title and href
 * - `lines`  — an ordered list of plain strings
 * - `ids`    — an ordered list of section ids, for layout keys
 */
export type SettingKind = 'text' | 'media' | 'slides' | 'cards' | 'lines' | 'ids';

/** Kinds whose value is `MediaSlide[]`. */
export const TRACK_KINDS: SettingKind[] = ['slides', 'cards'];

/** Kinds whose value is `string[]`. */
export const STRING_LIST_KINDS: SettingKind[] = ['lines', 'ids'];

/**
 * Declared here rather than derived from the section registry because the
 * server imports this file, and the registry reaches for `import.meta.env` to
 * build its default asset URLs — which does not exist in Node.
 *
 * The registry asserts at compile time that it describes exactly these keys, so
 * the two cannot drift: add a key here without a registry field, or a field
 * without a key, and the build fails.
 */
export const SETTING_KINDS: Record<keyof SiteSettings, SettingKind> = {
  heroImage: 'media',
  heroVideo: 'media',
  heroEyebrow: 'text',
  heroHeadline: 'text',
  heroTagline: 'text',
  heroCta: 'text',
  heroFooterNotes: 'lines',

  compositionsRevealLabel: 'text',
  compositionsEnterLabel: 'text',

  collectionBackground: 'media',
  collectionEyebrow: 'text',
  collectionHeadline: 'text',
  collectionSlides: 'slides',

  manifestoPhrases: 'lines',

  mosaicHeadline: 'text',
  mosaicNotation: 'text',
  mosaicCta: 'text',
  mosaicSlides: 'slides',

  archiveHeadline: 'text',
  archiveNotation: 'text',
  archiveCta: 'text',
  archiveCards: 'cards',

  newsletterEyebrow: 'text',
  newsletterHeadline: 'text',
  newsletterBody: 'text',
  newsletterPlaceholder: 'text',
  newsletterCta: 'text',

  sectionOrder: 'ids',
  hiddenSections: 'ids',
};

/** Every key null: no overrides at all, which is what a fresh install ships with. */
export const EMPTY_SITE_SETTINGS: SiteSettings = Object.fromEntries(
  (Object.keys(SETTING_KINDS) as (keyof SiteSettings)[]).map((key) => [key, null]),
) as SiteSettings;

/** How many entries one track or list may hold. A payload guard, not a design limit. */
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
