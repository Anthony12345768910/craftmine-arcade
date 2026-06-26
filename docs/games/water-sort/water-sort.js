// ============================================================
// CraftMine Water Sort — Puzzle Engine
// Tube-based color sorting game with solvable puzzle generation,
// pour logic, undo, level progression, and scoring.
// ============================================================

// ====== Constants ======
const TUBE_CAPACITY = 4; // Each tube holds 4 layers
const COLORS = [
    { name: 'red', cssClass: 'liquid-red' },
    { name: 'blue', cssClass: 'liquid-blue' },
    { name: 'green', cssClass: 'liquid-green' },
    { name: 'yellow', cssClass: 'liquid-yellow' },
    { name: 'purple', cssClass: 'liquid-purple' },
    { name: 'orange', cssClass: 'liquid-orange' },
    { name: 'pink', cssClass: 'liquid-pink' },
    { name: 'cyan', cssClass: 'liquid-cyan' },
    { name: 'lime', cssClass: 'liquid-lime' },
    { name: 'teal', cssClass: 'liquid-teal' }
];

// Level config: [numColors, numExtraEmptyTubes]
const LEVEL_CONFIG = [
    [3, 2],  // Level 1: 3 colors, 5 tubes total
    [4, 2],  // Level 2: 4 colors, 6 tubes
    [5, 2],  // Level 3: 5 colors, 7 tubes
    [5, 2],  // Level 4
    [6, 2],  // Level 5: 6 colors, 8 tubes
    [6, 2],  // Level 6
    [7, 2],  // Level 7: 7 colors, 9 tubes
    [7, 2],  // Level 8
    [8, 2],  // Level 9: 8 colors, 10 tubes
    [8, 2],  // Level 10
];

// ====== Game State ======
let tubes = [];           // Array of arrays (each is a stack, index 0 = bottom)
let selectedTube = -1;    // Index of currently selected tube, -1 = none
let moveHistory = [];     // Stack of previous states for undo
let currentLevel = 1;
let moveCount = 0;
let totalScore = 0;
let levelScore = 0;

// ====== Puzzle generation ======
// Creates a solvable puzzle by starting from solved state and shuffling

function generatePuzzle(numColors, numEmpty) {
    const totalTubes = numColors + numEmpty;

    // Start with solved state: each color fills one tube completely
    let solved = [];
    for (let i = 0; i < numColors; i++) {
        const tube = [];
        for (let j = 0; j < TUBE_CAPACITY; j++) {
            tube.push(i); // Color index
        }
        solved.push(tube);
    }
    // Add empty tubes
    for (let i = 0; i < numEmpty; i++) {
        solved.push([]);
    }

    // Shuffle by performing many random valid reverse-moves
    // A reverse-move = pour from any tube to any other (valid pour)
    let state = JSON.parse(JSON.stringify(solved));
    const shuffleMoves = numColors * TUBE_CAPACITY * 3; // Enough shuffling

    for (let i = 0; i < shuffleMoves; i++) {
        // Collect all valid pours
        const validMoves = [];
        for (let src = 0; src < totalTubes; src++) {
            if (state[src].length === 0) continue;
            for (let dst = 0; dst < totalTubes; dst++) {
                if (src === dst) continue;
                if (state[dst].length >= TUBE_CAPACITY) continue;
                // Allow any pour during shuffle (we're randomizing)
                validMoves.push([src, dst]);
            }
        }
        if (validMoves.length === 0) break;

        // Pick random move
        const [src, dst] = validMoves[Math.floor(Math.random() * validMoves.length)];
        const color = state[src].pop();
        state[dst].push(color);
    }

    // Verify the puzzle isn't already solved
    if (isSolved(state)) {
        return generatePuzzle(numColors, numEmpty); // Retry
    }

    return state;
}

// ====== Game logic ======

// Check if a pour from src to dst is valid
function canPour(srcIdx, dstIdx) {
    if (srcIdx === dstIdx) return false;
    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];

    if (src.length === 0) return false;
    if (dst.length >= TUBE_CAPACITY) return false;

    // Can pour into empty tube
    if (dst.length === 0) return true;

    // Top colors must match (REMOVED: User requested easier mode)
    // const srcTop = src[src.length - 1];
    // const dstTop = dst[dst.length - 1];
    // return srcTop === dstTop;
    return true; // Allow pouring onto any color
}

// Perform a pour: move matching top layers from src to dst
function performPour(srcIdx, dstIdx) {
    // Save state for undo before pouring
    saveStateForUndo();

    // Clear selection immediately so re-render doesn't show old selection
    selectedTube = -1;

    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];
    const pourColor = src[src.length - 1];

    // Count how many consecutive matching colors on top of source
    let count = 0;
    for (let i = src.length - 1; i >= 0; i--) {
        if (src[i] === pourColor) count++;
        else break;
    }

    // Only pour as many as destination has room for
    const room = TUBE_CAPACITY - dst.length;
    const pourCount = Math.min(count, room);

    // Move the layers
    for (let i = 0; i < pourCount; i++) {
        dst.push(src.pop());
    }

    moveCount++;
    updateDisplay();
    renderTubes();

    // Check win after a short delay (let animation play)
    setTimeout(() => {
        if (isSolved(tubes)) {
            handleWin();
        }
    }, 350);
}

// Check if puzzle is solved
function isSolved(state) {
    for (const tube of state) {
        if (tube.length === 0) continue; // Empty is OK
        if (tube.length !== TUBE_CAPACITY) return false; // Must be full
        // All elements must be the same color
        const color = tube[0];
        if (!tube.every(c => c === color)) return false;
    }
    return true;
}

