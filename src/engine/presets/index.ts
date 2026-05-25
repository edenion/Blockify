import { PresetRegistry } from './registry';
import { gameboyPreset } from './hardware/gameboy';
import { nesPreset } from './hardware/nes';
import { cgaPreset } from './hardware/cga';
import { egaPreset } from './hardware/ega';
import { cyberpunkPreset } from './themes/cyberpunk';
import { vaporwavePreset } from './themes/vaporwave';
import { wastelandPreset } from './themes/wasteland';
import { monoPreset } from './themes/mono';

export { PresetRegistry };
export type { Preset } from './registry';

export function createPresetRegistry(): PresetRegistry {
  const registry = new PresetRegistry();

  // Hardware presets
  registry.register(gameboyPreset);
  registry.register(nesPreset);
  registry.register(cgaPreset);
  registry.register(egaPreset);

  // Theme presets
  registry.register(cyberpunkPreset);
  registry.register(vaporwavePreset);
  registry.register(wastelandPreset);
  registry.register(monoPreset);

  return registry;
}
