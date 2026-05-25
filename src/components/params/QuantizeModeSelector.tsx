import { useAppStore } from '../../store';
import type { QuantizeMethod } from '../../engine/types';

export function QuantizeModeSelector() {
  const params = useAppStore((s) => s.params);
  const setParams = useAppStore((s) => s.setParams);
  const saveSnapshot = useAppStore((s) => s.saveSnapshot);

  const method = params.quantizeMethod;
  const maxColors = params.maxColors;

  const handleMethodChange = (newMethod: QuantizeMethod) => {
    setParams({ quantizeMethod: newMethod, maxColors });
    saveSnapshot();
  };

  const handleMaxColorsChange = (value: number) => {
    setParams({ maxColors: value });
    saveSnapshot();
  };

  return (
    <div className="space-y-2">
      <label className="text-retro-muted text-xs font-pixel">颜色量化</label>
      <div className="flex border border-retro-border">
        {(['none', 'median-cut', 'fixed-palette'] as QuantizeMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => handleMethodChange(m)}
            className={`flex-1 py-1 text-[10px] font-terminal transition-colors ${
              method === m
                ? 'bg-retro-primary text-retro-bg'
                : 'text-retro-muted hover:text-retro-text'
            } ${m !== 'none' ? 'border-l border-retro-border' : ''}`}
          >
            {m === 'none' ? 'None' : m === 'median-cut' ? 'Median' : 'Fixed'}
          </button>
        ))}
      </div>
      {method === 'median-cut' && (
        <div className="space-y-1">
          <label className="text-retro-muted text-[10px] font-terminal flex justify-between">
            <span>最大颜色数</span>
            <span className="text-retro-primary">{maxColors}</span>
          </label>
          <input
            type="range"
            min={2}
            max={256}
            value={maxColors}
            onChange={(e) => handleMaxColorsChange(Number(e.target.value))}
            className="w-full h-1.5 bg-retro-border appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-2.5
              [&::-webkit-slider-thumb]:h-2.5
              [&::-webkit-slider-thumb]:bg-retro-primary
              [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      )}
      {method === 'fixed-palette' && (
        <p className="text-[10px] font-terminal text-retro-muted">
          使用当前预设或自定义调色板中的颜色
        </p>
      )}
    </div>
  );
}
