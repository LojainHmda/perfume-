import fs from 'fs';
import path from 'path';
import { Jimp } from 'jimp';
import { PNG } from 'pngjs';

/**
 * Cut the jewelled gauntlet out of its black studio ground.
 *
 * The separation is luminance, not colour. An earlier gauntlet was shot on
 * saturated maroon, where "is this pixel strongly coloured for how dark it is"
 * keyed cleanly and kept the black leather; this one is shot on near-black,
 * where every hue test is meaningless. Measured off the source:
 *
 *     ground            lum  7 - 13
 *     leather, finger   lum 30 - 32
 *     leather, thumb    lum 42 - 53
 *     floor plane       lum 24 - 73
 *
 * So the ground clears the darkest leather by better than 2x and a soft ramp
 * between the two keeps the glove whole. The floor is the awkward part: it is
 * brighter than the finger leather, so no luminance threshold can drop it, and
 * it touches the finial the glove stands on, so connectivity cannot either. It
 * is cut structurally instead, at the row where the row-median luminance climbs
 * off the ground — see findFloor.
 *
 *     node scripts/knockout-glove.mjs <source.jpg|png> <out.png> [pad]
 *
 * The artwork is stored at roughly five times its drawn size, so the browser's
 * own downsampling does the antialiasing and the stones stay crisp on a
 * high-DPI screen. The tip this prints is the geometry contract with
 * LeatherHand.tsx and index.css — see the note there.
 */
const SRC = process.argv[2];
const OUT = process.argv[3];
const PAD = Number(process.argv[4] ?? 40);

/** Alpha ramp in luminance. Below LO is certainly ground, above HI is subject. */
const LUM_LO = 13;
const LUM_HI = 28;

/** How far the base fades out above the floor cut, so it is not sliced flat. */
const BASE_FADE = 26;

const img = await Jimp.read(SRC);
const W = img.bitmap.width;
const H = img.bitmap.height;
const data = img.bitmap.data;

const at = (x, y) => (y * W + x) * 4;
const lumAt = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

const smoothstep = (lo, hi, v) => {
  const t = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};

/**
 * The top of the floor plane.
 *
 * Rows that cross only ground and glove are overwhelmingly ground, so their
 * median luminance sits down at the ground's own value. Rows that cross the
 * floor are mostly floor, and the median jumps. Walking up from the bottom and
 * stopping at the first row that reads as ground finds the seam without
 * hard-coding a fraction of the frame.
 */
const findFloor = () => {
  const median = (y) => {
    const vals = [];
    for (let x = 0; x < W; x += 2) vals.push(lumAt(at(x, y)));
    vals.sort((a, b) => a - b);
    return vals[vals.length >> 1];
  };

  const GROUND = 20;
  let seam = H;
  for (let y = H - 1; y >= 0; y--) {
    if (median(y) <= GROUND) {
      seam = y + 1;
      break;
    }
  }
  // A frame with no floor at all leaves the seam at the bottom edge.
  return Math.min(seam, H);
};

const floorY = findFloor();

const alpha = new Float32Array(W * H);
for (let y = 0; y < H; y++) {
  // Everything at or below the seam is floor; the rows just above it fade out
  // so the finial is not left sitting on a sliced edge.
  const baseFade = y >= floorY ? 0 : smoothstep(0, BASE_FADE, floorY - y);
  if (baseFade <= 0) continue;

  for (let x = 0; x < W; x++) {
    alpha[y * W + x] = smoothstep(LUM_LO, LUM_HI, lumAt(at(x, y))) * baseFade;
  }
}

// --- Largest connected component of solid-ish pixels ---
// Drops dust, lens flare and any stray floor blob that survived the seam cut.
const solid = new Uint8Array(W * H);
for (let i = 0; i < alpha.length; i++) solid[i] = alpha[i] > 0.5 ? 1 : 0;

const label = new Int32Array(W * H).fill(-1);
let best = { id: -1, size: 0 };
let next = 0;
const stack = new Int32Array(W * H);

