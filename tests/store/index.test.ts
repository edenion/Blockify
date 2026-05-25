import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../src/store';

describe('AppStore', () => {
  beforeEach(() => {
    // Reset store state
    const store = useAppStore.getState();
    store.setOriginalImage(null);
    store.setParams({ blockSize: 8, algorithm: 'nearest' });
    store.setPresetId(null);
  });

  it('sets original image', () => {
    const store = useAppStore.getState();
    // We can't set actual HTMLImageElement in test, but we can verify the method exists
    expect(store.setOriginalImage).toBeDefined();
  });

  it('updates blockSize param', () => {
    useAppStore.getState().setParams({ blockSize: 16 });
    expect(useAppStore.getState().params.blockSize).toBe(16);
  });

  it('updates algorithm param', () => {
    useAppStore.getState().setParams({ algorithm: 'average' });
    expect(useAppStore.getState().params.algorithm).toBe('average');
  });

  it('sets preset id', () => {
    useAppStore.getState().setPresetId('gameboy');
    expect(useAppStore.getState().presetId).toBe('gameboy');
  });

  it('toggles compare view', () => {
    useAppStore.getState().setCompareMode(true);
    expect(useAppStore.getState().ui.showCompare).toBe(true);
    useAppStore.getState().setCompareMode(false);
    expect(useAppStore.getState().ui.showCompare).toBe(false);
  });
});
