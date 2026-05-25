import type { QuantizeOptions, RGB } from '../types';
import { findNearestColor } from '../../utils/color';

export function quantize(source: ImageData, options: QuantizeOptions): ImageData {
  const { width, height, data: srcData } = source;
  const destData = new Uint8ClampedArray(srcData);

  if (options.method === 'none') {
    return new ImageData(destData, width, height);
  }

  if (options.method === 'fixed-palette' && options.palette) {
    for (let i = 0; i < srcData.length; i += 4) {
      const color: RGB = {
        r: srcData[i],
        g: srcData[i + 1],
        b: srcData[i + 2],
      };
      const nearest = findNearestColor(color, options.palette);
      destData[i] = nearest.r;
      destData[i + 1] = nearest.g;
      destData[i + 2] = nearest.b;
    }
    return new ImageData(destData, width, height);
  }

  if (options.method === 'median-cut' && options.maxColors) {
    const colors = extractColors(source, options.maxColors);
    for (let i = 0; i < srcData.length; i += 4) {
      const color: RGB = {
        r: srcData[i],
        g: srcData[i + 1],
        b: srcData[i + 2],
      };
      const nearest = findNearestColor(color, colors);
      destData[i] = nearest.r;
      destData[i + 1] = nearest.g;
      destData[i + 2] = nearest.b;
    }
  }

  return new ImageData(destData, width, height);
}

function extractColors(source: ImageData, maxColors: number): RGB[] {
  const { data } = source;
  const colorMap = new Map<string, RGB>();

  for (let i = 0; i < data.length; i += 4) {
    const key = `${data[i]},${data[i + 1]},${data[i + 2]}`;
    if (!colorMap.has(key)) {
      colorMap.set(key, { r: data[i], g: data[i + 1], b: data[i + 2] });
    }
  }

  const uniqueColors = Array.from(colorMap.values());

  if (uniqueColors.length <= maxColors) {
    return uniqueColors;
  }

  // Simple greedy selection: pick colors spread across the color space
  const selected: RGB[] = [uniqueColors[0]];

  while (selected.length < maxColors) {
    let farthest = uniqueColors[0];
    let maxMinDist = -1;

    for (const color of uniqueColors) {
      let minDist = Infinity;
      for (const s of selected) {
        const dist = Math.sqrt(
          (color.r - s.r) ** 2 +
          (color.g - s.g) ** 2 +
          (color.b - s.b) ** 2
        );
        minDist = Math.min(minDist, dist);
      }
      if (minDist > maxMinDist) {
        maxMinDist = minDist;
        farthest = color;
      }
    }

    selected.push(farthest);
  }

  return selected;
}
