import { Fragrance } from '../../types/fragrance';
import { danceWithTheDevil } from './dance-with-the-devil';
import { fireInTheHole } from './fire-in-the-hole';
import { fireInTheHoleII } from './fire-in-the-hole-ii';

/**
 * The house catalogue, in the order it is presented on the storefront.
 * One file per fragrance — add a file, import it, drop it in this array.
 */
export const FRAGRANCES: Fragrance[] = [danceWithTheDevil, fireInTheHole, fireInTheHoleII];

export const getFragranceById = (id: string): Fragrance | undefined =>
  FRAGRANCES.find((fragrance) => fragrance.id === id);

export { danceWithTheDevil, fireInTheHole, fireInTheHoleII };

// Re-exported so long-standing `data/fragrances` imports keep resolving.
export { ASSETS, BOTTLES } from '../assets';
