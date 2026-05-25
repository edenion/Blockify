import { useState } from 'react';
import { useAppStore } from '../../store';
import type { RGB } from '../../engine/types';

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

export function CustomPaletteEditor() {
  const customPalette = useAppStore((s) => s.customPalette);
  const addCustomPaletteColor = useAppStore((s) => s.addCustomPaletteColor);
  const removeCustomPaletteColor = useAppStore((s) => s.removeCustomPaletteColor);
  const saveSnapshot = useAppStore((s) => s.saveSnapshot);
  const [color, setColor] = useState('#00ff00');

  const canAdd = customPalette.length < 32;

  const handleAdd = () => {
    if (!canAdd) return;
    addCustomPaletteColor(hexToRgb(color));
    saveSnapshot();
  };

  const handleRemove = (index: number) => {
    removeCustomPaletteColor(index);
    saveSnapshot();
  };

  return (
    <div className="space-y-2">
      <h3 className="text-retro-muted text-xs font-pixel">CUSTOM PALETTE</h3>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 p-0 border border-retro-border bg-transparent cursor-pointer"
          style={{ imageRendering: 'pixelated' }}
        />
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={`flex-1 py-1.5 text-xs font-terminal border transition-colors ${
            canAdd
              ? 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
              : 'border-retro-border text-retro-muted opacity-30 cursor-not-allowed'
          }`}
        >
          添加
        </button>
        <span className="text-[10px] font-terminal text-retro-muted">
          {customPalette.length}/32
        </span>
      </div>

      {customPalette.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {customPalette.map((c, i) => (
            <button
              key={i}
              onClick={() => handleRemove(i)}
              className="w-6 h-6 border border-retro-border cursor-pointer hover:brightness-125"
              style={{ backgroundColor: rgbToHex(c) }}
              title={`删除 ${rgbToHex(c)}`}
            />
          ))}
        </div>
      )}

      <p className="text-[10px] font-terminal text-retro-muted">
        点击色块删除
      </p>
    </div>
  );
}
