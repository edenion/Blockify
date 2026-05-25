import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../../store';
import { createPresetRegistry } from '../../engine/presets';
import { createSpriteSheet } from '../../engine/person/sprite';
import { downloadPNG } from '../../engine/export/png';
import type { ProcessOptions } from '../../engine/types';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

const registry = createPresetRegistry();

export function SpriteSheetModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      pendingUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      pendingUrlsRef.current.clear();
    };
  }, []);

  const spriteImages = useAppStore((s) => s.spriteImages);
  const addSpriteImage = useAppStore((s) => s.addSpriteImage);
  const removeSpriteImage = useAppStore((s) => s.removeSpriteImage);
  const clearSpriteImages = useAppStore((s) => s.clearSpriteImages);
  const spriteLayout = useAppStore((s) => s.spriteLayout);
  const setSpriteLayout = useAppStore((s) => s.setSpriteLayout);
  const spriteGridCols = useAppStore((s) => s.spriteGridCols);
  const setSpriteGridCols = useAppStore((s) => s.setSpriteGridCols);
  const spritePadding = useAppStore((s) => s.spritePadding);
  const setSpritePadding = useAppStore((s) => s.setSpritePadding);
  const params = useAppStore((s) => s.params);
  const presetId = useAppStore((s) => s.presetId);

  const loadFileAsImage = useCallback(
    (file: File): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
          reject(new Error('不支持的文件格式'));
          return;
        }
        if (file.size > MAX_SIZE) {
          reject(new Error('文件超过 20MB 限制'));
          return;
        }
        const img = new Image();
        const url = URL.createObjectURL(file);
        pendingUrlsRef.current.add(url);
        img.onload = () => {
          pendingUrlsRef.current.delete(url);
          URL.revokeObjectURL(url);
          resolve(img);
        };
        img.onerror = () => {
          pendingUrlsRef.current.delete(url);
          URL.revokeObjectURL(url);
          reject(new Error('图片加载失败'));
        };
        img.src = url;
      });
    },
    []
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        try {
          const img = await loadFileAsImage(file);
          addSpriteImage(img);
        } catch (err) {
          alert(err instanceof Error ? err.message : '图片加载失败');
        }
      }
    },
    [loadFileAsImage, addSpriteImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const buildProcessOptions = useCallback((): ProcessOptions => {
    if (presetId) {
      const preset = registry.get(presetId);
      if (preset) {
        return {
          downsample: preset.config.downsample,
          quantize: preset.config.quantize,
        };
      }
    }
    return {
      downsample: {
        blockSize: params.blockSize,
        algorithm: params.algorithm,
      },
      quantize: {
        method: params.quantizeMethod,
        maxColors: params.maxColors,
      },
    };
  }, [params, presetId]);

  const handleGenerate = useCallback(() => {
    if (spriteImages.length === 0) return;
    setIsGenerating(true);
    // Defer to next tick so UI can show loading state
    requestAnimationFrame(() => {
      const options = buildProcessOptions();
      const canvas = createSpriteSheet(spriteImages, options, {
        layout: spriteLayout,
        gridCols: spriteGridCols,
        padding: spritePadding,
      });
      setPreviewUrl(canvas.toDataURL('image/png'));
      setIsGenerating(false);
    });
  }, [spriteImages, spriteLayout, spriteGridCols, spritePadding, buildProcessOptions]);

  const handleExport = useCallback(() => {
    if (spriteImages.length === 0) return;
    const options = buildProcessOptions();
    const canvas = createSpriteSheet(spriteImages, options, {
      layout: spriteLayout,
      gridCols: spriteGridCols,
      padding: spritePadding,
    });
    downloadPNG(canvas, `sprite_sheet_${Date.now()}.png`);
  }, [spriteImages, spriteLayout, spriteGridCols, spritePadding, buildProcessOptions]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2 px-2 text-[10px] font-terminal border border-retro-primary text-retro-primary hover:bg-retro-primary/10 transition-colors"
      >
        打开 Sprite Sheet 编辑器
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[640px] max-h-[90vh] overflow-y-auto bg-[#0f172a] border border-retro-border p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-retro-border pb-3">
          <h2 className="text-xs font-pixel text-retro-primary">SPRITE SHEET 编辑器</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-retro-muted hover:text-retro-text text-xs font-terminal"
          >
            [关闭]
          </button>
        </div>

        {/* Upload Area */}
        <div
          onClick={handleClickUpload}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-retro-border rounded-sm py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-retro-primary transition-colors"
        >
          <span className="text-retro-primary text-xl font-pixel">+</span>
          <p className="text-retro-muted text-[10px] font-terminal">
            点击上传或拖放图片（支持多选）
          </p>
          <p className="text-retro-muted text-[10px] font-terminal">
            PNG / JPEG / WebP，最大 20MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Thumbnails */}
        {spriteImages.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-terminal text-retro-muted">
                已上传 {spriteImages.length} 张
              </span>
              <button
                onClick={clearSpriteImages}
                className="text-[10px] font-terminal text-red-400 hover:text-red-300"
              >
                清空全部
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {spriteImages.map((img, index) => (
                <div
                  key={index}
                  className="relative w-16 h-16 border border-retro-border bg-[#0f172a]"
                >
                  <img
                    src={img.src}
                    alt={`sprite-${index}`}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={() => removeSpriteImage(index)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] flex items-center justify-center border border-retro-border"
                    title="删除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Layout Options */}
        <div className="space-y-3 border-t border-retro-border pt-3">
          <h4 className="text-retro-muted text-[10px] font-pixel">布局方式</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setSpriteLayout('horizontal')}
              className={`flex-1 py-1.5 px-1 text-[10px] font-terminal border transition-colors ${
                spriteLayout === 'horizontal'
                  ? 'border-retro-primary bg-retro-primary/10 text-retro-primary'
                  : 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
              }`}
            >
              横向排列
            </button>
            <button
              onClick={() => setSpriteLayout('grid')}
              className={`flex-1 py-1.5 px-1 text-[10px] font-terminal border transition-colors ${
                spriteLayout === 'grid'
                  ? 'border-retro-primary bg-retro-primary/10 text-retro-primary'
                  : 'border-retro-border text-retro-muted hover:border-retro-text hover:text-retro-text'
              }`}
            >
              网格排列
            </button>
          </div>

          {spriteLayout === 'grid' && (
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-terminal text-retro-muted">列数</label>
              <input
                type="number"
                min={1}
                max={8}
                value={spriteGridCols}
                onChange={(e) => setSpriteGridCols(Math.max(1, Math.min(8, Number(e.target.value))))}
                className="w-14 bg-transparent border border-retro-border text-retro-text text-[10px] font-terminal px-2 py-1"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="text-[10px] font-terminal text-retro-muted">间距</label>
            <input
              type="range"
              min={0}
              max={20}
              value={spritePadding}
              onChange={(e) => setSpritePadding(Number(e.target.value))}
              className="flex-1 accent-retro-primary"
            />
            <span className="text-[10px] font-terminal text-retro-muted w-8 text-right">
              {spritePadding}px
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-retro-border pt-3">
          <button
            onClick={handleGenerate}
            disabled={spriteImages.length === 0 || isGenerating}
            className="flex-1 py-2 text-[10px] font-terminal border border-retro-primary text-retro-primary hover:bg-retro-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? '生成中...' : '生成预览'}
          </button>
          <button
            onClick={handleExport}
            disabled={spriteImages.length === 0}
            className="flex-1 py-2 text-[10px] font-terminal border border-retro-primary bg-retro-primary/10 text-retro-primary hover:bg-retro-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            导出 PNG
          </button>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="border border-retro-border p-2">
            <p className="text-[10px] font-terminal text-retro-muted mb-2">预览</p>
            <img
              src={previewUrl}
              alt="sprite sheet preview"
              className="max-w-full border border-retro-border"
            />
          </div>
        )}
      </div>
    </div>
  );
}
