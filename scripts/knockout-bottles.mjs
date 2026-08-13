/**
 * Bakes transparent bottle cut-outs from the studio photographs.
 *
 * The storefront used to knock these out in the browser on every load, which
 * cost a full-canvas pass per image and left the soft cast shadows behind as
 * grey smears.
 *
 * Doing it offline is easy to get subtly wrong: the bottle is black lacquer,
 * but its cap carries a near-white specular highlight. A plain luminance flood
 * fill from the borders walks straight through that highlight and eats the top
 * of the bottle, leaving it flat-topped. So the pipeline is:
 *
 *   1. flood fill the ground from the borders, generously (this over-eats),
 *   2. keep only the largest surviving component — drops shadow fragments,
 *   3. re-fill that component's interior holes from the original pixels —
 *      this is what puts the specular highlight back,
 *   4. feather the silhouette edge, then crop to it.
 *
 * Run: node scripts/knockout-bottles.mjs
 */
import { Jimp } from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(here, '..', 'src', 'assets', 'images');

const JOBS = [
  { from: 'Screenshot 2026-08-04 082232.png', to: 'dance_with_the_devil_cut.png', cutoff: 140 },
  { from: 'fire_in_the_hole_2.png', to: 'fire_in_the_hole_2_cut.png', cutoff: 140 },
  { from: 'checkmate-seal.jpeg', to: 'checkmate-seal-cut.png', cutoff: 150 },
  // NOTE: fire_in_the_hole.png (the dark-ground shot) is deliberately absent.
  // Its backdrop fades to luminance 1 at the floor — the same value as the
  // bottle — so no threshold separates subject from ground near the base, and
  // the cap's specular highlight touches the outer boundary. It needs either a
  // light-ground reshoot or a hand-masked PNG.
];

const luminance = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

for (const job of JOBS) {
  const image = await Jimp.read(path.join(imagesDir, job.from));
  const { width: w, height: h } = image.bitmap;
  const data = image.bitmap.data;
  const original = Uint8Array.from(data);
  const at = (x, y) => (y * w + x) * 4;

  // --- 1. Ground: flood fill inward from every border pixel that reads light.
  const isGround = (x, y) => {
    const i = at(x, y);
    return luminance(data[i], data[i + 1], data[i + 2]) > job.cutoff;
  };

  const cleared = new Uint8Array(w * h);
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) stack.push([0, y], [w - 1, y]);

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const key = y * w + x;
    if (seen[key]) continue;
    seen[key] = 1;
    if (!isGround(x, y)) continue;
    cleared[key] = 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  // --- 2. Keep only the largest surviving component (the bottle).
  const label = new Int32Array(w * h).fill(-1);
  let best = { id: -1, size: 0 };
  let next = 0;
  for (let start = 0; start < w * h; start++) {
    if (cleared[start] || label[start] !== -1) continue;
    const id = next++;
    let size = 0;
    const queue = [start];
    label[start] = id;
    while (queue.length) {
      const p = queue.pop();
      size++;
      const x = p % w;
      const y = (p / w) | 0;
      const neighbours = [
        x > 0 ? p - 1 : -1,
        x < w - 1 ? p + 1 : -1,
        y > 0 ? p - w : -1,
        y < h - 1 ? p + w : -1,
      ];
      for (const n of neighbours) {
        if (n < 0 || cleared[n] || label[n] !== -1) continue;
        label[n] = id;
        queue.push(n);
      }
    }
    if (size > best.size) best = { id, size };
  }

  // --- 3. Holes: transparent pixels the outside cannot reach are interior to
  //        the bottle (the eaten highlight) and must come back.
  const outside = new Uint8Array(w * h);
  const outQueue = [];
  const pushIfClear = (p) => {
    if (p >= 0 && p < w * h && cleared[p] && !outside[p]) {
      outside[p] = 1;
      outQueue.push(p);
    }
  };
  for (let x = 0; x < w; x++) {
    pushIfClear(x);
    pushIfClear((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    pushIfClear(y * w);
    pushIfClear(y * w + w - 1);
  }
  while (outQueue.length) {
    const p = outQueue.pop();
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) pushIfClear(p - 1);
    if (x < w - 1) pushIfClear(p + 1);
    if (y > 0) pushIfClear(p - w);
    if (y < h - 1) pushIfClear(p + w);
  }

  // Compose final alpha: keep the largest component, restore its holes, drop
  // everything else.
  for (let p = 0; p < w * h; p++) {
    const keep = (!cleared[p] && label[p] === best.id) || (cleared[p] && !outside[p]);
    if (keep) {
      data[p * 4] = original[p * 4];
      data[p * 4 + 1] = original[p * 4 + 1];
      data[p * 4 + 2] = original[p * 4 + 2];
      data[p * 4 + 3] = 255;
    } else {
      data[p * 4 + 3] = 0;
    }
  }

  // --- 4. Feather, so the silhouette doesn't stair-step against the page.
  const alphaCopy = new Uint8Array(w * h);
  for (let p = 0; p < w * h; p++) alphaCopy[p] = data[p * 4 + 3];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const p = y * w + x;
      if (alphaCopy[p] === 0) continue;
      const open =
        (alphaCopy[p - 1] === 0 ? 1 : 0) +
        (alphaCopy[p + 1] === 0 ? 1 : 0) +
        (alphaCopy[p - w] === 0 ? 1 : 0) +
        (alphaCopy[p + w] === 0 ? 1 : 0);
      if (open > 0) data[p * 4 + 3] = Math.round(255 * (1 - open / 5));
    }
  }

  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[at(x, y) + 3] > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 4;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(w - cropX, maxX - minX + 1 + pad * 2);
  const cropH = Math.min(h - cropY, maxY - minY + 1 + pad * 2);
  image.crop({ x: cropX, y: cropY, w: cropW, h: cropH });

  await image.write(path.join(imagesDir, job.to));
  console.log(`${job.from} -> ${job.to} (${cropW}x${cropH})`);
}
