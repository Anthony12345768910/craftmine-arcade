// ============================================================
// CraftMine Arcade — Express Server
// Handles: static files, JWT auth, score/leaderboard API
// ============================================================

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'craftmine-arcade-secret-key-change-in-production';
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Database helpers (JSON-file based)
// ============================================================

function readDB(file) {
    const filePath = path.join(DATA_DIR, file);
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function writeDB(file, data) {
    const filePath = path.join(DATA_DIR, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ============================================================
// Auth middleware — verifies JWT from Authorization header
// ============================================================

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.substring(7);
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// Optional auth — attaches user if token present, but doesn't block
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            req.user = jwt.verify(authHeader.substring(7), JWT_SECRET);
        } catch { /* ignore invalid tokens */ }
    }
    next();
}

// ============================================================
// AUTH ROUTES
// ============================================================

// POST /api/auth/register — Create a new account
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: 'Username must be 3-20 characters' });
        }
        if (password.length < 4) {
            return res.status(400).json({ error: 'Password must be at least 4 characters' });
        }

        const users = readDB('users.json');

        // Check if username already exists (case-insensitive)
        if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password and create user
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            username: username,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        writeDB('users.json', users);

        // Generate JWT
        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: { id: newUser.id, username: newUser.username }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/login — Log in with existing account
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const users = readDB('users.json');
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user.id, username: user.username }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/me — Get current user profile (requires JWT)
app.get('/api/auth/me', authenticate, (req, res) => {
    res.json({ user: { id: req.user.userId, username: req.user.username } });
});

// ============================================================
// SCORES / LEADERBOARD ROUTES
// ============================================================

// POST /api/scores — Submit a score (requires JWT)
app.post('/api/scores', authenticate, (req, res) => {
    try {
        const { game, score, level } = req.body;

        if (!game || score === undefined) {
            return res.status(400).json({ error: 'Game and score are required' });
        }

        const scores = readDB('scores.json');
        const newScore = {
            id: Date.now().toString(),
            userId: req.user.userId,
            username: req.user.username,
            game: game,
            score: Number(score),
            level: level || 1,
            date: new Date().toISOString()
        };
        scores.push(newScore);
        writeDB('scores.json', scores);

        res.status(201).json({ score: newScore });
    } catch (err) {
        console.error('Score submit error:', err);
        res.status(500).json({ error: 'Failed to submit score' });
    }
});

// GET /api/scores/:game — Get leaderboard for a game (public)
app.get('/api/scores/:game', (req, res) => {
    const { game } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const scores = readDB('scores.json');

    // Filter by game, sort by score descending, take top N
    const leaderboard = scores
        .filter(s => s.game === game)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((s, i) => ({
            rank: i + 1,
            username: s.username,
            score: s.score,
            level: s.level,
            date: s.date
        }));

    res.json({ leaderboard });
});

// GET /api/scores/:game/me — Get user's personal best for a game
app.get('/api/scores/:game/me', authenticate, (req, res) => {
    const { game } = req.params;
    const scores = readDB('scores.json');

    const userScores = scores
        .filter(s => s.game === game && s.userId === req.user.userId)
        .sort((a, b) => b.score - a.score);

    res.json({
        best: userScores[0] || null,
        totalGames: userScores.length
    });
});

// ============================================================
// Catch-all: serve index.html for SPA-style navigation
// ============================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================================
// Start server
// ============================================================

app.listen(PORT, () => {
    console.log(`⛏️  CraftMine Arcade running at http://localhost:${PORT}`);
});
