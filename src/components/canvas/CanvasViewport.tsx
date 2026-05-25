import { useAppStore } from '../../store';
import { UploadZone } from './UploadZone';
import { ImageCanvas } from './ImageCanvas';

export function CanvasViewport() {
  const originalImage = useAppStore((s) => s.originalImage);

  return (
    <div className="flex-1 bg-retro-bg flex items-center justify-center p-4 overflow-auto">
      {originalImage ? <ImageCanvas /> : <UploadZone />}
    </div>
  );
}
