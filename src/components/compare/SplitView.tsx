import { useRef, useEffect } from 'react';
import { useAppStore } from '../../store';
import { processImage } from '../../engine';
import { createPresetRegistry } from '../../engine/presets';
import { imageToImageData, imageDataToCanvas } from '../../utils/image';
import type { ProcessOptions } from '../../engine/types';

const registry = createPresetRegistry();

export function SplitView() {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalImage = useAppStore((s) => s.originalImage);
  const params = useAppStore((s) => s.params);
  const presetId = useAppStore((s) => s.presetId);

  useEffect(() => {
    if (!originalImage || !leftCanvasRef.current || !rightCanvasRef.current) return;

    const sourceData = imageToImageData(originalImage);

    // Left: original
    const leftCanvas = leftCanvasRef.current;
    leftCanvas.width = originalImage.naturalWidth;
    leftCanvas.height = originalImage.naturalHeight;
    const leftCtx = leftCanvas.getContext('2d')!;
    leftCtx.drawImage(originalImage, 0, 0);

    // Right: processed
    let options: ProcessOptions = {
      downsample: { blockSize: params.blockSize, algorithm: params.algorithm },
      quantize: { method: 'none' },
    };

    if (presetId) {
      const preset = registry.get(presetId);
      if (preset) {
        options = {
          downsample: preset.config.downsample,
          quantize: preset.config.quantize,
        };
      }
    }

    const result = processImage(sourceData, options);
    const resultCanvas = imageDataToCanvas(result);

    const rightCanvas = rightCanvasRef.current;
    rightCanvas.width = resultCanvas.width;
    rightCanvas.height = resultCanvas.height;
    const rightCtx = rightCanvas.getContext('2d')!;
    rightCtx.drawImage(resultCanvas, 0, 0);
  }, [originalImage, params, presetId]);

  if (!originalImage) return null;

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 flex items-center justify-center border-r border-retro-border overflow-hidden">
        <canvas
          ref={leftCanvasRef}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <canvas
          ref={rightCanvasRef}
          className="max-w-full max-h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  );
}
