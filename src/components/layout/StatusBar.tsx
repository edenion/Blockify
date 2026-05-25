import { useAppStore } from '../../store';

export function StatusBar() {
  const { originalImage, isProcessing } = useAppStore();

  const resolution = originalImage
    ? `${originalImage.naturalWidth}×${originalImage.naturalHeight}`
    : '—';

  return (
    <div className="h-7 bg-retro-panel border-t-2 border-retro-border flex items-center px-4 text-xs font-terminal text-retro-muted select-none">
      <span className="mr-6">
        [Status: {isProcessing ? 'Processing...' : 'Ready'}]
      </span>
      <span className="mr-6">[Resolution: {resolution}]</span>
      <span>[Zoom: 100%]</span>
    </div>
  );
}
