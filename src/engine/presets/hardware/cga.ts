import type { Preset } from '../registry';

export const cgaPreset: Preset = {
  id: 'cga',
  name: 'CGA',
  category: 'hardware',
  config: {
    downsample: { blockSize: 3, algorithm: 'nearest' },
    quantize: {
      method: 'fixed-palette',
      palette: [
        { r: 0, g: 0, b: 0 },
        { r: 85, g: 255, b: 255 },
        { r: 255, g: 85, b: 255 },
        { r: 255, g: 255, b: 255 },
      ],
    },
  },
};
