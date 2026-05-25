import { describe, it, expect } from 'vitest';
import type { RGB, DownsampleOptions } from '../../src/engine/types';

describe('engine types', () => {
  it('RGB type should accept valid color values', () => {
    const color: RGB = { r: 255, g: 128, b: 0 };
    expect(color.r).toBe(255);
    expect(color.g).toBe(128);
    expect(color.b).toBe(0);
  });

  it('DownsampleOptions should have required fields', () => {
    const opts: DownsampleOptions = {
      blockSize: 8,
      algorithm: 'nearest',
    };
    expect(opts.blockSize).toBeGreaterThanOrEqual(2);
    expect(opts.blockSize).toBeLessThanOrEqual(64);
  });
});
