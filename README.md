# 🧩 MazeCrafter – A* Pathfinding Puzzle Game

MazeCrafter is an interactive maze puzzle game that combines a sleek frontend with the powerful A* pathfinding algorithm. It allows users to visualize shortest pathfinding in real-time inside a playable maze environment.

---

## 🚀 Demo

https://maze-game-an28.onrender.com

---

## 🎮 Features

- ✨ Game-like frontend with responsive UI
- 🧠 A* (A-Star) pathfinding algorithm visualization
- 🧱 Custom maze creation with start/end placement
- 🎨 Built with TypeScript and modern web tools
- ⚡ Powered by Vite and TailwindCSS
- 🗂️ Clean code structure with client-server separation

---

## 🛠 Tech Stack

| Layer      | Tech Used                       |
|------------|---------------------------------|
| Frontend   | React + TypeScript (TSX)        |
| Styling    | Tailwind CSS                    |
| Build Tool | Vite                            |
| Server     | TypeScript backend              |
| Config     | PostCSS, Drizzle, Replit        |


## 🧠 How A* Works (In Brief)

The A* algorithm is a popular pathfinding algorithm used in games and AI. It finds the shortest path from a start node to an end node using a combination of:

- **g(n):** cost from start to node `n`
- **h(n):** heuristic estimate from `n` to the goal
- **f(n) = g(n) + h(n)** — total estimated cost

---

## 🧪 Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/SPareshKumar/Maze-Game.git
cd Maze-Game
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run the development server:
```bash
npm run dev
```

---

## 🛤 Future Improvements

- Add support for different pathfinding algorithms (Dijkstra, BFS, etc.)
- Maze random generation options
- Export/share puzzle states
- Mobile responsiveness
