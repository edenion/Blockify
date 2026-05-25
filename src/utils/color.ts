import type { RGB } from '../engine/types';

export function colorDistance(a: RGB, b: RGB): number {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

export function findNearestColor(color: RGB, palette: RGB[]): RGB {
  let nearest = palette[0];
  let minDist = Infinity;

  for (const p of palette) {
    const dist = colorDistance(color, p);
    if (dist < minDist) {
      minDist = dist;
      nearest = p;
    }
  }

  return nearest;
}
