import type { Preset } from '../registry';

export const gameboyPreset: Preset = {
  id: 'gameboy',
  name: 'Game Boy',
  category: 'hardware',
  config: {
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
  },
};
