document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".goal-slider");
  if (!slider) return;

  const templateItems = Array.from(slider.querySelectorAll(".goal-item"));
  if (!templateItems.length) return;

  const templateCount = templateItems.length;

  const GAP_DEG = 20.5; // smaller = cards closer
  const TILT_FACTOR = 1;
  const DRAG_SPEED = 1; // drag sensitivity

  const desiredGapRad = (GAP_DEG * Math.PI) / 180;

  const approxSlots = (2 * Math.PI) / desiredGapRad;
  let repeatCount = Math.max(2, Math.round(approxSlots / templateCount));
  const SLOTS = templateCount * repeatCount;

  const gapAngle = (2 * Math.PI) / SLOTS; // actual gap between slots

  const items = [];
  const baseAngles = [];

  let radius = 0,
    cx = 0,
    cy = 0;
  let rotationOffset = 0;

  let isDragging = false;
  let dragStartAngle = 0;
  let rotationAtDragStart = 0;

  let snapAnimationId = null; // for smooth snap

  // --- Build ring: clone templates into SLOTS --- //
  for (let i = 0; i < SLOTS; i++) {
    const src = templateItems[i % templateCount];
    let item;

    if (i < templateCount) {
      item = src;
    } else {
      item = src.cloneNode(true);
      item.dataset.clone = "1";
      slider.appendChild(item);
    }

    item.style.position = "absolute";
    item.style.transformOrigin = "50% 0%";
    item.dataset.slotIndex = i;

    items.push(item);
  }

  const mid = Math.floor(SLOTS / 2);
  for (let i = 0; i < SLOTS; i++) {
    baseAngles[i] = (i - mid) * gapAngle - Math.PI / 2;
  }

  function normalizeRotation() {
    const twoPi = Math.PI * 2;
    if (rotationOffset > twoPi || rotationOffset < -twoPi) {
      rotationOffset = ((rotationOffset % twoPi) + twoPi) % twoPi;
      if (rotationOffset > Math.PI) rotationOffset -= twoPi;
    }
  }

  // --- Geometry & positioning --- //
  function updateCircle() {
    const sliderWidth = slider.clientWidth;

    // baseline radius you like
    const baseRadius = sliderWidth / 2 + 1000;

    // measure current card width (will be ~160px on phone, 600px on laptop)
    const itemWidth = items[0]?.offsetWidth || 0;

    // how much space between card centers vs card width
    const SPACING_FACTOR = 1.4; // 1.0 = just touching, >1 = gap

    let r = baseRadius;

    if (itemWidth > 0) {
      const minArc = itemWidth * SPACING_FACTOR; // desired distance along the circle
      const currentArc = r * gapAngle; // current distance between cards

      // if cards would collide, push them further out by increasing radius
      if (currentArc < minArc) {
        r = minArc / gapAngle;
      }
    }

    radius = r;
    cx = sliderWidth / 2;
    cy = radius;

    positionAll();
  }

  function positionAll() {
    items.forEach((item, index) => {
      const angle = baseAngles[index] + rotationOffset;
      const itemWidth = item.offsetWidth;

      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      item.style.left = x - itemWidth / 2 + "px";
      item.style.top = y + "px";

      const rotationRad = (angle + Math.PI / 2) * TILT_FACTOR;
      const rotationDeg = (rotationRad * 180) / Math.PI;
      item.style.transform = `rotate(${rotationDeg}deg)`;
    });
  }

  // --- Smooth snap animation --- //
  function animateToRotation(targetRotation) {
    if (snapAnimationId !== null) {
      cancelAnimationFrame(snapAnimationId);
      snapAnimationId = null;
    }

    const startRotation = rotationOffset;
    const duration = 300; // ms
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      // smoothstep easing
      const eased = t * t * (3 - 2 * t);

      rotationOffset = startRotation + (targetRotation - startRotation) * eased;
      normalizeRotation();
      positionAll();

      if (t < 1 && !isDragging) {
        snapAnimationId = requestAnimationFrame(frame);
      } else {
        snapAnimationId = null;
      }
    }

    snapAnimationId = requestAnimationFrame(frame);
  }

  // --- Drag logic: spin + snap --- //
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
    isDragging = true;

    // stop any ongoing snap animation
    if (snapAnimationId !== null) {
      cancelAnimationFrame(snapAnimationId);
      snapAnimationId = null;
    }

    const pos = getPointerPos(evt);
    dragStartAngle = Math.atan2(pos.y - cy, pos.x - cx);
    rotationAtDragStart = rotationOffset;

    items.forEach((it) => it.classList.add("active"));

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag, { passive: false });
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  }

  function onDrag(evt) {
    if (!isDragging) return;
    evt.preventDefault();

    const pos = getPointerPos(evt);
    const currentAngle = Math.atan2(pos.y - cy, pos.x - cx);
    const deltaAngle = currentAngle - dragStartAngle;

    rotationOffset = rotationAtDragStart + deltaAngle * DRAG_SPEED;

    normalizeRotation();
    positionAll();
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    // snap to nearest slot
    const steps = Math.round(rotationOffset / gapAngle);
    const targetRotation = steps * gapAngle;

    normalizeRotation();
    animateToRotation(targetRotation); // 🔥 smooth snap back / forward

    items.forEach((it) => it.classList.remove("active"));

    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchend", endDrag);
  }

  // --- Button controls: next / previous --- //

  // helper: move N slots (positive = one way, negative = other way)
  function goToStep(deltaSteps) {
    // stop any ongoing animation
    if (snapAnimationId !== null) {
      cancelAnimationFrame(snapAnimationId);
      snapAnimationId = null;
    }

    const currentSteps = Math.round(rotationOffset / gapAngle);
    const targetSteps = currentSteps + deltaSteps;
    const targetRotation = targetSteps * gapAngle;

    normalizeRotation();
    animateToRotation(targetRotation);
  }

  const controls = document.querySelectorAll(".slider-cursor-btn");
  const prevBtn = controls[0];
  const nextBtn = controls[1];

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      // move one card to the LEFT (tweak sign if direction feels wrong)
      goToStep(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      // move one card to the RIGHT
      goToStep(1);
    });
  }

  // Init
  updateCircle();
  window.addEventListener("resize", updateCircle);

  slider.style.touchAction = "none";

  items.forEach((item) => {
    item.style.cursor = "grab";
    item.addEventListener("mousedown", startDrag);
    item.addEventListener("touchstart", startDrag, { passive: false });
  });
});
