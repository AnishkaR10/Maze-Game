import { useEffect, useState } from 'react';
import { useMaze } from '@/hooks/use-maze';
import MazeCanvas from '@/components/maze-canvas';
import ControlPanel from '@/components/control-panel';
import StatsPanel from '@/components/stats-panel';
import { useToast } from '@/hooks/use-toast';

export default function MazeCreator() {
  const {
    gridSize,
    grid,
    start,
    end,
    isDrawing,
    currentTool,
    isPathfinding,
    stats,
    animationSpeed,
    setGridSize,
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
  } = useMaze(50);

  const [savedMazes, setSavedMazes] = useState(getSavedMazes());
  const { toast } = useToast();

  // Update saved mazes list
  useEffect(() => {
    setSavedMazes(getSavedMazes());
  }, [getSavedMazes]);

  // Check if path exists
  const hasPath = grid.some(row => row.some(cell => cell === 'path'));
  const hasStartAndEnd = start !== null && end !== null;

  const handleSaveMaze = (name: string) => {
    try {
      const maze = saveMaze(name);
      setSavedMazes(getSavedMazes());
      toast({
        title: "Maze Saved! 💾",
        description: `"${maze.name}" has been saved to local storage.`,
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save maze. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoadMaze = (maze: any) => {
    try {
      loadMaze(maze);
      toast({
        title: "Maze Loaded! 📁",
        description: `"${maze.name}" has been loaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load maze. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMaze = (id: string) => {
    try {
      deleteSavedMaze(id);
      setSavedMazes(getSavedMazes());
      toast({
        title: "Maze Deleted",
        description: "Maze has been removed from saved mazes.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete maze. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFindPath = async () => {
    try {
      await findPath();
      // The toast will be handled by the pathfinding hook based on the actual result
    } catch (error) {
      toast({
        title: "Pathfinding Error",
        description: "An error occurred while finding the path.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid-background">
      {/* Floating Elements Background */}
      <div className="floating-elements">
        <div className="floating-element top-20 left-10 w-8 h-8 bg-primary/20 rounded transform rotate-45"></div>
        <div className="floating-element top-40 right-20 w-6 h-6 bg-accent/20 rounded-full"></div>
        <div className="floating-element top-60 left-1/3 w-10 h-10 bg-secondary/20 rounded transform rotate-12"></div>
        <div className="floating-element bottom-40 right-10 w-7 h-7 bg-primary/20 rounded-full"></div>
        <div className="floating-element bottom-20 left-20 w-9 h-9 bg-accent/20 rounded transform -rotate-12"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 mb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="pixelated-text text-4xl font-bold mb-2 text-foreground">
              MAZE CREATOR
            </h1>
            <p className="text-muted-foreground">
              A* Pathfinding Algorithm Visualizer
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {/* Left Control Panel */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <ControlPanel
              currentTool={currentTool}
              onToolChange={setCurrentTool}
              gridSize={gridSize}
              onGridSizeChange={setGridSize}
              animationSpeed={animationSpeed}
              onAnimationSpeedChange={setAnimationSpeed}
              isPathfinding={isPathfinding}
              hasStartAndEnd={hasStartAndEnd}
              onFindPath={handleFindPath}
              onClearPath={clearPath}
              onClearMaze={clearMaze}
              onSaveMaze={handleSaveMaze}
              onLoadMaze={handleLoadMaze}
              savedMazes={savedMazes}
              onDeleteMaze={handleDeleteMaze}
            />
          </div>

          {/* Maze Canvas */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="floating-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="pixelated-text text-xl font-bold">GRID</h2>
                <div className="text-sm text-muted-foreground">
                  {gridSize}×{gridSize}
                </div>
              </div>
              <MazeCanvas
                gridSize={gridSize}
                grid={grid}
                start={start}
                end={end}
                onCellClick={handleCellAction}
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
                isDrawing={isDrawing}
              />
            </div>
          </div>

          {/* Right Stats Panel */}
          <div className="lg:col-span-1 order-3">
            <StatsPanel
              stats={stats}
              gridSize={gridSize}
              isPathfinding={isPathfinding}
              hasPath={hasPath}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 text-center text-muted-foreground">
        <p className="text-sm">
          Create mazes • Visualize pathfinding • Save locally
        </p>
      </footer>
    </div>
  );
}
