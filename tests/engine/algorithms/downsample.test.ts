import { describe, it, expect } from 'vitest';
import { downsample } from '../../../src/engine/algorithms/downsample';

function createTestImageData(width: number, height: number, fillColor: [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fillColor[0];
    data[i + 1] = fillColor[1];
    data[i + 2] = fillColor[2];
    data[i + 3] = 255;
  }
  return new ImageData(data, width, height);
}

describe('downsample', () => {
  it('nearest algorithm with blockSize 2 reduces resolution by half', () => {
    const source = createTestImageData(4, 4, [255, 0, 0]);
    const result = downsample(source, { blockSize: 2, algorithm: 'nearest' });

    expect(result.width).toBe(4);
    expect(result.height).toBe(4);
    // Every 2x2 block should have the same color (center pixel of the block)
    expect(result.data[0]).toBe(255);
    expect(result.data[1]).toBe(0);
    expect(result.data[2]).toBe(0);
  });

  it('average algorithm computes mean color per block', () => {
    const data = new Uint8ClampedArray(4 * 4 * 4);
    // Fill with two colors in alternating blocks
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const i = (y * 4 + x) * 4;
        if (x < 2) {
          data[i] = 200; data[i + 1] = 0; data[i + 2] = 0;
        } else {
          data[i] = 0; data[i + 1] = 200; data[i + 2] = 0;
        }
        data[i + 3] = 255;
      }
    }
    const source = new ImageData(data, 4, 4);
    const result = downsample(source, { blockSize: 2, algorithm: 'average' });

    // Left half should be red-ish, right half green-ish
    expect(result.data[0]).toBe(200);
    expect(result.data[4 * 2]).toBe(0);
  });

  it('blockSize 1 returns identical image', () => {
    const source = createTestImageData(2, 2, [100, 150, 200]);
    const result = downsample(source, { blockSize: 1, algorithm: 'nearest' });

    for (let i = 0; i < source.data.length; i++) {
      expect(result.data[i]).toBe(source.data[i]);
    }
  });

  it('preserves source image dimensions', () => {
    const source = createTestImageData(3, 5, [10, 20, 30]);
    const result = downsample(source, { blockSize: 2, algorithm: 'nearest' });

    expect(result.width).toBe(3);
    expect(result.height).toBe(5);
  });

  it('handles edge blocks that extend beyond image boundaries', () => {
    // 3x3 image with blockSize 2 — bottom and right edges are partial blocks
    const data = new Uint8ClampedArray(3 * 3 * 4);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const i = (y * 3 + x) * 4;
        data[i] = x * 50;
        data[i + 1] = y * 50;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }
    }
    const source = new ImageData(data, 3, 3);
    const result = downsample(source, { blockSize: 2, algorithm: 'average' });

    // Should not throw and should return valid ImageData
    expect(result).toBeDefined();
    expect(result.data.length).toBe(3 * 3 * 4);
  });

  it('alpha channel is always 255', () => {
    const source = createTestImageData(2, 2, [50, 60, 70]);
    const result = downsample(source, { blockSize: 1, algorithm: 'nearest' });

    for (let i = 3; i < result.data.length; i += 4) {
      expect(result.data[i]).toBe(255);
    }
  });
});
