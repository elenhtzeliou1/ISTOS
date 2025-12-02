const slider = document.querySelector(".card-carousel");

let isDown = false;
let lastX = 0;
let lastScrollLeft = 0;
let velocity = 0;
let momentumId;

if (slider) {
  const getX = (e) =>
    e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;

  const cancelMomentum = () => {
    if (momentumId) {
      cancelAnimationFrame(momentumId);
      momentumId = null;
    }
  };

  const start = (e) => {
    isDown = true;
    slider.classList.add("active");
    cancelMomentum();

    lastX = getX(e);
    lastScrollLeft = slider.scrollLeft;
    velocity = 0;
  };

  const move = (e) => {
    if (!isDown) return;

    if (e.cancelable) e.preventDefault();

    const x = getX(e);
    const dx = x - lastX; // movement since last frame
    slider.scrollLeft -= dx; // move opposite direction
    velocity = dx; // store last delta for momentum
    lastX = x;
  };

  const end = () => {
    if (!isDown) return;
    isDown = false;
    slider.classList.remove("active");

    // start momentum scrolling
    let momentum = velocity;
    const step = () => {
      momentum *= 0.95; // friction
      if (Math.abs(momentum) < 0.1) return;

      slider.scrollLeft -= momentum;
      momentumId = requestAnimationFrame(step);
    };
    momentumId = requestAnimationFrame(step);
  };

  // mouse
  slider.addEventListener("mousedown", start);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", end);
  window.addEventListener("mouseleave", end);

  // touch
  slider.addEventListener("touchstart", start, { passive: true });
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", end);
  window.addEventListener("touchcancel", end);
}

/* Courses reveal on scroll */

const courseItems = document.querySelectorAll(".course-item");

if ("IntersectionObserver" in window && courseItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  courseItems.forEach((item) => observer.observe(item));
} else {
  // fall back gia old browsers
  courseItems.forEach((item) => item.classList.add("visible"));
}

//accordion:

document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".accordion-trigger");

  // Osa accordion panel exoun aria-expanded true anoigoun arxika
  triggers.forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (btn.getAttribute("aria-expanded") === "true") {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("is-open");
    } else {
      panel.style.maxHeight = "0px";
      panel.classList.remove("is-open");
    }
  });

  // click handler – mono ena meni enoikto ka8e fora
  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      const currentPanel = document.getElementById(
        btn.getAttribute("aria-controls")
      );

      if (isExpanded) {
        //kleinoume to idio an ksanapati8ei
        btn.setAttribute("aria-expanded", "false");
        currentPanel.style.maxHeight = "0px";
        currentPanel.classList.remove("is-open");
        return;
      }

      // kleinoume kai OLA ta ypoloipa
      triggers.forEach((otherBtn) => {
        if (otherBtn === btn) return;
        const otherPanel = document.getElementById(
          otherBtn.getAttribute("aria-controls")
        );
        otherBtn.setAttribute("aria-expanded", "false");
        otherPanel.style.maxHeight = "0px";
        otherPanel.classList.remove("is-open");
      });

      // anoigoume to trexon clickarismeno
      btn.setAttribute("aria-expanded", "true");
      currentPanel.style.maxHeight = currentPanel.scrollHeight + "px";
      currentPanel.classList.add("is-open");
    });
  });
});

// ===============================================//
// ===============================================//
// ===============================================//
// ===============================================//

