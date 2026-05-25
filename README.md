# Blockify

一款纯前端图片像素化工具。上传图片，实时调整参数，一键转换为像素艺术风格。

## 功能特性

- **图片上传** — 支持点击上传和拖拽上传
- **实时预览** — 参数调整即时反馈，零延迟
- **实时像素化** — 像素块大小 2~64 可调，支持 Nearest / Average 两种降采样算法
- **框选工具** — 矩形、圆形框选，选区内像素化、选区外保持原样
- **多种预设** — 内置 GameBoy、NES、CGA、EGA 等硬件模拟预设，以及赛博朋克、蒸汽波等创意主题
- **对比视图** — 并排或滑块对比原图与像素风效果
- **PNG 导出** — 使用原图分辨率导出高清像素风图片
- **隐私安全** — 图片全程本地处理，不上传服务器

## 技术栈

- React 19 + Vite 6 + TypeScript 5.7
- Tailwind CSS 3
- Zustand 5
- Canvas API

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 架构

项目采用模块化引擎架构，像素化处理引擎与 UI 层完全分离：

- `src/engine/` — 纯 TypeScript 像素化引擎，零 React 依赖，支持插件式算法扩展
- `src/components/` — React UI 组件，复古游戏终端风格
- `src/store/` — Zustand 全局状态管理

详细设计见 [docs/specs/2026-05-25-技术设计.md](docs/specs/2026-05-25-技术设计.md)
