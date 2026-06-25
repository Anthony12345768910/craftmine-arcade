// ============================================================
// CraftMine Arcade — Auth Client (JWT login/signup)
// Manages token storage, modal UI, and auth state in navbar
// ============================================================

// ====== Mock Database for Static Hosting (GitHub Pages) ======
const IS_STATIC_HOST = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';

if (IS_STATIC_HOST) {
    const originalFetch = window.fetch;
    window.fetch = async function (url, options = {}) {
        const urlStr = typeof url === 'string' ? url : url.url;
        
        if (urlStr.includes('/api/auth/register')) {
            const body = JSON.parse(options.body);
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            if (users.find(u => u.username.toLowerCase() === body.username.toLowerCase())) {
                return new Response(JSON.stringify({ error: 'Username already taken' }), { status: 400 });
            }
            const newUser = { id: Date.now().toString(), username: body.username };
            users.push({ ...newUser, password: body.password });
            localStorage.setItem('mock_users', JSON.stringify(users));
            return new Response(JSON.stringify({ token: 'mock_token_' + newUser.id, user: newUser }), { status: 201 });
        }
        
        if (urlStr.includes('/api/auth/login')) {
            const body = JSON.parse(options.body);
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const user = users.find(u => u.username.toLowerCase() === body.username.toLowerCase() && u.password === body.password);
            if (!user) {
                return new Response(JSON.stringify({ error: 'Invalid username or password' }), { status: 401 });
            }
            return new Response(JSON.stringify({ token: 'mock_token_' + user.id, user: { id: user.id, username: user.username } }), { status: 200 });
        }
        
        if (urlStr.includes('/api/auth/me')) {
            const authHeader = options.headers?.['Authorization'] || options.headers?.['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return new Response(JSON.stringify({ error: 'No token provided' }), { status: 401 });
            }
            const token = authHeader.substring(7);
            const userId = token.replace('mock_token_', '');
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            const user = users.find(u => u.id === userId);
            if (!user) {
                return new Response(JSON.stringify({ error: 'User not found' }), { status: 401 });
            }
            return new Response(JSON.stringify({ user: { id: user.id, username: user.username } }), { status: 200 });
        }
        
        if (urlStr.includes('/api/scores') && options.method === 'POST') {
            const body = JSON.parse(options.body);
            const authHeader = options.headers?.['Authorization'] || options.headers?.['authorization'];
            let user = { username: 'Guest', userId: 'guest' };
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                const userId = token.replace('mock_token_', '');
                const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
                const found = users.find(u => u.id === userId);
                if (found) {
                    user = { username: found.username, userId: found.id };
                }
            }
            const scores = JSON.parse(localStorage.getItem('mock_scores') || '[]');
            const newScore = {
                id: Date.now().toString(),
                userId: user.userId,
                username: user.username,
                game: body.game,
                score: Number(body.score),
                level: body.level || 1,
                date: new Date().toISOString()
            };
            scores.push(newScore);
            localStorage.setItem('mock_scores', JSON.stringify(scores));
            return new Response(JSON.stringify({ score: newScore }), { status: 201 });
        }
        
        if (urlStr.includes('/api/scores/') && urlStr.endsWith('/me')) {
            const parts = urlStr.split('/');
            const game = parts[parts.length - 2];
            const authHeader = options.headers?.['Authorization'] || options.headers?.['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return new Response(JSON.stringify({ best: null, totalGames: 0 }), { status: 200 });
            }
            const token = authHeader.substring(7);
            const userId = token.replace('mock_token_', '');
            const scores = JSON.parse(localStorage.getItem('mock_scores') || '[]');
            const userScores = scores
                .filter(s => s.game === game && s.userId === userId)
                .sort((a, b) => b.score - a.score);
            return new Response(JSON.stringify({
                best: userScores[0] || null,
                totalGames: userScores.length
            }), { status: 200 });
        }
        
        if (urlStr.includes('/api/scores/')) {
            const parts = urlStr.split('?')[0].split('/');
            const game = parts[parts.length - 1];
            // Safe URL parsing for relative paths
            const base = window.location.origin + window.location.pathname;
            const urlObj = new URL(urlStr, base);
            const limit = parseInt(urlObj.searchParams.get('limit')) || 10;
            
            const scores = JSON.parse(localStorage.getItem('mock_scores') || '[]');
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
            return new Response(JSON.stringify({ leaderboard }), { status: 200 });
        }
        
        return originalFetch(url, options);
    };
}

const AUTH_TOKEN_KEY = 'craftmine_token';
const AUTH_USER_KEY = 'craftmine_user';

let authMode = 'login'; // 'login' or 'register'

// ====== Token helpers ======

function getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
    } catch {
        return null;
    }
}

function saveAuth(token, user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearAuth() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}

// ====== Authenticated fetch helper ======
// Use this from game pages to make authenticated API calls

async function authFetch(url, options = {}) {
    const token = getToken();
    if (token) {
        options.headers = options.headers || {};
        options.headers['Authorization'] = 'Bearer ' + token;
    }
    return fetch(url, options);
}

// ====== UI State ======

function updateAuthUI() {
    const user = getUser();
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    if (!authButtons || !userInfo) return; // Not on homepage

    if (user) {
        authButtons.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = user.username;
    } else {
        authButtons.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}

// ====== Modal control ======

function showAuthModal(mode) {
    authMode = mode || 'login';
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('modal-title');
    const submitBtn = document.getElementById('auth-submit-btn');
    const switchText = document.getElementById('modal-switch-text');
    const switchLink = document.getElementById('modal-switch-link');
    const errorEl = document.getElementById('modal-error');

    errorEl.textContent = '';
    document.getElementById('auth-username').value = '';
    document.getElementById('auth-password').value = '';

    if (authMode === 'login') {
        title.textContent = '⚔️ Log In';
        submitBtn.textContent = 'Log In';
        switchText.textContent = "Don't have an account? ";
        switchLink.textContent = 'Sign Up';
    } else {
        title.textContent = '🛡️ Sign Up';
        submitBtn.textContent = 'Create Account';
        switchText.textContent = 'Already have an account? ';
        switchLink.textContent = 'Log In';
    }

    modal.classList.add('active');
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}

function toggleAuthMode() {
    showAuthModal(authMode === 'login' ? 'register' : 'login');
}

// ====== Form submission ======

async function handleAuthSubmit(event) {
    event.preventDefault();
    const errorEl = document.getElementById('modal-error');
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;

    if (!username || !password) {
        errorEl.textContent = 'Fill in all fields!';
        return;
    }

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            errorEl.textContent = data.error || 'Something went wrong';
            return;
        }

        // Save token and user
        saveAuth(data.token, data.user);
        hideAuthModal();
        updateAuthUI();

        // Reload personal bests if function exists
        if (typeof loadPersonalBests === 'function') {
            loadPersonalBests();
        }
    } catch (err) {
        errorEl.textContent = 'Connection error — is the server running?';
    }
}

// ====== Logout ======

function logout() {
    clearAuth();
    updateAuthUI();
    // Clear personal best displays
    const tetrisBest = document.getElementById('tetris-best');
    const wsBest = document.getElementById('watersort-best');
    if (tetrisBest) tetrisBest.textContent = 'High Score: ---';
    if (wsBest) wsBest.textContent = 'High Score: ---';
}

// ====== Initialize on page load ======
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});
