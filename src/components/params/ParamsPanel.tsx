import { useState } from 'react';
import { useAppStore } from '../../store';
import { BlockSizeSlider } from './BlockSizeSlider';
import { AlgorithmToggle } from './AlgorithmToggle';
import { PresetSelector } from './PresetSelector';
import { QuantizeModeSelector } from './QuantizeModeSelector';
import { MaskInvertToggle } from './MaskInvertToggle';
import { PersonModeSelector } from './PersonModeSelector';
import { CustomPaletteEditor } from './CustomPaletteEditor';
import { CustomPresetManager } from './CustomPresetManager';

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

function PanelContent() {
  return (
    <>
      <h2 className="text-retro-primary text-xs font-pixel mb-4">PARAMETERS</h2>
      <BlockSizeSlider />
      <AlgorithmToggle />
      <QuantizeModeSelector />
      <PresetSelector />
      <CustomPresetManager />
      <MaskInvertToggle />
      <PersonModeSelector />
      <CustomPaletteEditor />
      <CompareControl />
    </>
  );
}

export function ParamsPanel() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 bg-retro-panel border-l-2 border-retro-border p-4 space-y-6 overflow-y-auto">
        <PanelContent />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-64 bg-retro-panel border-l-2 border-retro-border p-4 space-y-6 overflow-y-auto z-50 md:hidden">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-retro-primary text-xs font-pixel">PARAMETERS</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-retro-muted hover:text-retro-text text-lg leading-none"
                aria-label="关闭"
              >
                ×
              </button>
            </div>
            <PanelContent />
          </div>
        </>
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-retro-panel border-2 border-retro-border rounded-sm flex items-center justify-center text-retro-primary text-lg font-pixel shadow-lg md:hidden z-30 hover:border-retro-primary transition-colors"
        aria-label="打开参数面板"
      >
        ⚙
      </button>
    </>
  );
}
