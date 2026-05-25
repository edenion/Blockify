import type { Preset } from '../registry';

export const monoPreset: Preset = {
  id: 'mono',
  name: '纯黑白',
  category: 'theme',
  config: {
    downsample: { blockSize: 4, algorithm: 'nearest' },
    quantize: {
      method: 'fixed-palette',
      palette: [
        { r: 0, g: 0, b: 0 },
        { r: 255, g: 255, b: 255 },
      ],
    },
  },
};
