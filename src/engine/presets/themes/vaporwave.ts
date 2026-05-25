import type { Preset } from '../registry';

export const vaporwavePreset: Preset = {
  id: 'vaporwave',
  name: '蒸汽波',
  category: 'theme',
  config: {
    downsample: { blockSize: 4, algorithm: 'average' },
    quantize: {
      method: 'median-cut',
      maxColors: 16,
    },
  },
};
