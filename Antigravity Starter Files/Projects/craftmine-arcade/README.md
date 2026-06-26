# CraftMine Arcade

A Minecraft-themed web arcade featuring classic games with pixelated aesthetics, JWT-based user accounts, and per-game leaderboards.

## How to Run

1. Open a terminal in this project folder
2. Run `npm install` to install dependencies
3. Run `node server.js` to start the server
4. Open `http://localhost:3000` in your browser

## Main Folders/Files

- `server.js` — Express backend (auth API + scores API + static file serving)
- `public/` — All frontend code (HTML, CSS, JS)
- `public/index.html` — Arcade homepage
- `public/games/tetris/` — Tetris game
- `public/games/water-sort/` — Water Sort puzzle game
- `public/games/snake/` — Snake game
- `public/games/memory/` — Memory card game
- `public/js/auth.js` — Login/signup client logic
- `public/js/music.js` — Minecraft music player widget (streams C418 OST)
- `public/css/style.css` — Global Minecraft theme
- `data/` — JSON-file database (users + scores)

## APIs Used
- None (self-contained)

## Skills Used
- auth-implementation-patterns (JWT login)
- uiux-designer (Minecraft theme design)
- frontend-expert (component organization)

## Music
The arcade plays C418's Minecraft OST (Sweden, Wet Hands, Mice on Venus, etc.) streamed
from Archive.org. A floating widget in the bottom-right corner lets players play/pause,
skip tracks, and control volume. State persists across page navigation via localStorage.
