import type { ProcessOptions } from '../types';
import { processImage } from '../pipeline';
import { edgeEnhance } from '../algorithms/edge-enhance';

export function processStyle(source: ImageData, options: ProcessOptions): ImageData {
  // Step 1: Standard pixelization
  let result = processImage(source, options);

  // Step 2: Edge enhancement
  result = edgeEnhance(result, 25);

  return result;
}
