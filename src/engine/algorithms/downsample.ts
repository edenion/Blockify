import type { DownsampleOptions } from '../types';

export function downsample(source: ImageData, options: DownsampleOptions): ImageData {
  const { width, height, data: srcData } = source;
  const { blockSize, algorithm } = options;

  const destData = new Uint8ClampedArray(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const blockX = Math.floor(x / blockSize) * blockSize;
      const blockY = Math.floor(y / blockSize) * blockSize;

      let r: number, g: number, b: number;

      if (algorithm === 'nearest') {
        const centerX = blockX + Math.floor(blockSize / 2);
        const centerY = blockY + Math.floor(blockSize / 2);
        const clampedX = Math.min(centerX, width - 1);
        const clampedY = Math.min(centerY, height - 1);
        const idx = (clampedY * width + clampedX) * 4;
        r = srcData[idx];
        g = srcData[idx + 1];
        b = srcData[idx + 2];
      } else {
        // average
        let sumR = 0, sumG = 0, sumB = 0, count = 0;
        for (let by = 0; by < blockSize; by++) {
          for (let bx = 0; bx < blockSize; bx++) {
            const sx = blockX + bx;
            const sy = blockY + by;
            if (sx >= width || sy >= height) continue;
            const idx = (sy * width + sx) * 4;
            sumR += srcData[idx];
            sumG += srcData[idx + 1];
            sumB += srcData[idx + 2];
            count++;
          }
        }
        r = Math.round(sumR / count);
        g = Math.round(sumG / count);
        b = Math.round(sumB / count);
      }

      const destIdx = (y * width + x) * 4;
      destData[destIdx] = r;
      destData[destIdx + 1] = g;
      destData[destIdx + 2] = b;
      destData[destIdx + 3] = 255;
    }
  }

  return new ImageData(destData, width, height);
}
