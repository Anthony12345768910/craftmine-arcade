// ============================================================
// CraftMine Arcade — Music Player
// Streams Minecraft ambient music (C418, public archive)
// Persists play state, track index, and volume in localStorage.
// Attach this script on every page (after auth.js).
// ============================================================

(function () {
    'use strict';

    // ====== Track list ===================================================
    // Using Kevin MacLeod (Incompetech) ambient tracks as a reliable fallback
    // since archive.org is currently returning 503 Service Unavailable.
    const TRACKS = [
        { title: 'Floating Cities',      url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Floating%20Cities.mp3' },
        { title: 'Gymnopédie No. 1',     url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Gymnopedie%20No%201.mp3' },
        { title: 'Deliberate Thought',   url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Deliberate%20Thought.mp3' },
        { title: 'Meditation Impromptu', url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3' },
        { title: 'Agnus Dei X',          url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Agnus%20Dei%20X.mp3' }
    ];

    // ====== Persistent state =============================================
    const LS_PLAYING = 'mc_music_playing';
    const LS_TRACK   = 'mc_music_track';
    const LS_VOLUME  = 'mc_music_volume';

    let currentIdx  = parseInt(localStorage.getItem(LS_TRACK)   || '0');
    let volume      = parseFloat(localStorage.getItem(LS_VOLUME) || '0.3');
    let isPlaying   = localStorage.getItem(LS_PLAYING) === 'true';

    // ====== Audio element ================================================
    const audio = new Audio();
    audio.loop   = false;
    audio.volume = volume;
    audio.crossOrigin = 'anonymous';

    function loadTrack(idx) {
        currentIdx = ((idx % TRACKS.length) + TRACKS.length) % TRACKS.length;
        audio.src  = TRACKS[currentIdx].url;
        localStorage.setItem(LS_TRACK, currentIdx);
        updateWidget();
    }

    function play() {
        audio.play().then(() => {
            isPlaying = true;
            localStorage.setItem(LS_PLAYING, 'true');
            updateWidget();
        }).catch(() => {
            // Browser blocked autoplay — user must click play
            isPlaying = false;
            updateWidget();
        });
    }

    function pause() {
        audio.pause();
        isPlaying = false;
        localStorage.setItem(LS_PLAYING, 'false');
        updateWidget();
    }

    function togglePlay() {
        if (isPlaying) {
            pause();
        } else {
            if (!audio.src || audio.src === window.location.href) {
                loadTrack(currentIdx);
            }
            play();
        }
    }

    function nextTrack() {
        loadTrack(currentIdx + 1);
        if (isPlaying) play();
    }

    function prevTrack() {
        loadTrack(currentIdx - 1);
        if (isPlaying) play();
    }

    audio.addEventListener('ended', nextTrack);

    // ====== Widget =======================================================

    function buildWidget() {
        // --- CSS ---
        const style = document.createElement('style');
        style.textContent = `
            #mc-music-player {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                background: rgba(13,13,13,0.94);
                border: 3px solid #5D8C3E;
                border-radius: 4px;
                padding: 10px 14px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: 'Press Start 2P', monospace;
                font-size: 0.5rem;
                color: #7EC850;
                box-shadow: 0 4px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(94,140,62,0.2);
                backdrop-filter: blur(6px);
                transition: border-color 0.2s, box-shadow 0.2s, min-width 0.2s;
                max-width: 290px;
                min-width: 230px;
                user-select: none;
            }
            #mc-music-player:hover {
                border-color: #7EC850;
                box-shadow: 0 4px 32px rgba(94,140,62,0.35), 0 0 0 1px rgba(126,200,80,0.3);
            }
            #mc-music-player.mc-collapsed {
                min-width: unset; max-width: unset; padding: 10px 12px;
            }
            #mc-music-icon {
                font-size: 1.1rem;
                flex-shrink: 0;
                cursor: pointer;
                display: inline-block;
                transition: transform 0.3s;
            }
            #mc-music-player.mc-playing #mc-music-icon {
                animation: mc-bounce 1.2s ease-in-out infinite;
            }
            @keyframes mc-bounce {
                0%,100% { transform: translateY(0) rotate(-8deg); }
                50%      { transform: translateY(-4px) rotate(8deg); }
            }
            #mc-music-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; gap: 5px; }
            #mc-music-player.mc-collapsed #mc-music-info { display: none; }
            #mc-disc-label { font-size: 0.4rem; color: #7F7F7F; letter-spacing: 1px; text-transform: uppercase; }
            #mc-track-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #E0E0E0; font-size: 0.45rem; }
            #mc-music-controls { display: flex; align-items: center; gap: 6px; }
            .mc-btn {
                background: none;
                border: 1px solid #5D8C3E;
                color: #7EC850;
                font-family: 'Press Start 2P', monospace;
                font-size: 0.6rem;
                cursor: pointer;
                padding: 4px 6px;
                border-radius: 2px;
                transition: background 0.15s, color 0.15s;
                line-height: 1;
            }
            .mc-btn:hover { background: #5D8C3E; color: #fff; }
            #mc-play-btn { background: #5D8C3E; color: #fff; border-color: #7EC850; font-size: 0.75rem; min-width: 28px; }
            #mc-play-btn:hover { background: #7EC850; }
            #mc-volume-row { display: flex; align-items: center; gap: 5px; color: #7F7F7F; font-size: 0.7rem; }
            #mc-volume-slider {
                -webkit-appearance: none; appearance: none;
                width: 70px; height: 4px;
                background: #3B3B3B; border-radius: 2px; outline: none; cursor: pointer;
            }
            #mc-volume-slider::-webkit-slider-thumb {
                -webkit-appearance: none; appearance: none;
                width: 11px; height: 11px; background: #7EC850; border-radius: 2px; cursor: pointer;
            }
            #mc-volume-slider::-moz-range-thumb {
                width: 11px; height: 11px; background: #7EC850; border: none; border-radius: 2px; cursor: pointer;
            }
            #mc-collapse-btn {
                background: none; border: none; cursor: pointer;
                color: #7F7F7F; font-size: 0.7rem; line-height: 1; padding: 0 2px; flex-shrink: 0;
            }
            #mc-collapse-btn:hover { color: #E0E0E0; }
        `;
        document.head.appendChild(style);

        // --- Widget HTML ---
        const widget = document.createElement('div');
        widget.id = 'mc-music-player';
        widget.innerHTML = `
            <div id="mc-music-icon" title="Click to play/pause">🎵</div>
            <div id="mc-music-info">
                <div id="mc-disc-label">♬ Minecraft Music</div>
                <div id="mc-track-name">${TRACKS[currentIdx].title}</div>
                <div id="mc-music-controls">
                    <button class="mc-btn" id="mc-prev-btn" title="Previous track">⏮</button>
                    <button class="mc-btn" id="mc-play-btn" title="Play / Pause">▶</button>
                    <button class="mc-btn" id="mc-next-btn" title="Next track">⏭</button>
                </div>
                <div id="mc-volume-row">
                    <span>🔊</span>
                    <input type="range" id="mc-volume-slider" min="0" max="1" step="0.05" value="${volume}">
                </div>
            </div>
            <button id="mc-collapse-btn" title="Collapse">◀</button>
        `;
        document.body.appendChild(widget);

        // --- Event wiring ---
        document.getElementById('mc-play-btn').addEventListener('click', togglePlay);
        document.getElementById('mc-prev-btn').addEventListener('click', prevTrack);
        document.getElementById('mc-next-btn').addEventListener('click', nextTrack);
        document.getElementById('mc-music-icon').addEventListener('click', togglePlay);

        document.getElementById('mc-volume-slider').addEventListener('input', (e) => {
            volume = parseFloat(e.target.value);
            audio.volume = volume;
            localStorage.setItem(LS_VOLUME, volume);
        });

        let collapsed = false;
        document.getElementById('mc-collapse-btn').addEventListener('click', () => {
            collapsed = !collapsed;
            widget.classList.toggle('mc-collapsed', collapsed);
            document.getElementById('mc-collapse-btn').textContent = collapsed ? '▶' : '◀';
        });

        updateWidget();
    }

    function updateWidget() {
        const playBtn   = document.getElementById('mc-play-btn');
        const trackName = document.getElementById('mc-track-name');
        const player    = document.getElementById('mc-music-player');
        if (!playBtn) return;
        playBtn.textContent = isPlaying ? '⏸' : '▶';
        trackName.textContent = TRACKS[currentIdx].title;
        player.classList.toggle('mc-playing', isPlaying);
    }

    // ====== Init =========================================================
    function init() {
        buildWidget();
        loadTrack(currentIdx);
        if (isPlaying) play(); // Resume playback from last session
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