// Check if a tube is complete (full with one color)
function isTubeComplete(tube) {
    if (tube.length !== TUBE_CAPACITY) return false;
    return tube.every(c => c === tube[0]);
}

// ====== Undo ======

function saveStateForUndo() {
    moveHistory.push({
        tubes: JSON.parse(JSON.stringify(tubes)),
        moveCount: moveCount
    });
    // Limit undo history to 50 moves
    if (moveHistory.length > 50) moveHistory.shift();
    document.getElementById('undo-btn').disabled = false;
}

function undoMove() {
    if (moveHistory.length === 0) return;
    const prev = moveHistory.pop();
    tubes = prev.tubes;
    moveCount = prev.moveCount;

    selectedTube = -1;
    updateDisplay();
    renderTubes();

    if (moveHistory.length === 0) {
        document.getElementById('undo-btn').disabled = true;
    }
}

// ====== Tube click handling ======

function onTubeClick(tubeIdx) {
    if (selectedTube === -1) {
        // Select this tube (if it has liquid)
        if (tubes[tubeIdx].length > 0) {
            selectedTube = tubeIdx;
            renderTubes();
        }
    } else if (selectedTube === tubeIdx) {
        // Deselect
        selectedTube = -1;
        renderTubes();
    } else {
        // Try to pour
        if (canPour(selectedTube, tubeIdx)) {
            performPour(selectedTube, tubeIdx);
            selectedTube = -1;
        } else {
            // Invalid pour — shake animation
            const tubeEl = document.querySelectorAll('.ws-tube')[tubeIdx];
            tubeEl.classList.add('invalid-target');
            setTimeout(() => tubeEl.classList.remove('invalid-target'), 300);

            // If the clicked tube has liquid, select it instead
            if (tubes[tubeIdx].length > 0) {
                selectedTube = tubeIdx;
            } else {
                selectedTube = -1;
            }
            renderTubes();
        }
    }
}

// ====== Rendering ======

function renderTubes() {
    const container = document.getElementById('tubes-container');
    container.innerHTML = '';

    tubes.forEach((tube, idx) => {
        const tubeEl = document.createElement('div');
        tubeEl.className = 'ws-tube';
        if (idx === selectedTube) tubeEl.classList.add('selected');
        if (isTubeComplete(tube)) tubeEl.classList.add('completed');
        tubeEl.onclick = () => onTubeClick(idx);

        // Render liquid layers from bottom to top
        // The tube div uses flex-direction: column + justify-content: flex-end
        // so we add layers in order (index 0 = bottom)
        for (let i = 0; i < tube.length; i++) {
            const liquidEl = document.createElement('div');
            liquidEl.className = 'ws-liquid ' + COLORS[tube[i]].cssClass;
            // Each layer takes up 1/TUBE_CAPACITY of the tube height
            // Tube inner height is roughly 240 - borders. Use percentage.
            liquidEl.style.height = (100 / TUBE_CAPACITY) + '%';
            tubeEl.appendChild(liquidEl);
        }

        container.appendChild(tubeEl);
    });
}

// ====== Display ======

function updateDisplay() {
    document.getElementById('ws-level').textContent = currentLevel;
    document.getElementById('ws-moves').textContent = moveCount;
    document.getElementById('ws-score').textContent = totalScore.toLocaleString();
}

// ====== Win handling ======

function handleWin() {
    // Calculate score for this level
    // Base score = 1000, minus 10 per move, minimum 100
    const config = getLevelConfig(currentLevel);
    const numColors = config[0];
    levelScore = Math.max(100, 1000 + (numColors * 100) - (moveCount * 10));
    totalScore += levelScore;

    updateDisplay();

    document.getElementById('win-moves').textContent = 'Moves: ' + moveCount;
    document.getElementById('win-score').textContent = 'Score: +' + levelScore.toLocaleString();

    setTimeout(() => {
        document.getElementById('win-overlay').classList.add('active');
    }, 400);
}

// ====== Level management ======

function getLevelConfig(level) {
    const idx = Math.min(level - 1, LEVEL_CONFIG.length - 1);
    return LEVEL_CONFIG[idx];
}

function nextLevel() {
    document.getElementById('win-overlay').classList.remove('active');
    currentLevel++;
    initLevel();
}

function initLevel() {
    const [numColors, numEmpty] = getLevelConfig(currentLevel);
    tubes = generatePuzzle(numColors, numEmpty);
    selectedTube = -1;
    moveCount = 0;
    moveHistory = [];
    document.getElementById('undo-btn').disabled = true;

    updateDisplay();
    renderTubes();
}

function restartLevel() {
    // If we have undo history, go back to the very beginning
    if (moveHistory.length > 0) {
        const first = moveHistory[0];
        tubes = first.tubes;
        moveCount = 0;
        moveHistory = [];
        selectedTube = -1;
        document.getElementById('undo-btn').disabled = true;
        updateDisplay();
        renderTubes();
    } else {
        // Generate a new puzzle at the same level
        initLevel();
    }
}

// ====== Score submission ======

async function submitWsScore() {
    const token = localStorage.getItem('craftmine_token');
    if (!token) return;

    const submitBtn = document.getElementById('ws-submit-btn');
    const submitMsg = document.getElementById('ws-submit-msg');

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
                game: 'water-sort',
                score: totalScore,
                level: currentLevel
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
    // Hide title, show game area, hide overlays
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    document.getElementById('win-overlay').classList.remove('active');
    document.getElementById('complete-overlay').classList.remove('active');

    // Reset
    currentLevel = 1;
    totalScore = 0;
    moveCount = 0;

    initLevel();
}
