import { BlockSizeSlider } from './BlockSizeSlider';
import { AlgorithmToggle } from './AlgorithmToggle';

export function ParamsPanel() {
  return (
    <div className="w-64 bg-retro-panel border-l-2 border-retro-border p-4 space-y-6 overflow-y-auto">
      <h2 className="text-retro-primary text-xs font-pixel mb-4">PARAMETERS</h2>
      <BlockSizeSlider />
      <AlgorithmToggle />
    </div>
  );
}
