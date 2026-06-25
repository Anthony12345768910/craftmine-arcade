// ============================================================
// CraftMine Arcade — Auth Client (JWT login/signup)
// Manages token storage, modal UI, and auth state in navbar
// ============================================================

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
