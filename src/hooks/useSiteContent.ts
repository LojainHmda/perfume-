import { useMemo } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { SECTIONS_BY_ID, SECTION_REGISTRY, fieldFallback } from '../data/sections';
import type { SectionDefinition } from '../types/sections';
import type { MediaSlide, SiteSettings } from '../types/settings';

/**
 * Reading resolved section content on the storefront.
 *
 * Every value is "the admin's override, or what the site ships with", and the
 * shipped value lives in the section registry rather than in the component. A
 * section component therefore holds no copy of its own: it is handed strings
 * and tracks and lays them out.
 *
 * The three readers exist because the three shapes need different empty
 * handling — an empty string is a cleared override, an empty array is a
 * deliberate "show nothing" — and collapsing them into one generic would push
 * that distinction into every call site.
 */

/** A single line of copy. Falls back to the shipped string, then to ''. */
export const readText = (settings: SiteSettings, key: keyof SiteSettings): string => {
  const saved = settings[key];
  if (typeof saved === 'string' && saved.trim() !== '') return saved;
  const shipped = fieldFallback(key);
  return typeof shipped === 'string' ? shipped : '';
};

/**
 * An ordered list of plain lines.
 *
 * `null` means untouched, so the shipped list stands; `[]` means the admin
 * emptied it deliberately and the storefront honours that.
 */
export const readLines = (settings: SiteSettings, key: keyof SiteSettings): string[] => {
  const saved = settings[key];
  if (Array.isArray(saved)) return saved as string[];
  const shipped = fieldFallback(key);
  return Array.isArray(shipped) ? (shipped as string[]) : [];
};

/** An ordered media track, with the same null-versus-empty rule as `readLines`. */
export const readTrack = (settings: SiteSettings, key: keyof SiteSettings): MediaSlide[] => {
  const saved = settings[key];
  if (Array.isArray(saved)) return saved as MediaSlide[];
  const shipped = fieldFallback(key);
  return Array.isArray(shipped) ? (shipped as MediaSlide[]) : [];
};

/**
 * The home page's sections, in the order the admin put them and without the
 * ones they switched off.
 *
 * Ids the registry no longer knows are dropped, and registered sections the
 * saved order has never heard of are appended — so a section shipped in a later
 * release appears on its own rather than waiting for someone to re-save the
 * layout.
 */
export const resolveLayout = (settings: SiteSettings): SectionDefinition[] => {
  const saved = settings.sectionOrder ?? [];
  const hidden = new Set(settings.hiddenSections ?? []);

  const ordered = saved
    .map((id) => SECTIONS_BY_ID[id])
    .filter((section): section is SectionDefinition => Boolean(section));

  const seen = new Set(ordered.map((section) => section.id));
  const appended = SECTION_REGISTRY.filter((section) => !seen.has(section.id));

  return [...ordered, ...appended].filter(
    (section) => section.required || !hidden.has(section.id),
  );
};

export interface SiteContent {
  text: (key: keyof SiteSettings) => string;
  lines: (key: keyof SiteSettings) => string[];
  track: (key: keyof SiteSettings) => MediaSlide[];
}

/** The readers bound to live settings, for components that render content. */
export const useSiteContent = (): SiteContent => {
  const settings = useSettingsStore((state) => state.settings);

  return useMemo(
    () => ({
      text: (key) => readText(settings, key),
      lines: (key) => readLines(settings, key),
      track: (key) => readTrack(settings, key),
    }),
    [settings],
  );
};

/** The resolved section list, for the home page and the layout editor. */
export const useSectionLayout = (): SectionDefinition[] => {
  const settings = useSettingsStore((state) => state.settings);
  return useMemo(() => resolveLayout(settings), [settings]);
};
