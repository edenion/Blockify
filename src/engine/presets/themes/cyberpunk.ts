import type { Preset } from '../registry';

export const cyberpunkPreset: Preset = {
  id: 'cyberpunk',
  name: '赛博朋克',
  category: 'theme',
  config: {
    downsample: { blockSize: 4, algorithm: 'nearest' },
    quantize: {
      method: 'fixed-palette',
      palette: [
        { r: 10, g: 10, b: 30 },
        { r: 255, g: 0, b: 255 },
        { r: 0, g: 255, b: 255 },
        { r: 255, g: 20, b: 147 },
        { r: 255, g: 255, b: 0 },
        { r: 0, g: 0, b: 0 },
        { r: 50, g: 0, b: 80 },
        { r: 0, g: 100, b: 100 },
      ],
    },
  },
};
