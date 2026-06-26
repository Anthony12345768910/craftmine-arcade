## Milestone 1: Project Skeleton & Backend
- [ ] Express server with static serving
- [ ] JWT auth endpoints (register, login, me)
- [ ] Scores API (submit, leaderboard, personal best)
- [ ] JSON-file database setup

## Milestone 2: Minecraft Theme & Homepage
- [ ] Global CSS with Minecraft color palette + pixel font
- [ ] Arcade homepage with game card grid
- [ ] Login/signup modal UI
- [ ] Auth client logic (JWT storage, auto-attach)

## Milestone 3: Tetris
- [ ] Full Tetris engine (SRS rotation, wall kicks, 7 tetrominoes)
- [ ] Scoring (single/double/triple/tetris), levels, speed increase
- [ ] Next piece preview, pause, hard drop
- [ ] Line clear animation + game over screen
- [ ] Score submission to leaderboard

## Milestone 4: Water Sort
- [ ] Tube state management + pour logic
- [ ] Solvable puzzle generation
- [ ] Pour animation + win detection
- [ ] Level progression + scoring
- [ ] Score submission to leaderboard

## Milestone 5: Polish & Integration
- [ ] Full auth flow verified end-to-end
- [ ] Leaderboards display on homepage
- [ ] Back to Arcade buttons on all games
- [ ] Final QA pass

## Milestone 6: Minecraft Music Player
- [x] Create public/js/music.js — self-contained floating music widget
- [x] Stream 8 C418 tracks from Archive.org (Sweden, Wet Hands, Mice on Venus, Clark, Subwoofer Lullaby, Living Mice, Haggstrom, Minecraft Title)
- [x] Play/pause, prev/next track, volume slider controls
- [x] Persist play state, current track, and volume in localStorage
- [x] Auto-advance to next track when current track ends
- [x] Resume playback when navigating between pages
- [x] Collapsible widget (shows only 🎵 icon when collapsed)
- [x] Inject music.js into all 5 pages: homepage + 4 game pages
