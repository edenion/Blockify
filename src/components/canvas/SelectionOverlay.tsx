import { useRef, useState, useCallback, useEffect } from 'react';
import type { Point, Shape } from '../../engine/selection/shapes';
import { createRectangle, createCircle } from '../../engine/selection/shapes';

export type SelectionTool = 'rectangle' | 'circle' | null;

interface SelectionOverlayProps {
  width: number;
  height: number;
  tool: SelectionTool;
  onShapeCreated: (shape: Shape | null) => void;
}

export function SelectionOverlay({ width, height, tool, onShapeCreated }: SelectionOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const getPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (shape.type === 'rectangle') {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === 'circle') {
      ctx.beginPath();
      ctx.arc(shape.cx, shape.cy, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!tool) return;
    const point = getPoint(e);
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentShape(null);
  }, [tool, getPoint]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !tool) return;

    const currentPoint = getPoint(e);
    let shape: Shape;

    if (tool === 'rectangle') {
      shape = createRectangle(startPoint, currentPoint);
    } else {
      shape = createCircle(startPoint, currentPoint);
    }

    setCurrentShape(shape);

    // Redraw
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShape(ctx, shape);
  }, [isDrawing, startPoint, tool, getPoint, drawShape]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentShape) {
      onShapeCreated(currentShape);
    }
  }, [isDrawing, currentShape, onShapeCreated]);

  // Clear canvas when tool changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCurrentShape(null);
    onShapeCreated(null);
  }, [tool, onShapeCreated]);

  // Keyboard handler for Delete/Backspace to clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d')!;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setCurrentShape(null);
        onShapeCreated(null);
      }
    };

    if (tool) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [tool, onShapeCreated]);

  if (!tool) return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="absolute top-0 left-0 cursor-crosshair"
      style={{ pointerEvents: tool ? 'auto' : 'none' }}
    />
  );
}
