import { useState, useCallback, useRef } from 'react';
import { CellType, Position, Maze } from '@shared/schema';
import { AStarPathfinder } from '@/lib/pathfinding';

export interface MazeStats {
  nodesExplored: number;
  pathLength: number;
  algorithmTime: number;
  wallsPlaced: number;
}

export function useMaze(initialGridSize: number = 50) {
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [grid, setGrid] = useState<string[][]>(() => 
    Array(initialGridSize).fill(null).map(() => Array(initialGridSize).fill(CellType.EMPTY))
  );
  const [start, setStart] = useState<Position | null>(null);
  const [end, setEnd] = useState<Position | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'start' | 'end' | 'wall' | 'erase'>('wall');
  const [isPathfinding, setIsPathfinding] = useState(false);
  const [stats, setStats] = useState<MazeStats>({
    nodesExplored: 0,
    pathLength: 0,
    algorithmTime: 0,
    wallsPlaced: 0
  });
  const [animationSpeed, setAnimationSpeed] = useState(50);

  const pathfinderRef = useRef<AStarPathfinder | null>(null);

  // Initialize grid with new size
  const initializeGrid = useCallback((newSize: number) => {
    const newGrid = Array(newSize).fill(null).map(() => Array(newSize).fill(CellType.EMPTY));
    setGrid(newGrid);
    setGridSize(newSize);
    setStart(null);
    setEnd(null);
    setStats({
      nodesExplored: 0,
      pathLength: 0,
      algorithmTime: 0,
      wallsPlaced: 0
    });
  }, []);

  // Clear the maze
  const clearMaze = useCallback(() => {
    initializeGrid(gridSize);
  }, [gridSize, initializeGrid]);

  // Clear only the path
  const clearPath = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => 
        row.map(cell => 
          cell === CellType.OPEN || cell === CellType.CLOSED || cell === CellType.PATH 
            ? CellType.EMPTY 
            : cell
        )
      );
      return newGrid;
    });
    
    // Restore start and end positions
    if (start) {
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[start.row][start.col] = CellType.START;
        return newGrid;
      });
    }
    
    if (end) {
      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[end.row][end.col] = CellType.END;
        return newGrid;
      });
    }
    
    setStats(prev => ({
      ...prev,
      nodesExplored: 0,
      pathLength: 0,
      algorithmTime: 0
    }));
  }, [start, end]);

  // Handle cell click/drawing
  const handleCellAction = useCallback((row: number, col: number) => {
    if (isPathfinding) return;

    const currentCell = grid[row][col];

    setGrid(prevGrid => {
      const newGrid = [...prevGrid];

      switch (currentTool) {
        case 'start':
          // Clear previous start
          if (start) {
            newGrid[start.row][start.col] = CellType.EMPTY;
          }
          // Set new start if not on end
          if (currentCell !== CellType.END) {
            newGrid[row][col] = CellType.START;
            setStart({ row, col });
          }
          break;

        case 'end':
          // Clear previous end
          if (end) {
            newGrid[end.row][end.col] = CellType.EMPTY;
          }
          // Set new end if not on start
          if (currentCell !== CellType.START) {
            newGrid[row][col] = CellType.END;
            setEnd({ row, col });
          }
          break;

        case 'wall':
          if (currentCell === CellType.EMPTY) {
            newGrid[row][col] = CellType.WALL;
            setStats(prev => ({ ...prev, wallsPlaced: prev.wallsPlaced + 1 }));
          }
          break;

        case 'erase':
          if (currentCell === CellType.WALL) {
            setStats(prev => ({ ...prev, wallsPlaced: Math.max(0, prev.wallsPlaced - 1) }));
          }
          if (currentCell === CellType.START) {
            setStart(null);
          }
          if (currentCell === CellType.END) {
            setEnd(null);
          }
          newGrid[row][col] = CellType.EMPTY;
          break;
      }

      return newGrid;
    });

    // Clear path when making changes
    clearPath();
  }, [currentTool, grid, isPathfinding, start, end, clearPath]);

  // Find path using A* algorithm
  const findPath = useCallback(async () => {
    if (!start || !end || isPathfinding) return;

    setIsPathfinding(true);
    clearPath();

    const startTime = Date.now();
    pathfinderRef.current = new AStarPathfinder(gridSize, grid);

    try {
      const result = await pathfinderRef.current.findPath(
        start,
        end,
        (position, type) => {
          setGrid(prevGrid => {
            const newGrid = [...prevGrid];
            newGrid[position.row][position.col] = type === 'open' ? CellType.OPEN : CellType.CLOSED;
            return newGrid;
          });
        },
        async (path) => {
          // Animate path drawing
          for (let i = 1; i < path.length - 1; i++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            setGrid(prevGrid => {
              const newGrid = [...prevGrid];
              newGrid[path[i].row][path[i].col] = CellType.PATH;
              return newGrid;
            });
          }
        },
        Math.max(1, 101 - animationSpeed)
      );

      const algorithmTime = Date.now() - startTime;

      if (result && result.path.length > 0) {
        setStats(prev => ({
          ...prev,
          nodesExplored: result.nodesExplored,
          pathLength: result.path.length - 1,
          algorithmTime
        }));
      } else {
        setStats(prev => ({
          ...prev,
          algorithmTime,
          nodesExplored: 0,
          pathLength: 0
        }));
      }
    } catch (error) {
      console.error('Pathfinding error:', error);
    } finally {
      setIsPathfinding(false);
    }
  }, [start, end, isPathfinding, gridSize, grid, animationSpeed, clearPath]);

  // Save maze to localStorage
  const saveMaze = useCallback((name: string) => {
    const maze: Maze = {
      id: Date.now().toString(),
      name,
      gridSize,
      grid,
      start,
      end,
      stats,
      createdAt: new Date().toISOString()
    };

    const savedMazes = JSON.parse(localStorage.getItem('savedMazes') || '[]') as Maze[];
    savedMazes.push(maze);
    localStorage.setItem('savedMazes', JSON.stringify(savedMazes));

    return maze;
  }, [gridSize, grid, start, end, stats]);

  // Load maze from localStorage
  const loadMaze = useCallback((maze: Maze) => {
    setGridSize(maze.gridSize);
    setGrid(maze.grid);
    setStart(maze.start);
    setEnd(maze.end);
    if (maze.stats) {
      setStats(maze.stats);
    }
  }, []);

  // Get saved mazes
  const getSavedMazes = useCallback((): Maze[] => {
    return JSON.parse(localStorage.getItem('savedMazes') || '[]') as Maze[];
  }, []);

  // Delete saved maze
  const deleteSavedMaze = useCallback((id: string) => {
    const savedMazes = getSavedMazes();
    const filteredMazes = savedMazes.filter(maze => maze.id !== id);
    localStorage.setItem('savedMazes', JSON.stringify(filteredMazes));
  }, [getSavedMazes]);

  return {
    // State
    gridSize,
    grid,
    start,
    end,
    isDrawing,
    currentTool,
    isPathfinding,
    stats,
    animationSpeed,

    // Actions
    setGridSize: initializeGrid,
    setIsDrawing,
    setCurrentTool,
    setAnimationSpeed,
    clearMaze,
    clearPath,
    handleCellAction,
    findPath,
    saveMaze,
    loadMaze,
    getSavedMazes,
    deleteSavedMaze
  };
}
