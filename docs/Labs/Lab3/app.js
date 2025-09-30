// Test if JS is connected
//console.log("JS loaded");
// Get elements
const infoX = document.getElementById("x");
const infoY = document.getElementById("y");
const stage = document.getElementById("stage");
const dot   = document.getElementById("dot");

// Show mouse position in real time
stage.addEventListener("mousemove", (e) => {
  infoX.textContent = e.clientX;
  infoY.textContent = e.clientY;
});

// Move dot and log event
stage.addEventListener("click", (e) => {
  const r = stage.getBoundingClientRect();
  const x = e.clientX - r.left - 10; // 10 = half of dot size (20px)
  const y = e.clientY - r.top  - 10;
  dot.style.left = `${x}px`;
  dot.style.top  = `${y}px`;

  console.log("Click event object:", e);
});

// Pulse effect on double click
stage.addEventListener("dblclick", () => {
  dot.classList.add("pulse");
  setTimeout(() => dot.classList.remove("pulse"), 600);
});

// Ripple effect on right click
stage.addEventListener("contextmenu", (e) => {
  e.preventDefault();           // block default right-click menu
  dot.classList.add("ripple");
  setTimeout(() => dot.classList.remove("ripple"), 600);
});
