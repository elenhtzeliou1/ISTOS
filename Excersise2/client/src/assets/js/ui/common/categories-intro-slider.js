// the carousel from the header of categories.html
(function () {
  function init() {
    const slider = document.querySelector(".goal-slider");
    if (!slider) return;

    // If Angular hasn't rendered items yet, wait and retry once items appear
    const templateItemsNow = slider.querySelectorAll(".goal-item");
    if (!templateItemsNow.length) {
      if (slider._waitGoalItems) return;
      slider._waitGoalItems = true;

      const mo = new MutationObserver(() => {
        const items = slider.querySelectorAll(".goal-item");
        if (items.length) {
          mo.disconnect();
          slider._waitGoalItems = false;
          init();
        }
      });
      mo.observe(slider, { childList: true, subtree: false });
      return;
    }

    // preventing double init 
    if (slider.dataset.ringBound === "1") return;
    slider.dataset.ringBound = "1";

    const templateItems = Array.from(slider.querySelectorAll(".goal-item"));
    const templateCount = templateItems.length;

    const GAP_DEG = 20.5;
    const TILT_FACTOR = 1;
    const DRAG_SPEED = 1.8;

    const desiredGapRad = (GAP_DEG * Math.PI) / 180;
    const approxSlots = (2 * Math.PI) / desiredGapRad;
    let repeatCount = Math.max(2, Math.round(approxSlots / templateCount));
    const SLOTS = templateCount * repeatCount;

    const gapAngle = (2 * Math.PI) / SLOTS;

    const items = [];
    const baseAngles = [];

    let radius = 0,
      cx = 0,
      cy = 0;
    let rotationOffset = 0;

    let isDragging = false;
    let dragStartAngle = 0;
    let rotationAtDragStart = 0;

    let snapAnimationId = null;

    const DRAG_THRESHOLD_PX = 5;
    let pointerDown = false;
    let moved = false;
    let startX = 0,
      startY = 0;
    let suppressClick = false;

    //slider :
    slider.addEventListener(
      "click",
      (e) => {
        const a = e.target?.closest?.(".goal-item");
        if (!a) return;

        // if a drag happened, block the click
        if (suppressClick) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // normal click -> smooth scroll to section id
        const href = a.getAttribute("href") || "";
        if (href.startsWith("#")) {
          const id = href.slice(1);
          const target = document.getElementById(id);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            // keep URL fragment in sync (optional but nice)
            history.replaceState(null, "", href);
          }
        }
      },
      true
    );

    // Build ring
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

    function equalizeItemHeights() {
      items.forEach((it) => (it.style.height = "auto"));
      const maxH = Math.max(...items.map((it) => it.scrollHeight));
      items.forEach((it) => (it.style.height = maxH + "px"));
    }

    function relayout() {
      equalizeItemHeights();
      updateCircle();
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

    function updateCircle() {
      const sliderWidth = slider.clientWidth;
      const baseRadius = sliderWidth / 2 + 1000;

      const itemWidth = items[0]?.offsetWidth || 0;
      const SPACING_FACTOR = 1.65;

      let r = baseRadius;
      if (itemWidth > 0) {
        const minArc = itemWidth * SPACING_FACTOR;
        const currentArc = r * gapAngle;
        if (currentArc < minArc) r = minArc / gapAngle;
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

    function getPointerPos(evt) {
      const e = evt.touches ? evt.touches[0] : evt;
      const bounds = slider.getBoundingClientRect();
      return { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
    }

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

    function onDrag(evt) {
      if (!pointerDown) return;

      const pos = getPointerPos(evt);
      const dx = pos.x - startX;
      const dy = pos.y - startY;

      if (!moved) {
        if (dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) return;

        moved = true;
        isDragging = true;
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

      if (!moved) return;

      suppressClick = true;
      setTimeout(() => (suppressClick = false), 0);

      isDragging = false;

      const steps = Math.round(rotationOffset / gapAngle);
      const targetRotation = steps * gapAngle;

      normalizeRotation();
      animateToRotation(targetRotation);

      items.forEach((it) => it.classList.remove("active"));
    }

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

    requestAnimationFrame(relayout);
    window.addEventListener("resize", () => requestAnimationFrame(relayout));

    slider.style.touchAction = "none";

    items.forEach((item) => {
      item.style.cursor = "grab";

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

  window.CategoriesIntroSlider = { init };
})();

