export type ShapeType = 'rectangle' | 'circle';

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  type: 'circle';
  cx: number;
  cy: number;
  radius: number;
}

export type Shape = Rectangle | Circle;

export function createRectangle(start: Point, end: Point): Rectangle {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  return { type: 'rectangle', x, y, width, height };
}

export function createCircle(start: Point, end: Point): Circle {
  const cx = start.x;
  const cy = start.y;
  const radius = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
  return { type: 'circle', cx, cy, radius };
}
