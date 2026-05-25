import { describe, it, expect } from 'vitest';
import {
  createRectangle,
  createCircle,
  createPolygon,
  createFreehand,
} from '../../../src/engine/selection/shapes';

describe('createRectangle', () => {
  it('creates a rectangle from start and end points', () => {
    const rect = createRectangle({ x: 10, y: 20 }, { x: 30, y: 50 });
    expect(rect.type).toBe('rectangle');
    expect(rect.x).toBe(10);
    expect(rect.y).toBe(20);
    expect(rect.width).toBe(20);
    expect(rect.height).toBe(30);
  });

  it('normalizes coordinates when end is before start', () => {
    const rect = createRectangle({ x: 50, y: 40 }, { x: 20, y: 10 });
    expect(rect.x).toBe(20);
    expect(rect.y).toBe(10);
    expect(rect.width).toBe(30);
    expect(rect.height).toBe(30);
  });
});

describe('createCircle', () => {
  it('creates a circle from start and end points', () => {
    const circle = createCircle({ x: 0, y: 0 }, { x: 3, y: 4 });
    expect(circle.type).toBe('circle');
    expect(circle.cx).toBe(0);
    expect(circle.cy).toBe(0);
    expect(circle.radius).toBe(5);
  });
});

describe('createPolygon', () => {
  it('creates a polygon with 3 points', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 10 },
    ];
    const polygon = createPolygon(points);
    expect(polygon.type).toBe('polygon');
    expect(polygon.points).toEqual(points);
  });
});

describe('createFreehand', () => {
  it('creates a freehand shape with path points', () => {
    const path = [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 0 },
      { x: 15, y: 5 },
    ];
    const freehand = createFreehand(path);
    expect(freehand.type).toBe('freehand');
    expect(freehand.path).toEqual(path);
  });
});
