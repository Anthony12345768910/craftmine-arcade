// ============================================================
// CraftMine Memory — Matching Card Game Engine
// Tech-themed emoji pairs, 4x4 grid, flip & match mechanics
// ============================================================

// 8 unique tech-themed emoji pairs
const CARD_SYMBOLS = [
    { emoji: '🤖', label: 'Robot' },
    { emoji: '💻', label: 'Laptop' },
    { emoji: '🎮', label: 'Controller' },
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '⚡', label: 'Lightning' },
    { emoji: '🔮', label: 'Crystal Ball' },
    { emoji: '🛸', label: 'UFO' },
    { emoji: '🧠', label: 'Brain' },
];

let cards = [];       // Array of card objects
let flipped = [];     // Currently face-up (unmatched) cards (max 2)
let matched = 0;      // Number of matched pairs
let moves = 0;        // Total moves made
let locked = false;   // Prevent clicking while animating
let timer = null;
let seconds = 0;
let gameStarted = false;

// ====== Shuffle (Fisher-Yates) ======
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ====== Build card deck ======
function buildDeck() {
    // Duplicate each symbol to make pairs
    const deck = [];
    CARD_SYMBOLS.forEach((sym, i) => {
        deck.push({ id: i * 2,     symbol: sym, matched: false });
        deck.push({ id: i * 2 + 1, symbol: sym, matched: false });
    });
    return shuffle(deck);
}

// ====== Render the grid ======
function renderGrid() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    cards.forEach((card, idx) => {
        const el = document.createElement('div');
        el.className = 'mem-card';
        el.dataset.index = idx;
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', 'Card ' + (idx + 1));
        el.id = 'card-' + idx;

        el.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front" aria-label="${card.symbol.label}">
                <span>${card.symbol.emoji}</span>
            </div>
        `;

        el.addEventListener('click', () => onCardClick(idx));
        grid.appendChild(el);
    });
}

// ====== Card click handler ======
function onCardClick(idx) {
    const card = cards[idx];
    const el = document.getElementById('card-' + idx);

    // Ignore: locked board, already flipped, already matched
    if (locked) return;
    if (card.matched) return;
    if (flipped.length === 1 && flipped[0].idx === idx) return;
    if (el.classList.contains('flipped')) return;

    // Start timer on first click
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    // Flip this card
    el.classList.add('flipped');
    flipped.push({ idx, card, el });

    if (flipped.length === 2) {
        moves++;
        document.getElementById('mem-moves').textContent = moves;
        checkMatch();
    }
}

// ====== Check for match ======
function checkMatch() {
    locked = true;
    const [a, b] = flipped;

    if (a.card.symbol.emoji === b.card.symbol.emoji) {
        // ✅ Match!
        setTimeout(() => {
            a.el.classList.add('matched');
            b.el.classList.add('matched');
            a.card.matched = true;
            b.card.matched = true;
            matched++;
            flipped = [];
            locked = false;
            document.getElementById('mem-matched').textContent = matched;

            if (matched === CARD_SYMBOLS.length) {
                setTimeout(showWin, 400);
            }
        }, 300);
    } else {
        // ❌ No match — show wrong flash then flip back
        setTimeout(() => {
            a.el.classList.add('wrong');
            b.el.classList.add('wrong');
        }, 100);

        setTimeout(() => {
            a.el.classList.remove('flipped', 'wrong');
            b.el.classList.remove('flipped', 'wrong');
            flipped = [];
            locked = false;
        }, 1100);
    }
}

// ====== Timer ======
function startTimer() {
    seconds = 0;
    clearInterval(timer);
    timer = setInterval(() => {
        seconds++;
        document.getElementById('mem-time').textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
}

// ====== Win screen ======
function showWin() {
    stopTimer();
    document.getElementById('win-moves').textContent = moves;
    document.getElementById('win-time').textContent = formatTime(seconds);
    document.getElementById('win-overlay').classList.add('active');
}

// ====== Start / Restart game ======
function startMemory() {
    // Reset state
    cards = buildDeck();
    flipped = [];
    matched = 0;
    moves = 0;
    locked = false;
    gameStarted = false;
    seconds = 0;
    stopTimer();

    // Reset UI
    document.getElementById('mem-moves').textContent = '0';
    document.getElementById('mem-matched').textContent = '0';
    document.getElementById('mem-time').textContent = '0:00';
    document.getElementById('win-overlay').classList.remove('active');
    document.getElementById('title-screen').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');

    renderGrid();
}
