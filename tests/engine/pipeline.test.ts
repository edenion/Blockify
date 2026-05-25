import { describe, it, expect } from 'vitest';
import { processImage } from '../../src/engine/pipeline';

function createImageData(width: number, height: number, fillColor: [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fillColor[0];
    data[i + 1] = fillColor[1];
    data[i + 2] = fillColor[2];
    data[i + 3] = 255;
  }
  return new ImageData(data, width, height);
}

describe('processImage', () => {
  it('processes image with default options', () => {
    const source = createImageData(4, 4, [100, 150, 200]);
    const result = processImage(source, {
      downsample: { blockSize: 2, algorithm: 'nearest' },
      quantize: { method: 'none' },
    });

    expect(result.width).toBe(4);
    expect(result.height).toBe(4);
  });

  it('applies GameBoy preset correctly', () => {
    const source = createImageData(8, 8, [139, 172, 15]);
    const result = processImage(source, {
      downsample: { blockSize: 4, algorithm: 'nearest' },
      quantize: {
        method: 'fixed-palette',
        palette: [
          { r: 15, g: 56, b: 15 },
          { r: 48, g: 98, b: 48 },
          { r: 139, g: 172, b: 15 },
          { r: 155, g: 188, b: 15 },
        ],
      },
    });

    // All pixels should be mapped to one of the GameBoy colors
    const validColors = [
      [15, 56, 15],
      [48, 98, 48],
      [139, 172, 15],
      [155, 188, 15],
    ];

    for (let i = 0; i < result.data.length; i += 4) {
      const pixel = [result.data[i], result.data[i + 1], result.data[i + 2]];
      const isValid = validColors.some(
        c => c[0] === pixel[0] && c[1] === pixel[1] && c[2] === pixel[2]
      );
      expect(isValid).toBe(true);
    }
  });
});
