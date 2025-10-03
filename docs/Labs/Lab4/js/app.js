// Gallery (Lab 4) — thumbnails + lightbox 

document.addEventListener("DOMContentLoaded", () => {
  // base refs
  const base     = document.getElementById("gallery-base");
  const enhanced = document.getElementById("enhanced");
  const lightbox = document.getElementById("lightbox");

  // read figures (fallback data source)
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

  // switch UI to enhanced
  document.body.classList.add("is-enhanced");

  // build thumbnails
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

    // short title (first line of caption)
    const title = (it.caption || "").split("\n")[0].trim();
    const cap = document.createElement("p");
    cap.className = "thumb-cap";
    cap.innerText = title || "Untitled";
    li.appendChild(cap);

    // open lightbox
    btn.addEventListener("click", () => openLightbox(i, btn));

    ul.appendChild(li);
  });

  // mount thumbs
  enhanced.innerHTML = "";
  enhanced.appendChild(ul);
  enhanced.setAttribute("aria-busy", "false");

  // lightbox shell
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

  // lightbox refs
  const lbImg   = document.getElementById("lb-img");
  const lbCap   = document.getElementById("lb-cap");
  const lbIdx   = document.getElementById("lb-idx");
  const btnPrev = document.getElementById("lb-prev");
  const btnNext = document.getElementById("lb-next");
  const btnClose= document.getElementById("lb-close");

  // state
  let currentIndex = 0;
  let lastTrigger = null;

  // small UI: mark active thumb
  function markActive(i){
    ul.querySelectorAll(".thumb.active").forEach(b => b.classList.remove("active"));
    const li = ul.children[i];
    li?.querySelector(".thumb")?.classList.add("active");
  }

  // open / close / render
  function openLightbox(i, triggerEl){
    currentIndex = i;
    lastTrigger = triggerEl || null;
    render();
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // lock page scroll
    btnClose.focus();
  }

  function closeLightbox(){
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // restore scroll
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

  // nav
  function prev(){
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    render();
  }
  function next(){
    currentIndex = (currentIndex + 1) % items.length;
    render();
  }

  // events
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);
  btnClose.addEventListener("click", closeLightbox);

  // click outside panel closes
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // keyboard: esc + arrows
  document.addEventListener("keydown", (e) => {
    if (lightbox.getAttribute("aria-hidden") === "true") return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  prev();
    if (e.key === "ArrowRight") next();
  });
});
