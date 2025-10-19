/* ===========================================
   Wonders of the World — main.js
   Author: Ghazaleh Moghaddam (student)
   What this file does:
   - Progressive enhancement: turns each .album grid into a slider
   - Autoplay starts on page load; stops on any user interaction
   - Captions stay in sync with the current slide
   - Cross-fade transition between slides
   - Bonus: top nav links toggle album visibility (instead of just jump)
   Required HTML structure (already in index.html):
   <section id="ancient"><div class="album">…<figure>…</figure></div></section>
   =========================================== */

(() => {
  // Convenience selectors
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Mark JS-enabled for CSS hooks (you already used this in style.css)
  document.body.classList.add('js-enabled');

  // Build a slider for each album grid
  $$('.album').forEach(initAlbumSlider);

  // Bonus: top nav toggles album visibility (not just anchor jump)
  initAlbumSwitcher();

  // Optional: if later you add a #theme-toggle button, this will work out of the box.
  initThemeToggle();

  /* -------- slider factory -------- */
  function initAlbumSlider(albumEl) {
    const figures = $$('figure', albumEl);
    if (figures.length === 0) return;

    // Wrap all slides inside a stage for absolute-position fading
    const stage = document.createElement('div');
    stage.className = 'slider-stage';
    figures.forEach(fig => {
      fig.classList.add('slide');
      stage.appendChild(fig);
    });

    // Controls: prev / next / play-pause + live caption area + counter
    const controls = document.createElement('div');
    controls.className = 'slider-controls';
    controls.innerHTML = `
      <button class="btn prev" aria-label="Previous slide">◀</button>
      <button class="btn play" aria-label="Pause autoplay">❚❚</button>
      <button class="btn next" aria-label="Next slide">▶</button>
      <span class="counter" aria-live="polite"></span>
      <div class="live-caption" aria-live="polite"></div>
    `;

    // Replace grid mode with slider mode
    albumEl.classList.add('is-slider');
    albumEl.innerHTML = '';           // clear
    albumEl.appendChild(stage);
    albumEl.appendChild(controls);

    // Slider state
    let i = 0;
    let autoplay = true;
    let timer = null;
    const delay = 3500;

    // Helpers
    const slides   = $$('.slide', stage);
    const counter  = $('.counter', controls);
    const liveCap  = $('.live-caption', controls);
    const btnPrev  = $('.prev', controls);
    const btnNext  = $('.next', controls);
    const btnPlay  = $('.play', controls);

    function show(index) {
      // bounds
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      // update slide classes + aria
      slides.forEach((s, idx) => {
        const active = idx === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', String(!active));
      });

      // sync caption (use the figure's figcaption text)
      const cap = $('figcaption', slides[index]);
      liveCap.textContent = cap ? cap.textContent : '';

      // counter (e.g., 3 / 10)
      counter.textContent = `${index + 1} / ${slides.length}`;

      i = index;
    }

    function next()  { show(i + 1); }
    function prev()  { show(i - 1); }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(next, delay);
      autoplay = true;
      btnPlay.textContent = '❚❚';
      btnPlay.setAttribute('aria-label', 'Pause autoplay');
    }

    function stopAutoplay() {
      if (timer) clearInterval(timer);
      timer = null;
      autoplay = false;
      btnPlay.textContent = '▶';
      btnPlay.setAttribute('aria-label', 'Start autoplay');
    }

    // Initial render
    show(0);
    startAutoplay();

    // Events
    btnNext.addEventListener('click', () => { stopAutoplay(); next(); });
    btnPrev.addEventListener('click', () => { stopAutoplay(); prev(); });
    btnPlay.addEventListener('click', () => { autoplay ? stopAutoplay() : startAutoplay(); });

    // Keyboard (left/right/space)
    albumEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { stopAutoplay(); next(); }
      else if (e.key === 'ArrowLeft') { stopAutoplay(); prev(); }
      else if (e.key === ' ') { e.preventDefault(); autoplay ? stopAutoplay() : startAutoplay(); }
    });

    // Pause autoplay when user hovers (nice UX on desktop)
    albumEl.addEventListener('pointerenter', stopAutoplay);
    albumEl.addEventListener('pointerleave', () => { if (!autoplay) return; startAutoplay(); });

    // Keep stage square (your images already 1:1 via CSS)
    stage.style.aspectRatio = '1 / 1';
  }

  /* -------- top nav switches album visibility (Bonus) -------- */
  function initAlbumSwitcher() {
    const navLinks = $$('header nav a');
    const sections = $$('main > section');

    navLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        // Progressive enhancement: only preventDefault when JS is active
        e.preventDefault();
        const id = a.getAttribute('href').replace('#', '');
        sections.forEach(sec => {
          if (sec.id === id) {
            sec.hidden = false;
            a.classList.add('is-active');
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            sec.hidden = true;
            // remove is-active from other links
            $$('header nav a').forEach(link => {
              if (link !== a) link.classList.remove('is-active');
            });
          }
        });
      });
    });
  }

  /* -------- optional theme toggle (works only if button exists) -------- */
  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const apply = (mode) => {
      document.body.classList.toggle('dark', mode === 'dark');
      localStorage.setItem('wow-theme', mode);
      btn.textContent = mode === 'dark' ? 'Light mode' : 'Dark mode';
    };
    // load saved
    const saved = localStorage.getItem('wow-theme');
    if (saved === 'dark') apply('dark');
    btn.addEventListener('click', () => {
      const next = document.body.classList.contains('dark') ? 'light' : 'dark';
      apply(next);
    });
  }
})();
// ====== Wiring to the Featured Video and panel ======
const clip = document.querySelector('#video video');
const ccSelect = document.getElementById('ccSelect');
const videoSelect = document.getElementById('videoSelect');

