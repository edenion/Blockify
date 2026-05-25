import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store';
import { processImage } from '../../engine';
import { createPresetRegistry } from '../../engine/presets';
import { imageToImageData, imageDataToCanvas } from '../../utils/image';
import type { ProcessOptions } from '../../engine/types';

const registry = createPresetRegistry();

export function ImageCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImage = useAppStore((s) => s.originalImage);
  const params = useAppStore((s) => s.params);
  const presetId = useAppStore((s) => s.presetId);
  const setIsProcessing = useAppStore((s) => s.setIsProcessing);

  useEffect(() => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);

    // Use requestAnimationFrame for non-blocking processing
    requestAnimationFrame(() => {
      const sourceData = imageToImageData(originalImage);

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
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      canvas.width = resultCanvas.width;
      canvas.height = resultCanvas.height;
      ctx.drawImage(resultCanvas, 0, 0);

      setIsProcessing(false);
    });
  }, [originalImage, params, presetId, setIsProcessing]);

  if (!originalImage) return null;

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full max-h-full object-contain"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
