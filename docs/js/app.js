/* ===== Data  ===== */
const ITEMS = [
  {
    type:'Project',
    title:'Project 1: Course Jump Page',
    due:'2025-09-19',
    status:'ok',
    desc:'Landing page aggregating all course work with repo + live URLs.',
    repo:'https://github.com/ghazalehhm/ARTDM-174',
    live:'./',

    video:'videos/P1.mp4'
  },
  {
    type:'Project',
    title:'Project 2: Photo Gallery',
    due:'2025-10-18',
    status:'warn',
    desc:'Responsive gallery with accessibility and performance in mind.',
    repo:'#', live:'#',
    video:'videos/P2.mp4'
  },
  {
    type:'Project',
    title:'Project 3: Dynamic Media Player',
    due:'2025-11-06',
    status:'warn',
    desc:'Custom controls and dynamic media interactions.',
    repo:'#', live:'#',
    video:'videos/P3.mp4'
  },
  {
    type:'Project',
    title:'Project 4: Web App',
    due:'2025-12-11',
    status:'miss',
    desc:'Capstone single-page app demonstrating course concepts.',
    repo:'#', live:'#',
    video:'videos/P4.mp4'
  },
  {
    type:'Project',
    title:'Project 5: (Optional)',
    due:'2025-12-18',
    status:'warn',
    desc:'Optional expansion.',
    repo:'#', live:'#',
    video:'videos/P5.mp4'
  },
  {
    type:'Project',
    title:'Project 6: (Optional)',
    due:'2025-12-25',
    status:'warn',
    desc:'Optional expansion.',
    repo:'#', live:'#',
    video:'videos/P6.mp4'
  },

  // Labs
  {type:'Lab', title:'Lab 0: Static Comp → Page', due:'2025-08-30', status:'ok',
    desc:'Semantic HTML & responsive CSS.',
    repo:'https://github.com/ghazalehhm/ARTDM-174/tree/main/docs/Labs/Lab0',
    live:'Labs/Lab0/index.html', video:'videos/L0.mp4'},
  {type:'Lab', title:'Lab 1: Flexbox & Grid', due:'2025-09-04', status:'ok',
    desc:'Core layouts; mobile-first.',
    repo:'https://github.com/ghazalehhm/ARTDM-174/tree/main/docs/Labs/Lab1',
    live:'Labs/Lab1/index.html', video:'videos/L1.mp4'},
  {type:'Lab', title:'Lab 2: Transitions & Anim', due:'2025-09-11', status:'ok',
    desc:'Motion with performance in mind.',
    repo:'https://github.com/ghazalehhm/ARTDM-174/tree/main/docs/Labs/Lab2',
    live:'Labs/Lab2/index.html', video:'videos/L2.mp4'},
  {type:'Lab', title:'Lab 3: Mouse Events', due:'2025-09-25', status:'ok',
    desc:'DOM events and micro-interactions.',
    repo:'https://github.com/ghazalehhm/ARTDM-174/tree/main/docs/Labs/Lab3',
    live:'Labs/Lab3/index.html', video:'videos/L3.mp4'},
  {type:'Lab', title:'Lab 4: Changing the DOM', due:'2025-10-02', status:'warn',
    desc:'Selection, mutation, state.',
    repo:'https://github.com/ghazalehhm/ARTDM-174/tree/main/docs/Labs/Lab4',
    live:'Labs/Lab4/', video:'videos/L4.mp4'},
  {type:'Lab', title:'Lab 5: Audio & Video', due:'2025-10-23', status:'warn',
    desc:'Accessible media handling.',
    repo:'https://github.com/ghazalehhm/ARTDM-174/tree/main/docs/Labs/Lab5',
    live:'Labs/Lab5/', video:'videos/L5.mp4'},
  {type:'Lab', title:'Lab 6: Fetch', due:'2025-11-13', status:'warn',
    desc:'Remote APIs, JSON, rendering.',
    repo:'https://github.com/ghazalehhm/ARTDM-174/tree/main/docs/Labs/Lab6',
    live:'Labs/Lab6/', video:'videos/L6.mp4'},
  {type:'Lab', title:'Lab 7: Remote APIs (Fun)', due:'2025-12-02', status:'warn',
    desc:'Creative public API mashups.',
    repo:'https://github.com/ghazalehhm/ARTDM-174/tree/main/docs/Labs/Lab7',
    live:'Labs/Lab7/', video:'videos/L7.mp4'},
];

/* ===== Helpers ===== */
function $(sel, ctx){ return (ctx||document).querySelector(sel); }
var list = $('#list');
function fmt(d){
  return new Date(d).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'});
}

/* Media block  */
function mediaMarkup(item){
  if(item.video){
    return '' +
      '<figure class="thumb-wrap">' +
      '  <video class="thumb" src="' + item.video + '" preload="metadata" muted playsinline loop></video>' +
      '  <button class="play focus-ring" type="button" aria-label="Play preview">▶</button>' +
      '</figure>';
  }
  if(item.image){
    return '' +
      '<figure class="thumb-wrap">' +
      '  <img class="thumb" src="' + item.image + '" alt="">' +
      '</figure>';
  }
  return '';
}

