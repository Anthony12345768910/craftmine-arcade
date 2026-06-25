// ============================================================
// CraftMine Snake — Voxel Isometric Snake Game Engine
// Full isometric 3D block rendering on Canvas2D
// ============================================================

const GRID_COLS = 20;
const GRID_ROWS = 20;

// Isometric tile dimensions
const ISO_W = 32;   // tile width  (diamond width)
const ISO_H = 16;   // tile height (diamond height)
const BLOCK_H = 20; // height of a cube face (sides)

// Canvas
let canvas, ctx;
let canvasW, canvasH;

// Game state
let snake = [];       // [{x, y}, ...] head first
let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };
let apple = { x: 0, y: 0 };
let score = 0;
let highScore = parseInt(localStorage.getItem('snake_hs') || '0');
let gameRunning = false;
let gameOver = false;
let gamePaused = false;
let gameLoopId = null;
let speed = 150; // ms per tick

// ====== Isometric math ======

// Convert grid (gx, gy) to isometric screen (sx, sy) for the TOP face
function gridToIso(gx, gy) {
    const sx = (gx - gy) * (ISO_W / 2) + canvasW / 2;
    const sy = (gx + gy) * (ISO_H / 2) + ISO_H * 2;
    return { sx, sy };
}

// ====== Color palettes ======

const GROUND_COLORS = {
    top:   '#4A7A28',
    left:  '#2D5016',
    right: '#3B6020',
};

const DIRT_COLORS = {
    top:   '#7A5820',
    left:  '#4A380F',
    right: '#5C4414',
};

const SNAKE_COLORS = {
    top:   '#50C878',
    left:  '#2D8C48',
    right: '#3BA35A',
};

const SNAKE_HEAD_COLORS = {
    top:   '#7EC850',
    left:  '#4A8C28',
    right: '#5DA030',
};

const APPLE_COLORS = {
    top:   '#FF3B3B',
    left:  '#AA2020',
    right: '#CC2E2E',
};

const APPLE_LEAF = '#50C878';

// ====== Draw isometric cube ======

function drawIsoCube(gx, gy, colors, heightMult = 1, extraH = 0) {
    const { sx, sy } = gridToIso(gx, gy);
    const h = BLOCK_H * heightMult + extraH;

    ctx.save();

    // Top face (diamond)
    ctx.beginPath();
    ctx.moveTo(sx,              sy - h);
    ctx.lineTo(sx + ISO_W / 2, sy - h + ISO_H / 2);
    ctx.lineTo(sx,              sy - h + ISO_H);
    ctx.lineTo(sx - ISO_W / 2, sy - h + ISO_H / 2);
    ctx.closePath();
    ctx.fillStyle = colors.top;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Left face
    ctx.beginPath();
    ctx.moveTo(sx - ISO_W / 2, sy - h + ISO_H / 2);
    ctx.lineTo(sx,              sy - h + ISO_H);
    ctx.lineTo(sx,              sy + ISO_H / 2);
    ctx.lineTo(sx - ISO_W / 2, sy);
    ctx.closePath();
    ctx.fillStyle = colors.left;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Right face
    ctx.beginPath();
    ctx.moveTo(sx,              sy - h + ISO_H);
    ctx.lineTo(sx + ISO_W / 2, sy - h + ISO_H / 2);
    ctx.lineTo(sx + ISO_W / 2, sy);
    ctx.lineTo(sx,              sy + ISO_H / 2);
    ctx.closePath();
    ctx.fillStyle = colors.right;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.restore();
}

