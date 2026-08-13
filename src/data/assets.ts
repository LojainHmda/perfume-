/**
 * Central image manifest.
 *
 * The house owns three product photographs and nothing else — every other
 * surface builds its atmosphere from CSS and canvas (light, grain, gradient,
 * board geometry) rather than from stock or borrowed imagery.
 *
 * Everything ships pre-knocked-out to a transparent PNG by
 * scripts/knockout-bottles.mjs — only the subject is visible, and the subject's
 * own pixels are never altered.
 */

/**
 * Bottle photographs are served from public/brand rather than imported.
 *
 * The catalogue is persisted on the server the first time it is seeded, and a
 * product's `image` travels with it — a bundled import would freeze a hashed
 * build URL into that record and 404 after the next build. A public path is
 * the same string in dev and in production, so the stored record stays valid.
 */
const bottleDanceDevil = `${import.meta.env.BASE_URL}brand/dance_with_the_devil_cut.png`;
// The dark-ground shot cannot be isolated cleanly, so both Fire fragrances use
// the light-ground cut-out of the same bottle for now.
const bottleFireInTheHole = `${import.meta.env.BASE_URL}brand/fire_in_the_hole_2_cut.png`;
const bottleFireInTheHole2 = `${import.meta.env.BASE_URL}brand/fire_in_the_hole_2_cut.png`;

// The house seal is never persisted — it is decoration on the storefront only,
// so it stays a bundled import and gets hashing and cache-busting for free.
import checkmateSeal from '../assets/images/checkmate-seal-cut.png';

export const SEAL = checkmateSeal;

export const BOTTLES = {
  danceWithTheDevil: bottleDanceDevil,
  fireInTheHole: bottleFireInTheHole,
  fireInTheHoleII: bottleFireInTheHole2,
} as const;

export const ASSETS = {
  bottleDanceDevil,
  bottleFireInTheHole,
  bottleFireInTheHole2,
};
