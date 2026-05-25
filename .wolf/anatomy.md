# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-05-25T05:40:23.243Z
> Files: 75 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `.gitignore` — Git ignore rules (~132 tok)
- `CLAUDE.md` — OpenWolf (~315 tok)
- `index.html` — PixelArt Studio (~82 tok)
- `package.json` — Node.js package manifest (~215 tok)
- `postcss.config.js` (~24 tok)
- `README.md` — Project documentation (~206 tok)
- `tailwind.config.ts` — /*.{ts,tsx}'], (~176 tok)
- `tsconfig.json` — TypeScript configuration (~172 tok)
- `tsconfig.node.json` (~61 tok)
- `vite.config.ts` (~67 tok)

## .claude/

- `settings.json` (~441 tok)

## .claude/rules/

- `openwolf.md` (~313 tok)

## .superpowers/brainstorm/83020-1779678619/content/

- `ui-style.html` (~3182 tok)
- `waiting.html` (~39 tok)

## .wolf/

- `anatomy.md` — 文件导航索引 (~200 tok)
- `cerebrum.md` — 学习记忆，含用户偏好、关键学习、决策记录 (~500 tok)
- `memory.md` — 会话操作日志 (~400 tok)
- `OPENWOLF.md` — OpenWolf 操作协议 (~800 tok)

## docs/plans/

- `2026-05-25-像素风图片转换-phase1.md` — PixelArt Studio Phase 1 实现计划 (~20240 tok)

## docs/prd/

- `2026-05-25-像素风图片转换.md` — PixelArt Studio 产品需求文档 (PRD) (~7000 tok)

## docs/specs/

- `2026-05-25-技术设计.md` — PixelArt Studio 技术设计文档 (~2500 tok)

## src/

- `App.tsx` — App (~182 tok)
- `index.css` — Styles: 5 rules (~81 tok)
- `main.tsx` (~66 tok)

## src/components/canvas

- `CanvasViewport.tsx` — 中间画布区域占位组件 (~50 tok)

## src/components/canvas/

- `CanvasViewport.tsx` — CanvasViewport (~313 tok)
- `ImageCanvas.tsx` — registry (~833 tok)
- `SelectionOverlay.tsx` — SelectionOverlay (~1144 tok)
- `UploadZone.tsx` — ALLOWED_TYPES (~579 tok)

## src/components/compare/

- `SliderCompare.tsx` — registry (~1158 tok)
- `SplitView.tsx` — registry (~713 tok)

## src/components/layout

- `Layout.tsx` — 三栏布局外壳：TitleBar + 内容区 + StatusBar (~100 tok)
- `StatusBar.tsx` — 底部状态栏：显示处理状态/分辨率/缩放 (~150 tok)
- `TitleBar.tsx` — 顶部标题栏：像素风窗口标题 + 最小化/最大化/关闭按钮 (~200 tok)

## src/components/layout/

- `Layout.tsx` — Layout (~124 tok)
- `StatusBar.tsx` — StatusBar (~178 tok)
- `TitleBar.tsx` — TitleBar (~307 tok)

## src/components/params

- `ParamsPanel.tsx` — 右侧参数面板：包含 BlockSizeSlider + AlgorithmToggle (~116 tok)

## src/components/params/

- `AlgorithmToggle.tsx` — 降采样算法切换（Nearest / Average） (~328 tok)
- `BlockSizeSlider.tsx` — BlockSizeSlider (~471 tok)
- `ParamsPanel.tsx` — CompareControl (~653 tok)
- `PresetSelector.tsx` — registry (~807 tok)
- `QuantizeModeSelector.tsx` — QuantizeModeSelector (~625 tok)

## src/components/toolbar/

- `ExportButton.tsx` — 导出按钮：处理原图并下载 PNG (~525 tok)
- `Toolbar.tsx` — Toolbar (~521 tok)

## src/engine/

- `index.ts` (~40 tok)
- `pipeline.ts` — Exports processImage (~122 tok)
- `types.ts` — Exports RGB, DownsampleAlgorithm, DownsampleOptions, QuantizeMethod + 3 more (~170 tok)

## src/engine/algorithms/

- `downsample.ts` — Exports downsample (~520 tok)
- `quantize.ts` — Exports quantize (~716 tok)

## src/engine/export/

- `png.ts` — downloadPNG：将 Canvas 转为 PNG 并触发下载 (~72 tok)
- `png.ts` — Exports downloadPNG (~72 tok)

## src/engine/presets/

- `index.ts` — Exports createPresetRegistry (~271 tok)
- `registry.ts` — Exports Preset, PresetRegistry (~196 tok)

## src/engine/presets/hardware/

- `cga.ts` — Exports cgaPreset (~121 tok)
- `ega.ts` — Exports egaPreset (~214 tok)
- `gameboy.ts` — Exports gameboyPreset (~125 tok)
- `nes.ts` — Exports nesPreset (~622 tok)

## src/engine/presets/themes/

- `cyberpunk.ts` — Exports cyberpunkPreset (~161 tok)
- `mono.ts` — Exports monoPreset (~101 tok)
- `vaporwave.ts` — Exports vaporwavePreset (~83 tok)
- `wasteland.ts` — Exports wastelandPreset (~83 tok)

## src/engine/selection/

- `mask.ts` — Exports createMask, applyMask (~388 tok)
- `shapes.ts` — Exports ShapeType, Point, Rectangle, Circle + 3 more (~250 tok)

## src/store/

- `index.ts` — Exports Algorithm, AppState, useAppStore (~476 tok)

## src/utils/

- `color.ts` — Exports colorDistance, findNearestColor (~148 tok)
- `image.ts` — Exports loadImage, imageToImageData, imageDataToCanvas (~294 tok)

## tests/

- `setup.ts` (~50 tok)

## tests/engine/

- `pipeline.test.ts` — Declares createImageData (~510 tok)
- `types.test.ts` — Declares should (~180 tok)

## tests/engine/algorithms/

- `downsample.test.ts` — Declares createTestImageData (~951 tok)
- `quantize.test.ts` — Declares createImageData (~366 tok)

## tests/engine/presets/

- `registry.test.ts` — API routes: GET (1 endpoints) (~526 tok)

## tests/store/

- `index.test.ts` — Declares store (~385 tok)

## tests/utils/

- `color.test.ts` — Declares d (~186 tok)
