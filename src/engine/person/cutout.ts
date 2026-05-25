import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import type { ProcessOptions } from '../types';
import { processImage } from '../pipeline';

let selfieSegmentation: SelfieSegmentation | null = null;
let modelLoading = false;

async function ensureModel(): Promise<SelfieSegmentation> {
  if (selfieSegmentation) return selfieSegmentation;
  if (modelLoading) {
    while (modelLoading) await new Promise((r) => setTimeout(r, 100));
    if (selfieSegmentation) return selfieSegmentation;
  }
  modelLoading = true;
  const ss = new SelfieSegmentation({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  });
  ss.setOptions({ modelSelection: 1 });
  await ss.initialize();
  selfieSegmentation = ss;
  modelLoading = false;
  return ss;
}

export async function processCutout(
  source: ImageData,
  options: ProcessOptions,
  bgMode: 'keep' | 'pixelate' | 'color',
  bgColor: string
): Promise<ImageData> {
  const ss = await ensureModel();

  // Feed source to mediapipe via canvas
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(source, 0, 0);

  const maskData = await new Promise<ImageData>((resolve, reject) => {
    ss.onResults((results) => {
      const maskCanvas = results.segmentationMask as HTMLCanvasElement;
      const maskCtx = maskCanvas.getContext('2d')!;
      resolve(maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height));
    });
    ss.send({ image: canvas }).catch(reject);
  });

  const mask = maskData;
  const processed = processImage(source, options);
  const result = new Uint8ClampedArray(source.data);

  // Parse bg color
  let bgR = 15, bgG = 23, bgB = 42;
  if (bgMode === 'color') {
    const hex = bgColor.replace('#', '');
    bgR = parseInt(hex.substring(0, 2), 16);
    bgG = parseInt(hex.substring(2, 4), 16);
    bgB = parseInt(hex.substring(4, 6), 16);
  }

  for (let i = 0; i < source.width * source.height; i++) {
    const maskVal = mask.data[i * 4];
    const isForeground = maskVal > 128;
    const idx = i * 4;

    if (isForeground) {
      result[idx] = processed.data[idx];
      result[idx + 1] = processed.data[idx + 1];
      result[idx + 2] = processed.data[idx + 2];
    } else {
      if (bgMode === 'keep') {
        // keep original — result already has source data
      } else if (bgMode === 'pixelate') {
        result[idx] = processed.data[idx];
        result[idx + 1] = processed.data[idx + 1];
        result[idx + 2] = processed.data[idx + 2];
      } else if (bgMode === 'color') {
        result[idx] = bgR;
        result[idx + 1] = bgG;
        result[idx + 2] = bgB;
      }
    }
  }

  return new ImageData(result, source.width, source.height);
}
