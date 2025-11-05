// === Project 3: Dynamic Media Player (SEO) ===
// YouTube IFrame API + Play/Pause + Progress + Cue-points + Teaching cards
let Player;
let tick = null;          // interval timer while playing
const fired = new Set();    // ensure each cue runs once
// DOM refs
const msg  =document.getElementById('message');
const btnPlay  =document.getElementById('btnPlay');
const btnPause  =document.getElementById('btnPause');
const ProgressFill  =document.getElementById('progressFill');
const cardsbox  =document.getElementById('cards');
// ---- Cue-points  ----
const CUES = [
  { t: 5,   run: () => setMsg('SEO = improving quality/quantity of organic traffic') },
  { t: 20,  run: () => showCard('Benefits', 'Brand awareness, local reach, credibility—without direct ad spend') },
  { t: 40,  run: () => showCard('On-Page SEO', 'Keywords in title/H1/URL, internal links, readable content') },
  { t: 70,  run: () => showCard('Technical SEO', 'Schema, meta tags, speed, mobile-friendly, clean HTML structure') },
  { t: 95,  run: () => showCard('Off-Page SEO', 'High-quality backlinks, mentions, domain authority') },
  { t: 120, run: () => showCard('Tools', 'Google Ads KW Planner, Ahrefs/SEMrush for ideas/volume/difficulty') },
  { t: 150, run: () => highlightPanel(true) },
  { t: 170, run: () => { setMsg('Action: pick one page and apply the on-page checklist'); highlightPanel(false); } }
];
// ---- YouTube bootstrap (API calls this global function) ----
function onYouTubeIframeAPIReady() {
    Player = new YT.Player('player',{
        height: '315',
        width: '560',
        videoId: 'MYE6T_gd7h0',
        events: {onRedy: onPlayerRedy, onStateChange: onPlayerStateChange 
        }
    }) 
}
// ---- Ready ----
function onPlayerRedy() {
    setMsg('Video loaded and ready');
    btnPlay.disabled =false;
    btnPause.disabled = false;
    btnPlay.addEventListener('click', () => Player.PlayVideo());
    btnPause.addEventListener('click', () => Player.pauseVideo());



    // Mark cue times while playing: press "M" to log current second in the console
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm' && player?.getCurrentTime) {
      console.log('MARK @', Math.floor(player.getCurrentTime()), 'sec');
    }
  });
}
// ---- State changes ----
function onPlayerStateChange(e) {
    switch (e.data) {
        case YT.PlayerState.PLAYING:
            setMsg('playing...');
            startTick();
            break;
            case YT.PlayerState.ENDED:
                setMsg('finished');
                stopTick();
                finalizeProgress();
                showCard('Next Steps', '1) Choose a Page 2) Keywords 3) On-Page 4) Speed 5) Backlinks');
                fired.clear();
                break;
                default:
                    setMsg('Ready');
    }
}
// ---- Tick: update progress + run cues ----
function startTick() {
    stopTick();
    tick = setInterval(() => {
        if (!player?.getCurrentTime) return;
        const cur = Math.floor(player.getCurrentTime());
        const due = Math.max(1, Math.floor(player.getDuration() || 1));
        const pct = Math.min(100, Math.max(0, (cur / dur)*100));
        ProgressFill.style.width = pct +'%';
        manageCues(cur);
    }, 500);
}
function stopTick() { if(tick) { clearInterval(tick);tick = null; } }
// ---- Cue manager (fire each cue once) ----
function manageCues(currentSec) {
    for (const cue of CUES ){
        if (currentSec >= cue.t && !fired.has(cue.t)) {
            fired.add(cue.t);
            try { cue.run();} catch (err) {console.error('cue error:',err);}
        }
    }
}
// ---- UI helpers ----
function setMsg(text) { msg.textContent =text; }
function showCard(title, body) {
    const id ='card-' +title.replace(/\s+/g, '-').toLowerCase();
    let card = document.getElementById(id);
    if (!card) {
        card = document.getElementById('div');
        card.className = 'card';
        card.id = id;
        cardsbox.appendChild(card);
    }
    card.innerHTML = '<h3 class="card-title">${title}</h3><p class="card-body">${body}</p>';
}
function highlightPanel(on){
    if (on) cardsbox.classList.add('puls');
    else cardsbox.classList.remove('pulse');
}
function finalizeProgress(){ ProgressFill.style.width = '100';}