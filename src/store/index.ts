import { create } from 'zustand';
import type { QuantizeMethod, RGB } from '../engine/types';
import type { Preset } from '../engine/presets/registry';
import type { Shape } from '../engine/selection/shapes';
import { loadCustomPresets, saveCustomPresets } from './storage';

export type Algorithm = 'nearest' | 'average';
export type PersonMode = 'normal' | 'cutout' | 'style' | 'sprite' | null;

export interface HistorySnapshot {
  params: AppState['params'];
  selection: AppState['selection'];
  presetId: string | null;
  personMode: PersonMode;
  customPalette: RGB[];
  cutoutBg: 'keep' | 'pixelate' | 'color';
  cutoutBgColor: string;
}

export interface AppState {
  // Image
  originalImage: HTMLImageElement | null;
  setOriginalImage: (image: HTMLImageElement | null) => void;
  thumbnailImage: HTMLCanvasElement | null;
  setThumbnailImage: (canvas: HTMLCanvasElement | null) => void;

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

  // Custom presets
  customPresets: Preset[];
  addCustomPreset: (preset: Preset) => void;
  removeCustomPreset: (id: string) => void;

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
    shape: Shape | null;
  };
  setSelectionInvert: (invert: boolean) => void;
  setSelectionShape: (shape: Shape | null) => void;

  // Person mode
  personMode: PersonMode;
  setPersonMode: (mode: PersonMode) => void;

  // Cutout options
  cutoutBg: 'keep' | 'pixelate' | 'color';
  cutoutBgColor: string;
  setCutoutBg: (bg: 'keep' | 'pixelate' | 'color') => void;
  setCutoutBgColor: (color: string) => void;

  // Sprite mode
  spriteImages: HTMLImageElement[];
  spriteLayout: 'horizontal' | 'grid';
  spriteGridCols: number;
  spritePadding: number;
  addSpriteImage: (image: HTMLImageElement) => void;
  removeSpriteImage: (index: number) => void;
  clearSpriteImages: () => void;
  setSpriteLayout: (layout: 'horizontal' | 'grid') => void;
  setSpriteGridCols: (cols: number) => void;
  setSpritePadding: (padding: number) => void;

  // Processing state
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;

  // History
  history: {
    past: HistorySnapshot[];
    future: HistorySnapshot[];
  };
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;
}

function getSnapshot(state: AppState): HistorySnapshot {
  return {
    params: { ...state.params },
    selection: { ...state.selection },
    presetId: state.presetId,
    personMode: state.personMode,
    customPalette: [...state.customPalette],
    cutoutBg: state.cutoutBg,
    cutoutBgColor: state.cutoutBgColor,
  };
}

export const useAppStore = create<AppState>((set) => ({
  originalImage: null,
  setOriginalImage: (image) => set({ originalImage: image }),
  thumbnailImage: null,
  setThumbnailImage: (canvas) => set({ thumbnailImage: canvas }),

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

  customPresets: loadCustomPresets(),
  addCustomPreset: (preset) =>
    set((state) => {
      const next = [...state.customPresets, preset];
      saveCustomPresets(next);
      return { customPresets: next };
    }),
  removeCustomPreset: (id) =>
    set((state) => {
      const next = state.customPresets.filter((p) => p.id !== id);
      saveCustomPresets(next);
      return { customPresets: next };
    }),

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
    shape: null,
  },
  setSelectionInvert: (invert) =>
    set((state) => ({
      selection: { ...state.selection, invert },
    })),
  setSelectionShape: (shape) =>
    set((state) => ({
      selection: { ...state.selection, shape },
    })),

  personMode: null,
  setPersonMode: (mode) => set({ personMode: mode }),

  cutoutBg: 'keep',
  cutoutBgColor: '#0f172a',
  setCutoutBg: (bg) => set({ cutoutBg: bg }),
  setCutoutBgColor: (color) => set({ cutoutBgColor: color }),

  spriteImages: [],
  spriteLayout: 'horizontal',
  spriteGridCols: 2,
  spritePadding: 0,
  addSpriteImage: (image) =>
    set((state) => ({ spriteImages: [...state.spriteImages, image] })),
  removeSpriteImage: (index) =>
    set((state) => ({ spriteImages: state.spriteImages.filter((_, i) => i !== index) })),
  clearSpriteImages: () => set({ spriteImages: [] }),
  setSpriteLayout: (layout) => set({ spriteLayout: layout }),
  setSpriteGridCols: (cols) => set({ spriteGridCols: cols }),
  setSpritePadding: (padding) => set({ spritePadding: padding }),

  isProcessing: false,
  setIsProcessing: (processing) => set({ isProcessing: processing }),

  history: { past: [], future: [] },
  saveSnapshot: () =>
    set((state) => {
      const snapshot = getSnapshot(state);
      const lastPast = state.history.past[state.history.past.length - 1];
      if (lastPast && JSON.stringify(lastPast) === JSON.stringify(snapshot)) {
        return state;
      }
      return {
        history: {
          past: [...state.history.past, snapshot],
          future: [],
        },
      };
    }),
  undo: () =>
    set((state) => {
      if (state.history.past.length === 0) return state;
      const current = getSnapshot(state);
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        params: previous.params,
        selection: previous.selection,
        presetId: previous.presetId,
        personMode: previous.personMode,
        customPalette: previous.customPalette,
        cutoutBg: previous.cutoutBg,
        cutoutBgColor: previous.cutoutBgColor,
        history: {
          past: newPast,
          future: [current, ...state.history.future],
        },
      };
    }),
  redo: () =>
    set((state) => {
      if (state.history.future.length === 0) return state;
      const current = getSnapshot(state);
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        params: next.params,
        selection: next.selection,
        presetId: next.presetId,
        personMode: next.personMode,
        customPalette: next.customPalette,
        cutoutBg: next.cutoutBg,
        cutoutBgColor: next.cutoutBgColor,
        history: {
          past: [...state.history.past, current],
          future: newFuture,
        },
      };
    }),
}));
