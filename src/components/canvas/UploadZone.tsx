import { useCallback } from 'react';
import { useAppStore } from '../../store';
import { loadImage } from '../../utils/image';
import { createThumbnail } from '../../hooks/useThumbnail';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export function UploadZone() {
  const setOriginalImage = useAppStore((s) => s.setOriginalImage);
  const setThumbnailImage = useAppStore((s) => s.setThumbnailImage);

  const handleFile = useCallback(
    async (file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert('不支持的文件格式，请上传 PNG、JPEG 或 WebP 图片');
        return;
      }
      if (file.size > MAX_SIZE) {
        alert('文件超过 20MB 限制');
        return;
      }

      try {
        const img = await loadImage(file);
        setOriginalImage(img);
        setThumbnailImage(createThumbnail(img));
      } catch {
        alert('图片加载失败');
      }
    },
    [setOriginalImage, setThumbnailImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ALLOWED_TYPES.join(',');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-80 h-64 border-2 border-dashed border-retro-border rounded-sm flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-retro-primary transition-colors"
    >
      <div className="w-16 h-16 border-2 border-retro-border rounded-sm flex items-center justify-center">
        <span className="text-retro-primary text-3xl font-pixel">+</span>
      </div>
      <div className="text-center">
        <p className="text-retro-muted text-sm">点击上传或拖放图片</p>
        <p className="text-retro-muted text-xs mt-1">支持 PNG、JPEG、WebP</p>
      </div>
    </div>
  );
}
