import {
  Archive,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Mail,
  Quote,
  Sparkles,
} from 'lucide-react';
import type { SectionDefinition, SectionField, SettingValue } from '../types/sections';
import type { MediaSlide, SiteSettings } from '../types/settings';
import { SETTING_KINDS } from '../types/settings';
import defaultHeroPlate from '../assets/images/Gemini_Generated_Image_ikb336ikb336ikb3.png';

/**
 * Every home page section, described once.
 *
 * This is the only place a section is declared. The sidebar, the routes, the
 * editor panels, the overview cards, the page-layout list and the storefront's
 * fallbacks all read from here, so adding a section is this entry plus its
 * component in `SECTION_VIEWS` — not six edits across the admin.
 *
 * Default plates are public paths rather than bundled imports for the same
 * reason the bottle photography is: a track opens in the panel already holding
 * its shipped set, so saving without changing anything persists these exact
 * strings. A hashed build URL would be frozen into that record and 404 after
 * the next build; a public path is the same string in dev and in production.
 *
 * The hero plate is the exception — it is never pre-filled into a form (an
 * empty media field means "keep the default"), so it never reaches the store
 * and can stay a bundled import with hashing and cache-busting for free.
 */
const plate = (file: string) => `${import.meta.env.BASE_URL}collection/${file}`;

/** Ids are stable across saves, so a shipped default keeps its identity. */
const slide = (
  id: string,
  src: string,
  alt: string,
  productId: string | null,
  extra: Partial<MediaSlide> = {},
): MediaSlide => ({ id, src, alt, productId, ...extra });

/**
 * `satisfies` rather than a type annotation: it type-checks every entry against
 * `SectionDefinition` while keeping each `key` as its own literal, which is
 * what makes the exhaustiveness assertion at the foot of this file real work
 * rather than a tautology.
 *
 * Kept private, and re-exported widened below: the literal type is precise to
 * the point of being unusable — each section's `fields` is its own array type,
 * which nothing can iterate across — and only the assertion needs that
 * precision.
 */
