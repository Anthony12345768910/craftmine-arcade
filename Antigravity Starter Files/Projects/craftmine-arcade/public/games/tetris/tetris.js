// ============================================================
// CraftMine Tetris — Full Engine
// SRS rotation, wall kicks, 7 standard tetrominoes, scoring,
// next piece preview, levels, line clear animation, game over.
// ============================================================

// ====== Constants ======
const COLS = 10;
const ROWS = 22;          // Top 2 rows are hidden spawn zone
const VISIBLE_ROWS = 20;  // Only bottom 20 shown on canvas
const CELL_SIZE = 30;     // Pixel size of each cell on canvas

// Canvas references (set on game start)
let canvas, ctx, nextCanvas, nextCtx;

// ====== Tetromino definitions ======
// Each piece has 4 rotation states (0, 1, 2, 3) stored as [row, col] offsets
const TETROMINOES = {
    I: {
        color: '#00CED1',    // Cyan
        darkColor: '#00A5A8',
        lightColor: '#4AEDD9',
        // 4 rotation states for I-piece
        states: [
            [[0,0],[0,1],[0,2],[0,3]],   // State 0 — horizontal
            [[0,2],[1,2],[2,2],[3,2]],   // State 1 — vertical
            [[2,0],[2,1],[2,2],[2,3]],   // State 2 — horizontal (flipped)
            [[0,1],[1,1],[2,1],[3,1]]    // State 3 — vertical (flipped)
        ]
    },
    O: {
        color: '#FCDC5F',    // Yellow
        darkColor: '#D4B84A',
        lightColor: '#FDE88A',
        states: [
            [[0,0],[0,1],[1,0],[1,1]],
            [[0,0],[0,1],[1,0],[1,1]],
            [[0,0],[0,1],[1,0],[1,1]],
            [[0,0],[0,1],[1,0],[1,1]]
        ]
    },
    T: {
        color: '#A020F0',    // Purple
        darkColor: '#7B18B8',
        lightColor: '#C060FF',
        states: [
            [[0,1],[1,0],[1,1],[1,2]],
            [[0,0],[1,0],[1,1],[2,0]],
            [[0,0],[0,1],[0,2],[1,1]],
            [[0,1],[1,0],[1,1],[2,1]]
        ]
    },
    S: {
        color: '#50C878',    // Green
        darkColor: '#3BA35D',
        lightColor: '#70E898',
        states: [
            [[0,1],[0,2],[1,0],[1,1]],
            [[0,0],[1,0],[1,1],[2,1]],
            [[1,1],[1,2],[2,0],[2,1]],
            [[0,0],[1,0],[1,1],[2,1]]
        ]
    },
    Z: {
        color: '#FF3B3B',    // Red
        darkColor: '#CC2E2E',
        lightColor: '#FF6B6B',
        states: [
            [[0,0],[0,1],[1,1],[1,2]],
            [[0,1],[1,0],[1,1],[2,0]],
            [[0,0],[0,1],[1,1],[1,2]],
            [[0,1],[1,0],[1,1],[2,0]]
        ]
    },
    J: {
        color: '#3B6BFF',    // Blue
        darkColor: '#2E55CC',
        lightColor: '#6B8BFF',
        states: [
            [[0,0],[1,0],[1,1],[1,2]],
            [[0,0],[0,1],[1,0],[2,0]],
            [[0,0],[0,1],[0,2],[1,2]],
            [[0,1],[1,1],[2,0],[2,1]]
        ]
    },
    L: {
        color: '#FF8C00',    // Orange
        darkColor: '#CC7000',
        lightColor: '#FFA840',
        states: [
            [[0,2],[1,0],[1,1],[1,2]],
            [[0,0],[1,0],[2,0],[2,1]],
            [[0,0],[0,1],[0,2],[1,0]],
            [[0,0],[0,1],[1,1],[2,1]]
        ]
    }
};

