import { useAppStore } from '../../store';
import { UploadZone } from './UploadZone';
import { ImageCanvas } from './ImageCanvas';
import { SplitView } from '../compare/SplitView';
import { SliderCompare } from '../compare/SliderCompare';

export function CanvasViewport() {
  const originalImage = useAppStore((s) => s.originalImage);
  const { showCompare, compareMode } = useAppStore((s) => s.ui);

  if (!originalImage) {
    return (
      <div className="flex-1 bg-retro-bg flex items-center justify-center p-4">
        <UploadZone />
      </div>
    );
  }

  if (showCompare) {
    return (
      <div className="flex-1 bg-retro-bg p-4 overflow-hidden">
        {compareMode === 'split' ? <SplitView /> : <SliderCompare />}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-retro-bg flex items-center justify-center p-4 overflow-auto">
      <ImageCanvas />
    </div>
  );
}
