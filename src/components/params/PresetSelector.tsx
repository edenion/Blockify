import { useAppStore } from '../../store';
import { createPresetRegistry } from '../../engine/presets';

const registry = createPresetRegistry();

export function PresetSelector() {
  const presetId = useAppStore((s) => s.presetId);
  const setPresetId = useAppStore((s) => s.setPresetId);

  const hardwarePresets = registry.getByCategory('hardware');
  const themePresets = registry.getByCategory('theme');

  const handleSelect = (id: string) => {
    setPresetId(presetId === id ? null : id);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-retro-muted text-xs font-pixel">PRESETS</h3>

      <div>
        <h4 className="text-[10px] text-retro-muted font-terminal mb-2 uppercase tracking-wider">
          Hardware
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {hardwarePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset.id)}
              className={`py-2 px-2 text-[10px] font-terminal border transition-colors text-left ${
                presetId === preset.id
                  ? 'border-retro-primary bg-retro-primary/10 text-retro-primary'
                  : 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] text-retro-muted font-terminal mb-2 uppercase tracking-wider">
          Themes
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {themePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset.id)}
              className={`py-2 px-2 text-[10px] font-terminal border transition-colors text-left ${
                presetId === preset.id
                  ? 'border-retro-primary bg-retro-primary/10 text-retro-primary'
                  : 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {presetId && (
        <button
          onClick={() => setPresetId(null)}
          className="w-full py-1.5 text-[10px] font-terminal text-retro-muted border border-retro-border hover:border-retro-warning hover:text-retro-warning transition-colors"
        >
          清除预设
        </button>
      )}
    </div>
  );
}
