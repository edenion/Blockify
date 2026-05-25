import { describe, it, expect } from 'vitest';
import { quantize } from '../../../src/engine/algorithms/quantize';

function createImageData(width: number, height: number, colors: [number, number, number][]): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const color = colors[i % colors.length];
    data[i * 4] = color[0];
    data[i * 4 + 1] = color[1];
    data[i * 4 + 2] = color[2];
    data[i * 4 + 3] = 255;
  }
  return new ImageData(data, width, height);
}

describe('quantize', () => {
  it('none method returns identical image', () => {
    const source = createImageData(2, 2, [[100, 150, 200]]);
    const result = quantize(source, { method: 'none' });
    expect(result.data[0]).toBe(100);
    expect(result.data[1]).toBe(150);
    expect(result.data[2]).toBe(200);
  });

  it('fixed-palette maps colors to nearest palette color', () => {
    const source = createImageData(2, 2, [[200, 200, 200]]);
    const result = quantize(source, {
      method: 'fixed-palette',
      palette: [
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
      ],
    });
    expect(result.data[0]).toBe(255);
    expect(result.data[1]).toBe(255);
    expect(result.data[2]).toBe(255);
  });
});
