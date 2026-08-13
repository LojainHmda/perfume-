import React from 'react';

/**
 * The cursor's hero asset: a closed leather-gloved fist with the index finger
 * extended, drawn as vector rather than shipped as a bitmap.
 *
 * Vector is the right call here for three reasons: it stays razor sharp on any
 * DPI, the fingertip sits at a coordinate we can trust for hit alignment, and
 * the material is built from gradients + one turbulence pass rather than a
 * megabyte of PNG that would have to be decoded before the cursor appears.
 *
 * Geometry contract — CustomCursor reads these to place the fingertip exactly
 * on the pointer, so they must move together:
 *   viewBox 180 x 260, fingertip at (58, 34).
 */

export const HAND_VIEW_W = 180;
export const HAND_VIEW_H = 260;
export const HAND_TIP_X = 58;
export const HAND_TIP_Y = 34;

/** Fist, folded fingers and cuff. The index finger is a separate path so it can press. */
const FIST =
  'M37,140 C36,126 39,117 45,112 L75,110 C80,104 90,101 97,106 C104,100 116,101 121,109 ' +
  'C128,106 138,111 141,123 C146,137 146,161 142,179 C139,193 134,201 128,203 L50,203 ' +
  'C41,193 37,160 37,140 Z';

const FINGER =
  'M45,108 C43,84 44,62 48,48 C50,38 55,32 60,32.5 C66,33 71,40 72,50 ' +
  'C74,68 75,90 75,108 Z';

const THUMB =
  'M39,150 C43,140 54,137 65,143 C78,150 87,161 91,173 C93,182 87,189 78,187 ' +
  'C63,184 47,174 41,164 C38,159 37,155 39,150 Z';

const CUFF =
  'M48,198 C52,196 130,196 134,198 C138,210 138,224 133,235 C130,237 54,237 51,235 ' +
  'C45,224 45,210 48,198 Z';

/** Rays fan out of the fingertip, 13→25 units, at -150/-120/-90/-60/-30 degrees. */
const RAYS: Array<[number, number, number, number]> = [
  [46.7, 27.5, 36.3, 21.5],
  [51.5, 22.7, 45.5, 12.4],
  [58.0, 21.0, 58.0, 9.0],
  [64.5, 22.7, 70.5, 12.4],
  [69.3, 27.5, 79.7, 21.5],
];

