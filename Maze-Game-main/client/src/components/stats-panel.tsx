import { MazeStats } from '@/hooks/use-maze';

interface StatsPanelProps {
  stats: MazeStats;
  gridSize: number;
  isPathfinding: boolean;
  hasPath: boolean;
}

export default function StatsPanel({ stats, gridSize, isPathfinding, hasPath }: StatsPanelProps) {
  const getStatus = () => {
    if (isPathfinding) return 'SOLVING...';
    if (hasPath) return 'SOLVED!';
    return 'READY';
  };

  const getStatusColor = () => {
    if (isPathfinding) return 'text-yellow-600';
    if (hasPath) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <div className="space-y-4">
      {/* Status */}
      <div className="floating-card p-4">
        <h3 className="pixelated-text text-lg mb-3 text-center">STATUS</h3>
        <div className="text-center">
          <div className={`pixelated-text text-lg font-bold ${getStatusColor()}`}>
            {getStatus()}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="floating-card p-4">
        <h3 className="pixelated-text text-lg mb-3 text-center">STATS</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Grid:</span>
            <span className="font-bold">{gridSize}x{gridSize}</span>
          </div>
          <div className="flex justify-between">
            <span>Walls:</span>
            <span className="font-bold">{stats.wallsPlaced}</span>
          </div>
          <div className="flex justify-between">
            <span>Explored:</span>
            <span className="font-bold">{stats.nodesExplored}</span>
          </div>
          <div className="flex justify-between">
            <span>Path:</span>
            <span className="font-bold">{stats.pathLength}</span>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <span className="font-bold">{stats.algorithmTime}ms</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="floating-card p-4">
        <h3 className="pixelated-text text-lg mb-3 text-center">LEGEND</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded mr-2 border border-gray-400" style={{backgroundColor: '#F59E0B'}}></div>
            <span>Start</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded mr-2 border border-gray-400" style={{backgroundColor: '#3B82F6'}}></div>
            <span>End</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded mr-2 border border-gray-400" style={{backgroundColor: '#334155'}}></div>
            <span>Wall</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded mr-2 border border-gray-400" style={{backgroundColor: '#10B981'}}></div>
            <span>Open</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded mr-2 border border-gray-400" style={{backgroundColor: '#EF4444'}}></div>
            <span>Closed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded mr-2 border border-gray-400" style={{backgroundColor: '#8B5CF6'}}></div>
            <span>Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
