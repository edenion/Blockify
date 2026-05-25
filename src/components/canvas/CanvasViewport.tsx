import { useAppStore } from '../../store';
import { UploadZone } from './UploadZone';
import { ImageCanvas } from './ImageCanvas';
import { SplitView } from '../compare/SplitView';
import { SliderCompare } from '../compare/SliderCompare';
import type { SelectionTool } from './SelectionOverlay';

interface CanvasViewportProps {
  selectionTool?: SelectionTool;
}

export function CanvasViewport({ selectionTool }: CanvasViewportProps) {
  const originalImage = useAppStore((s) => s.originalImage);
  const showCompare = useAppStore((s) => s.ui.showCompare);
  const compareMode = useAppStore((s) => s.ui.compareMode);

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
      <ImageCanvas selectionTool={selectionTool} />
    </div>
  );
}
