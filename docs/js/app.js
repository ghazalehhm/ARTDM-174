// ===== Data (edit links if you want) =====
const ITEMS = [
  // Projects with videos (P1..P6 exist in your videos/ folder)
  {
    type:'Project',
    title:'Project 1: Course Jump Page',
    due:'2025-09-19',
    status:'ok',
    desc:'Landing page aggregating all course work with repo + live URLs.',
    repo:'#', live:'#',
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

  // Labs with videos (L0..L7 exist in your videos/ folder)
  {type:'Lab', title:'Lab 0: Static Comp → Page', due:'2025-08-30', status:'ok',  desc:'Semantic HTML & responsive CSS.', repo:'#', live:'#', video:'videos/L0.mp4'},
  {type:'Lab', title:'Lab 1: Flexbox & Grid',      due:'2025-09-04', status:'ok',  desc:'Core layouts; mobile-first.',    repo:'#', live:'#', video:'videos/L1.mp4'},
  {type:'Lab', title:'Lab 2: Transitions & Anim',  due:'2025-09-11', status:'ok',  desc:'Motion with performance in mind.',repo:'#', live:'#', video:'videos/L2.mp4'},
  {type:'Lab', title:'Lab 3: Mouse Events',        due:'2025-09-25', status:'ok',  desc:'DOM events and micro-interactions.', repo:'#', live:'#', video:'videos/L3.mp4'},
  {type:'Lab', title:'Lab 4: Changing the DOM',    due:'2025-10-02', status:'warn',desc:'Selection, mutation, state.',    repo:'#', live:'#', video:'videos/L4.mp4'},
  {type:'Lab', title:'Lab 5: Audio & Video',       due:'2025-10-23', status:'warn',desc:'Accessible media handling.',     repo:'#', live:'#', video:'videos/L5.mp4'},
  {type:'Lab', title:'Lab 6: Fetch',               due:'2025-11-13', status:'warn',desc:'Remote APIs, JSON, rendering.',  repo:'#', live:'#', video:'videos/L6.mp4'},
  {type:'Lab', title:'Lab 7: Remote APIs (Fun)',   due:'2025-12-02', status:'warn',desc:'Creative public API mashups.',   repo:'#', live:'#', video:'videos/L7.mp4'},
];

// ===== Helpers =====
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const list = $('#list');
const fmt = d => new Date(d).toLocaleDateString('en-US', {year:'numeric', month:'short', day:'numeric'});

// Build media block
function mediaMarkup(item){
  if(item.video){
    return `
      <figure class="thumb-wrap">
        <video class="thumb" src="${item.video}" preload="metadata" muted playsinline loop></video>
        <button class="play focus-ring" type="button" aria-label="Play preview">▶</button>
      </figure>`;
  }
  if(item.image){
    return `
      <figure class="thumb-wrap">
        <img class="thumb" src="${item.image}" alt="">
      </figure>`;
  }
  return '';
}

function assignmentCard(item){
  const statusClass = item.status === 'ok' ? 'ok' : item.status === 'warn' ? 'warn' : 'miss';
  const dueISO = new Date(item.due).toISOString().split('T')[0];
  return `
    <article class="card" data-type="${item.type}" data-title="${item.title.toLowerCase()}" data-keywords="${(item.desc||'').toLowerCase()}">
      <div class="ribbon ${statusClass}"></div>
      ${mediaMarkup(item)}
      <div class="meta">
        <span class="chip">🗓 ${fmt(item.due)} <time datetime="${dueISO}" hidden></time></span>
        <span class="chip">${item.type}</span>
      </div>
      <h3>${item.title}</h3>
      <p class="desc">${item.desc||''}</p>
      <div class="links">
        <a class="btn focus-ring" href="${item.repo}" target="_blank" rel="noopener noreferrer" aria-label="Repository link for ${item.title}">📦 Repo</a>
        <a class="btn focus-ring" href="${item.live}" target="_blank" rel="noopener noreferrer" aria-label="Live link for ${item.title}">🔗 Live</a>
      </div>
    </article>`;
}

function render(items){
  list.innerHTML = items.map(assignmentCard).join('');
  wireVideoPreviews();
}

// Filter + sort
function applyFilters(){
  const q = $('#q').value.trim().toLowerCase();
  const type = $('#type').value;
  const sortBy = $('#sort').value;
  let out = [...ITEMS];

  if(type !== 'all') out = out.filter(i => i.type === type);
  if(q){
    out = out.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q) ||
      (i.desc||'').toLowerCase().includes(q)
    );
  }
  out.sort((a,b)=>{
    if(sortBy === 'title') return a.title.localeCompare(b.title);
    return new Date(a.due) - new Date(b.due);
  });

  list.classList.add('updating');
  requestAnimationFrame(()=>{
    render(out);
    requestAnimationFrame(()=> list.classList.remove('updating'));
  });
}

