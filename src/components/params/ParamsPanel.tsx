import { useAppStore } from '../../store';
import { BlockSizeSlider } from './BlockSizeSlider';
import { AlgorithmToggle } from './AlgorithmToggle';
import { PresetSelector } from './PresetSelector';
import { QuantizeModeSelector } from './QuantizeModeSelector';
import { MaskInvertToggle } from './MaskInvertToggle';

function CompareControl() {
  const { showCompare, compareMode } = useAppStore((s) => s.ui);
  const setCompareMode = useAppStore((s) => s.setCompareMode);
  const setCompareType = useAppStore((s) => s.setCompareType);

  return (
    <div className="space-y-2">
      <h3 className="text-retro-muted text-xs font-pixel">COMPARE</h3>
      <button
        onClick={() => setCompareMode(!showCompare)}
        className={`w-full py-1.5 text-xs font-terminal border transition-colors ${
          showCompare
            ? 'border-retro-primary bg-retro-primary/10 text-retro-primary'
            : 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
        }`}
      >
        {showCompare ? '关闭对比' : '开启对比'}
      </button>

      {showCompare && (
        <div className="flex border border-retro-border">
          <button
            onClick={() => setCompareType('split')}
            className={`flex-1 py-1 text-[10px] font-terminal transition-colors ${
              compareMode === 'split'
                ? 'bg-retro-primary text-retro-bg'
                : 'text-retro-muted hover:text-retro-text'
            }`}
          >
            并排
          </button>
          <button
            onClick={() => setCompareType('slider')}
            className={`flex-1 py-1 text-[10px] font-terminal transition-colors border-l border-retro-border ${
              compareMode === 'slider'
                ? 'bg-retro-primary text-retro-bg'
                : 'text-retro-muted hover:text-retro-text'
            }`}
          >
            滑块
          </button>
        </div>
      )}
    </div>
  );
}

export function ParamsPanel() {
  return (
    <div className="w-64 bg-retro-panel border-l-2 border-retro-border p-4 space-y-6 overflow-y-auto">
      <h2 className="text-retro-primary text-xs font-pixel mb-4">PARAMETERS</h2>
      <BlockSizeSlider />
      <AlgorithmToggle />
      <QuantizeModeSelector />
      <PresetSelector />
      <MaskInvertToggle />
      <CompareControl />
    </div>
  );
}
