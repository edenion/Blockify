import { describe, it, expect } from 'vitest';
import { createMask, applyMask } from '../../../src/engine/selection/mask';
import {
  createRectangle,
  createPolygon,
  createFreehand,
} from '../../../src/engine/selection/shapes';

function createImageData(width: number, height: number, fill: [number, number, number]): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fill[0];
    data[i + 1] = fill[1];
    data[i + 2] = fill[2];
    data[i + 3] = 255;
  }
  return new ImageData(data, width, height);
}

describe('createMask', () => {
  it('rectangle mask marks inside pixels', () => {
    const rect = createRectangle({ x: 2, y: 2 }, { x: 5, y: 5 });
    const mask = createMask(rect, 8, 8, false);

    // Inside: (2,2) to (5,5) inclusive
    expect(mask[2 * 8 + 2]).toBe(1);
    expect(mask[5 * 8 + 5]).toBe(1);

    // Outside
    expect(mask[0]).toBe(0);
    expect(mask[1 * 8 + 1]).toBe(0);
    expect(mask[6 * 8 + 6]).toBe(0);
  });

  it('polygon mask with triangle', () => {
    const triangle = createPolygon([
      { x: 4, y: 1 },
      { x: 1, y: 7 },
      { x: 7, y: 7 },
    ]);
    const mask = createMask(triangle, 8, 8, false);

    // Center of triangle should be inside
    expect(mask[4 * 8 + 4]).toBe(1);
    expect(mask[5 * 8 + 4]).toBe(1);

    // Corners outside
    expect(mask[0]).toBe(0);
    expect(mask[7 * 8 + 0]).toBe(0);
  });

  it('freehand mask with simple path', () => {
    // A diamond-like closed path
    const path = createFreehand([
      { x: 4, y: 1 },
      { x: 7, y: 4 },
      { x: 4, y: 7 },
      { x: 1, y: 4 },
      { x: 4, y: 1 },
    ]);
    const mask = createMask(path, 8, 8, false);

    // Center should be inside
    expect(mask[4 * 8 + 4]).toBe(1);

    // Corner should be outside
    expect(mask[0]).toBe(0);
  });

  it('invert flips mask values', () => {
    const rect = createRectangle({ x: 2, y: 2 }, { x: 5, y: 5 });
    const maskNormal = createMask(rect, 8, 8, false);
    const maskInverted = createMask(rect, 8, 8, true);

    for (let i = 0; i < maskNormal.length; i++) {
      expect(maskInverted[i]).toBe(maskNormal[i] === 1 ? 0 : 1);
    }
  });
});

describe('applyMask', () => {
  it('applies processed pixels where mask is 1', () => {
    const width = 4;
    const height = 4;
    const source = createImageData(width, height, [255, 0, 0]);   // red
    const processed = createImageData(width, height, [0, 255, 0]); // green

    // Mask: only first 2 pixels are 1
    const mask = new Uint8Array(width * height);
    mask[0] = 1;
    mask[1] = 1;

    const result = applyMask(source, processed, mask);

    // Mask=1 -> processed (green)
    expect(result.data[0]).toBe(0);
    expect(result.data[1]).toBe(255);
    expect(result.data[2]).toBe(0);

    expect(result.data[4]).toBe(0);
    expect(result.data[5]).toBe(255);
    expect(result.data[6]).toBe(0);

    // Mask=0 -> source (red)
    expect(result.data[8]).toBe(255);
    expect(result.data[9]).toBe(0);
    expect(result.data[10]).toBe(0);
  });
});
