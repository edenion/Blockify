import { useRef, useEffect } from 'react';
import { useAppStore } from '../../store';
import { processImage } from '../../engine';
import { processStyle } from '../../engine/person/style';
import { processCutout } from '../../engine/person/cutout';
import { createPresetRegistry } from '../../engine/presets';
import { imageToImageData, imageDataToCanvas } from '../../utils/image';
import { createMask, applyMask } from '../../engine/selection/mask';
import type { ProcessOptions } from '../../engine/types';

const registry = createPresetRegistry();

export function SplitView() {
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalImage = useAppStore((s) => s.originalImage);
  const params = useAppStore((s) => s.params);
  const presetId = useAppStore((s) => s.presetId);
  const customPalette = useAppStore((s) => s.customPalette);
  const personMode = useAppStore((s) => s.personMode);
  const cutoutBg = useAppStore((s) => s.cutoutBg);
  const cutoutBgColor = useAppStore((s) => s.cutoutBgColor);
  const shape = useAppStore((s) => s.selection.shape);
  const invert = useAppStore((s) => s.selection.invert);

  useEffect(() => {
    if (!originalImage || !leftCanvasRef.current || !rightCanvasRef.current) return;

    let cancelled = false;

    const render = async () => {
      const sourceData = imageToImageData(originalImage);
      if (cancelled) return;

      // Left: original
      const leftCanvas = leftCanvasRef.current!;
      leftCanvas.width = originalImage.naturalWidth;
      leftCanvas.height = originalImage.naturalHeight;
      const leftCtx = leftCanvas.getContext('2d')!;
      leftCtx.drawImage(originalImage, 0, 0);

      // Right: processed
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
        try {
          result = await processCutout(sourceData, options, cutoutBg, cutoutBgColor);
        } catch {
          result = processImage(sourceData, options);
        }
      } else if (personMode === 'style') {
        result = processStyle(sourceData, options);
      } else {
        result = processImage(sourceData, options);
      }

      if (shape) {
        const mask = createMask(shape, sourceData.width, sourceData.height, invert);
        result = applyMask(sourceData, result, mask);
      }

      if (cancelled) return;

      const resultCanvas = imageDataToCanvas(result);
      const rightCanvas = rightCanvasRef.current!;
      rightCanvas.width = resultCanvas.width;
      rightCanvas.height = resultCanvas.height;
      const rightCtx = rightCanvas.getContext('2d')!;
      rightCtx.drawImage(resultCanvas, 0, 0);
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [originalImage, params, presetId, customPalette, personMode, cutoutBg, cutoutBgColor, shape, invert]);

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
