# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-05-25

## User Preferences

- **默认使用中文回复**：所有回复均使用中文，除非用户明确要求使用其他语言。
- **基于最新网络资源**：回答问题时优先检索并使用最新的网络资源，确保信息的时效性和准确性。
- **复古游戏风 UI**：用户选择深色背景+荧光绿配色+像素字体的复古终端风格，后续所有 UI 设计需遵循此风格。
- **功能完整性优先**：用户倾向于"全都要"的功能策略（所有预设类型、所有输出格式、所有人物模式），而非 MVP 取舍。
- **可扩展性优先**：用户多次强调"要考虑后续方便迭代和扩展"，架构设计应优先选择插件化/模块化方案。
- **纯前端方案**：用户接受纯前端架构，零服务器成本，图片不上传。

## Key Learnings

- **Project:** Blockify / PixelArt Studio
- **Description:** 纯前端图片像素化工具，支持裁剪、框选、多种预设、人物像素风、对比视图
- **提交规范**：英文前缀 + 中文内容（如 `fix: 修复登录失效`），常见前缀 `fix:`、`style:`、`feat:`、`refactor:`、`docs:`、`test:`、`chore:`
- **PR 规范**：需包含变更说明、影响模块、关联 issue/方案文档、测试结果；禁止提交 `.env`、本地路径、凭据
- **引擎架构**：像素化处理引擎与 UI 层完全分离，引擎零 React 依赖，支持算法插件注册
- **预设系统**：预设 = 纯 JSON 配置对象，通过 `PixelEngine.registerPreset()` 注册
- **性能策略**：缩略图预览（800px）用于实时调参，原图仅用于最终导出；Web Worker 处理像素化避免阻塞 UI
- **人像分割**：使用 `@mediapipe/selfie-segmentation` 实现纯前端人像抠图
- **精灵图模式**：用户上传多张照片（正面/侧面/背面），统一像素化后拼接为 Sprite Sheet
- **裁剪与框选**：可独立使用，无强制顺序
- **自定义框选**：同时支持多边形点选和自由手绘路径
- **框选遮罩实现**：选区内应用像素化、选区外保持原图，通过 `Uint8Array` 掩码 + `applyMask(source, processed, mask)` 混合两张 ImageData 实现；掩码在 `requestAnimationFrame` 中同步计算，无异步延迟
- **选区状态应放入 Store**：`SelectionOverlay` 创建的 `shape` 原本是 ImageCanvas 的本地状态，导致 ExportButton 和对比视图无法访问当前选区。修复：将 `shape` 提升到 Zustand store 的 `selection.shape` 中，使所有处理管线（预览、导出、对比）使用同一数据源
- **处理管线一致性**：ExportButton、SplitView、SliderCompare 的处理逻辑必须与 ImageCanvas 完全一致，否则用户预览和导出结果不同。应提取共享的选项构建逻辑或统一通过 store 消费
- **多边形点检测性能**：Canvas `isPointInPath()` 每像素调用一次，1920x1080 图片需 200 万次 Canvas API 调用。改用射线法（ray-casting）纯 JS 实现，性能提升数个数量级
- **Worker 错误恢复**：Web Worker 出错后若不重置实例，后续所有处理请求都会失败。应监听 `error` 事件并 `terminate() + null` 重建
- **异步外部依赖超时**：`@mediapipe/selfie-segmentation` 从 CDN 加载模型，网络异常时会无限挂起。必须用 `Promise.race()` 添加超时保护
- **Blob URL 内存管理**：`URL.createObjectURL()` 创建的 URL 若在组件卸载前未完成加载，会造成内存泄漏。应使用 `Set` 追踪 pending URLs，在 `useEffect` cleanup 中统一 `revokeObjectURL`
- **HistorySnapshot 完整性**：影响处理结果的每个状态字段都必须纳入 `HistorySnapshot`，否则 undo/redo 后处理结果会与历史状态不一致。例如 `cutoutBg` / `cutoutBgColor` 直接影响 cutout 模式的输出，必须包含在快照和恢复逻辑中
- **异步处理链的防御式编程**：`processWithSource` 等异步函数内部的 try/catch 不足够，调用端的 `.then()` 链也必须附加 `.catch()`，防止异常导致 `setIsProcessing(false)`  never 执行、UI 永久处于 loading 状态
- **Zustand selector 对象引用陷阱**：`useAppStore((s) => s.ui)` 每次返回新对象引用，会导致组件无限重渲染。应拆分为原始值 selector：`useAppStore((s) => s.ui.showCompare)` 和 `useAppStore((s) => s.ui.compareMode)`
- **事件处理器中优先使用 getState()**：快捷键等事件处理器若使用 `const undo = useAppStore((s) => s.undo)` selector，每次 store 变化都会触发 effect 重新订阅/清理。应在 handler 内部调用 `useAppStore.getState().undo()`，避免不必要的 effect 重运行

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->

