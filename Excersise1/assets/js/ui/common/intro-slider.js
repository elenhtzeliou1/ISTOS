// intro-slider (ring carousel)
(function () {
  function init() {
    const slider = document.querySelector(".intro-slider");
    if (!slider) return;

    // prevent double init (important if scripts are accidentally loaded twice)
    if (slider.dataset.introSliderInit === "1") return;
    slider.dataset.introSliderInit = "1";

    const templateItems = Array.from(slider.querySelectorAll(".intro-item"));
    if (!templateItems.length) return;

    const templateCount = templateItems.length;

    const GAP_DEG = 22; // desired gap between neighbours in degrees
    const TILT_FACTOR = 1; // 1 = full tangent, <1 = softer tilt
    const AUTO_SPEED = 0.0015; // radians per frame

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
    let draggedIndex = null;

    // --- Build ring: clone the templates into SLOTS positions --- //
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

    // Center one slot at the TOP (-π/2) and step by gapAngle
    const mid = Math.floor(SLOTS / 2);
    for (let i = 0; i < SLOTS; i++) {
      baseAngles[i] = (i - mid) * gapAngle - Math.PI / 2;
    }

    function updateCircle() {
      const sliderWidth = slider.clientWidth;
      if (!sliderWidth) return;

      radius = sliderWidth / 2 + 400;
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

    function animate() {
      if (!isDragging) {
        rotationOffset += AUTO_SPEED;

        if (rotationOffset > Math.PI * 2) rotationOffset -= Math.PI * 2;
        if (rotationOffset < -Math.PI * 2) rotationOffset += Math.PI * 2;
      }

      positionAll();
      requestAnimationFrame(animate);
    }

    updateCircle();
    window.addEventListener("resize", updateCircle);

    items.forEach((item) => {
      item.style.cursor = "grab";
      item.addEventListener("mousedown", startDrag);
      item.addEventListener("touchstart", startDrag, { passive: false });
    });

    animate();
  }

  window.IntroSlider = { init };
})();
