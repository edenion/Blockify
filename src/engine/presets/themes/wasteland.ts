import type { Preset } from '../registry';

export const wastelandPreset: Preset = {
  id: 'wasteland',
  name: '末世废土',
  category: 'theme',
  config: {
    downsample: { blockSize: 6, algorithm: 'average' },
    quantize: {
      method: 'median-cut',
      maxColors: 8,
    },
  },
};
