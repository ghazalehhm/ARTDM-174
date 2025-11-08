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
  // Intro — Rahele's story begins
  { t: 4, run: () => setMsg("Meet Rahele — a passionate baker starting her online journey.") },
  { t: 10, run: () => showCard("The Beginning", "Rahele started her own bakery and began posting regularly on her blog.") },
  { t: 20, run: () => showCard("The Challenge", "Despite her effort, very few visitors were showing up on her website.") },

  // Discovering SEO
  { t: 35, run: () => setMsg("One day, while searching for answers, she discovered SEO — Search Engine Optimization!") },
  { t: 45, run: () => showCard("What is SEO?", "SEO helps improve the quality and quantity of visitors coming from search engines.") },
  { t: 55, run: () => showCard("Why It Matters", "SEO builds awareness, local visibility, and credibility — all without paid ads!") },

  // On-Page SEO
  { t: 70, run: () => setMsg("Rahele decided to start with On-Page SEO.") },
  { t: 80, run: () => showCard("On-Page SEO", "Optimizing website content and technical aspects like HTML, schema, and metadata.") },
  { t: 95, run: () => showCard("Keyword Research", "She used tools like Google to find popular keywords related to her recipes.") },
  { t: 110, run: () => showCard("Content Optimization", "Rahele wrote engaging introductions and naturally included her keywords.") },
  { t: 125, run: () => showCard("Engaging Media", "She added photos, videos, and time-lapse clips to boost engagement and trust.") },

  // Off-Page SEO
  { t: 145, run: () => setMsg("After improving her site, she explored Off-Page SEO.") },
  { t: 155, run: () => showCard("Off-Page SEO", "Actions taken outside her website to improve visibility and authority.") },
  { t: 165, run: () => showCard("Building Backlinks", "Gaining credibility from reputable sites through backlinks and mentions.") },
  { t: 175, run: () => showCard("Social Promotion", "Rahele shared her blog on Facebook, Twitter, Instagram, Reddit, and Medium.") },

  // Quiz Section
  { t: 195, run: () => showCard("Quick Quiz!", "Which is the best way to improve Off-Page SEO? 1) Create more pages 2) Get backlinks from relevant sites 3) None of the above.") },
  { t: 205, run: () => setMsg("Let us know your answer in the comments below!") },

  // Learning and Growth
  { t: 215, run: () => showCard("Next Step", "Rahele joined a digital marketing certification to learn everything about SEO.") },
  { t: 230, run: () => showCard("Results", "Soon, she implemented her knowledge and saw a massive rise in website visitors.") },
  { t: 245, run: () => showCard("Future Plans", "With growing traffic, she could even start her own online shop!") },

  // Conclusion
  { t: 260, run: () => setMsg("And that’s how Rahele transformed her business with SEO!") },
  { t: 270, run: () => showCard("The End", "SEO opened endless possibilities for Rahele — and it can do the same for you.") },
  { t: 285, run: () => setMsg("Thank you for watching! Don’t forget to like, subscribe, and stay tuned for more.") },
  { t: 300, run: () => highlightPanel(true) },
  { t: 310, run: () => highlightPanel(false) }
];
function onYouTubeIframeAPIReady(){
    Player = new YT.Player('player', {

        height: '315',
        width: '560',
        videoId: 'MYE6T_gd7H0',
        events: {onReady: onPlayerReady, onStateChange: onPlayerStateChange 
        },
        playerVars: {
            rel: 0, modestbranding: 1, playsinline: 1
        }
    });
}
// ---- Ready ----
function onPlayerReady() {
    setMsg('Video loaded and ready');
    btnPlay.disabled =false;
    btnPause.disabled = false;
    btnPlay.addEventListener('click', () => Player.playVideo());
    btnPause.addEventListener('click', () => Player.pauseVideo());



    // Mark cue times while playing: press "M" to log current second in the console
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'm' && typeof Player?.getCurrentTime === 'function') {
      console.log('MARK @', Math.floor(Player.getCurrentTime()), 'sec');
    }
  });
}
// ---- State changes ----
function onPlayerStateChange(e) {
    switch (e.data) {
        case YT.PlayerState.PLAYING:
            setMsg('Playing...');
            startTick();
            break;
            case YT.PlayerState.PAUSED:
                setMsg('Paused');
                stopTick();
                break;
            case YT.PlayerState.ENDED:
                setMsg('Finished');
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
        if (typeof Player?.getCurrentTime !== 'function') return;
        const cur = Math.floor(Player.getCurrentTime() || 0);
        const dur = Math.max(1, Math.floor(Player.getDuration() || 1));
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
        card = document.createElement('div');
        card.className = 'card';
        card.id = id;
        cardsbox.appendChild(card);
    }
   card.innerHTML = `
  <h3 class="card-title">${title}</h3>
  <p class="card-body">${body}</p>
`;

}
function highlightPanel(on){
    if (on) cardsbox.classList.add('pulse');
    else cardsbox.classList.remove('pulse');
}
function finalizeProgress(){
     ProgressFill.style.width = '100%';}