// Video previews
function wireVideoPreviews(){
  document.querySelectorAll('.thumb-wrap video').forEach(v=>{
    const wrap = v.parentElement;
    const btn  = wrap.querySelector('.play');

    const start = ()=>{
      v.play().then(()=>btn?.classList.add('on')).catch(()=>{});
    };
    const stop  = ()=>{
      v.pause(); btn?.classList.remove('on');
    };

    wrap.addEventListener('mouseenter', start);
    wrap.addEventListener('mouseleave', stop);
    btn?.addEventListener('click', ()=> v.paused ? start() : stop());
  });

  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        const v = e.target;
        if(!e.isIntersecting){
          v.pause();
          v.parentElement?.querySelector('.play')?.classList.remove('on');
        }
      });
    }, {threshold:0.15});
    document.querySelectorAll('.thumb-wrap video').forEach(v=>io.observe(v));
  }
}

// Smooth scroll
function goTo(id){
  const el = document.querySelector(id);
  if(!el) return;
  el.scrollIntoView({behavior:'smooth', block:'start'});
}

// ===== Init =====
window.addEventListener('DOMContentLoaded', ()=>{
  // Inputs
  ['q','type','sort'].forEach(id=>{
    const el = document.getElementById(id);
    el.classList?.add('focus-ring');
    el.addEventListener('input', applyFilters);
    el.addEventListener('change', applyFilters);
  });

  applyFilters();

  // Meta
  const now = new Date();
  $('#yr').textContent = now.getFullYear();
  $('#lastUpdated').textContent = now.toLocaleString('en-US');
  $('#lastUpdated').setAttribute('datetime', now.toISOString());

  // Top-level Repo/Live (replace with your real links)
  document.getElementById('repoLink').href = '#';
  document.getElementById('liveLink').href = '#';

  // Nav: mobile toggle
  const burger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-links');
  if (burger && navList){
    burger.addEventListener('click', ()=>{
      const open = navList.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  // Menu → filter + scroll
  const typeSelect = document.getElementById('type');
  document.getElementById('nav-projects')?.addEventListener('click', (e)=>{
    e.preventDefault();
    if(typeSelect){ typeSelect.value = 'Project'; }
    applyFilters(); goTo('#projects');
  });
  document.getElementById('nav-labs')?.addEventListener('click', (e)=>{
    e.preventDefault();
    if(typeSelect){ typeSelect.value = 'Lab'; }
    applyFilters(); goTo('#projects');
  });
  document.getElementById('nav-about')?.addEventListener('click', (e)=>{
    e.preventDefault(); goTo('#about');
  });
  document.getElementById('nav-search')?.addEventListener('click', (e)=>{
    e.preventDefault(); goTo('#search'); document.getElementById('q')?.focus();
  });

  // Hero CTAs
  document.getElementById('cta-projects')?.addEventListener('click', (e)=>{
    e.preventDefault(); if(typeSelect){ typeSelect.value = 'Project'; }
    applyFilters(); goTo('#projects');
  });
  document.getElementById('cta-labs')?.addEventListener('click', (e)=>{
    e.preventDefault(); if(typeSelect){ typeSelect.value = 'Lab'; }
    applyFilters(); goTo('#projects');
  });
});
