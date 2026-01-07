// Intro slider (ring-style carousel) wrapped in an IIFE to keep the global scope clean
// Displays items arranged on a circular path with automatic rotation and drag interaction
(function () {
  function init() {
    // Select the main intro slider container
    const slider = document.querySelector(".intro-slider");
    if (!slider) return;

    // Prevent double initialization (important if scripts are loaded more than once)
    if (slider.dataset.introSliderInit === "1") return;
    slider.dataset.introSliderInit = "1";

    // Base items used as templates for cloning around the ring
    const templateItems = Array.from(slider.querySelectorAll(".intro-item"));
    if (!templateItems.length) return;

    const templateCount = templateItems.length;

    // Configuration constants controlling layout and motion
    const GAP_DEG = 22; // desired angular gap between neighboring items (degrees)
    const TILT_FACTOR = 1; // controls item rotation tangent strength (1 = full tangent)
    const AUTO_SPEED = 0.0015; // automatic rotation speed (radians per frame)

    // Convert desired gap to radians and estimate total slots needed for a full circle
    const desiredGapRad = (GAP_DEG * Math.PI) / 180;
    const approxSlots = (2 * Math.PI) / desiredGapRad;

    // Determine how many times templates must repeat to fill the ring smoothly
    let repeatCount = Math.max(2, Math.round(approxSlots / templateCount));
    const SLOTS = templateCount * repeatCount;
    const gapAngle = (2 * Math.PI) / SLOTS;

    // Arrays holding all ring items and their base angles
    const items = [];
    const baseAngles = [];

    // Geometry and rotation state
    let radius = 0,
      cx = 0,
      cy = 0;
    let rotationOffset = 0;

    // Drag interaction state
    let isDragging = false;
    let draggedIndex = null;

    // --- Build ring: clone the templates into SLOTS positions --- //
    for (let i = 0; i < SLOTS; i++) {
      const src = templateItems[i % templateCount];
      let item;

      // Use original items first, then clone as needed
      if (i < templateCount) {
        item = src;
      } else {
        item = src.cloneNode(true);
        item.dataset.clone = "1";
        slider.appendChild(item);
      }

      // Absolute positioning allows free placement on the circular path
      item.style.position = "absolute";
      item.style.transformOrigin = "50% 0%";
      item.dataset.slotIndex = i;

      items.push(item);
    }

    // Center one slot at the top (-π/2) and distribute others evenly around the ring
    const mid = Math.floor(SLOTS / 2);
    for (let i = 0; i < SLOTS; i++) {
      baseAngles[i] = (i - mid) * gapAngle - Math.PI / 2;
    }

    // Computes circle geometry based on slider width
    function updateCircle() {
      const sliderWidth = slider.clientWidth;
      if (!sliderWidth) return;

      // Radius extended to place items outside the visible center
      radius = sliderWidth / 2 + 400;
      cx = sliderWidth / 2;
      cy = radius;

      positionAll();
    }

    // Positions and rotates all items according to their angle on the ring
    function positionAll() {
      items.forEach((item, index) => {
        const angle = baseAngles[index] + rotationOffset;
        const itemWidth = item.offsetWidth;

        // Convert polar coordinates to Cartesian
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        item.style.left = x - itemWidth / 2 + "px";
        item.style.top = y + "px";

        // Rotate item to follow the tangent of the ring
        const rotationRad = (angle + Math.PI / 2) * TILT_FACTOR;
        const rotationDeg = (rotationRad * 180) / Math.PI;
        item.style.transform = `rotate(${rotationDeg}deg)`;
      });
    }

    // Normalizes mouse and touch events into slider-local coordinates
    function getPointerPos(evt) {
      const e = evt.touches ? evt.touches[0] : evt;
      const bounds = slider.getBoundingClientRect();

      return {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };
    }

    // Starts a drag interaction on an item
    function startDrag(evt) {
      evt.preventDefault();
      const item = evt.currentTarget;

      isDragging = true;
      draggedIndex = Number(item.dataset.slotIndex);

      // Visual feedback during drag
      slider.style.cursor = "grabbing";
      items.forEach((it) => (it.style.cursor = "grabbing"));

      onDrag(evt);

      // Bind global move/end listeners for smooth dragging
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("touchmove", onDrag, { passive: false });
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchend", endDrag);
    }

    // Updates rotation offset based on pointer angle
    function onDrag(evt) {
      if (!isDragging) return;
      evt.preventDefault();

      const pos = getPointerPos(evt);
      const angle = Math.atan2(pos.y - cy, pos.x - cx);

      rotationOffset = angle - baseAngles[draggedIndex];
      positionAll();
    }

    // Ends drag interaction and restores default cursor
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

    // Automatic animation loop for continuous rotation
    function animate() {
      if (!isDragging) {
        rotationOffset += AUTO_SPEED;

        // Normalize rotation offset to avoid unbounded growth
        if (rotationOffset > Math.PI * 2) rotationOffset -= Math.PI * 2;
        if (rotationOffset < -Math.PI * 2) rotationOffset += Math.PI * 2;
      }

      positionAll();
      requestAnimationFrame(animate);
    }

    // Initial setup and responsive handling
    updateCircle();
    window.addEventListener("resize", updateCircle);

    // Enable dragging on each item
    items.forEach((item) => {
      item.style.cursor = "grab";
      item.addEventListener("mousedown", startDrag);
      item.addEventListener("touchstart", startDrag, { passive: false });
    });

    // Start automatic animation
    animate();
  }

  // Expose a minimal public API for controlled initialization
  window.IntroSlider = { init };
})();
