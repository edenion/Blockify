import { create } from 'zustand';
import type { QuantizeMethod, RGB } from '../engine/types';

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

  // Custom palette
  customPalette: RGB[];
  addCustomPaletteColor: (color: RGB) => void;
  removeCustomPaletteColor: (index: number) => void;

  // Compare
  ui: {
    showCompare: boolean;
    compareMode: 'split' | 'slider';
  };
  setCompareMode: (show: boolean) => void;
  setCompareType: (mode: 'split' | 'slider') => void;

  // Selection
  selection: {
    invert: boolean;
  };
  setSelectionInvert: (invert: boolean) => void;

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

  customPalette: [],
  addCustomPaletteColor: (color) =>
    set((state) => ({
      customPalette:
        state.customPalette.length < 32
          ? [...state.customPalette, color]
          : state.customPalette,
    })),
  removeCustomPaletteColor: (index) =>
    set((state) => ({
      customPalette: state.customPalette.filter((_, i) => i !== index),
    })),

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

  selection: {
    invert: false,
  },
  setSelectionInvert: (invert) =>
    set((state) => ({
      selection: { ...state.selection, invert },
    })),

  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),
}));
