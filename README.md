# Blockify

一款纯前端图片像素化工具。上传图片，实时调整参数，一键转换为像素艺术风格。

## 功能特性

- **图片上传** — 支持点击上传和拖拽上传
- **实时预览** — 参数调整即时反馈，零延迟
- **裁剪与框选** — 矩形、圆形、多边形、自由手绘框选，支持局部或反向像素化
- **多种预设** — 内置 GameBoy、NES、CGA、EGA 等硬件模拟预设，以及赛博朋克、蒸汽波等创意主题
- **自定义调色板** — 创建并保存个人调色板预设
- **人物像素风** — 支持普通/抠图/风格化/精灵图四种模式
- **对比视图** — 并排或滑块对比原图与像素风效果
- **隐私安全** — 图片全程本地处理，不上传服务器

## 技术栈

- React 19 + Vite 6 + TypeScript 5.7
- Tailwind CSS 4
- Zustand 5
- Canvas API + Web Worker

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

详细设计见 [docs/superpowers/specs/2026-05-25-pixel-art-studio-design.md](docs/superpowers/specs/2026-05-25-pixel-art-studio-design.md)
