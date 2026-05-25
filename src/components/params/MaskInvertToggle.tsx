import { useAppStore } from '../../store';

export function MaskInvertToggle() {
  const invert = useAppStore((s) => s.selection.invert);
  const setSelectionInvert = useAppStore((s) => s.setSelectionInvert);
  const saveSnapshot = useAppStore((s) => s.saveSnapshot);

  const handleToggle = () => {
    setSelectionInvert(!invert);
    saveSnapshot();
  };

  return (
    <div className="space-y-2">
      <h3 className="text-retro-muted text-xs font-pixel">SELECTION</h3>
      <button
        onClick={handleToggle}
        className={`w-full py-1.5 text-xs font-terminal border transition-colors ${
          invert
            ? 'border-retro-primary bg-retro-primary/10 text-retro-primary'
            : 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
        }`}
      >
        {invert ? '反转选区: 开' : '反转选区: 关'}
      </button>
      <p className="text-[10px] font-terminal text-retro-muted leading-relaxed">
        {invert
          ? '选区外像素化，选区内保持原图'
          : '选区内像素化，选区外保持原图'}
      </p>
    </div>
  );
}