const REGISTRY_LITERAL = [
  {
    id: 'hero',
    label: 'Hero',
    description: 'The opening frame: the campaign plate and the type held over it.',
    icon: ImageIcon,
    required: true,
    fields: [
      {
        key: 'heroImage',
        label: 'Hero image',
        accept: 'image/*',
        hint: 'Shown full-bleed behind the hero type.',
        emptyLabel: 'Empty — the built-in campaign plate is shown.',
        fallback: defaultHeroPlate,
      },
      {
        key: 'heroVideo',
        label: 'Hero film (optional)',
        accept: 'video/*',
        hint: 'Plays muted on loop over the still.',
        emptyLabel: 'Empty — no film, the still stands alone.',
      },
      {
        key: 'heroEyebrow',
        label: 'Eyebrow',
        hint: 'Small line above the title.',
        emptyLabel: "Blank uses the feature product's notation and collection.",
      },
      {
        key: 'heroHeadline',
        label: 'Headline',
        hint: 'The name set large over the plate.',
        emptyLabel: "Blank uses the feature product's name.",
      },
      {
        key: 'heroTagline',
        label: 'Tagline',
        hint: 'One line under the headline.',
        emptyLabel: "Blank uses the feature product's tagline.",
      },
      {
        key: 'heroCta',
        label: 'Button label',
        hint: 'Scrolls the visitor down to the compositions.',
        fallback: 'Enter the collection',
      },
      {
        key: 'heroFooterNotes',
        label: 'Footer notation',
        hint: 'The strip of small caps along the foot of the hero.',
        addLabel: 'Add note',
        fallback: [
          'The Grandmaster Series',
          'Extrait de Parfum',
          'Three compositions',
          'One silhouette',
        ],
      },
    ],
  },

  {
    id: 'compositions',
    label: 'Compositions',
    description: 'The three seals that dissolve to reveal each bottle.',
    icon: Sparkles,
    fields: [
      {
        key: 'compositionsRevealLabel',
        label: 'Cursor label',
        hint: 'What the custom cursor reads while hovering a panel.',
        fallback: 'REVEAL',
      },
      {
        key: 'compositionsEnterLabel',
        label: 'Invitation',
        hint: 'Appears under the name once the bottle has risen.',
        fallback: 'Enter',
      },
    ],
  },

  {
    id: 'filmstrip',
    label: 'Collection',
    description: 'The full-bleed frame and its scrolling column of plates.',
    icon: Layers,
    fields: [
      {
        key: 'collectionBackground',
        label: 'Section background',
        accept: 'image/*,video/*',
        hint: 'Held full-bleed behind the type. A film plays muted on loop.',
        emptyLabel: 'Empty — the built-in crimson plate is shown.',
        fallback: plate('hero.jpg'),
      },
      {
        key: 'collectionEyebrow',
        label: 'Eyebrow',
        hint: 'Small line above the title.',
        fallback: 'The Grandmaster Series',
      },
      {
        key: 'collectionHeadline',
        label: 'Headline',
        hint: 'Set large along the foot of the frame.',
        fallback: 'Perfume Collection',
      },
      {
        key: 'collectionSlides',
        label: 'Scrolling column',
        accept: 'image/*,video/*',
        linkLabel: 'Links to product',
        hint: 'Top to bottom, in the order the column scrolls. Reorder with the arrows. Each slot links to a product, set independently of its image.',
        fallback: [
          slide('default-1', plate('tile-dance.jpg'), 'Dance With The Devil', 'dance-with-the-devil'),
          slide('default-2', plate('tile-fire.jpg'), 'Fire In The Hole', 'fire-in-the-hole'),
          slide('default-3', plate('tile-fire-two.jpg'), 'Fire In The Hole II', 'fire-in-the-hole-2'),
        ],
      },
    ],
  },

  {
    id: 'manifesto',
    label: 'Manifesto',
    description: 'The drifting band of house lines between the frames.',
    icon: Quote,
    fields: [
      {
        key: 'manifestoPhrases',
        label: 'Phrases',
        hint: 'Set in didone caps and looped end to end. Three or four short lines read best.',
        addLabel: 'Add phrase',
        fallback: ['Born of strategy', 'Worn as intent', 'Every scent is a move'],
      },
    ],
  },

  {
    id: 'mosaic',
    label: 'Series mosaic',
    description: 'Three plates stood on the chessboard, two stacked beside one.',
    icon: LayoutGrid,
    fields: [
      {
        key: 'mosaicHeadline',
        label: 'Headline',
        hint: 'Set over the board, above the tiles.',
        fallback: 'The Grandmaster Series',
      },
      {
        key: 'mosaicNotation',
        label: 'Notation',
        hint: 'Small caps opposite the headline.',
        fallback: 'Extrait de Parfum — Paris',
      },
      {
        key: 'mosaicCta',
        label: 'Tile action',
        hint: 'The underlined words at the foot of every tile.',
        fallback: 'Shop now',
      },
      {
        key: 'mosaicSlides',
        label: 'Tiles',
        accept: 'image/*',
        linkLabel: 'Links to product',
        hint: 'In grid order: the first two stack on the left, the third stands full height on the right. A tile with no plate falls back to its product photograph.',
        fallback: [
          slide('mosaic-1', plate('tile-dance.jpg'), 'Dance With The Devil', 'dance-with-the-devil'),
          slide('mosaic-2', plate('tile-fire.jpg'), 'Fire In The Hole', 'fire-in-the-hole'),
          slide('mosaic-3', plate('tile-fire-two.jpg'), 'Fire In The Hole II', 'fire-in-the-hole-2'),
        ],
      },
    ],
  },

  {
    id: 'archive',
    label: 'Archive',
    description: 'The pair of editorial doors into the house reasoning.',
    icon: Archive,
    fields: [
      {
        key: 'archiveHeadline',
        label: 'Headline',
        fallback: 'The Archive',
      },
      {
        key: 'archiveNotation',
        label: 'Notation',
        hint: 'Small caps opposite the headline.',
        fallback: 'Where the house keeps its reasoning',
      },
      {
        key: 'archiveCta',
        label: 'Entry action',
        hint: 'The word beside the rule at the foot of each entry.',
        fallback: 'Read',
      },
      {
        key: 'archiveCards',
        label: 'Entries',
        accept: 'image/*',
        linkLabel: 'Links to product',
        addLabel: 'Add entry',
        hint: 'Each entry sets its own overline and title over an artwork. Point it at a product, or give it any path — /story, say — in the link field.',
        fallback: [
          slide('archive-1', '', 'Why the board was chosen', null, {
            eyebrow: 'Archive — I',
            title: 'Why the board was chosen',
            href: '/story',
          }),
          // Points at a product rather than carrying its own plate, which is
          // how this entry has always drawn: the closing fragrance's bottle
          // over the ground, opening that fragrance.
          slide('archive-2', '', 'One silhouette, three compositions', 'fire-in-the-hole-2', {
            eyebrow: 'Archive — II',
            title: 'One silhouette, three compositions',
          }),
        ],
      },
    ],
  },

  {
    id: 'newsletter',
    label: 'Correspondence',
    description: 'The closing invitation and its single rule of an input.',
    icon: Mail,
    fields: [
      { key: 'newsletterEyebrow', label: 'Eyebrow', fallback: 'Correspondence' },
      {
        key: 'newsletterHeadline',
        label: 'Headline',
        fallback: 'First to know, first to wear.',
      },
      {
        key: 'newsletterBody',
        label: 'Body',
        hint: 'One sentence under the headline.',
        fallback:
          'Openings, private commissions and the occasional note from the atelier. Nothing else.',
      },
      {
        key: 'newsletterPlaceholder',
        label: 'Input placeholder',
        fallback: 'your@email.com',
      },
      { key: 'newsletterCta', label: 'Button label', fallback: 'Subscribe' },
    ],
  },
] satisfies SectionDefinition[];

