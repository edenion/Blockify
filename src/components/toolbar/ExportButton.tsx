import { useAppStore } from '../../store';
import { processImage } from '../../engine';
import { createPresetRegistry } from '../../engine/presets';
import { imageToImageData, imageDataToCanvas } from '../../utils/image';
import { downloadPNG } from '../../engine/export/png';
import type { ProcessOptions } from '../../engine/types';

const registry = createPresetRegistry();

export function ExportButton() {
  const originalImage = useAppStore((s) => s.originalImage);
  const params = useAppStore((s) => s.params);
  const presetId = useAppStore((s) => s.presetId);

  const handleExport = () => {
    if (!originalImage) return;

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
    const canvas = imageDataToCanvas(result);
    downloadPNG(canvas);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!originalImage}
      className="w-10 h-10 border border-retro-border flex items-center justify-center text-retro-muted hover:text-retro-primary hover:border-retro-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      title="导出 PNG"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );
}
