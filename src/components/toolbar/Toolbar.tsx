import { ExportButton } from './ExportButton';

export type SelectionTool = 'rectangle' | 'circle' | null;

interface ToolbarProps {
  onSelectTool: (tool: SelectionTool) => void;
  activeTool: SelectionTool;
}

export function Toolbar({ onSelectTool, activeTool }: ToolbarProps) {
  return (
    <div className="w-14 bg-retro-panel border-r-2 border-retro-border flex flex-col items-center py-3 gap-2">
      <span className="text-retro-muted text-[10px] font-pixel mb-2">TOOLS</span>

      <button
        onClick={() => onSelectTool(activeTool === 'rectangle' ? null : 'rectangle')}
        className={`w-10 h-10 border flex items-center justify-center transition-colors ${
          activeTool === 'rectangle'
            ? 'border-retro-primary text-retro-primary bg-retro-primary/10'
            : 'border-retro-border text-retro-muted hover:text-retro-text hover:border-retro-text'
        }`}
        title="矩形框选"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="0" />
        </svg>
      </button>

      <button
        onClick={() => onSelectTool(activeTool === 'circle' ? null : 'circle')}
        className={`w-10 h-10 border flex items-center justify-center transition-colors ${
          activeTool === 'circle'
            ? 'border-retro-primary text-retro-primary bg-retro-primary/10'
            : 'border-retro-border text-retro-muted hover:text-retro-text hover:border-retro-text'
        }`}
        title="圆形框选"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
        </svg>
      </button>

      <div className="flex-1" />
      <ExportButton />
    </div>
  );
}
