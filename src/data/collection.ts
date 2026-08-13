import { MediaSlide } from '../types/settings';

/**
 * What the collection section shows before an admin touches it.
 *
 * These are public paths rather than bundled imports for the same reason the
 * bottle photography is: the admin panel opens with this set already in its
 * form, so saving without changing anything persists these exact strings. A
 * hashed build URL would be frozen into that record and 404 after the next
 * build; a public path is the same string in dev and in production.
 */
const plate = (file: string) => `${import.meta.env.BASE_URL}collection/${file}`;

export const DEFAULT_COLLECTION_BACKGROUND = plate('hero.jpg');

export const DEFAULT_COLLECTION_EYEBROW = 'The Grandmaster Series';
export const DEFAULT_COLLECTION_HEADLINE = 'Perfume Collection';

export const DEFAULT_COLLECTION_SLIDES: MediaSlide[] = [
  {
    id: 'default-1',
    src: plate('tile-dance.jpg'),
    alt: 'Dance With The Devil',
    productId: 'dance-with-the-devil',
  },
  {
    id: 'default-2',
    src: plate('tile-fire.jpg'),
    alt: 'Fire In The Hole',
    productId: 'fire-in-the-hole',
  },
  {
    id: 'default-3',
    src: plate('tile-fire-two.jpg'),
    alt: 'Fire In The Hole II',
    productId: 'fire-in-the-hole-2',
  },
];
