import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

/**
 * Cut the jewelled glove out of its maroon studio ground.
 *
 * The separation is colour, not luminance: the ground is a saturated warm red
 * and the subject is neutral throughout — white stones, grey platinum, black
 * leather. Testing "is this pixel warm and saturated" keeps the black cuff,
 * which a luminance key would eat.
 *
 * The bokeh sparkles scattered over the ground are neutral and bright, so they
 * survive that test. They are removed structurally instead: keep only the
 * largest connected run of subject pixels, which is the glove.
 */
const SRC = process.argv[2];
const OUT = process.argv[3];

const png = PNG.sync.read(fs.readFileSync(SRC));
const { width: W, height: H, data } = png;

const at = (x, y) => (y * W + x) * 4;

const smoothstep = (lo, hi, v) => {
  const t = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
};

/**
 * 0 = certainly ground, 1 = certainly subject, with a soft band between.
 *
 * Saturation has to be measured relative to the pixel's own brightness. The
 * ground is dark maroon, so in absolute terms its channels are close together
 * and an absolute "how much redder than blue" test reads it as nearly neutral —
 * which is what kept the whole background on the first pass. chroma/max says
 * "strongly coloured for how dark it is", which is the actual question.
 */
const subjectness = (x, y) => {
  const i = at(x, y);
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;

  // The close-button chrome sits over the top of the frame. It is neutral, so
  // the colour test would keep it; it is also only ever up there.
  if (y < 62 && chroma < 26 && max < 110) return 0;

  // Near-black is glove shadow. Nothing can be said about its hue.
  if (max < 10) return 1;

  const sat = chroma / max;
  if (sat < 0.16) return 1;

  // Hue in degrees; only the red-to-magenta wedge is ground.
  let hue = 0;
  if (max === r) hue = (60 * ((g - b) / chroma) + 360) % 360;
  else if (max === g) hue = 60 * ((b - r) / chroma) + 120;
  else hue = 60 * ((r - g) / chroma) + 240;

  const isGroundHue = hue >= 300 || hue <= 32;
  if (!isGroundHue) return 1;

  return 1 - smoothstep(0.16, 0.32, sat);
};

const alpha = new Float32Array(W * H);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) alpha[y * W + x] = subjectness(x, y);
}

// --- Largest connected component of solid-ish pixels ---
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

// Anything not attached to the glove is a sparkle or chrome.
for (let i = 0; i < alpha.length; i++) {
  if (alpha[i] > 0 && label[i] !== best.id) alpha[i] = 0;
}

/**
 * Close the holes.
 *
 * The stones mirror the maroon ground, so the colour key punches transparent
 * pits through the middle of the setting. Real background is reachable from the
 * frame edge; a reflection is not. Flood the outside, then anything still
 * transparent is interior and gets filled back in.
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

/**
 * One pass of 3x3 averaging on the alpha only.
 *
 * The key comes out binary — the ground's saturation and the glove's are far
 * enough apart that almost nothing lands in the soft band — and a hard matte
 * shows its stair-steps on the diagonal edges of the setting. The artwork is
 * drawn about five times smaller than it is stored, so this plus the browser's
 * own downsampling is enough.
 */
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

/** Transparent margin, so the fingertip rays have somewhere to be drawn. */
const PAD = Number(process.argv[4] ?? 40);

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
    const a = feathered[sy * W + sx];

    // Un-mix the ground's red out of the semi-transparent rim, or every edge
    // keeps a maroon fringe once it is composited on the site's obsidian.
    let r = data[s];
    let g = data[s + 1];
    let b = data[s + 2];
    if (a > 0.02 && a < 0.98) {
      const neutral = (g + b) / 2;
      if (r > neutral) r = neutral + (r - neutral) * 0.35;
    }

    out.data[d] = r;
    out.data[d + 1] = g;
    out.data[d + 2] = b;
    out.data[d + 3] = Math.round(Math.max(0, Math.min(1, a)) * 255);
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
console.log(`crop     x${minX} y${minY} -> ${cw}x${ch}`);
console.log(`tip      (${tipX}, ${tipY})  = ${((tipX / cw) * 100).toFixed(2)}% ${((tipY / ch) * 100).toFixed(2)}%`);
console.log(`wrote    ${OUT}`);
