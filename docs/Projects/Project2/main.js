(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  document.body.classList.add('js-enabled');

  $$('.album').forEach(initAlbumSlider);
  initAlbumSwitcher();
  initThemeToggle();

  /* -------- Slider -------- */
  function initAlbumSlider(albumEl) {
    const figures = $$('figure', albumEl);
    if (figures.length === 0) return;

    albumEl.tabIndex = 0; // keyboard focus

    const stage = document.createElement('div');
    stage.className = 'slider-stage';
    figures.forEach(fig => {
      fig.classList.add('slide');
      stage.appendChild(fig);
    });

    const controls = document.createElement('div');
    controls.className = 'slider-controls';
    controls.innerHTML = `
      <button type="button" class="btn prev" aria-label="Previous slide">◀</button>
      <button type="button" class="btn play" aria-label="Pause autoplay">❚❚</button>
      <button type="button" class="btn next" aria-label="Next slide">▶</button>
      <span class="counter"></span>
      <div class="live-caption" aria-live="polite"></div>
    `;

    albumEl.classList.add('is-slider');
    albumEl.innerHTML = '';
    albumEl.appendChild(stage);
    albumEl.appendChild(controls);

    let i = 0;
    let autoplay = true;
    let timer = null;
    const delay = 3500;
    let wasAutoOnHover = false;

    const slides   = $$('.slide', stage);
    const counter  = $('.counter', controls);
    const liveCap  = $('.live-caption', controls);
    const btnPrev  = $('.prev', controls);
    const btnNext  = $('.next', controls);
    const btnPlay  = $('.play', controls);

    function show(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      slides.forEach((s, idx) => {
        const active = idx === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', String(!active));
      });

      const cap = $('figcaption', slides[index]);
      liveCap.textContent = cap ? cap.textContent : '';
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

    show(0);
    startAutoplay();

    btnNext.addEventListener('click', () => { stopAutoplay(); next(); });
    btnPrev.addEventListener('click', () => { stopAutoplay(); prev(); });
    btnPlay.addEventListener('click', () => { autoplay ? stopAutoplay() : startAutoplay(); });

    albumEl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { stopAutoplay(); next(); }
      else if (e.key === 'ArrowLeft') { stopAutoplay(); prev(); }
      else if (e.key === ' ') { e.preventDefault(); autoplay ? stopAutoplay() : startAutoplay(); }
    });

    albumEl.addEventListener('pointerenter', () => { wasAutoOnHover = autoplay; stopAutoplay(); });
    albumEl.addEventListener('pointerleave', () => { if (wasAutoOnHover) startAutoplay(); });

    stage.style.aspectRatio = '1 / 1';
  }

  /* -------- Nav Switcher -------- */
  function initAlbumSwitcher() {
    const navLinks = $$('header nav a');
    const sections = $$('main > section');

    navLinks.forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const id = a.getAttribute('href').replace('#', '');
        sections.forEach(sec => {
          const active = sec.id === id;
          sec.hidden = !active;
          if (active) {
            a.classList.add('is-active');
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            $$('header nav a').forEach(link => link.classList.remove('is-active'));
          }
        });
      });
    });
  }

  /* -------- Theme Toggle -------- */
  function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const apply = (mode) => {
      document.body.classList.toggle('dark', mode === 'dark');
      localStorage.setItem('wow-theme', mode);
      btn.textContent = mode === 'dark' ? 'Light mode' : 'Dark mode';
    };
    const saved = localStorage.getItem('wow-theme');
    if (saved === 'dark') apply('dark');
    btn.addEventListener('click', () => {
      const next = document.body.classList.contains('dark') ? 'light' : 'dark';
      apply(next);
    });
  }
})();

/* ====== Video Controls + Transcript ====== */
const clip = document.querySelector('#video video');
const ccSelect = document.getElementById('ccSelect');
const videoSelect = document.getElementById('videoSelect');
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
  playBtn .addEventListener('click', () => clip.play());
  pauseBtn.addEventListener('click', () => clip.pause());
  muteBtn .addEventListener('click', () => clip.muted = true);
  unmuteBtn.addEventListener('click', () => clip.muted = false);

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

  const clamp = (t) => Math.min(Math.max(t, 0), isNaN(clip.duration) ? 1e9 : clip.duration);
  rew6Btn.addEventListener('click', () => clip.currentTime = clamp(clip.currentTime - 6));
  ff6Btn .addEventListener('click', () => clip.currentTime = clamp(clip.currentTime + 6));
  slowBtn.addEventListener('click', () => clip.playbackRate = 0.5);
  normalBtn.addEventListener('click', () => clip.playbackRate = 1.0);

  /* ---- Captions ---- */
  function norm(lang){ return (lang || '').toLowerCase().split('-')[0]; }
  function setCaptions(lang) {
    const want = norm(lang);
    const tracks = clip.textTracks;
    let found = false;
    for (let i = 0; i < tracks.length; i++) {
      const have = norm(tracks[i].language || tracks[i].label);
      const on = (want !== 'off' && have === want);
      tracks[i].mode = on ? 'showing' : 'disabled';
      if (on) found = true;
    }
    console.log('CC → want:', want, 'found:', found, [...tracks].map(t => ({label:t.label, lang:t.language, mode:t.mode})));
  }
  ccSelect.addEventListener('change', e => setCaptions(e.target.value));
  clip.addEventListener('loadedmetadata', () => setCaptions(ccSelect.value));
  setTimeout(() => {
    if ([...clip.textTracks].every(t => t.mode === 'disabled')) setCaptions('en');
  }, 1000);

  /* ---- Video switch ---- */
  videoSelect.addEventListener('change', e => {
    clip.pause();
    clip.src = e.target.value;
    clip.load();
    clip.play();
  });

  /* ---- Transcript ---- */
  transcriptToggle.addEventListener('click', async (ev) => {
    ev.preventDefault();
    if (!transcriptBox.hasAttribute('data-loaded')) {
      try {
        const res = await fetch('subtitle/english.vtt', { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        let txt = await res.text();
        txt = txt.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
        txt = txt.replace(/^WEBVTT[^\n]*\n?/i, '');
        txt = txt.replace(/^NOTE[\s\S]*?(?=\n\n|$)/gmi, '');
        const cues = txt.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
        const lines = cues.flatMap(cue => {
          const rows = cue.split('\n').filter(Boolean);
          if (rows[0] && rows[0].includes('-->')) rows.shift();
          return rows;
        });
        const text = lines
          .map(s => s.replace(/<\/?[^>]+>/g, ''))
          .map(s => s.replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .join(' ');
        transcriptBox.textContent = text || 'Transcript is empty.';
        transcriptBox.setAttribute('data-loaded', '1');
      } catch (e) {
        transcriptBox.textContent = 'Transcript could not be loaded.';
        console.error('Transcript error:', e);
      }
    }
    const isHidden = transcriptBox.hasAttribute('hidden');
    transcriptBox.toggleAttribute('hidden', !isHidden);
    transcriptToggle.textContent = transcriptBox.hasAttribute('hidden') ? 'Show Transcript' : 'Hide Transcript';
  });
}
