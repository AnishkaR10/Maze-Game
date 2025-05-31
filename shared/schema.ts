import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Maze data structure for local storage
export const mazeSchema = z.object({
  id: z.string(),
  name: z.string(),
  gridSize: z.number(),
  grid: z.array(z.array(z.string())),
  start: z.object({ row: z.number(), col: z.number() }).nullable(),
  end: z.object({ row: z.number(), col: z.number() }).nullable(),
  stats: z.object({
    nodesExplored: z.number(),
    pathLength: z.number(),
    algorithmTime: z.number(),
    wallsPlaced: z.number()
  }).optional(),
  createdAt: z.string()
});

export type Maze = z.infer<typeof mazeSchema>;

// Cell types for the maze grid
export enum CellType {
  EMPTY = 'empty',
  WALL = 'wall',
  START = 'start',
  END = 'end',
  OPEN = 'open',
  CLOSED = 'closed',
  PATH = 'path'
}

// Position interface
export interface Position {
  row: number;
  col: number;
}

// Pathfinding node
export interface PathNode {
  position: Position;
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
}