// Buttons
const btn = id => document.getElementById(id);
const playBtn   = btn('vPlay');
const pauseBtn  = btn('vPause');
const muteBtn   = btn('vMute');
const unmuteBtn = btn('vUnmute');
const startBtn  = btn('vStart');
const endBtn    = btn('vEnd');
const statsBtn  = btn('vStats');
const rew6Btn   = btn('rew6');
const ff6Btn    = btn('ff6');
const slowBtn   = btn('slow');
const normalBtn = btn('normal');

const transcriptToggle = document.getElementById('toggleTranscript');
const transcriptBox    = document.getElementById('transcript');

if (clip) {
  // ---- Playback controls
  playBtn .addEventListener('click', () => clip.play());
  pauseBtn.addEventListener('click', () => clip.pause());
  muteBtn .addEventListener('click', () => clip.muted = true);
  unmuteBtn.addEventListener('click', () => clip.muted = false);

  // ---- Chapters
  startBtn.addEventListener('click', () => { clip.currentTime = 0; clip.play(); });
  endBtn  .addEventListener('click', () => { if (!isNaN(clip.duration)) clip.currentTime = Math.max(clip.duration - 0.1, 0); });
  statsBtn.addEventListener('click', () => {
    const info = {
      currentTime: clip.currentTime.toFixed(2),
      duration: isNaN(clip.duration) ? '—' : clip.duration.toFixed(2),
      playbackRate: clip.playbackRate,
      muted: clip.muted,
      volume: clip.volume
    };
    alert(`Time: ${info.currentTime}s / ${info.duration}s\nRate: ${info.playbackRate}×\nMuted: ${info.muted}\nVolume: ${info.volume}`);
  });

  // ---- Seek & Speed
  const clamp = (t) => Math.min(Math.max(t, 0), isNaN(clip.duration) ? 1e9 : clip.duration);
  rew6Btn.addEventListener('click', () => clip.currentTime = clamp(clip.currentTime - 6));
  ff6Btn .addEventListener('click', () => clip.currentTime = clamp(clip.currentTime + 6));
  slowBtn.addEventListener('click', () => clip.playbackRate = 0.5);
  normalBtn.addEventListener('click', () => clip.playbackRate = 1.0);

  // ---- Captions switcher
  function setCaptions(lang) {
    const tracks = clip.textTracks; // TextTrackList
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = 'disabled';
      const trLang = (tracks[i].language || '').toLowerCase();
      if (lang !== 'off' && trLang === lang) tracks[i].mode = 'showing';
    }
  }
  ccSelect.addEventListener('change', e => setCaptions(e.target.value));
  clip.addEventListener('loadedmetadata', () => setCaptions(ccSelect.value));

  // ---- Video source switcher
  videoSelect.addEventListener('change', e => {
    clip.pause();
    clip.src = e.target.value;  
    clip.load();
    clip.play();
  });

  // ---- Transcript (loads english.vtt and shows plain text)
  transcriptToggle.addEventListener('click', async (ev) => {
    ev.preventDefault();
    if (!transcriptBox.hasAttribute('data-loaded')) {
      try {
        const res = await fetch('subtitle/english.vtt');
        const txt = await res.text();
       //???
        const lines = txt.split(/\r?\n/).filter(l =>
          l.trim() && !l.includes('-->') && l.trim().toUpperCase() !== 'WEBVTT' && !/^\d+$/.test(l.trim())
        );
        transcriptBox.innerText = lines.join(' ');
        transcriptBox.setAttribute('data-loaded', '1');
      } catch (e) {
        transcriptBox.innerText = 'Transcript could not be loaded.';
      }
    }
    const hidden = transcriptBox.hasAttribute('hidden');
    transcriptBox.toggleAttribute('hidden', !hidden ? true : false);
    transcriptToggle.textContent = transcriptBox.hasAttribute('hidden') ? 'Show Transcript' : 'Hide Transcript';
  });
}
