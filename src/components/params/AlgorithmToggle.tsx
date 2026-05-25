import { useAppStore } from '../../store';

export function AlgorithmToggle() {
  const algorithm = useAppStore((s) => s.params.algorithm);
  const setParams = useAppStore((s) => s.setParams);

  return (
    <div className="space-y-2">
      <label className="text-retro-muted text-xs font-pixel">降采样算法</label>
      <div className="flex border border-retro-border">
        <button
          onClick={() => setParams({ algorithm: 'nearest' })}
          className={`flex-1 py-1.5 text-xs font-terminal transition-colors ${
            algorithm === 'nearest'
              ? 'bg-retro-primary text-retro-bg'
              : 'text-retro-muted hover:text-retro-text'
          }`}
        >
          Nearest
        </button>
        <button
          onClick={() => setParams({ algorithm: 'average' })}
          className={`flex-1 py-1.5 text-xs font-terminal transition-colors border-l border-retro-border ${
            algorithm === 'average'
              ? 'bg-retro-primary text-retro-bg'
              : 'text-retro-muted hover:text-retro-text'
          }`}
        >
          Average
        </button>
      </div>
    </div>
  );
}
