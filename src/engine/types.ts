export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type DownsampleAlgorithm = 'nearest' | 'average';

export interface DownsampleOptions {
  blockSize: number;
  algorithm: DownsampleAlgorithm;
}

export type QuantizeMethod = 'none' | 'median-cut' | 'fixed-palette';

export interface QuantizeOptions {
  method: QuantizeMethod;
  maxColors?: number;
  palette?: RGB[];
}

export interface ProcessOptions {
  downsample: DownsampleOptions;
  quantize: QuantizeOptions;
}

export interface PixelEngine {
  process(source: ImageData, options: ProcessOptions): ImageData;
}
