import type { Point, Shape } from './shapes';

let cachedCanvas: HTMLCanvasElement | null = null;
let cachedCtx: CanvasRenderingContext2D | null = null;

function getCanvasContext(): CanvasRenderingContext2D {
  if (!cachedCanvas) {
    cachedCanvas = document.createElement('canvas');
    cachedCanvas.width = 1;
    cachedCanvas.height = 1;
    cachedCtx = cachedCanvas.getContext('2d')!;
  }
  return cachedCtx!;
}

function buildPath(ctx: CanvasRenderingContext2D, points: Point[], close: boolean): void {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  if (close) {
    ctx.closePath();
  }
}

export function createMask(shape: Shape, width: number, height: number, invert: boolean): Uint8Array {
  const mask = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const inside = isPointInShape(x, y, shape);
      mask[idx] = invert ? (inside ? 0 : 1) : (inside ? 1 : 0);
    }
  }

  return mask;
}

function isPointInShape(x: number, y: number, shape: Shape): boolean {
  switch (shape.type) {
    case 'rectangle':
      return x >= shape.x && x <= shape.x + shape.width &&
             y >= shape.y && y <= shape.y + shape.height;
    case 'circle': {
      const dx = x - shape.cx;
      const dy = y - shape.cy;
      return dx * dx + dy * dy <= shape.radius * shape.radius;
    }
    case 'polygon': {
      const ctx = getCanvasContext();
      buildPath(ctx, shape.points, true);
      return ctx.isPointInPath(x, y);
    }
    case 'freehand': {
      const ctx = getCanvasContext();
      buildPath(ctx, shape.path, true);
      return ctx.isPointInPath(x, y);
    }
  }
}

export function applyMask(
  source: ImageData,
  processed: ImageData,
  mask: Uint8Array
): ImageData {
  const { width, height, data: srcData } = source;
  const { data: procData } = processed;
  const result = new Uint8ClampedArray(srcData);

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === 1) {
      const idx = i * 4;
      result[idx] = procData[idx];
      result[idx + 1] = procData[idx + 1];
      result[idx + 2] = procData[idx + 2];
    }
  }

  return new ImageData(result, width, height);
}
