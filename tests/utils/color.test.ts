import { describe, it, expect } from 'vitest';
import { colorDistance, findNearestColor } from '../../src/utils/color';

describe('color utils', () => {
  it('colorDistance computes Euclidean distance', () => {
    const d = colorDistance({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
    expect(d).toBeCloseTo(Math.sqrt(255 * 255 * 3), 0);
  });

  it('findNearestColor returns closest palette color', () => {
    const palette = [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ];
    const nearest = findNearestColor({ r: 200, g: 200, b: 200 }, palette);
    expect(nearest).toEqual({ r: 255, g: 255, b: 255 });
  });
});
