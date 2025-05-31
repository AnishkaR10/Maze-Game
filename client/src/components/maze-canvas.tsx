import { useRef, useEffect, useCallback } from 'react';
import { CellType, Position } from '@shared/schema';

interface MazeCanvasProps {
  gridSize: number;
  grid: string[][];
  start: Position | null;
  end: Position | null;
  onCellClick: (row: number, col: number) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  isDrawing: boolean;
}

const CELL_COLORS = {
  [CellType.EMPTY]: '#F8FAFC',
  [CellType.WALL]: '#334155',
  [CellType.START]: '#F59E0B',
  [CellType.END]: '#3B82F6',
  [CellType.OPEN]: '#10B981',
  [CellType.CLOSED]: '#EF4444',
  [CellType.PATH]: '#8B5CF6'
};

export default function MazeCanvas({
  gridSize,
  grid,
  start,
  end,
  onCellClick,
  onMouseDown,
  onMouseUp,
  isDrawing
}: MazeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  const cellSize = Math.max(12, 600 / gridSize); // Minimum 12px per cell for better visibility

  // Draw the maze
  const drawMaze = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw cells
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const cellType = grid[row][col] as CellType;

        ctx.fillStyle = CELL_COLORS[cellType];
        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

        // Add glow effect for special cells
        if ([CellType.START, CellType.END, CellType.PATH].includes(cellType)) {
          ctx.shadowColor = CELL_COLORS[cellType];
          ctx.shadowBlur = 10;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
          ctx.shadowBlur = 0;
        }
      }
    }
  }, [gridSize, grid, cellSize]);

  // Handle mouse events
  const getMousePosition = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      return { row, col };
    }
    return null;
  }, [cellSize, gridSize]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const position = getMousePosition(event);
    if (position) {
      onMouseDown();
      onCellClick(position.row, position.col);
    }
  }, [getMousePosition, onMouseDown, onCellClick]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const position = getMousePosition(event);
    if (position) {
      onCellClick(position.row, position.col);
    }
  }, [isDrawing, getMousePosition, onCellClick]);

  const handleMouseUp = useCallback(() => {
    onMouseUp();
  }, [onMouseUp]);

  // Draw maze on changes
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(drawMaze);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawMaze]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="maze-canvas rounded cursor-crosshair max-w-full h-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
