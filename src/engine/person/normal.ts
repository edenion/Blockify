import type { ProcessOptions } from '../types';
import { processImage } from '../pipeline';

export function processNormal(source: ImageData, options: ProcessOptions): ImageData {
  return processImage(source, options);
}
