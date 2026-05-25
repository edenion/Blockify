import type { ProcessOptions } from '../types';
import { processImage } from '../pipeline';
import { imageToImageData, imageDataToCanvas } from '../../utils/image';

export interface SpriteSheetOptions {
  layout: 'horizontal' | 'grid';
  gridCols: number;
  padding: number;
}

export function createSpriteSheet(
  images: HTMLImageElement[],
  options: ProcessOptions,
  sheetOptions: SpriteSheetOptions
): HTMLCanvasElement {
  if (images.length === 0) {
    const empty = document.createElement('canvas');
    empty.width = 1;
    empty.height = 1;
    return empty;
  }

  // Process each image with the same options
  const processedCanvases = images.map((img) => {
    const sourceData = imageToImageData(img);
    const result = processImage(sourceData, options);
    return imageDataToCanvas(result);
  });

  const frameW = processedCanvases[0].width;
  const frameH = processedCanvases[0].height;
  const count = processedCanvases.length;

  let cols: number;
  let rows: number;

  if (sheetOptions.layout === 'horizontal') {
    cols = count;
    rows = 1;
  } else {
    cols = sheetOptions.gridCols;
    rows = Math.ceil(count / cols);
  }

  const canvas = document.createElement('canvas');
  canvas.width = cols * frameW + (cols - 1) * sheetOptions.padding;
  canvas.height = rows * frameH + (rows - 1) * sheetOptions.padding;

  const ctx = canvas.getContext('2d')!;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * (frameW + sheetOptions.padding);
    const y = row * (frameH + sheetOptions.padding);
    ctx.drawImage(processedCanvases[i], x, y);
  }

  return canvas;
}
