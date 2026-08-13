/**
 * Storefront-wide settings the admin can override.
 *
 * Every field is nullable on purpose: `null` means "no override — use what the
 * site ships with". That is what keeps the built-in hero plate and copy in
 * place until an admin deliberately replaces them.
 */
export interface SiteSettings {
  /** Replacement hero still. URL (usually /uploads/…) or null for the default plate. */
  heroImage: string | null;
  /** Optional hero film. When set it plays over the still. */
  heroVideo: string | null;
  /** Copy overrides for the hero block. Null falls back to the feature product. */
  heroEyebrow: string | null;
  heroHeadline: string | null;
  heroTagline: string | null;
}

export const EMPTY_SITE_SETTINGS: SiteSettings = {
  heroImage: null,
  heroVideo: null,
  heroEyebrow: null,
  heroHeadline: null,
  heroTagline: null,
};
