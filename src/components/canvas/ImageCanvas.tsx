import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store';
import { processImage } from '../../engine';
import { processNormal } from '../../engine/person/normal';
import { processCutout } from '../../engine/person/cutout';
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
  const customPalette = useAppStore((s) => s.customPalette);
  const setIsProcessing = useAppStore((s) => s.setIsProcessing);
  const invert = useAppStore((s) => s.selection.invert);
  const personMode = useAppStore((s) => s.personMode);
  const cutoutBg = useAppStore((s) => s.cutoutBg);
  const cutoutBgColor = useAppStore((s) => s.cutoutBgColor);
  const [shape, setShape] = useState<Shape | null>(null);

  useEffect(() => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);

    const process = async () => {
      const sourceData = imageToImageData(originalImage);

      let options: ProcessOptions = {
        downsample: { blockSize: params.blockSize, algorithm: params.algorithm },
        quantize: {
          method: params.quantizeMethod,
          maxColors: params.maxColors,
        },
      };

      if (presetId) {
        const preset = registry.get(presetId);
        if (preset) {
          options = {
            downsample: preset.config.downsample,
            quantize: preset.config.quantize,
          };
        }
      } else if (params.quantizeMethod === 'fixed-palette' && customPalette.length > 0) {
        options = {
          ...options,
          quantize: {
            method: 'fixed-palette',
            palette: customPalette,
          },
        };
      }

      let result: ImageData;
      if (personMode === 'cutout') {
        result = await processCutout(sourceData, options, cutoutBg, cutoutBgColor);
      } else if (personMode === 'normal') {
        result = processNormal(sourceData, options);
      } else {
        // Fallback for now — other modes will be implemented in later tasks
        result = processImage(sourceData, options);
      }

      // Apply selection mask if shape exists
      if (shape) {
        const mask = createMask(shape, sourceData.width, sourceData.height, invert);
        result = applyMask(sourceData, result, mask);
      }

      const resultCanvas = imageDataToCanvas(result);
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      canvas.width = resultCanvas.width;
      canvas.height = resultCanvas.height;
      ctx.drawImage(resultCanvas, 0, 0);

      setIsProcessing(false);
    };

    process();
  }, [originalImage, params, presetId, customPalette, setIsProcessing, shape, invert, personMode, cutoutBg, cutoutBgColor]);

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
