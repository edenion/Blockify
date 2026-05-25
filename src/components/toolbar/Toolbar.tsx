import { ExportButton } from './ExportButton';

export type SelectionTool = 'rectangle' | 'circle' | 'polygon' | 'freehand' | null;

interface ToolbarProps {
  onSelectTool: (tool: SelectionTool) => void;
  activeTool: SelectionTool;
}

const TOOLS: { id: SelectionTool; label: string; title: string }[] = [
  { id: 'rectangle', label: '□', title: '矩形框选' },
  { id: 'circle', label: '○', title: '圆形框选' },
  { id: 'polygon', label: '◇', title: '多边形框选' },
  { id: 'freehand', label: '✎', title: '自由手绘' },
];

export function Toolbar({ onSelectTool, activeTool }: ToolbarProps) {
  return (
    <div className="w-14 bg-retro-panel border-r-2 border-retro-border flex flex-col items-center py-3 gap-2">
      <span className="text-retro-muted text-[10px] font-pixel mb-2">TOOLS</span>

      {TOOLS.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelectTool(activeTool === t.id ? null : t.id)}
          className={`w-10 h-10 border flex items-center justify-center transition-colors ${
            activeTool === t.id
              ? 'border-retro-primary text-retro-primary bg-retro-primary/10'
              : 'border-retro-border text-retro-muted hover:text-retro-text hover:border-retro-text'
          }`}
          title={t.title}
        >
          <span className="text-sm leading-none">{t.label}</span>
        </button>
      ))}

      <div className="flex-1" />
      <ExportButton />
    </div>
  );
}
