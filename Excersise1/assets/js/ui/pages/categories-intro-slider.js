// Ring-style carousel used in the header of categories.html
// Wrapped in an IIFE to keep the global scope clean and avoid collisions
(function () {
  function init() {
    // Main slider container
    const slider = document.querySelector(".goal-slider");
    if (!slider) return;

    // Prevent double initialization (important if scripts are reloaded)
    if (slider.dataset.ringBound === "1") return;
    slider.dataset.ringBound = "1";

    // Base items used as templates for building the circular ring
    const templateItems = Array.from(slider.querySelectorAll(".goal-item"));
    if (!templateItems.length) return;

    const templateCount = templateItems.length;

    // Configuration constants
    const GAP_DEG = 20.5;     // angular gap between items (degrees)
    const TILT_FACTOR = 1;   // tangent rotation strength
    const DRAG_SPEED = 1.8;  // multiplier for drag sensitivity

    // Compute how many slots are needed to fill the full circle
    const desiredGapRad = (GAP_DEG * Math.PI) / 180;
    const approxSlots = (2 * Math.PI) / desiredGapRad;
    let repeatCount = Math.max(2, Math.round(approxSlots / templateCount));
    const SLOTS = templateCount * repeatCount;

    const gapAngle = (2 * Math.PI) / SLOTS;

    // Arrays holding all rendered items and their base angles
    const items = [];
    const baseAngles = [];

    // Geometry and rotation state
    let radius = 0,
      cx = 0,
      cy = 0;
    let rotationOffset = 0;

    // Drag state
    let isDragging = false;
    let dragStartAngle = 0;
    let rotationAtDragStart = 0;

    // Snap animation tracking
    let snapAnimationId = null;

    // Separate click vs drag handling
    const DRAG_THRESHOLD_PX = 5;
    let pointerDown = false;
    let moved = false;
    let startX = 0,
      startY = 0;
    let suppressClick = false;

    // Cancel link navigation only if a drag actually occurred
    slider.addEventListener(
      "click",
      (e) => {
        if (!suppressClick) return;
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );

    // --- Build ring: clone templates into SLOTS positions ---
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

      // Absolute positioning allows circular placement
      item.style.position = "absolute";
      item.style.transformOrigin = "50% 0%";
      item.dataset.slotIndex = i;

      items.push(item);
    }

    // Equalize heights so all items align visually
    function equalizeItemHeights() {
      // Reset to natural height for measurement
      items.forEach((it) => (it.style.height = "auto"));

      // Measure tallest item
      const maxH = Math.max(...items.map((it) => it.scrollHeight));

      // Lock all items to the same height
      items.forEach((it) => (it.style.height = maxH + "px"));
    }

    // Helper: recompute geometry and layout together
    function relayout() {
      equalizeItemHeights();
      updateCircle(); // also calls positionAll()
    }

    // Base angles so one item is centered at the top
    const mid = Math.floor(SLOTS / 2);
    for (let i = 0; i < SLOTS; i++) {
      baseAngles[i] = (i - mid) * gapAngle - Math.PI / 2;
    }

    // Keeps rotation offset within a reasonable range
    function normalizeRotation() {
      const twoPi = Math.PI * 2;
      if (rotationOffset > twoPi || rotationOffset < -twoPi) {
        rotationOffset = ((rotationOffset % twoPi) + twoPi) % twoPi;
        if (rotationOffset > Math.PI) rotationOffset -= twoPi;
      }
    }

    // Computes circle geometry based on container size
    function updateCircle() {
      const sliderWidth = slider.clientWidth;

      const baseRadius = sliderWidth / 2 + 1000;
      const itemWidth = items[0]?.offsetWidth || 0;

      const SPACING_FACTOR = 1.65;
      let r = baseRadius;

      // Ensure enough arc length so items do not overlap
      if (itemWidth > 0) {
        const minArc = itemWidth * SPACING_FACTOR;
        const currentArc = r * gapAngle;

        if (currentArc < minArc) {
          r = minArc / gapAngle;
        }
      }

      radius = r;
      cx = sliderWidth / 2;
      cy = radius;

      positionAll();
    }

    // Positions and rotates all items along the circle
    function positionAll() {
      items.forEach((item, index) => {
        const angle = baseAngles[index] + rotationOffset;
        const itemWidth = item.offsetWidth;

        // Convert polar coordinates to screen coordinates
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        item.style.left = x - itemWidth / 2 + "px";
        item.style.top = y + "px";

        // Rotate item tangentially to the circle
        const rotationRad = (angle + Math.PI / 2) * TILT_FACTOR;
        const rotationDeg = (rotationRad * 180) / Math.PI;
        item.style.transform = `rotate(${rotationDeg}deg)`;
      });
    }

    // Smooth snapping animation to the nearest slot
    function animateToRotation(targetRotation) {
      if (snapAnimationId !== null) {
        cancelAnimationFrame(snapAnimationId);
        snapAnimationId = null;
      }

      const startRotation = rotationOffset;
      const duration = 300;
      const startTime = performance.now();

      function frame(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);

        // Smoothstep easing
        const eased = t * t * (3 - 2 * t);

        rotationOffset =
          startRotation + (targetRotation - startRotation) * eased;

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

    // ---- Drag logic: spin & snap ----

    // Normalizes pointer position to slider-local coordinates
    function getPointerPos(evt) {
      const e = evt.touches ? evt.touches[0] : evt;
      const bounds = slider.getBoundingClientRect();
      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };
    }

    function startDrag(evt) {
      // Do not preventDefault immediately (keeps normal clicks working)
      pointerDown = true;
      moved = false;
      isDragging = false;

      const pos = getPointerPos(evt);
      startX = pos.x;
      startY = pos.y;

      dragStartAngle = Math.atan2(pos.y - cy, pos.x - cx);
      rotationAtDragStart = rotationOffset;

      document.addEventListener("mousemove", onDrag);
      document.addEventListener("touchmove", onDrag, { passive: false });
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchend", endDrag);
    }

    function onDrag(evt) {
      if (!pointerDown) return;

      const pos = getPointerPos(evt);
      const dx = pos.x - startX;
      const dy = pos.y - startY;

      // Become a drag only after passing threshold
      if (!moved) {
        if (dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) return;

        moved = true;
        isDragging = true;

        // Now it is a real drag: stop scrolling and snapping
        evt.preventDefault();

        if (snapAnimationId !== null) {
          cancelAnimationFrame(snapAnimationId);
          snapAnimationId = null;
        }

        items.forEach((it) => it.classList.add("active"));
      } else {
        evt.preventDefault();
      }

      const currentAngle = Math.atan2(pos.y - cy, pos.x - cx);
      const deltaAngle = currentAngle - dragStartAngle;

      rotationOffset = rotationAtDragStart + deltaAngle * DRAG_SPEED;

      normalizeRotation();
      positionAll();
    }

    function endDrag() {
      if (!pointerDown) return;
      pointerDown = false;

      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("touchmove", onDrag);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchend", endDrag);

      // No drag -> allow normal anchor click
      if (!moved) return;

      // Dragged -> suppress the synthetic click
      suppressClick = true;
      setTimeout(() => (suppressClick = false), 0);

      isDragging = false;

      // Snap to nearest slot
      const steps = Math.round(rotationOffset / gapAngle);
      const targetRotation = steps * gapAngle;

      normalizeRotation();
      animateToRotation(targetRotation);

      items.forEach((it) => it.classList.remove("active"));
    }

    // Button controls (previous / next)
    function goToStep(deltaSteps) {
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

    prevBtn?.addEventListener("click", () => goToStep(-1));
    nextBtn?.addEventListener("click", () => goToStep(1));

    // Initial layout and responsive handling
    requestAnimationFrame(relayout);
    window.addEventListener("resize", () => requestAnimationFrame(relayout));

    // Disable browser touch gestures that interfere with dragging
    slider.style.touchAction = "none";

    // Bind dragging behavior to each item
    items.forEach((item) => {
      item.style.cursor = "grab";

      // Prevent native link/image dragging
      item.setAttribute("draggable", "false");
      item.addEventListener("dragstart", (e) => e.preventDefault());
      item.querySelectorAll("img").forEach((img) => {
        img.draggable = false;
        img.addEventListener("dragstart", (e) => e.preventDefault());
      });

      item.addEventListener("mousedown", startDrag);
      item.addEventListener("touchstart", startDrag, { passive: false });
    });
  }

  // Expose initializer
  window.CourseDetailResponsive = { init };
})();
