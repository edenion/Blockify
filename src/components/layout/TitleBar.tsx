export function TitleBar() {
  return (
    <div className="h-10 bg-retro-panel border-b-2 border-retro-border flex items-center px-4 select-none">
      <span className="text-retro-primary font-pixel text-xs mr-2">[◉]</span>
      <span className="text-retro-primary font-pixel text-xs tracking-wider">
        PIXEL_ART.EXE
      </span>
      <div className="ml-auto flex gap-2">
        <button className="w-5 h-5 border border-retro-border text-retro-muted hover:text-retro-text hover:border-retro-primary text-xs flex items-center justify-center transition-colors">
          ─
        </button>
        <button className="w-5 h-5 border border-retro-border text-retro-muted hover:text-retro-text hover:border-retro-primary text-xs flex items-center justify-center transition-colors">
          □
        </button>
        <button className="w-5 h-5 border border-retro-border text-retro-muted hover:text-retro-danger hover:border-retro-danger text-xs flex items-center justify-center transition-colors">
          ✕
        </button>
      </div>
    </div>
  );
}
