const THUMBNAIL_MAX_SIZE = 800;

export function createThumbnail(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, THUMBNAIL_MAX_SIZE / Math.max(img.naturalWidth, img.naturalHeight));
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}
