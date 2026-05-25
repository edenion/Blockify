import type { ProcessOptions } from '../types';

export interface Preset {
  id: string;
  name: string;
  category: 'hardware' | 'theme' | 'custom';
  config: ProcessOptions;
}

export class PresetRegistry {
  private presets = new Map<string, Preset>();

  register(preset: Preset): void {
    this.presets.set(preset.id, preset);
  }

  get(id: string): Preset | undefined {
    return this.presets.get(id);
  }

  getAll(): Preset[] {
    return Array.from(this.presets.values());
  }

  getByCategory(category: Preset['category']): Preset[] {
    return this.getAll().filter((p) => p.category === category);
  }

  unregister(id: string): void {
    this.presets.delete(id);
  }
}