// ====== Draw apple with leaf ======
function drawApple(gx, gy) {
    // Apple body (slightly taller cube)
    drawIsoCube(gx, gy, APPLE_COLORS, 1, 6);

    // Leaf — small green diamond on top
    const { sx, sy } = gridToIso(gx, gy);
    const h = BLOCK_H + 6;
    ctx.save();
    ctx.fillStyle = APPLE_LEAF;
    ctx.beginPath();
    ctx.moveTo(sx + 2, sy - h - 2);
    ctx.lineTo(sx + 8, sy - h - 8);
    ctx.lineTo(sx + 12, sy - h - 4);
    ctx.lineTo(sx + 6, sy - h + 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// ====== Draw the ground grid ======
function drawGround() {
    // Draw in back-to-front order for proper layering
    for (let gy = 0; gy < GRID_ROWS; gy++) {
        for (let gx = 0; gx < GRID_COLS; gx++) {
            // Checkerboard-style variation for depth
            const isDark = (gx + gy) % 2 === 0;
            const colors = isDark ? GROUND_COLORS : {
                top:   '#3D6822',
                left:  '#254A10',
                right: '#2F5A18',
            };
            drawIsoCube(gx, gy, colors, 0.5);
        }
    }
}

// ====== Draw snake ======
function drawSnake() {
    // Draw tail-first so head overlaps
    for (let i = snake.length - 1; i >= 0; i--) {
        const seg = snake[i];
        const colors = i === 0 ? SNAKE_HEAD_COLORS : SNAKE_COLORS;
        drawIsoCube(seg.x, seg.y, colors, 1.3, 2);

        // Eyes on head
        if (i === 0) {
            const { sx, sy } = gridToIso(seg.x, seg.y);
            const h = BLOCK_H * 1.3 + 2;
            ctx.save();
            ctx.fillStyle = '#fff';

            // Position eyes based on direction
            const ex1 = dir.x === 1 ? sx + 6  : dir.x === -1 ? sx - 6  : sx - 4;
            const ey1 = dir.y === 1 ? sy - h + ISO_H - 4 : dir.y === -1 ? sy - h + 4 : sy - h + 6;
            const ex2 = dir.x === 1 ? sx + 10 : dir.x === -1 ? sx - 10 : sx + 4;
            const ey2 = ey1;

            ctx.beginPath(); ctx.arc(ex1, ey1, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(ex2, ey2, 2.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath(); ctx.arc(ex1 + 0.5, ey1 + 0.5, 1.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(ex2 + 0.5, ey2 + 0.5, 1.2, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }
    }
}

// ====== Main render ======
function render() {
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Sky gradient background
    const sky = ctx.createLinearGradient(0, 0, 0, canvasH);
    sky.addColorStop(0, '#87CEEB');
    sky.addColorStop(1, '#C8E8FF');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, canvasW, canvasH);

    drawGround();
    drawApple(apple.x, apple.y);
    drawSnake();
}

// ====== Game logic ======
function spawnApple() {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * GRID_COLS),
            y: Math.floor(Math.random() * GRID_ROWS),
        };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    apple = pos;
}

function tick() {
    if (!gameRunning || gamePaused || gameOver) return;

    dir = { ...nextDir };

    const head = snake[0];
    const newHead = {
        x: (head.x + dir.x + GRID_COLS) % GRID_COLS,
        y: (head.y + dir.y + GRID_ROWS) % GRID_ROWS,
    };

    // Self-collision
    if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
        endGame();
        return;
    }

    snake.unshift(newHead);

    // Eat apple
    if (newHead.x === apple.x && newHead.y === apple.y) {
        score++;
        document.getElementById('snake-score').textContent = score;
        // Speed up slightly
        speed = Math.max(60, 150 - score * 4);
        clearInterval(gameLoopId);
        gameLoopId = setInterval(tick, speed);
        spawnApple();
    } else {
        snake.pop();
    }

    render();
}

// ====== End game ======
function endGame() {
    gameOver = true;
    gameRunning = false;
    clearInterval(gameLoopId);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snake_hs', highScore);
        document.getElementById('snake-hs').textContent = highScore;
        document.getElementById('snake-hs').classList.add('hs-flash');
    }

    document.getElementById('snake-final-score').textContent = score;
    document.getElementById('snake-final-hs').textContent = highScore;
    setTimeout(() => {
        document.getElementById('snake-game-over').classList.add('active');
    }, 300);
}

// ====== Start / Restart ======
function startSnake() {
    // Hide overlays
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('snake-game-over').classList.remove('active');
    document.getElementById('game-area').classList.remove('hidden');

    // Reset
    snake = [
        { x: 10, y: 10 },
        { x: 9,  y: 10 },
        { x: 8,  y: 10 },
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    speed = 150;
    gameOver = false;
    gamePaused = false;
    gameRunning = true;

    document.getElementById('snake-score').textContent = '0';
    document.getElementById('snake-hs').textContent = highScore;
    document.getElementById('snake-hs').classList.remove('hs-flash');

    spawnApple();
    render();

    clearInterval(gameLoopId);
    gameLoopId = setInterval(tick, speed);
}

// ====== Input ======
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); if (dir.y !== 1)  nextDir = { x: 0, y: -1 }; break;
        case 'ArrowDown':  e.preventDefault(); if (dir.y !== -1) nextDir = { x: 0, y: 1 };  break;
        case 'ArrowLeft':  e.preventDefault(); if (dir.x !== 1)  nextDir = { x: -1, y: 0 }; break;
        case 'ArrowRight': e.preventDefault(); if (dir.x !== -1) nextDir = { x: 1, y: 0 };  break;
        case 'p': case 'P':
            if (gameRunning) {
                gamePaused = !gamePaused;
                document.getElementById('snake-pause').classList.toggle('active', gamePaused);
            }
            break;
    }
});

// Mobile d-pad
function dpadPress(d) {
    switch (d) {
        case 'up':    if (dir.y !== 1)  nextDir = { x: 0, y: -1 }; break;
        case 'down':  if (dir.y !== -1) nextDir = { x: 0, y: 1 };  break;
        case 'left':  if (dir.x !== 1)  nextDir = { x: -1, y: 0 }; break;
        case 'right': if (dir.x !== -1) nextDir = { x: 1, y: 0 };  break;
    }
}

// ====== Canvas setup ======
window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('snake-canvas');
    ctx = canvas.getContext('2d');

    // Size canvas: calculate how wide the iso grid needs to be
    canvasW = (GRID_COLS + GRID_ROWS) * (ISO_W / 2) + ISO_W;
    canvasH = (GRID_COLS + GRID_ROWS) * (ISO_H / 2) + BLOCK_H * 2 + 60;
    canvas.width = canvasW;
    canvas.height = canvasH;

    document.getElementById('snake-hs').textContent = highScore;
});
