// Lab 4 - Gallery Project

document.addEventListener("DOMContentLoaded", () => {
  // --- Base Elements ---
  const base     = document.getElementById("gallery-base");
  const enhanced = document.getElementById("enhanced");
  const lightbox = document.getElementById("lightbox");

  // --- Collect Data from Base Figures ---
  const figures = Array.from(base.querySelectorAll("figure"));
  const items = figures.map(fig => {
    const img = fig.querySelector("img");
    const cap = fig.querySelector("figcaption");
    return {
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "",
      caption: cap ? cap.innerText : ""
    };
  });

  // --- Switch UI to Enhanced Mode ---
  document.body.classList.add("is-enhanced");

  // --- Create Thumbnails ---
  const ul = document.createElement("ul");
  ul.className = "thumbs";

  items.forEach((it, i) => {
    const li  = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thumb";

    const img = document.createElement("img");
    img.src = it.src;
    img.alt = it.alt;
    img.loading = "lazy";

    btn.appendChild(img);
    li.appendChild(btn);

    // title under each thumbnail
    const title = (it.caption || "").split("\n")[0].trim();
    const cap = document.createElement("p");
    cap.className = "thumb-cap";
    cap.innerText = title || "Untitled";
    li.appendChild(cap);

    // open lightbox when clicked
    btn.addEventListener("click", () => openLightbox(i, btn));

    ul.appendChild(li);
  });

  // --- Mount Thumbnails into Enhanced Section ---
  enhanced.innerHTML = "";
  enhanced.appendChild(ul);
  enhanced.setAttribute("aria-busy", "false");

  // --- Lightbox Panel Layout ---
  lightbox.innerHTML = `
    <div class="lightbox-panel" role="document">
      <div class="lightbox-media"><img id="lb-img" alt=""></div>
      <div class="lightbox-bar">
        <div class="caption" id="lb-cap"></div>
        <div class="index" id="lb-idx"></div>
        <div class="btns">
          <button class="btn" id="lb-prev" aria-label="Previous (←)">Prev</button>
          <button class="btn" id="lb-next" aria-label="Next (→)">Next</button>
          <button class="btn" id="lb-close" aria-label="Close (Esc)">Close</button>
        </div>
      </div>
    </div>
  `;

  // --- Lightbox References ---
  const lbImg   = document.getElementById("lb-img");
  const lbCap   = document.getElementById("lb-cap");
  const lbIdx   = document.getElementById("lb-idx");
  const btnPrev = document.getElementById("lb-prev");
  const btnNext = document.getElementById("lb-next");
  const btnClose= document.getElementById("lb-close");

  // --- State Variables ---
  let currentIndex = 0;
  let lastTrigger = null;

  // --- Helper: Highlight Current Thumb ---
  function markActive(i){
    ul.querySelectorAll(".thumb.active").forEach(b => b.classList.remove("active"));
    const li = ul.children[i];
    li?.querySelector(".thumb")?.classList.add("active");
  }

  // --- Open / Close / Render Lightbox ---
  function openLightbox(i, triggerEl){
    currentIndex = i;
    lastTrigger = triggerEl || null;
    render();
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }

  function closeLightbox(){
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  }

  function render(){
    const it = items[currentIndex];
    lbImg.onerror = () => { lbCap.textContent = "(image failed to load)"; };
    lbImg.src = it.src;
    lbImg.alt = it.alt;
    lbCap.textContent = it.caption || "";
    lbIdx.textContent = `${currentIndex + 1} / ${items.length}`;
    markActive(currentIndex);
  }

  // --- Navigation Functions ---
  function prev(){
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    render();
  }
  function next(){
    currentIndex = (currentIndex + 1) % items.length;
    render();
  }

  // --- Event Listeners ---
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);
  btnClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.getAttribute("aria-hidden") === "true") return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  prev();
    if (e.key === "ArrowRight") next();
  });

  // --- Extra DOM API Demos for Rubric ---
  const figList = base.getElementsByTagName('figure');
  console.log('Figures (base):', figList.length);

  const firstFig = figList[0];
  if (firstFig) {
    console.log('firstFig childNodes:', firstFig.childNodes.length);
    console.log('firstFig parentNode tag:', firstFig.parentNode && firstFig.parentNode.tagName);
  }

  if (firstFig && firstFig.nextSibling) {
    console.log('firstFig nextSibling nodeType:', firstFig.nextSibling.nodeType);
  }
  const lastFig = figList[figList.length - 1];
  if (lastFig && lastFig.previousSibling) {
    console.log('lastFig previousSibling nodeType:', lastFig.previousSibling.nodeType);
  }

  const infoProbe = document.createElement('div');
  infoProbe.style.display = 'none';
  infoProbe.innerHTML = `<em>probed ${figList.length} figures</em>`;
  document.body.appendChild(infoProbe);
});
