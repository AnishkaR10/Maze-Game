import { CellType, Position, PathNode } from "@shared/schema";

export class AStarPathfinder {
  private gridSize: number;
  private grid: string[][];

  constructor(gridSize: number, grid: string[][]) {
    this.gridSize = gridSize;
    this.grid = grid;
  }

  // Manhattan distance heuristic
  private heuristic(pos1: Position, pos2: Position): number {
    return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
  }

  // Get valid neighbors
  private getNeighbors(position: Position): Position[] {
    const neighbors: Position[] = [];
    const directions = [
      { row: -1, col: 0 }, // Up
      { row: 1, col: 0 },  // Down
      { row: 0, col: -1 }, // Left
      { row: 0, col: 1 }   // Right
    ];

    for (const dir of directions) {
      const newRow = position.row + dir.row;
      const newCol = position.col + dir.col;

      if (
        newRow >= 0 && 
        newRow < this.gridSize && 
        newCol >= 0 && 
        newCol < this.gridSize &&
        this.grid[newRow][newCol] !== CellType.WALL
      ) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  }

  // Reconstruct path from end to start
  private reconstructPath(endNode: PathNode): Position[] {
    const path: Position[] = [];
    let current: PathNode | null = endNode;

    while (current) {
      path.unshift(current.position);
      current = current.parent;
    }

    return path;
  }

  // Main A* algorithm
  async findPath(
    start: Position, 
    end: Position, 
    onNodeExplored?: (position: Position, type: 'open' | 'closed') => void,
    onPathFound?: (path: Position[]) => void,
    delay: number = 50
  ): Promise<{ path: Position[], nodesExplored: number } | null> {
    const openSet: PathNode[] = [];
    const closedSet = new Set<string>();
    const openSetHash = new Set<string>();

    const startNode: PathNode = {
      position: start,
      g: 0,
      h: this.heuristic(start, end),
      f: this.heuristic(start, end),
      parent: null
    };

    openSet.push(startNode);
    openSetHash.add(`${start.row},${start.col}`);

    let nodesExplored = 0;

    while (openSet.length > 0) {
      // Find node with lowest f score
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      const currentKey = `${current.position.row},${current.position.col}`;

      openSetHash.delete(currentKey);
      closedSet.add(currentKey);
      nodesExplored++;

      // Notify about node exploration
      if (onNodeExplored && 
          !(current.position.row === start.row && current.position.col === start.col) &&
          !(current.position.row === end.row && current.position.col === end.col)) {
        onNodeExplored(current.position, 'closed');
      }

      // Check if we reached the goal
      if (current.position.row === end.row && current.position.col === end.col) {
        const path = this.reconstructPath(current);
        if (onPathFound) {
          onPathFound(path);
        }
        return { path, nodesExplored };
      }

      // Check neighbors
      const neighbors = this.getNeighbors(current.position);

      for (const neighborPos of neighbors) {
        const neighborKey = `${neighborPos.row},${neighborPos.col}`;

        if (closedSet.has(neighborKey)) {
          continue;
        }

        const tentativeG = current.g + 1;

        if (!openSetHash.has(neighborKey)) {
          const neighbor: PathNode = {
            position: neighborPos,
            g: tentativeG,
            h: this.heuristic(neighborPos, end),
            f: tentativeG + this.heuristic(neighborPos, end),
            parent: current
          };

          openSet.push(neighbor);
          openSetHash.add(neighborKey);

          // Notify about new open node
          if (onNodeExplored && 
              !(neighborPos.row === end.row && neighborPos.col === end.col)) {
            onNodeExplored(neighborPos, 'open');
          }
        } else {
          // Check if this path to neighbor is better
          const existingNode = openSet.find(node => 
            node.position.row === neighborPos.row && 
            node.position.col === neighborPos.col
          );

          if (existingNode && tentativeG < existingNode.g) {
            existingNode.g = tentativeG;
            existingNode.f = tentativeG + existingNode.h;
            existingNode.parent = current;
          }
        }
      }

      // Add delay for animation
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return null; // No path found
  }
}
