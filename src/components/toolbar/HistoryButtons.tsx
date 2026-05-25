import { useAppStore } from '../../store';

export function HistoryButtons() {
  const history = useAppStore((s) => s.history);
  const undo = useAppStore((s) => s.undo);
  const redo = useAppStore((s) => s.redo);

  return (
    <div className="flex gap-1">
      <button
        onClick={undo}
        disabled={history.past.length === 0}
        className="w-8 h-8 border border-retro-border flex items-center justify-center text-retro-muted hover:text-retro-primary hover:border-retro-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
        title="撤销 (Ctrl+Z)"
      >
        ↺
      </button>
      <button
        onClick={redo}
        disabled={history.future.length === 0}
        className="w-8 h-8 border border-retro-border flex items-center justify-center text-retro-muted hover:text-retro-primary hover:border-retro-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
        title="重做 (Ctrl+Shift+Z)"
      >
        ↻
      </button>
    </div>
  );
}
