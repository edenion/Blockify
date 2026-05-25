import { useAppStore } from '../../store';
import type { PersonMode } from '../../store';

const modes: { id: PersonMode; label: string; desc: string }[] = [
  { id: 'normal', label: 'Normal', desc: '普通像素化处理' },
  { id: 'cutout', label: 'Cutout', desc: '人像分割+背景处理' },
  { id: 'style', label: 'Style', desc: '轮廓增强像素风' },
  { id: 'sprite', label: 'Sprite', desc: '多图拼接精灵图' },
];

const bgModes = [
  { id: 'keep' as const, label: '保留' },
  { id: 'pixelate' as const, label: '像素化' },
  { id: 'color' as const, label: '纯色' },
];

export function PersonModeSelector() {
  const personMode = useAppStore((s) => s.personMode);
  const setPersonMode = useAppStore((s) => s.setPersonMode);
  const cutoutBg = useAppStore((s) => s.cutoutBg);
  const setCutoutBg = useAppStore((s) => s.setCutoutBg);
  const cutoutBgColor = useAppStore((s) => s.cutoutBgColor);
  const setCutoutBgColor = useAppStore((s) => s.setCutoutBgColor);

  const handleSelect = (id: PersonMode) => {
    if (personMode === id) {
      setPersonMode(null);
    } else {
      setPersonMode(id);
    }
  };

  const activeMode = modes.find((m) => m.id === personMode);

  return (
    <div className="space-y-3">
      <h3 className="text-retro-muted text-xs font-pixel">PERSON MODE</h3>

      <div className="grid grid-cols-2 gap-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => handleSelect(mode.id)}
            className={`py-2 px-2 text-[10px] font-terminal border transition-colors text-left ${
              personMode === mode.id
                ? 'border-retro-primary bg-retro-primary/10 text-retro-primary'
                : 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {activeMode && (
        <p className="text-[10px] font-terminal text-retro-muted leading-relaxed">
          {activeMode.desc}
        </p>
      )}

      {personMode === 'cutout' && (
        <div className="space-y-2 pt-2 border-t border-retro-border">
          <h4 className="text-retro-muted text-[10px] font-pixel">背景处理</h4>
          <div className="flex gap-2">
            {bgModes.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setCutoutBg(bg.id)}
                className={`flex-1 py-1.5 px-1 text-[10px] font-terminal border transition-colors ${
                  cutoutBg === bg.id
                    ? 'border-retro-primary bg-retro-primary/10 text-retro-primary'
                    : 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
          {cutoutBg === 'color' && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={cutoutBgColor}
                onChange={(e) => setCutoutBgColor(e.target.value)}
                className="w-8 h-8 bg-transparent border border-retro-border cursor-pointer"
              />
              <span className="text-[10px] font-terminal text-retro-muted">
                {cutoutBgColor}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