[2026-05-25] 添加新参数到 UI 组件前，先更新 store 的类型定义。QuantizeModeSelector 和 ImageCanvas 引用 `params.quantizeMethod` 和 `params.maxColors` 时 TS 报错，因为 store 的 `params` 类型只定义了 `blockSize` 和 `algorithm`。修复：先在 `src/store/index.ts` 的 `AppState.params` 中添加新字段，再移除组件中的 `as` 类型断言。

[2026-05-25] 多个组件（ExportButton、SplitView、SliderCompare）重复实现处理选项构建逻辑，导致与主画布不一致。应将所有处理参数统一从 store 读取，避免分散的逻辑副本。

[2026-05-25] `createMask` 对 polygon/freehand 使用 Canvas `isPointInPath`，每像素调用一次 Canvas API，大图片性能极差。应使用纯 JS 射线法检测多边形包含关系，避免 Canvas 上下文切换开销。

## Key Learnings

- **Testing ImageData in Node.js**: jsdom does not provide `ImageData` global. Must install `canvas` package (`npm install -D canvas`) and polyfill in `tests/setup.ts`: `import { ImageData } from 'canvas'; global.ImageData = ImageData;`
- **降采样算法设计**: 输出 ImageData 保持与输入相同尺寸，每个 block 内所有像素取同一颜色（nearest=center pixel, average=mean），形成像素块视觉效果
- **颜色量化算法设计**: `none` 返回原图副本；`fixed-palette` 用欧氏距离映射到最近调色板颜色；`median-cut` 使用贪心算法选取散布在色彩空间中的代表色（简化版，可后续优化为真正的中位切分算法）
- **测试文件导入路径**: tests/utils/color.test.ts 位于 tests/utils/，导入 src/utils/color.ts 应使用 `../../src/utils/color` 而非 `../../../src/utils/color`（后者会解析到项目根目录之外）
- **Zustand getState() 快照引用陷阱**: `const store = useAppStore.getState()` 获取的是调用时刻的状态快照，后续 `set()` 不会更新该引用。测试中每次操作后应重新调用 `getState()` 获取最新状态，否则断言会拿到旧值

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->

### 2026-05-25 — 选择纯前端 Canvas 架构
- **选项**：A. 纯前端 / B. 服务端处理 / C. 混合模式
- **选择**：A. 纯前端
- **理由**：零延迟预览、零部署成本（Vercel/Netlify 免费托管）、隐私友好（图片不上传）、像素化算法在 Canvas 上性能足够

### 2026-05-25 — 选择 React + Vite + TypeScript + Tailwind CSS
- **选项**：A. React + Vite + TS + Tailwind / B. 原生 JS / C. Vue 3
- **选择**：A. React 技术栈
- **理由**：框选交互、状态同步、参数实时预览等功能，React 响应式模型更清晰；组件化利于拆分上传区/画布区/参数面板

### 2026-05-25 — 选择模块化引擎架构（方案 C）
- **选项**：A. MVP 优先 / B. 完整版一次到位 / C. 模块化引擎
- **选择**：C. 模块化引擎
- **理由**：预设系统是核心功能，配置驱动引擎天然适合；人物像素风 4 种模式是不同算法，插件式注册最清晰；引擎可独立测试复用；用户强调可扩展性

### 2026-05-25 — UI 设计风格选择复古游戏风
- **选项**：A. 简约现代 / B. 复古游戏风 / C. 工具型专业感 / D. 活泼插画感
- **选择**：B. 复古游戏风
- **理由**：用户直接选择，与像素主题呼应

### 2026-05-25 — 精灵图生成采用方案 A（多图上传拼接）
- **选项**：A. 用户上传多张照片拼接 / B. 单图算法生成伪角度 / C. AI API 生成
- **选择**：A. 多图上传拼接
- **理由**：单图生成多角度效果有限，AI API 违背纯前端架构

### 2026-05-25 — 暂不实现 GIF 导出
- **理由**：单帧转 GIF 意义不大，列为 P2 后续迭代方向
