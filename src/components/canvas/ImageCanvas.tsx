import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store';
import { processImage } from '../../engine';
import { createPresetRegistry } from '../../engine/presets';
import { imageToImageData, imageDataToCanvas } from '../../utils/image';
import { createMask, applyMask } from '../../engine/selection/mask';
import type { Shape } from '../../engine/selection/shapes';
import type { ProcessOptions } from '../../engine/types';
import { SelectionOverlay } from './SelectionOverlay';
import type { SelectionTool } from './SelectionOverlay';

const registry = createPresetRegistry();

interface ImageCanvasProps {
  selectionTool?: SelectionTool;
}

export function ImageCanvas({ selectionTool }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImage = useAppStore((s) => s.originalImage);
  const params = useAppStore((s) => s.params);
  const presetId = useAppStore((s) => s.presetId);
  const setIsProcessing = useAppStore((s) => s.setIsProcessing);
  const [shape, setShape] = useState<Shape | null>(null);

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

      let result = processImage(sourceData, options);

      // Apply selection mask if shape exists
      if (shape) {
        const mask = createMask(shape, sourceData.width, sourceData.height, false);
        result = applyMask(sourceData, result, mask);
      }

      const resultCanvas = imageDataToCanvas(result);
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      canvas.width = resultCanvas.width;
      canvas.height = resultCanvas.height;
      ctx.drawImage(resultCanvas, 0, 0);

      setIsProcessing(false);
    });
  }, [originalImage, params, presetId, setIsProcessing, shape]);

  if (!originalImage) return null;

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
      <SelectionOverlay
        width={originalImage.naturalWidth}
        height={originalImage.naturalHeight}
        tool={selectionTool ?? null}
        onShapeCreated={setShape}
      />
    </div>
  );
}
