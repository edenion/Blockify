import { ExportButton } from './ExportButton';

export function Toolbar() {
  return (
    <div className="w-14 bg-retro-panel border-r-2 border-retro-border flex flex-col items-center py-3 gap-2">
      <span className="text-retro-muted text-[10px] font-pixel mb-2">TOOLS</span>
      <ExportButton />
    </div>
  );
}
