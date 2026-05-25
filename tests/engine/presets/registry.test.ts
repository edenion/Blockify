import { describe, it, expect } from 'vitest';
import { PresetRegistry } from '../../../src/engine/presets/registry';

describe('PresetRegistry', () => {
  it('registers and retrieves presets', () => {
    const registry = new PresetRegistry();
    const preset = {
      id: 'test',
      name: 'Test',
      category: 'theme' as const,
      config: {
        downsample: { blockSize: 4, algorithm: 'nearest' as const },
        quantize: { method: 'none' as const },
      },
    };

    registry.register(preset);
    const retrieved = registry.get('test');
    expect(retrieved).toEqual(preset);
  });

  it('returns all presets', () => {
    const registry = new PresetRegistry();
    registry.register({
      id: 'a',
      name: 'A',
      category: 'hardware' as const,
      config: { downsample: { blockSize: 2, algorithm: 'nearest' as const }, quantize: { method: 'none' as const } },
    });
    registry.register({
      id: 'b',
      name: 'B',
      category: 'theme' as const,
      config: { downsample: { blockSize: 4, algorithm: 'average' as const }, quantize: { method: 'none' as const } },
    });

    expect(registry.getAll()).toHaveLength(2);
  });

  it('returns presets by category', () => {
    const registry = new PresetRegistry();
    registry.register({
      id: 'hw',
      name: 'HW',
      category: 'hardware' as const,
      config: { downsample: { blockSize: 2, algorithm: 'nearest' as const }, quantize: { method: 'none' as const } },
    });
    registry.register({
      id: 'th',
      name: 'TH',
      category: 'theme' as const,
      config: { downsample: { blockSize: 4, algorithm: 'average' as const }, quantize: { method: 'none' as const } },
    });

    expect(registry.getByCategory('hardware')).toHaveLength(1);
    expect(registry.getByCategory('theme')).toHaveLength(1);
  });
});