// ====== SRS Wall Kick Data ======
// Offsets to test when rotating. Format: [colOffset, rowOffset]
// For J, L, S, T, Z pieces (non-I, non-O)
const WALL_KICK_JLSTZ = {
    '0>1': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    '1>0': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    '1>2': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
    '2>1': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
    '2>3': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
    '3>2': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    '3>0': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
    '0>3': [[0,0],[1,0],[1,-1],[0,2],[1,2]]
};

// For I piece
const WALL_KICK_I = {
    '0>1': [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
    '1>0': [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
    '1>2': [[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
    '2>1': [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
    '2>3': [[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
    '3>2': [[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
    '3>0': [[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
    '0>3': [[0,0],[-1,0],[2,0],[-1,-2],[2,1]]
};

// ====== Game State ======
let board = [];         // 2D array [ROWS][COLS], null = empty, string = piece type
let currentPiece = null;
let nextPieceType = null;
let score = 0;
let level = 1;
let linesCleared = 0;
let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let dropInterval = null;
let dropSpeed = 1000;   // ms per drop (decreases with level)
let bag = [];           // 7-bag randomizer

// ====== Piece object ======
// { type: 'T', rotation: 0, row: 0, col: 3 }

function createPiece(type) {
    return {
        type: type,
        rotation: 0,
        // Spawn centered, top of visible area (row 0 of board = hidden zone)
        row: 0,
        col: Math.floor((COLS - 4) / 2)
    };
}

// Get the current cells occupied by a piece at a given position/rotation
function getPieceCells(piece, rotation, row, col) {
    const states = TETROMINOES[piece.type].states;
    const state = states[rotation !== undefined ? rotation : piece.rotation];
    return state.map(([r, c]) => [row !== undefined ? row + r : piece.row + r, col !== undefined ? col + c : piece.col + c]);
}

// ====== 7-Bag Randomizer ======
function fillBag() {
    bag = Object.keys(TETROMINOES).slice();
    // Fisher-Yates shuffle
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
}

function nextFromBag() {
    if (bag.length === 0) fillBag();
    return bag.pop();
}

// ====== Board operations ======

function createBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
        board.push(new Array(COLS).fill(null));
    }
}

// Check if a set of cells is valid (in bounds, no overlap)
function isValid(cells) {
    for (const [r, c] of cells) {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
        if (board[r][c] !== null) return false;
    }
    return true;
}

// Lock the current piece onto the board
function lockPiece() {
    const cells = getPieceCells(currentPiece);
    for (const [r, c] of cells) {
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            board[r][c] = currentPiece.type;
        }
    }
}

// ====== Line clearing ======

function getFullRows() {
    const fullRows = [];
    for (let r = 0; r < ROWS; r++) {
        if (board[r].every(cell => cell !== null)) {
            fullRows.push(r);
        }
    }
    return fullRows;
}

function clearRows(rows) {
    // Remove full rows and add empty ones at top
    // Sort descending so we remove from bottom first
    rows.sort((a, b) => b - a);
    for (const r of rows) {
        board.splice(r, 1);
    }
    // Add empty rows at top
    for (let i = 0; i < rows.length; i++) {
        board.unshift(new Array(COLS).fill(null));
    }
}

// Scoring based on number of lines cleared
function scoreForLines(numLines) {
    const multipliers = { 1: 100, 2: 300, 3: 500, 4: 800 };
    return (multipliers[numLines] || 0) * level;
}

// ====== Movement & Rotation ======

function movePiece(dRow, dCol) {
    const cells = getPieceCells(currentPiece, currentPiece.rotation,
        currentPiece.row + dRow, currentPiece.col + dCol);
    if (isValid(cells)) {
        currentPiece.row += dRow;
        currentPiece.col += dCol;
        return true;
    }
    return false;
}

// SRS rotation with wall kicks
function rotatePiece() {
    if (currentPiece.type === 'O') return; // O doesn't rotate

    const oldRot = currentPiece.rotation;
    const newRot = (oldRot + 1) % 4;
    const kickKey = `${oldRot}>${newRot}`;

    // Choose wall kick table based on piece type
    const kickTable = currentPiece.type === 'I' ? WALL_KICK_I : WALL_KICK_JLSTZ;
    const kicks = kickTable[kickKey];

    // Try each kick offset
    for (const [dc, dr] of kicks) {
        const cells = getPieceCells(currentPiece, newRot,
            currentPiece.row - dr, currentPiece.col + dc);
        if (isValid(cells)) {
            currentPiece.rotation = newRot;
            currentPiece.row -= dr;
            currentPiece.col += dc;
            return true;
        }
    }
    return false; // No kick worked
}

// Hard drop — instantly drop to lowest valid position
function hardDrop() {
    let dropCount = 0;
    while (movePiece(1, 0)) {
        dropCount++;
    }
    // Award 2 points per row hard-dropped
    score += dropCount * 2;
    placePiece();
}

// Soft drop — move down one row, score 1 point
function softDrop() {
    if (movePiece(1, 0)) {
        score += 1;
        updateDisplay();
        render();
    }
}

// ====== Place piece and spawn next ======

function placePiece() {
    lockPiece();

    // Check for line clears
    const fullRows = getFullRows();
    if (fullRows.length > 0) {
        // Flash animation (brief white flash on cleared rows)
        flashRows(fullRows, () => {
            clearRows(fullRows);
            linesCleared += fullRows.length;
            score += scoreForLines(fullRows.length);

            // Level up every 10 lines
            const newLevel = Math.floor(linesCleared / 10) + 1;
            if (newLevel > level) {
                level = newLevel;
                updateDropSpeed();
            }

            updateDisplay();
            spawnNext();
        });
    } else {
        spawnNext();
    }
}

function spawnNext() {
    currentPiece = createPiece(nextPieceType);
    nextPieceType = nextFromBag();

    // Check if new piece can be placed (game over check)
    const cells = getPieceCells(currentPiece);
    if (!isValid(cells)) {
        endGame();
        return;
    }

    updateDisplay();
    render();
    renderNextPiece();
}

// ====== Line clear flash animation ======

function flashRows(rows, callback) {
    // Stop the normal drop during animation
    clearInterval(dropInterval);
    let flashes = 0;
    const maxFlashes = 4;
    const flashInterval = setInterval(() => {
        flashes++;
        // Toggle between white and normal rendering
        render(flashes % 2 === 0 ? rows : null, flashes % 2 === 1 ? rows : null);
        if (flashes >= maxFlashes) {
            clearInterval(flashInterval);
            callback();
            startDropInterval();
        }
    }, 80);
}

// ====== Rendering ======

function render(flashWhiteRows, flashEmptyRows) {
    if (!ctx) return;
    // Clear canvas
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let r = 0; r < VISIBLE_ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            ctx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
    }

    // Draw locked blocks on board (skip top 2 hidden rows)
    for (let r = 2; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== null) {
                const visR = r - 2; // Visible row index

                // Check flash state
                if (flashWhiteRows && flashWhiteRows.includes(r)) {
                    drawBlock(c, visR, '#FFFFFF', '#CCCCCC', '#FFFFFF');
                    continue;
                }
                if (flashEmptyRows && flashEmptyRows.includes(r)) {
                    continue; // Don't draw
                }

                const pieceData = TETROMINOES[board[r][c]];
                drawBlock(c, visR, pieceData.color, pieceData.darkColor, pieceData.lightColor);
            }
        }
    }

    // Draw ghost piece (shadow showing where piece will land)
    if (currentPiece && !gameOver) {
        // Find ghost position
        let ghostRow = currentPiece.row;
        while (true) {
            const cells = getPieceCells(currentPiece, currentPiece.rotation, ghostRow + 1, currentPiece.col);
            if (!isValid(cells)) break;
            ghostRow++;
        }
        if (ghostRow !== currentPiece.row) {
            const ghostCells = getPieceCells(currentPiece, currentPiece.rotation, ghostRow, currentPiece.col);
            for (const [r, c] of ghostCells) {
                const visR = r - 2;
                if (visR >= 0) {
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.fillRect(c * CELL_SIZE + 1, visR * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
                    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(c * CELL_SIZE + 1, visR * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
                }
            }
        }

        // Draw current piece
        const cells = getPieceCells(currentPiece);
        const pieceData = TETROMINOES[currentPiece.type];
        for (const [r, c] of cells) {
            const visR = r - 2;
            if (visR >= 0) {
                drawBlock(c, visR, pieceData.color, pieceData.darkColor, pieceData.lightColor);
            }
        }
    }
}

// Draw a single Minecraft-style block with 3D bevel
function drawBlock(col, visRow, color, darkColor, lightColor) {
    const x = col * CELL_SIZE;
    const y = visRow * CELL_SIZE;
    const s = CELL_SIZE;
    const bevel = 3;

    // Main face
    ctx.fillStyle = color;
    ctx.fillRect(x, y, s, s);

    // Top highlight
    ctx.fillStyle = lightColor;
    ctx.fillRect(x, y, s, bevel);
    // Left highlight
    ctx.fillRect(x, y, bevel, s);

    // Bottom shadow
    ctx.fillStyle = darkColor;
    ctx.fillRect(x, y + s - bevel, s, bevel);
    // Right shadow
    ctx.fillRect(x + s - bevel, y, bevel, s);

    // Inner texture (subtle pixel grain)
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    // Small inner square to give depth
    ctx.fillRect(x + bevel, y + bevel, s - bevel * 2, s - bevel * 2);

    // Pixel specks for texture
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(x + 8, y + 8, 2, 2);
    ctx.fillRect(x + 18, y + 14, 2, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(x + 14, y + 6, 2, 2);
    ctx.fillRect(x + 6, y + 18, 2, 2);

    // Outer border
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1);
}

// Render next piece preview
function renderNextPiece() {
    if (!nextCtx) return;
    nextCtx.fillStyle = 'rgba(10, 10, 10, 0.5)';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (!nextPieceType) return;

    const piece = TETROMINOES[nextPieceType];
    const state = piece.states[0];

    // Calculate bounding box for centering
    let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
    for (const [r, c] of state) {
        minR = Math.min(minR, r);
        maxR = Math.max(maxR, r);
        minC = Math.min(minC, c);
        maxC = Math.max(maxC, c);
    }
    const pieceW = (maxC - minC + 1);
    const pieceH = (maxR - minR + 1);

    // Center in the 120x120 canvas, using 24px cells for preview
    const previewCell = 24;
    const offsetX = Math.floor((nextCanvas.width - pieceW * previewCell) / 2) - minC * previewCell;
    const offsetY = Math.floor((nextCanvas.height - pieceH * previewCell) / 2) - minR * previewCell;

    for (const [r, c] of state) {
        const x = offsetX + c * previewCell;
        const y = offsetY + r * previewCell;
        const bevel = 2;

        nextCtx.fillStyle = piece.color;
        nextCtx.fillRect(x, y, previewCell, previewCell);

        nextCtx.fillStyle = piece.lightColor;
        nextCtx.fillRect(x, y, previewCell, bevel);
        nextCtx.fillRect(x, y, bevel, previewCell);

        nextCtx.fillStyle = piece.darkColor;
        nextCtx.fillRect(x, y + previewCell - bevel, previewCell, bevel);
        nextCtx.fillRect(x + previewCell - bevel, y, bevel, previewCell);

        nextCtx.strokeStyle = 'rgba(0,0,0,0.4)';
        nextCtx.lineWidth = 1;
        nextCtx.strokeRect(x + 0.5, y + 0.5, previewCell - 1, previewCell - 1);
    }
}

// ====== Display updates ======

function updateDisplay() {
    document.getElementById('score-display').textContent = score.toLocaleString();
    document.getElementById('level-display').textContent = level;
    document.getElementById('lines-display').textContent = linesCleared;
}

// ====== Drop speed ======

function getDropSpeed() {
    // Speed increases with level: starts at 1000ms, minimum 50ms
    return Math.max(50, 1000 - (level - 1) * 80);
}

function updateDropSpeed() {
    dropSpeed = getDropSpeed();
    if (dropInterval) {
        clearInterval(dropInterval);
        startDropInterval();
    }
}

function startDropInterval() {
    dropInterval = setInterval(() => {
        if (!gamePaused && gameRunning && !gameOver) {
            if (!movePiece(1, 0)) {
                placePiece();
            }
            render();
            updateDisplay();
        }
    }, dropSpeed);
}

// ====== Controls ======

function handleKeyDown(e) {
    if (!gameRunning || gameOver) return;

    // Pause toggle
    if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePause();
        return;
    }

    if (gamePaused) return;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            movePiece(0, -1);
            render();
            break;
        case 'ArrowRight':
            e.preventDefault();
            movePiece(0, 1);
            render();
            break;
        case 'ArrowDown':
            e.preventDefault();
            softDrop();
            break;
        case 'ArrowUp':
            e.preventDefault();
            rotatePiece();
            render();
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
    }
}

// ====== Pause ======

function togglePause() {
    gamePaused = !gamePaused;
    const overlay = document.getElementById('pause-overlay');
    if (gamePaused) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// ====== Game Over ======

function endGame() {
    gameOver = true;
    gameRunning = false;
    clearInterval(dropInterval);

    render();

    // Update game over overlay
    document.getElementById('final-score').textContent = 'Score: ' + score.toLocaleString();
    document.getElementById('final-level').textContent = 'Level: ' + level;
    document.getElementById('final-lines').textContent = 'Lines: ' + linesCleared;

    // Check if user is logged in for score submission
    const token = localStorage.getItem('craftmine_token');
    const submitBtn = document.getElementById('submit-score-btn');
    const submitMsg = document.getElementById('score-submit-msg');

    if (token && score > 0) {
        submitBtn.classList.remove('hidden');
        submitMsg.textContent = 'Save your score to the leaderboard!';
    } else if (!token) {
        submitMsg.textContent = 'Log in on the homepage to save scores!';
    } else {
        submitMsg.textContent = '';
    }

    // Show overlay with slight delay for dramatic effect
    setTimeout(() => {
        document.getElementById('game-over-overlay').classList.add('active');
    }, 500);
}

// ====== Score submission ======

async function submitScore() {
    const token = localStorage.getItem('craftmine_token');
    if (!token) return;

    const submitBtn = document.getElementById('submit-score-btn');
    const submitMsg = document.getElementById('score-submit-msg');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
        const res = await fetch('/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                game: 'tetris',
                score: score,
                level: level
            })
        });

        if (res.ok) {
            submitMsg.textContent = '✅ Score saved!';
            submitMsg.style.color = '#50C878';
            submitBtn.classList.add('hidden');
        } else {
            const data = await res.json();
            submitMsg.textContent = '❌ ' + (data.error || 'Failed to save');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Score';
        }
    } catch (err) {
        submitMsg.textContent = '❌ Connection error';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Score';
    }
}

// ====== Game lifecycle ======

function startGame() {
    // Initialize
    canvas = document.getElementById('tetris-canvas');
    ctx = canvas.getContext('2d');
    nextCanvas = document.getElementById('next-canvas');
    nextCtx = nextCanvas.getContext('2d');

    // Hide title, show game area
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');

    // Reset state
    createBoard();
    score = 0;
    level = 1;
    linesCleared = 0;
    gameOver = false;
    gamePaused = false;
    gameRunning = true;
    bag = [];
    dropSpeed = getDropSpeed();

    // Spawn first pieces
    nextPieceType = nextFromBag();
    currentPiece = createPiece(nextFromBag());
    nextPieceType = nextFromBag();

    updateDisplay();
    render();
    renderNextPiece();
    startDropInterval();

    // Attach keyboard listener
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);
}

function restartGame() {
    // Hide overlays
    document.getElementById('game-over-overlay').classList.remove('active');
    document.getElementById('pause-overlay').classList.remove('active');
    clearInterval(dropInterval);

    // Reset and start
    startGame();
}