/** The registry as everything else consumes it: a plain list of sections. */
export const SECTION_REGISTRY: SectionDefinition[] = REGISTRY_LITERAL;

/** Keys the registry does not describe: layout, which has its own page. */
export const LAYOUT_KEYS = ['sectionOrder', 'hiddenSections'] satisfies (keyof SiteSettings)[];

export const SECTIONS_BY_ID: Record<string, SectionDefinition> = Object.fromEntries(
  SECTION_REGISTRY.map((section) => [section.id, section]),
);

const ALL_FIELDS: SectionField[] = SECTION_REGISTRY.flatMap((section) => section.fields);

/** Every settings key the registry claims, in declaration order. */
export const REGISTERED_KEYS: (keyof SiteSettings)[] = ALL_FIELDS.map((field) => field.key);

/**
 * What the storefront shows for a key before anyone edits it.
 *
 * Built once into a map rather than searched per call: every section component
 * asks for several of these on every render.
 */
const FALLBACKS = new Map<keyof SiteSettings, SettingValue>(
  ALL_FIELDS.filter((field) => field.fallback !== undefined).map((field) => [
    field.key,
    field.fallback as SettingValue,
  ]),
);

export const fieldFallback = (key: keyof SiteSettings): SettingValue | undefined =>
  FALLBACKS.get(key);

/**
 * Compile-time proof that the registry and `SETTING_KINDS` describe the same
 * set of keys.
 *
 * `SETTING_KINDS` has to be declared in the types file because the server
 * imports it and cannot evaluate this module's `import.meta.env`. This assertion
 * is what stops the two drifting: a key added to one and not the other fails
 * the build here rather than silently becoming uneditable or unsanitised.
 */
type RegisteredKey = (typeof REGISTRY_LITERAL)[number]['fields'][number]['key'];
type LayoutKey = (typeof LAYOUT_KEYS)[number];
type Missing = Exclude<keyof SiteSettings, RegisteredKey | LayoutKey>;

/**
 * If this errors, some `SiteSettings` key has no control in any section panel —
 * the false branch resolves to the offending keys, so the compiler names them.
 */
export const __allSettingsAreEditable: [Missing] extends [never] ? true : Missing = true;

/** Runtime companion: catches a key described twice across two sections. */
if (import.meta.env.DEV) {
  const seen = new Set<string>();
  for (const key of REGISTERED_KEYS) {
    if (seen.has(key)) {
      console.error(`[sections] "${key}" is claimed by more than one section.`);
    }
    seen.add(key);
  }
  const unkinded = REGISTERED_KEYS.filter((key) => !(key in SETTING_KINDS));
  if (unkinded.length) {
    console.error(`[sections] no SETTING_KINDS entry for: ${unkinded.join(', ')}`);
  }
}
