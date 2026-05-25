import type { Point, Shape } from './shapes';

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

function isPointInPolygon(x: number, y: number, points: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x, yi = points[i].y;
    const xj = points[j].x, yj = points[j].y;
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
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
    case 'polygon':
      return isPointInPolygon(x, y, shape.points);
    case 'freehand':
      return isPointInPolygon(x, y, shape.path);
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
