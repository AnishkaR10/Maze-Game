import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Maze } from "@shared/schema";

interface ControlPanelProps {
  currentTool: 'start' | 'end' | 'wall' | 'erase';
  onToolChange: (tool: 'start' | 'end' | 'wall' | 'erase') => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  isPathfinding: boolean;
  hasStartAndEnd: boolean;
  onFindPath: () => void;
  onClearPath: () => void;
  onClearMaze: () => void;
  onSaveMaze: (name: string) => void;
  onLoadMaze: (maze: Maze) => void;
  savedMazes: Maze[];
  onDeleteMaze: (id: string) => void;
}

export default function ControlPanel({
  currentTool,
  onToolChange,
  gridSize,
  onGridSizeChange,
  animationSpeed,
  onAnimationSpeedChange,
  isPathfinding,
  hasStartAndEnd,
  onFindPath,
  onClearPath,
  onClearMaze,
  onSaveMaze,
  onLoadMaze,
  savedMazes,
  onDeleteMaze
}: ControlPanelProps) {
  const [mazeName, setMazeName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  const handleSave = () => {
    if (!mazeName.trim()) {
      setShowSaveInput(true);
      return;
    }
    onSaveMaze(mazeName.trim());
    setMazeName('');
    setShowSaveInput(false);
  };

  const toolButtons = [
    { tool: 'start' as const, label: 'START', className: 'start' },
    { tool: 'end' as const, label: 'END', className: 'end' },
    { tool: 'wall' as const, label: 'WALL', className: 'wall' },
    { tool: 'erase' as const, label: 'ERASE', className: 'erase' }
  ];

  return (
    <div className="space-y-4">
      {/* Drawing Tools */}
      <div className="floating-card p-4">
        <h3 className="pixelated-text text-lg mb-4 text-center">TOOLS</h3>
        <div className="grid grid-cols-2 gap-3">
          {toolButtons.map(({ tool, label, className }) => (
            <button
              key={tool}
              onClick={() => onToolChange(tool)}
              className={`game-button ${className} p-3 ${
                currentTool === tool ? 'opacity-70 transform translate-y-1' : ''
              }`}
              disabled={isPathfinding}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Controls */}
      <div className="floating-card p-4">
        <h3 className="pixelated-text text-lg mb-4 text-center">ACTIONS</h3>
        <div className="space-y-3">
          <button
            onClick={onFindPath}
            disabled={!hasStartAndEnd || isPathfinding}
            className="w-full game-button primary p-3"
          >
            {isPathfinding ? 'FINDING...' : 'FIND PATH'}
          </button>
          <button
            onClick={onClearPath}
            disabled={isPathfinding}
            className="w-full game-button teal p-3"
          >
            CLEAR PATH
          </button>
          <button
            onClick={onClearMaze}
            disabled={isPathfinding}
            className="w-full game-button secondary p-3"
          >
            RESET MAZE
          </button>
        </div>
      </div>

      {/* Grid Size Control */}
      <div className="floating-card p-4">
        <h3 className="pixelated-text text-lg mb-4 text-center">GRID SIZE</h3>
        <div className="space-y-3">
          <Label className="text-sm font-bold">Size: {gridSize}x{gridSize}</Label>
          <Select
            value={gridSize.toString()}
            onValueChange={(value) => onGridSizeChange(parseInt(value))}
            disabled={isPathfinding}
          >
            <SelectTrigger className="border-2 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20x20</SelectItem>
              <SelectItem value="30">30x30</SelectItem>
              <SelectItem value="40">40x40</SelectItem>
              <SelectItem value="50">50x50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Animation Speed */}
      <div className="floating-card p-4">
        <h3 className="pixelated-text text-lg mb-4 text-center">SPEED</h3>
        <div className="space-y-3">
          <Label className="text-sm font-bold">Speed: {animationSpeed}%</Label>
          <Slider
            value={[animationSpeed]}
            onValueChange={(value) => onAnimationSpeedChange(value[0])}
            max={100}
            min={1}
            step={1}
            className="w-full"
            disabled={isPathfinding}
          />
        </div>
      </div>

      {/* Save/Load */}
      <div className="floating-card p-4">
        <h3 className="pixelated-text text-lg mb-4 text-center">SAVE</h3>
        <div className="space-y-3">
          {showSaveInput && (
            <Input
              value={mazeName}
              onChange={(e) => setMazeName(e.target.value)}
              placeholder="Enter maze name..."
              className="border-2 border-border"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') setShowSaveInput(false);
              }}
            />
          )}
          <button
            onClick={handleSave}
            disabled={isPathfinding || (!hasStartAndEnd && !showSaveInput)}
            className="w-full game-button accent p-3"
          >
            SAVE MAZE
          </button>
          
          {savedMazes.length > 0 && (
            <Select onValueChange={(value) => {
              const maze = savedMazes.find(m => m.id === value);
              if (maze) onLoadMaze(maze);
            }}>
              <SelectTrigger className="border-2 border-border">
                <SelectValue placeholder="Load maze..." />
              </SelectTrigger>
              <SelectContent>
                {savedMazes.map((maze) => (
                  <SelectItem key={maze.id} value={maze.id}>
                    {maze.name} ({maze.gridSize}x{maze.gridSize})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
