import { useState } from 'react';
import { useAppStore } from '../../store';
import type { Preset } from '../../engine/presets/registry';

export function CustomPresetManager() {
  const params = useAppStore((s) => s.params);
  const customPalette = useAppStore((s) => s.customPalette);
  const customPresets = useAppStore((s) => s.customPresets);
  const addCustomPreset = useAppStore((s) => s.addCustomPreset);
  const removeCustomPreset = useAppStore((s) => s.removeCustomPreset);
  const presetId = useAppStore((s) => s.presetId);
  const setPresetId = useAppStore((s) => s.setPresetId);
  const setParams = useAppStore((s) => s.setParams);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const preset: Preset = {
      id: `custom-${Date.now()}`,
      name: trimmed,
      category: 'custom',
      config: {
        downsample: {
          blockSize: params.blockSize,
          algorithm: params.algorithm,
        },
        quantize: {
          method: params.quantizeMethod,
          maxColors: params.maxColors,
          palette: customPalette.length > 0 ? customPalette : undefined,
        },
      },
    };

    addCustomPreset(preset);
    setName('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setName('');
    }
  };

  const handleSelect = (id: string) => {
    if (presetId === id) {
      setPresetId(null);
      return;
    }
    const preset = customPresets.find((p) => p.id === id);
    if (preset) {
      setParams({
        blockSize: preset.config.downsample.blockSize,
        algorithm: preset.config.downsample.algorithm,
        quantizeMethod: preset.config.quantize.method,
        maxColors: preset.config.quantize.maxColors ?? params.maxColors,
      });
    }
    setPresetId(id);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-retro-muted text-xs font-pixel">CUSTOM PRESETS</h3>

      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-1.5 text-[10px] font-terminal border border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text transition-colors"
        >
          保存当前参数为预设
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="预设名称"
            autoFocus
            className="w-full px-2 py-1.5 text-[10px] font-terminal bg-retro-bg border border-retro-border text-retro-text placeholder:text-retro-muted/50 focus:outline-none focus:border-retro-primary"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className={`flex-1 py-1 text-[10px] font-terminal border transition-colors ${
                name.trim()
                  ? 'border-retro-primary text-retro-primary hover:bg-retro-primary/10'
                  : 'border-retro-border text-retro-muted opacity-30 cursor-not-allowed'
              }`}
            >
              保存
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setName('');
              }}
              className="flex-1 py-1 text-[10px] font-terminal border border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {customPresets.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {customPresets.map((preset) => (
            <div key={preset.id} className="relative group">
              <button
                onClick={() => handleSelect(preset.id)}
                className={`w-full py-2 px-2 text-[10px] font-terminal border transition-colors text-left pr-6 ${
                  presetId === preset.id
                    ? 'border-retro-primary bg-retro-primary/10 text-retro-primary'
                    : 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
                }`}
              >
                {preset.name}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeCustomPreset(preset.id);
                  if (presetId === preset.id) {
                    setPresetId(null);
                  }
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[10px] text-retro-muted hover:text-retro-warning transition-colors"
                title="删除预设"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
