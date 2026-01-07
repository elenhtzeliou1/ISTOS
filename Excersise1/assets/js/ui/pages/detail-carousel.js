// Ring carousel used in the header of categories.html
// Implements a circular (ring) layout with drag, snap, and button controls
(function () {
  function init() {
    // Main slider container
    const slider = document.querySelector(".goal-slider");
    if (!slider) return;

    // Prevent double initialization (e.g. script loaded twice)
    if (slider.dataset.ringBound === "1") return;
    slider.dataset.ringBound = "1";

    // Base items used as templates for cloning
    const templateItems = Array.from(slider.querySelectorAll(".goal-item"));
    if (!templateItems.length) return;

    const templateCount = templateItems.length;

    // Visual / interaction constants
    const GAP_DEG = 20.5;       // angular gap between items
    const TILT_FACTOR = 1;      // rotation tilt factor
    const DRAG_SPEED = 1.8;     // drag sensitivity multiplier

    // Compute how many slots are needed to fill the circle
    const desiredGapRad = (GAP_DEG * Math.PI) / 180;
    const approxSlots = (2 * Math.PI) / desiredGapRad;
    let repeatCount = Math.max(2, Math.round(approxSlots / templateCount));
    const SLOTS = templateCount * repeatCount;

    const gapAngle = (2 * Math.PI) / SLOTS;

    // Arrays holding all carousel items and their base angles
    const items = [];
    const baseAngles = [];

    // Circle geometry
    let radius = 0,
      cx = 0,
      cy = 0;
    let rotationOffset = 0;

    // Drag state
    let isDragging = false;
    let dragStartAngle = 0;
    let rotationAtDragStart = 0;

    // Snap animation state
    let snapAnimationId = null;

    // Separate click vs drag handling
    const DRAG_THRESHOLD_PX = 5;
    let pointerDown = false;
    let moved = false;
    let startX = 0,
      startY = 0;
    let suppressClick = false;

    // Cancel link navigation only if a drag actually happened
    slider.addEventListener(
      "click",
      (e) => {
        if (!suppressClick) return;
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );

    // Build the circular ring by cloning templates into SLOTS
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

    // Force all items to share the same height (avoids layout jumps)
    function equalizeItemHeights() {
      // Reset height for measurement
      items.forEach((it) => (it.style.height = "auto"));

      // Measure tallest item
      const maxH = Math.max(...items.map((it) => it.scrollHeight));

      // Apply uniform height
      items.forEach((it) => (it.style.height = maxH + "px"));
    }

    // Recompute heights + circle geometry together
    function relayout() {
      equalizeItemHeights();
      updateCircle(); // also positions items
    }

    // Precompute base angles (centered vertically at top)
    const mid = Math.floor(SLOTS / 2);
    for (let i = 0; i < SLOTS; i++) {
      baseAngles[i] = (i - mid) * gapAngle - Math.PI / 2;
    }

    // Keep rotationOffset within [-π, π] range
    function normalizeRotation() {
      const twoPi = Math.PI * 2;
      if (rotationOffset > twoPi || rotationOffset < -twoPi) {
        rotationOffset = ((rotationOffset % twoPi) + twoPi) % twoPi;
        if (rotationOffset > Math.PI) rotationOffset -= twoPi;
      }
    }

    // Compute circle radius and center based on container width
    function updateCircle() {
      const sliderWidth = slider.clientWidth;

      const baseRadius = sliderWidth / 2 + 1000;
      const itemWidth = items[0]?.offsetWidth || 0;
      const SPACING_FACTOR = 1.65;

      let r = baseRadius;

      // Ensure enough arc length to avoid item overlap
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

    // Position and rotate all items around the circle
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

    // Animate snapping to nearest slot
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

    // Helper: pointer position relative to slider
    function getPointerPos(evt) {
      const e = evt.touches ? evt.touches[0] : evt;
      const bounds = slider.getBoundingClientRect();
      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };
    }

    // Start drag interaction
    function startDrag(evt) {
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

    // Handle dragging motion
    function onDrag(evt) {
      if (!pointerDown) return;

      const pos = getPointerPos(evt);
      const dx = pos.x - startX;
      const dy = pos.y - startY;

      // Activate drag only after movement threshold
      if (!moved) {
        if (dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) return;

        moved = true;
        isDragging = true;

        evt.preventDefault();

        // Stop any snapping animation
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

    // End drag and snap to nearest item
    function endDrag() {
      if (!pointerDown) return;
      pointerDown = false;

      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("touchmove", onDrag);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchend", endDrag);

      // If no drag occurred, allow normal click
      if (!moved) return;

      // Suppress click generated after drag
      suppressClick = true;
      setTimeout(() => (suppressClick = false), 0);

      isDragging = false;

      const steps = Math.round(rotationOffset / gapAngle);
      const targetRotation = steps * gapAngle;

      normalizeRotation();
      animateToRotation(targetRotation);

      items.forEach((it) => it.classList.remove("active"));
    }

    // Button-based navigation (previous / next)
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

    // Initial layout and resize handling
    requestAnimationFrame(relayout);
    window.addEventListener("resize", () => requestAnimationFrame(relayout));

    // Disable native touch gestures
    slider.style.touchAction = "none";

    // Bind drag handlers to each item
    items.forEach((item) => {
      item.style.cursor = "grab";

      // Prevent native dragging of links/images
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