for (let start = 0; start < solid.length; start++) {
  if (!solid[start] || label[start] !== -1) continue;
  const id = next++;
  let top = 0;
  let size = 0;
  stack[top++] = start;
  label[start] = id;

  while (top > 0) {
    const p = stack[--top];
    size++;
    const px = p % W;
    const py = (p - px) / W;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = px + dx;
        const ny = py + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const q = ny * W + nx;
        if (solid[q] && label[q] === -1) {
          label[q] = id;
          stack[top++] = q;
        }
      }
    }
  }

  if (size > best.size) best = { id, size };
}

for (let i = 0; i < alpha.length; i++) {
  if (alpha[i] > 0 && label[i] !== best.id) alpha[i] = 0;
}

/**
 * Close the holes.
 *
 * Shadow inside the setting and between the fingers reads as ground to a
 * luminance key, punching transparent pits through the middle of the glove.
 * Real ground is reachable from the frame edge; an enclosed shadow is not.
 * Flood the outside, then anything still transparent is interior and is filled
 * back in — which is also what reclaims the darkest leather.
 */
const outside = new Uint8Array(W * H);
let head = 0;
const queue = new Int32Array(W * H);

const pushIfGround = (x, y) => {
  const p = y * W + x;
  if (!outside[p] && alpha[p] < 0.5) {
    outside[p] = 1;
    queue[head++] = p;
  }
};

for (let x = 0; x < W; x++) {
  pushIfGround(x, 0);
  pushIfGround(x, H - 1);
}
for (let y = 0; y < H; y++) {
  pushIfGround(0, y);
  pushIfGround(W - 1, y);
}

for (let read = 0; read < head; read++) {
  const p = queue[read];
  const px = p % W;
  const py = (p - px) / W;
  if (px > 0) pushIfGround(px - 1, py);
  if (px < W - 1) pushIfGround(px + 1, py);
  if (py > 0) pushIfGround(px, py - 1);
  if (py < H - 1) pushIfGround(px, py + 1);
}

for (let i = 0; i < alpha.length; i++) {
  if (alpha[i] < 1 && !outside[i]) alpha[i] = 1;
}

// --- Crop to what is left ---
let minX = W;
let minY = H;
let maxX = -1;
let maxY = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (alpha[y * W + x] > 0.06) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

if (maxX < 0) {
  console.error('nothing survived the key — widen LUM_LO/LUM_HI');
  process.exit(1);
}

/** One pass of 3x3 averaging on the alpha only, to take the stair-steps off. */
const feathered = Float32Array.from(alpha);
for (let y = 1; y < H - 1; y++) {
  for (let x = 1; x < W - 1; x++) {
    let sum = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) sum += alpha[(y + dy) * W + (x + dx)];
    }
    feathered[y * W + x] = sum / 9;
  }
}

const cw = maxX - minX + 1 + PAD * 2;
const ch = maxY - minY + 1 + PAD * 2;
const out = new PNG({ width: cw, height: ch });
out.data.fill(0);

for (let y = PAD; y < ch - PAD; y++) {
  for (let x = PAD; x < cw - PAD; x++) {
    const sx = minX + x - PAD;
    const sy = minY + y - PAD;
    const s = at(sx, sy);
    const d = (y * cw + x) * 4;

    out.data[d] = data[s];
    out.data[d + 1] = data[s + 1];
    out.data[d + 2] = data[s + 2];
    out.data[d + 3] = Math.round(Math.max(0, Math.min(1, feathered[sy * W + sx])) * 255);
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, PNG.sync.write(out));

// --- Report the fingertip, which the cursor aligns to the pointer ---
let tipY = -1;
let tipXs = [];
for (let y = 0; y < ch && tipY < 0; y++) {
  const row = [];
  for (let x = 0; x < cw; x++) {
    if (out.data[(y * cw + x) * 4 + 3] > 140) row.push(x);
  }
  if (row.length >= 3) {
    tipY = y;
    tipXs = row;
  }
}
const tipX = Math.round(tipXs.reduce((a, b) => a + b, 0) / tipXs.length);

console.log(`source   ${W}x${H}`);
console.log(`floor    cut at y${floorY} of ${H}`);
console.log(`crop     x${minX} y${minY} -> ${cw}x${ch}`);
console.log(`tip      (${tipX}, ${tipY})  = ${((tipX / cw) * 100).toFixed(2)}% ${((tipY / ch) * 100).toFixed(2)}%`);
console.log(`wrote    ${OUT}`);
