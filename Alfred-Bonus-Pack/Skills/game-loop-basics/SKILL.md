---
name: game-loop-basics
description: "The heartbeat of every game: input → update → draw → repeat. A reusable starting skeleton for any browser arcade game, plus the ideas that carry straight into Unity and Unreal later. Use at the very start of any game project."
risk: low
source: alfred-bonus-pack
---

# Game Loop Basics (the heartbeat of every game)

> Every game — your camp arcade game, and later Unity/Unreal — runs the same
> little heartbeat over and over: read the **input**, **update** the world a tiny
> bit, **draw** it, then do it all again ~60 times a second. Learn this once and
> you've learned how all games work.

## When to Use It
- You're starting any arcade/action game (the camp's main project).
- You want a clean skeleton to build on instead of a blank page.

## The idea (4 steps, forever)
```
1. INPUT   — what is the player pressing/tapping right now?
2. UPDATE  — move everything a little (player, enemies, ball, timer).
3. DRAW    — paint the new picture on the screen.
4. REPEAT  — ask the browser to do it all again next frame.
```
That's it. A racing game, Minecraft, and Pac-Man are all just this loop with
different UPDATE and DRAW steps.

## Steps / Pattern
1. Make an HTML page with a `<canvas>`.
2. Track input (keys/taps) into a small `keys` object.
3. Write `update()` (move things) and `draw()` (paint things).
4. Run them every frame with `requestAnimationFrame`.

## Example — a runnable skeleton (a square you move)
```html
<!doctype html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;background:#111">
<canvas id="game" width="375" height="600"></canvas>
<script>
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// --- game state ---
const player = { x: 170, y: 500, size: 35, speed: 4 };
const keys = {};

// --- INPUT ---
addEventListener("keydown", e => keys[e.key] = true);
addEventListener("keyup",   e => keys[e.key] = false);
// touch: tap left/right half of screen to move (mobile-first!)
addEventListener("touchstart", e => {
  const x = e.touches[0].clientX;
  keys["left"]  = x < canvas.width / 2;
  keys["right"] = x >= canvas.width / 2;
});
addEventListener("touchend", () => { keys["left"] = keys["right"] = false; });

// --- UPDATE ---
function update() {
  if (keys["ArrowLeft"]  || keys["left"])  player.x -= player.speed;
  if (keys["ArrowRight"] || keys["right"]) player.x += player.speed;
  // keep player on screen
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
}

// --- DRAW ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#4ade80";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// --- THE LOOP ---
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);   // do it again next frame
}
loop();
</script>
</body>
</html>
```
Save it as `index.html`, open it in a browser, and move the square with the arrow
keys — or tap the left/right side on a phone. Now you have a heartbeat to build on.

## Notes & Gotchas
- **Mobile-first:** notice the example handles taps, not just keys. Add touch
  controls from the start (see the DESIGNER role).
- **Add features one at a time:** add a goal, then enemies, then a score, then a
  win/lose screen — testing after each. (That's the BUILDER rulebook.)
- **This carries forward:** Unity calls UPDATE `Update()`; Unreal calls it `Tick`.
  Same heartbeat, fancier engine. Learning it here means you already get those.
- Keep `update()` and `draw()` separate — it keeps the game easy to change.
