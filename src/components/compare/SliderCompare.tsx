import { useRef, useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../../store';
import { processImage } from '../../engine';
import { processStyle } from '../../engine/person/style';
import { processCutout } from '../../engine/person/cutout';
import { createPresetRegistry } from '../../engine/presets';
import { imageToImageData, imageDataToCanvas } from '../../utils/image';
import { createMask, applyMask } from '../../engine/selection/mask';
import type { ProcessOptions } from '../../engine/types';

const registry = createPresetRegistry();

export function SliderCompare() {
  const containerRef = useRef<HTMLDivElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const processedCanvasRef = useRef<HTMLCanvasElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

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
    if (!originalImage || !originalCanvasRef.current || !processedCanvasRef.current) return;

    let cancelled = false;

    const render = async () => {
      const sourceData = imageToImageData(originalImage);
      if (cancelled) return;

      // Draw original
      const origCanvas = originalCanvasRef.current!;
      origCanvas.width = originalImage.naturalWidth;
      origCanvas.height = originalImage.naturalHeight;
      const origCtx = origCanvas.getContext('2d')!;
      origCtx.drawImage(originalImage, 0, 0);

      // Draw processed
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
      const procCanvas = processedCanvasRef.current!;
      procCanvas.width = resultCanvas.width;
      procCanvas.height = resultCanvas.height;
      const procCtx = procCanvas.getContext('2d')!;
      procCtx.drawImage(resultCanvas, 0, 0);
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [originalImage, params, presetId, customPalette, personMode, cutoutBg, cutoutBgColor, shape, invert]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(percent);
    },
    [isDragging]
  );

  if (!originalImage) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Original (full) */}
      <canvas
        ref={originalCanvasRef}
        className="absolute max-w-full max-h-full object-contain"
        style={{ zIndex: 1 }}
      />

      {/* Processed (clipped) */}
      <div
        className="absolute max-w-full max-h-full overflow-hidden"
        style={{
          width: `${sliderPos}%`,
          zIndex: 2,
        }}
      >
        <canvas
          ref={processedCanvasRef}
          className="max-w-none max-h-none object-contain"
          style={{
            width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
            height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
            imageRendering: 'pixelated',
          }}
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-retro-primary cursor-ew-resize"
        style={{ left: `${sliderPos}%`, zIndex: 3 }}
        onMouseDown={() => setIsDragging(true)}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-retro-primary rounded-full flex items-center justify-center">
          <span className="text-retro-bg text-xs">{'<>'}</span>
        </div>
      </div>
    </div>
  );
}
