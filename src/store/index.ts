import { create } from 'zustand';
import type { QuantizeMethod } from '../engine/types';

export type Algorithm = 'nearest' | 'average';

export interface AppState {
  // Image
  originalImage: HTMLImageElement | null;
  setOriginalImage: (image: HTMLImageElement | null) => void;

  // Params
  params: {
    blockSize: number;
    algorithm: Algorithm;
    quantizeMethod: QuantizeMethod;
    maxColors: number;
  };
  setParams: (params: Partial<AppState['params']>) => void;

  // Preset
  presetId: string | null;
  setPresetId: (id: string | null) => void;

  // Compare
  ui: {
    showCompare: boolean;
    compareMode: 'split' | 'slider';
  };
  setCompareMode: (show: boolean) => void;
  setCompareType: (mode: 'split' | 'slider') => void;

  // Processing state
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  originalImage: null,
  setOriginalImage: (image) => set({ originalImage: image }),

  params: {
    blockSize: 8,
    algorithm: 'nearest',
    quantizeMethod: 'none' as QuantizeMethod,
    maxColors: 16,
  },
  setParams: (newParams) =>
    set((state) => ({
      params: { ...state.params, ...newParams },
    })),

  presetId: null,
  setPresetId: (id) => set({ presetId: id }),

  ui: {
    showCompare: false,
    compareMode: 'split',
  },
  setCompareMode: (show) =>
    set((state) => ({
      ui: { ...state.ui, showCompare: show },
    })),
  setCompareType: (mode) =>
    set((state) => ({
      ui: { ...state.ui, compareMode: mode },
    })),

  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),
}));