function assignmentCard(item){
  var statusClass = item.status === 'ok' ? 'ok' : (item.status === 'warn' ? 'warn' : 'miss');
  var dueISO = new Date(item.due).toISOString().split('T')[0];
  return '' +
    '<article class="card" data-type="' + item.type + '" data-title="' + item.title.toLowerCase() + '" data-keywords="' + (item.desc||'').toLowerCase() + '">' +
    '  <div class="ribbon ' + statusClass + '"></div>' +
         mediaMarkup(item) +
    '  <div class="meta">' +
    '    <span class="chip">🗓 ' + fmt(item.due) + ' <time datetime="' + dueISO + '" hidden></time></span>' +
    '    <span class="chip">' + item.type + '</span>' +
    '  </div>' +
    '  <h3>' + item.title + '</h3>' +
    '  <p class="desc">' + (item.desc||'') + '</p>' +
    '  <div class="links">' +
    '    <a class="btn focus-ring" href="' + (item.repo||'#') + '" target="_blank" rel="noopener noreferrer" aria-label="Repository link for ' + item.title + '">📦 Repo</a>' +
    '    <a class="btn focus-ring" href="' + (item.live||'#') + '" target="_blank" rel="noopener noreferrer" aria-label="Live link for ' + item.title + '">🔗 Live</a>' +
    '  </div>' +
    '</article>';
}

function render(items){
  if(!items.length){
    list.innerHTML = '<p class="desc" role="status">No results found. Try a different filter or keyword.</p>';
    return;
  }
  list.innerHTML = items.map(assignmentCard).join('');
  wireVideoPreviews();
}

/* ===== Filter + sort ===== */
function applyFilters(){
  var qEl = document.getElementById('q');
  var typeEl = document.getElementById('type');
  var sortEl = document.getElementById('sort');

  var q = qEl && qEl.value ? qEl.value.trim().toLowerCase() : '';
  var type = typeEl && typeEl.value ? typeEl.value : 'all';
  var sortBy = sortEl && sortEl.value ? sortEl.value : 'due';

  var out = ITEMS.slice();

  if(type !== 'all'){
    out = out.filter(function(i){ return i.type === type; });
  }
  if(q){
    out = out.filter(function(i){
      return (i.title||'').toLowerCase().includes(q) ||
             (i.type||'').toLowerCase().includes(q) ||
             (i.desc||'').toLowerCase().includes(q);
    });
  }
  out.sort(function(a,b){
    if(sortBy === 'title') return a.title.localeCompare(b.title);
    return new Date(a.due) - new Date(b.due);
  });

  list.classList.add('updating');
  requestAnimationFrame(function(){
    render(out);
    requestAnimationFrame(function(){ list.classList.remove('updating'); });
  });
}

/* ===== Video previews ===== */
function wireVideoPreviews(){
  var vids = document.querySelectorAll('.thumb-wrap video');
  for (var i=0; i<vids.length; i++){
    (function(v){
      var wrap = v.parentElement;
      var btn = wrap ? wrap.querySelector('.play') : null;

      function start(){
        var p = v.play();
        if (p && p.then) {
          p.then(function(){ if(btn){ btn.classList.add('on'); } }).catch(function(){});
        } else {
          if(btn){ btn.classList.add('on'); }
        }
      }
      function stop(){
        v.pause();
        if(btn){ btn.classList.remove('on'); }
      }

      if(wrap){
        wrap.addEventListener('mouseenter', start);
        wrap.addEventListener('mouseleave', stop);
      }
      if(btn){
        btn.addEventListener('click', function(){
          if(v.paused){ start(); } else { stop(); }
        });
      }
    })(vids[i]);
  }
}

/* ===== Smooth scroll ===== */
function goTo(id){
  var el = document.querySelector(id);
  if(!el) return;
  el.scrollIntoView({behavior:'smooth', block:'start'});
}

/* ===== Init ===== */
window.addEventListener('DOMContentLoaded', function(){
  // Inputs
  ['q','type','sort'].forEach(function(id){
    var el = document.getElementById(id);
    if(el){
      el.classList.add('focus-ring');
      el.addEventListener('input', applyFilters);
      el.addEventListener('change', applyFilters);
    }
  });

  applyFilters();

  // Meta
  var now = new Date();
  var yrEl = document.getElementById('yr');
  if (yrEl){ yrEl.textContent = now.getFullYear(); }

  var last = document.getElementById('lastUpdated');
  if (last){
    var txt = now.toLocaleString('en-US');
    last.textContent = txt;
    last.setAttribute('datetime', now.toISOString());
    last.setAttribute('title', txt);
  }

  // Nav: mobile toggle + close on click
  var burger = document.querySelector('.hamburger');
  var navList = document.querySelector('.nav-links');
  if (burger && navList){
    burger.addEventListener('click', function(){
      var open = navList.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    var links = navList.querySelectorAll('a');
    for (var i=0;i<links.length;i++){
      links[i].addEventListener('click', function(){
        navList.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // Menu → filter + scroll 
  var typeSelect = document.getElementById('type');

  var navProjects = document.getElementById('nav-projects');
  if (navProjects){
    navProjects.addEventListener('click', function(e){
      e.preventDefault();
      if(typeSelect){ typeSelect.value = 'Project'; }
      applyFilters(); goTo('#projects');
    });
  }

  var navLabs = document.getElementById('nav-labs');
  if (navLabs){
    navLabs.addEventListener('click', function(e){
      e.preventDefault();
      if(typeSelect){ typeSelect.value = 'Lab'; }
      applyFilters(); goTo('#projects');
    });
  }

  var navAbout = document.getElementById('nav-about');
  if (navAbout){
    navAbout.addEventListener('click', function(e){
      e.preventDefault(); goTo('#about');
    });
  }

  var navSearch = document.getElementById('nav-search');
  if (navSearch){
    navSearch.addEventListener('click', function(e){
      e.preventDefault(); goTo('#search');
      var q = document.getElementById('q'); if(q){ q.focus(); }
    });
  }
});