//intro slider
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".intro-slider");

  const templateItems = Array.from(slider.querySelectorAll(".intro-item"));
  const templateCount = templateItems.length || 1;

  const GAP_DEG = 22; // desired gap between neighbours in degrees
  const TILT_FACTOR = 1; // 1 = full tangent, <1 = softer tilt
  const AUTO_SPEED = 0.0015; // radians per frame (its changes the autoplay speed)

  const desiredGapRad = (GAP_DEG * Math.PI) / 180;

  // How many slots would we want approximately
  const approxSlots = (2 * Math.PI) / desiredGapRad;

  // We  need a multiple of templateCount so the pattern repeats cleanly
  let repeatCount = Math.max(2, Math.round(approxSlots / templateCount));
  const SLOTS = templateCount * repeatCount;

  // Actual gap used so spacing is perfectly even
  const gapAngle = (2 * Math.PI) / SLOTS;

  const items = []; // all real DOM items (templates + clones)
  const baseAngles = []; // base angle per slot

  let radius = 0,
    cx = 0,
    cy = 0;
  let rotationOffset = 0;

  let isDragging = false;
  let draggedIndex = null;

  // --- Build ring: clone the templates into SLOTS positions ---//

  for (let i = 0; i < SLOTS; i++) {
    const src = templateItems[i % templateCount];
    let item;

    if (i < templateCount) {
      // reuse the original items for first ones
      item = src;
    } else {
      // extra slots are clones
      item = src.cloneNode(true);
      item.dataset.clone = "1";
      slider.appendChild(item);
    }

    item.style.position = "absolute";
    item.style.transformOrigin = "50% 0%";
    item.dataset.slotIndex = i;

    items.push(item);
  }

  // Center one slot at the TOP (-π/2) and step by gapAngle
  const mid = Math.floor(SLOTS / 2);
  for (let i = 0; i < SLOTS; i++) {
    baseAngles[i] = (i - mid) * gapAngle - Math.PI / 2;
  }

  // --- Geometry && positioning ---//

  function updateCircle() {
    const sliderWidth = slider.clientWidth;

    radius = sliderWidth / 2 + 400; //  radius rule
    cx = sliderWidth / 2;
    cy = radius; // so top of circle is y = 0

    positionAll();
  }

  function positionAll() {
    items.forEach((item, index) => {
      const angle = baseAngles[index] + rotationOffset;
      const itemWidth = item.offsetWidth;

      // TOP-CENTER point on circle
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      item.style.left = x - itemWidth / 2 + "px";
      item.style.top = y + "px";

      // Tilt along tangent (so the top one is alligning as straight line)
      const rotationRad = (angle + Math.PI / 2) * TILT_FACTOR;
      const rotationDeg = (rotationRad * 180) / Math.PI;
      item.style.transform = `rotate(${rotationDeg}deg)`;
    });
  }

  // --- Drag logic: rotate the entire ring ---//
  function getPointerPos(evt) {
    const e = evt.touches ? evt.touches[0] : evt;
    const bounds = slider.getBoundingClientRect();

    return {
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    };
  }

  function startDrag(evt) {
    evt.preventDefault();
    const item = evt.currentTarget;

    isDragging = true;
    draggedIndex = Number(item.dataset.slotIndex);

    slider.style.cursor = "grabbing";
    items.forEach((it) => (it.style.cursor = "grabbing"));

    // Position immediately so there's no jump
    onDrag(evt);

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  }

  function onDrag(evt) {
    if (!isDragging) return;
    evt.preventDefault();

    const pos = getPointerPos(evt);
    const angle = Math.atan2(pos.y - cy, pos.x - cx);

    // Keep the dragged slot under the cursor:
    // angle = baseAngles[draggedIndex] + rotationOffset
    rotationOffset = angle - baseAngles[draggedIndex];

    positionAll();
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    slider.style.cursor = "";
    items.forEach((it) => (it.style.cursor = "grab"));

    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchend", endDrag);
  }

  // --- Autoplay -  infinity rotation of the ring ---//

  function animate() {
    if (!isDragging) {
      rotationOffset += AUTO_SPEED; // change sign to reverse direction

      if (rotationOffset > Math.PI * 2) rotationOffset -= Math.PI * 2;
      if (rotationOffset < -Math.PI * 2) rotationOffset += Math.PI * 2;
    }

    positionAll();
    requestAnimationFrame(animate);
  }

  // Initialize
  updateCircle();
  window.addEventListener("resize", updateCircle);

  // Add listeners to all slots (templates + clones)
  items.forEach((item) => {
    item.style.cursor = "grab";
    item.addEventListener("mousedown", startDrag);
    item.addEventListener("touchstart", startDrag, { passive: false });
  });

  animate(); // start autoplay
});

// ==================================//
// ==================================//
// ==================================//
// ==================================//
