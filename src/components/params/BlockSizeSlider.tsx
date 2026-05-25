import { useState, useEffect } from 'react';
import { useAppStore } from '../../store';

export function BlockSizeSlider() {
  const blockSize = useAppStore((s) => s.params.blockSize);
  const setParams = useAppStore((s) => s.setParams);
  const saveSnapshot = useAppStore((s) => s.saveSnapshot);
  const [localValue, setLocalValue] = useState(blockSize);

  useEffect(() => {
    setLocalValue(blockSize);
  }, [blockSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams({ blockSize: localValue });
    }, 150);
    return () => clearTimeout(timer);
  }, [localValue, setParams]);

  return (
    <div className="space-y-2">
      <label className="text-retro-muted text-xs font-pixel flex justify-between">
        <span>像素块大小</span>
        <span className="text-retro-primary">{localValue}px</span>
      </label>
      <input
        type="range"
        min={2}
        max={64}
        value={localValue}
        onChange={(e) => setLocalValue(Number(e.target.value))}
        onMouseUp={() => saveSnapshot()}
        className="w-full h-2 bg-retro-border appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:bg-retro-primary
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-3
          [&::-moz-range-thumb]:h-3
          [&::-moz-range-thumb]:bg-retro-primary
          [&::-moz-range-thumb]:border-none
          [&::-moz-range-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-retro-muted font-terminal">
        <span>2</span>
        <span>64</span>
      </div>
    </div>
  );
}
