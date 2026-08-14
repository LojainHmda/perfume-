import type { LucideIcon } from 'lucide-react';
import type { MediaSlide, SiteSettings } from './settings';

/**
 * The shape of a described section.
 *
 * A section is a surface on the storefront plus the list of settings keys that
 * feed it. Describing one is enough to get a sidebar entry, a route, an editor
 * panel, an overview card and a place in the page-layout list — none of which
 * are written per section any more.
 */

/** Everything a setting can hold, across all kinds. */
export type SettingValue = string | string[] | MediaSlide[];

export interface SectionField {
  /** The flat `SiteSettings` key this control writes. */
  key: keyof SiteSettings;
  /** Control label in the panel. */
  label: string;
  /** One line under the control explaining what it does on the storefront. */
  hint?: string;
  /**
   * What the storefront shows while this stays empty.
   *
   * For text controls it becomes the input's placeholder, so an admin can read
   * the shipped copy before deciding to replace it. For media controls it is
   * the caption under the empty preview.
   */
  emptyLabel?: string;
  /** File types the upload control accepts. Media and track controls only. */
  accept?: string;
  /** Column header for a track's product link. Track controls only. */
  linkLabel?: string;
  /** Label on the button that appends a row. Track and list controls only. */
  addLabel?: string;
  /**
   * The value the storefront falls back to when there is no override.
   *
   * Omitted where the fallback cannot be a constant — the hero headline defers
   * to the feature product's name, which is catalogue data rather than section
   * content.
   */
  fallback?: SettingValue;
}

export interface SectionDefinition {
  /** Stable id. Used in the route, the layout order and the renderer map. */
  id: string;
  /** Sidebar entry and panel title. */
  label: string;
  /** Panel subtitle — what this surface is, in one line. */
  description: string;
  icon: LucideIcon;
  /**
   * Structural sections the admin may reorder but not switch off. The hero is
   * the page's opening frame; a home page with nothing above the fold is a
   * mistake rather than a choice.
   */
  required?: boolean;
  fields: SectionField[];
}
