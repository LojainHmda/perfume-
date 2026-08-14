import React from 'react';
import gloveCut from '../../assets/images/glove-jewelled-cut.png';

/**
 * The cursor's hero asset: the house's jewelled gauntlet — a black leather
 * glove caged in platinum and diamonds, index finger extended.
 *
 * This is the supplied photograph, knocked out of its studio ground and used as
 * it was shot. It is not a redrawing: an earlier pass rebuilt the piece as
 * vector paths and, however carefully the stones were placed, a hand-authored
 * approximation of high jewellery reads as an imitation of one. The real
 * article carries its own light, and that is the whole of its luxury.
 *
 * The cut-out is produced by scripts/knockout-glove.mjs, which keys on colour
 * rather than luminance — the ground is a saturated maroon and the glove is
 * neutral from the white stones to the black cuff, so a luminance key would eat
 * the leather. Re-run it if the source is ever re-shot:
 *
 *     node scripts/knockout-glove.mjs <source.png> <out.png> 40
 *
 * The artwork is stored at roughly five times its drawn size, so the browser's
 * own downsampling does the antialiasing and the stones stay crisp on a
 * high-DPI screen.
 *
 * Bundled import rather than a public path, deliberately: the cursor is
 * decoration that is never written into the content store, so it can take a
 * hashed build URL and get cache-busting for free — the same call the house
 * seal makes.
 *
 * Geometry contract — CustomCursor reads these to place the fingertip exactly
 * on the pointer, and index.css hard-codes the same point as a transform-origin
 * (30.18% 4.91%) plus the ray origin in view units. All of them must move
 * together, and the knockout script prints the tip it found:
 *   viewBox 444 x 814, fingertip at (134, 40).
 */

export const HAND_VIEW_W = 444;
export const HAND_VIEW_H = 814;
export const HAND_TIP_X = 134;
export const HAND_TIP_Y = 40;

/**
 * Click affordance: rays fanning off the fingertip.
 *
 * Generated from the tip rather than written as coordinates, so re-cropping the
 * artwork moves them with it. The radii are in view units and are sized to land
 * at the same on-screen distance the drawn cursor used.
 */
const RAY_INNER = 40;
const RAY_OUTER = 76;
const RAY_ANGLES = [-150, -120, -90, -60, -30];

const RAYS = RAY_ANGLES.map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return [
    HAND_TIP_X + RAY_INNER * Math.cos(rad),
    HAND_TIP_Y + RAY_INNER * Math.sin(rad),
    HAND_TIP_X + RAY_OUTER * Math.cos(rad),
    HAND_TIP_Y + RAY_OUTER * Math.sin(rad),
  ] as const;
});

export const LeatherHand: React.FC = () => (
  <svg
    className="lhc-svg"
    viewBox={`0 0 ${HAND_VIEW_W} ${HAND_VIEW_H}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="lhc-gold" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#F5D77F" />
        <stop offset="45%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#7C6218" />
      </linearGradient>

      <radialGradient id="lhc-contact" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>

      <filter id="lhc-drop" x="-40%" y="-25%" width="180%" height="160%">
        <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#000000" floodOpacity="0.6" />
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
      </filter>
    </defs>

    {/* Ground shadow. Offset by CustomCursor each frame so it drifts with motion. */}
    <g className="lhc-shadow">
      <ellipse cx="228" cy="792" rx="132" ry="26" fill="url(#lhc-contact)" />
    </g>

    {/*
      The press moves this node. With a photograph there is no separable finger
      layer to travel on its own, so the gesture is carried by the whole hand
      instead — the CSS origin is the foot of the artwork, so it dips and swings
      from the wrist rather than sliding.
    */}
    <g className="lhc-finger" filter="url(#lhc-drop)">
      <image href={gloveCut} x="0" y="0" width={HAND_VIEW_W} height={HAND_VIEW_H} />
    </g>

    {/* Gold rays at the fingertip, revealed only over targets. */}
    <g className="lhc-rays" fill="none" stroke="url(#lhc-gold)" strokeWidth="7.6" strokeLinecap="round">
      {RAYS.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </g>
  </svg>
);
