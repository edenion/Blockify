import type { ProcessOptions } from './types';
import { downsample } from './algorithms/downsample';
import { quantize } from './algorithms/quantize';

export function processImage(source: ImageData, options: ProcessOptions): ImageData {
  let result = source;

  // Step 1: Downsample
  result = downsample(result, options.downsample);

  // Step 2: Quantize
  result = quantize(result, options.quantize);

  return result;
}
