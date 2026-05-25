import { useRef, useState, useCallback, useEffect } from 'react';
import type { Point, Shape } from '../../engine/selection/shapes';
import { createRectangle, createCircle, createPolygon, createFreehand } from '../../engine/selection/shapes';

export type SelectionTool = 'rectangle' | 'circle' | 'polygon' | 'freehand' | null;

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
  const [, setPolygonPoints] = useState<Point[]>([]);
  const [freehandPath, setFreehandPath] = useState<Point[]>([]);

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
    ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (shape.type === 'rectangle') {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === 'circle') {
      ctx.beginPath();
      ctx.arc(shape.cx, shape.cy, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
    } else if (shape.type === 'polygon') {
      if (shape.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(shape.points[0].x, shape.points[0].y);
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i].x, shape.points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    } else if (shape.type === 'freehand') {
      if (shape.path.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(shape.path[0].x, shape.path[0].y);
      for (let i = 1; i < shape.path.length; i++) {
        ctx.lineTo(shape.path[i].x, shape.path[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }

    ctx.setLineDash([]);
  }, []);

  const drawPolygonPreview = useCallback((ctx: CanvasRenderingContext2D, points: Point[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (points.length === 0) return;

    // Draw vertices
    ctx.fillStyle = '#22c55e';
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw connecting lines
    if (points.length >= 2) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, []);

  const drawFreehandPreview = useCallback((ctx: CanvasRenderingContext2D, path: Point[]) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (path.length < 2) return;

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  const resetState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentShape(null);
    setPolygonPoints([]);
    setFreehandPath([]);
  }, []);

  // ===== Drag-based tools: rectangle / circle / freehand =====

  const handleDragMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!tool) return;
    const point = getPoint(e);
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentShape(null);

    if (tool === 'freehand') {
      setFreehandPath([point]);
    }
  }, [tool, getPoint]);

  const handleDragMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !tool) return;

    const currentPoint = getPoint(e);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    if (tool === 'rectangle') {
      const shape = createRectangle(startPoint, currentPoint);
      setCurrentShape(shape);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShape(ctx, shape);
    } else if (tool === 'circle') {
      const shape = createCircle(startPoint, currentPoint);
      setCurrentShape(shape);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShape(ctx, shape);
    } else if (tool === 'freehand') {
      setFreehandPath((prev) => {
        const newPath = [...prev, currentPoint];
        drawFreehandPreview(ctx, newPath);
        return newPath;
      });
    }
  }, [isDrawing, startPoint, tool, getPoint, drawShape, drawFreehandPreview]);

  const handleDragMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (tool === 'freehand' && freehandPath.length >= 3) {
      const shape = createFreehand(freehandPath);
      setCurrentShape(shape);
      onShapeCreated(shape);
      // Draw final shape with fill
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShape(ctx, shape);
    } else if (currentShape && tool !== 'freehand') {
      onShapeCreated(currentShape);
    }
  }, [isDrawing, tool, freehandPath, currentShape, onShapeCreated, drawShape]);

  // ===== Polygon tool: click to add points, double-click to finish =====

  const handlePolygonMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool !== 'polygon') return;
    const point = getPoint(e);

    setPolygonPoints((prev) => {
      const newPoints = [...prev, point];
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      drawPolygonPreview(ctx, newPoints);
      return newPoints;
    });
  }, [tool, getPoint, drawPolygonPreview]);

  const handlePolygonDoubleClick = useCallback(() => {
    if (tool !== 'polygon') return;

    setPolygonPoints((prev) => {
      if (prev.length < 3) {
        return prev;
      }
      const shape = createPolygon(prev);
      setCurrentShape(shape);
      onShapeCreated(shape);

      // Draw final filled polygon
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawShape(ctx, shape);

      return []; // Reset after closing
    });
  }, [tool, onShapeCreated, drawShape]);

  // ===== Unified handlers =====

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'polygon') {
      handlePolygonMouseDown(e);
    } else {
      handleDragMouseDown(e);
    }
  }, [tool, handlePolygonMouseDown, handleDragMouseDown]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'polygon') return;
    handleDragMouseMove(e);
  }, [tool, handleDragMouseMove]);

  const handleMouseUp = useCallback(() => {
    if (tool === 'polygon') return;
    handleDragMouseUp();
  }, [tool, handleDragMouseUp]);

  const handleMouseLeave = useCallback(() => {
    if (tool === 'polygon') return;
    handleDragMouseUp();
  }, [tool, handleDragMouseUp]);

  // ===== Effects =====

  // Clear canvas when tool changes
  useEffect(() => {
    clearCanvas();
    resetState();
    onShapeCreated(null);
  }, [tool, clearCanvas, resetState, onShapeCreated]);

  // Keyboard handler for Delete/Backspace to clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        clearCanvas();
        resetState();
        onShapeCreated(null);
      }
    };

    if (tool) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [tool, clearCanvas, resetState, onShapeCreated]);

  if (!tool) return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handlePolygonDoubleClick}
      className="absolute top-0 left-0 cursor-crosshair"
      style={{ pointerEvents: tool ? 'auto' : 'none' }}
    />
  );
}