export const LeatherHand: React.FC = () => (
  <svg
    className="lhc-svg"
    viewBox={`0 0 ${HAND_VIEW_W} ${HAND_VIEW_H}`}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* Leather is not one colour: a lit shoulder, a deep body, a black core. */}
      <radialGradient id="lhc-body" cx="34%" cy="20%" r="88%">
        <stop offset="0%" stopColor="#4E4E56" />
        <stop offset="38%" stopColor="#2A2A31" />
        <stop offset="74%" stopColor="#141418" />
        <stop offset="100%" stopColor="#07070A" />
      </radialGradient>

      <linearGradient id="lhc-finger" x1="0" y1="0.1" x2="1" y2="0.2">
        <stop offset="0%" stopColor="#2E2E35" />
        <stop offset="18%" stopColor="#5A5A63" />
        <stop offset="52%" stopColor="#26262D" />
        <stop offset="86%" stopColor="#0D0D11" />
        <stop offset="100%" stopColor="#33333B" />
      </linearGradient>

      <linearGradient id="lhc-thumb" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor="#454550" />
        <stop offset="55%" stopColor="#1C1C22" />
        <stop offset="100%" stopColor="#0A0A0D" />
      </linearGradient>

      <linearGradient id="lhc-cuff" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22222A" />
        <stop offset="60%" stopColor="#121217" />
        <stop offset="100%" stopColor="#06060A" />
      </linearGradient>

      <linearGradient id="lhc-gold" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#F5D77F" />
        <stop offset="45%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#7C6218" />
      </linearGradient>

      {/* Specular sheen — leather catches light in narrow, soft bands. */}
      <linearGradient id="lhc-sheen" x1="0" y1="0" x2="1" y2="0.6">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>

      <radialGradient id="lhc-contact" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>

      {/* Grain. One fractal-noise pass, desaturated, laid over the silhouette in
          overlay blend so it reads as pore texture rather than as dirt. */}
      <filter id="lhc-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="11" result="n" />
        <feColorMatrix
          in="n"
          type="matrix"
          values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.6 0"
        />
      </filter>

      <filter id="lhc-drop" x="-60%" y="-40%" width="220%" height="200%">
        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.55" />
        <feDropShadow dx="0" dy="1" stdDeviation="1.4" floodColor="#000000" floodOpacity="0.5" />
      </filter>

      {/* Separation halo: the site's ground is obsidian, so a black glove needs a
          whisper of light behind it or it disappears into the page. */}
      <filter id="lhc-halo" x="-60%" y="-40%" width="220%" height="200%">
        <feGaussianBlur stdDeviation="5" />
      </filter>

      <clipPath id="lhc-silhouette">
        <path d={FIST} />
        <path d={FINGER} />
        <path d={THUMB} />
        <path d={CUFF} />
      </clipPath>
    </defs>

    {/* Ground shadow. Offset by CustomCursor each frame so it drifts with motion. */}
    <g className="lhc-shadow">
      <ellipse cx="92" cy="242" rx="56" ry="13" fill="url(#lhc-contact)" />
    </g>

    {/* Faint light bloom behind the silhouette, for dark sections of the page. */}
    <g className="lhc-halo" filter="url(#lhc-halo)" opacity="0.16">
      <path d={FIST} fill="#F2EFE9" />
      <path d={FINGER} fill="#F2EFE9" />
      <path d={CUFF} fill="#F2EFE9" />
    </g>

    <g filter="url(#lhc-drop)">
      {/* Cuff first: everything else overlaps it. */}
      <g className="lhc-cuff">
        <path d={CUFF} fill="url(#lhc-cuff)" />
        <path
          d="M52,205 C72,203 112,203 131,205"
          fill="none"
          stroke="#C9C3B4"
          strokeOpacity="0.22"
          strokeWidth="1.1"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        <path
          d="M53,230 C73,232 110,232 129,230"
          fill="none"
          stroke="#C9C3B4"
          strokeOpacity="0.16"
          strokeWidth="1.1"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        {/* Snap fastener — the one warm point on the glove. */}
        <circle cx="114" cy="217" r="6.5" fill="url(#lhc-gold)" />
        <circle cx="114" cy="217" r="6.5" fill="none" stroke="#000000" strokeOpacity="0.5" strokeWidth="0.8" />
        <circle cx="112" cy="215" r="2" fill="#FFF6DA" fillOpacity="0.75" />
        <path d={CUFF} fill="none" stroke="#F2EFE9" strokeOpacity="0.1" strokeWidth="1" />
      </g>

      {/* Fist mass. */}
      <path className="lhc-fist" d={FIST} fill="url(#lhc-body)" />

      {/* The three folded fingers. Valleys carry the read at cursor size; the
          ridge highlights beside them give each finger its own volume. */}
      <g fill="none" strokeLinecap="round">
        {/* Crease where the folded fingers meet the back of the hand. */}
        <path d="M76,114 C93,107 116,109 133,120" stroke="#000000" strokeOpacity="0.55" strokeWidth="2.6" />
        <path d="M77,110 C94,103 116,105 133,116" stroke="#F2EFE9" strokeOpacity="0.14" strokeWidth="1.3" />
        {/* Gaps between middle / ring / little. */}
        <path d="M108,106 C112,124 105,152 92,180" stroke="#000000" strokeOpacity="0.5" strokeWidth="2.6" />
        <path d="M131,112 C135,130 127,158 114,186" stroke="#000000" strokeOpacity="0.42" strokeWidth="2.4" />
        <path d="M97,108 C100,126 93,154 81,180" stroke="#F2EFE9" strokeOpacity="0.11" strokeWidth="1.5" />
        <path d="M120,112 C124,130 116,158 104,186" stroke="#F2EFE9" strokeOpacity="0.09" strokeWidth="1.4" />
        {/* Second knuckle line, halfway down the folded fingers. */}
        <path d="M83,150 C100,142 122,144 140,155" stroke="#000000" strokeOpacity="0.3" strokeWidth="2" />
      </g>

      {/* Thumb folded across the front, lifted off the fist by its own shadow. */}
      <path
        d={THUMB}
        fill="url(#lhc-thumb)"
        stroke="#000000"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <path
        d="M41,151 C48,142 60,141 71,149"
        fill="none"
        stroke="#F2EFE9"
        strokeOpacity="0.2"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M66,150 C76,157 84,166 88,176"
        fill="none"
        stroke="#F2EFE9"
        strokeOpacity="0.1"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Index finger — its own node so the press animation can move only this. */}
      <g className="lhc-finger">
        <path d={FINGER} fill="url(#lhc-finger)" />
        {/* Seam down the finger, stitched. */}
        <path
          d="M59,44 C57,64 57,88 58,106"
          fill="none"
          stroke="#C9C3B4"
          strokeOpacity="0.18"
          strokeWidth="0.9"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        {/* Joint crease — without it the finger reads as a tube. */}
        <path
          d="M46,76 C54,72 65,73 73,78"
          fill="none"
          stroke="#000000"
          strokeOpacity="0.45"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M46,73 C54,69 65,70 73,75"
          fill="none"
          stroke="#F2EFE9"
          strokeOpacity="0.12"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        {/* Rim light on the lit edge, and a tight specular at the tip. */}
        <path
          d="M48,48 C50,38 55,32 60,32.5"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.45"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M46,100 C44,80 45,60 48,48"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.24"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <ellipse cx="66" cy="68" rx="3.2" ry="19" fill="url(#lhc-sheen)" opacity="0.35" />
      </g>

      {/* Global rim light along the outer silhouette. */}
      <g fill="none" strokeLinecap="round">
        <path d="M37,140 C36,126 39,117 45,112" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.5" />
        <path d="M97,106 C104,100 116,101 121,109" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="1.3" />
        <path d="M121,109 C128,106 138,111 141,123" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="1.3" />
        <path d="M141,123 C146,137 146,161 142,179" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="1.2" />
        {/* Wrist shadow so the cuff sits behind the hand, not beside it. */}
        <path d="M52,199 C80,193 108,193 130,199" stroke="#000000" strokeOpacity="0.5" strokeWidth="3" />
      </g>

      {/* Pore grain, clipped to the glove. */}
      <g clipPath="url(#lhc-silhouette)" className="lhc-grain">
        <rect x="0" y="0" width={HAND_VIEW_W} height={HAND_VIEW_H} filter="url(#lhc-grain)" />
      </g>
    </g>

    {/* Click affordance: gold rays at the fingertip, revealed only over targets. */}
    <g className="lhc-rays" fill="none" stroke="url(#lhc-gold)" strokeWidth="2.6" strokeLinecap="round">
      {RAYS.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </g>
  </svg>
);
