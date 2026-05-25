import { processImage } from './pipeline';
import type { ProcessOptions } from './types';

self.onmessage = (e: MessageEvent<{ imageData: ImageData; options: ProcessOptions }>) => {
  const { imageData, options } = e.data;
  try {
    const result = processImage(imageData, options);
    self.postMessage({ result }, { transfer: [result.data.buffer] });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
};

export {};
