export function TitleBar() {
  return (
    <div className="h-10 bg-retro-panel border-b-2 border-retro-border flex items-center px-4 select-none">
      <span className="text-retro-primary font-pixel text-xs mr-2">[◉]</span>
      <span className="text-retro-primary font-pixel text-xs tracking-wider">
        PIXEL_ART.EXE
      </span>
      <div className="ml-auto flex gap-2" aria-hidden="true">
        <span className="w-5 h-5 border border-retro-border text-retro-muted text-xs flex items-center justify-center">─</span>
        <span className="w-5 h-5 border border-retro-border text-retro-muted text-xs flex items-center justify-center">□</span>
        <span className="w-5 h-5 border border-retro-border text-retro-muted text-xs flex items-center justify-center">✕</span>
      </div>
    </div>
  );
}
