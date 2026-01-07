// Proposed courses carousel (draggable, centered card carousel)
// Wrapped in an IIFE to avoid leaking variables into the global scope
(function () {
  // Generic dragging utility class
  // Normalizes mouse and touch dragging into a single abstraction
  class DraggingEvent {
    constructor(target = undefined) {
      this.target = target;
    }

    // Registers a dragging lifecycle and delegates movement handling to a callback
    event(callback) {
      let handler;

      // Mouse-based dragging
      this.target.addEventListener("mousedown", (e) => {
        e.preventDefault();
        handler = callback(e);

        window.addEventListener("mousemove", handler);
        document.addEventListener("mouseleave", clearDraggingEvent);
        window.addEventListener("mouseup", clearDraggingEvent);

        function clearDraggingEvent() {
          window.removeEventListener("mousemove", handler);
          window.removeEventListener("mouseup", clearDraggingEvent);
          document.removeEventListener("mouseleave", clearDraggingEvent);
          handler(null);
        }
      });

      // Touch-based dragging
      this.target.addEventListener("touchstart", (e) => {
        handler = callback(e);

        window.addEventListener("touchmove", handler);
        window.addEventListener("touchend", clearDraggingEvent);
        document.body.addEventListener("mouseleave", clearDraggingEvent);

        function clearDraggingEvent() {
          window.removeEventListener("touchmove", handler);
          window.removeEventListener("touchend", clearDraggingEvent);
          handler(null);
        }
      });
    }

    // Calculates pointer distance relative to the drag start position
    getDistance(callback) {
      function distanceInit(e1) {
        let startingX, startingY;

        // Capture initial pointer position
        if ("touches" in e1) {
          startingX = e1.touches[0].clientX;
          startingY = e1.touches[0].clientY;
        } else {
          startingX = e1.clientX;
          startingY = e1.clientY;
        }

        // Return a handler that reports deltas on each move
        return function (e2) {
          if (e2 === null) return callback(null);

          if ("touches" in e2) {
            return callback({
              x: e2.touches[0].clientX - startingX,
              y: e2.touches[0].clientY - startingY,
            });
          }

          return callback({
            x: e2.clientX - startingX,
            y: e2.clientY - startingY,
          });
        };
      }

      this.event(distanceInit);
    }
  }

  // Card carousel implementation extending the generic dragging logic
  class CardCarousel extends DraggingEvent {
    constructor(container) {
      super(container);

      this.container = container;
      this.cards = container.querySelectorAll(".proposed-video-card");
      if (!this.cards.length) return;

      // Determine the visual center card
      this.centerIndex = (this.cards.length - 1) / 2;

      // Card width as a percentage of container width
      this.cardWidth =
        (this.cards[0].offsetWidth / this.container.offsetWidth) * 100;

      // Map of logical x-positions to card elements
      this.xScale = {};

      // Drag vs click handling
      this.dragThreshold = 5; // pixels before treating interaction as a drag
      this.hasDragged = false;

      // Reset drag state on new interaction
      this.container.addEventListener("mousedown", () => {
        this.hasDragged = false;
      });
      this.container.addEventListener("touchstart", () => {
        this.hasDragged = false;
      });

      // Cancel click events if a drag actually occurred
      this.container.addEventListener(
        "click",
        (e) => {
          if (this.hasDragged) {
            e.preventDefault();
            e.stopPropagation();
            this.hasDragged = false;
          }
        },
        true // capture phase to intercept before links
      );

      // Recalculate layout on resize
      window.addEventListener("resize", this.updateCardWidth.bind(this));

      // Initial layout build and drag binding
      this.build();
      super.getDistance(this.moveCards.bind(this));
    }

    // Updates card width percentage on resize
    updateCardWidth() {
      if (!this.cards.length) return;

      this.cardWidth =
        (this.cards[0].offsetWidth / this.container.offsetWidth) * 100;
      this.build();
    }

    // Computes initial layout for all cards
    build() {
      for (let i = 0; i < this.cards.length; i++) {
        const x = i - this.centerIndex;
        const scale = this.calcScale(x);
        const scale2 = this.calcScale2(x);
        const zIndex = -Math.abs(i - this.centerIndex);
        const leftPos = this.calcPos(x, scale2);
        const tilt = this.calcTilt(x);

        this.xScale[x] = this.cards[i];

        this.updateCards(this.cards[i], {
          x,
          scale,
          leftPos,
          zIndex,
          tilt,
        });
      }
    }

    // Calculates horizontal position based on scale and side
    calcPos(x, scale) {
      let formula;

      if (x < 0) {
        formula = (scale * 100 - this.cardWidth) / 2;
        return formula;
      } else {
        formula = 100 - (scale * 100 + this.cardWidth) / 2;
        return formula;
      }
    }

    // Applies computed styles and attributes to a card
    updateCards(card, data) {
      if (data.x || data.x === 0) {
        card.setAttribute("data-x", data.x);
      }

      const tilt = data.tilt !== undefined ? data.tilt : 0;

      if (data.scale || data.scale === 0) {
        card.style.transform = `translateY(-50%) scale(${data.scale}) rotate(${tilt}deg)`;
        card.style.opacity = data.scale === 0 ? 0 : 1;
      }

      if (data.leftPos !== undefined) {
        card.style.left = `${data.leftPos}%`;
      }

      if (data.zIndex || data.zIndex === 0) {
        if (data.zIndex === 0) card.classList.add("highlight");
        else card.classList.remove("highlight");

        card.style.zIndex = data.zIndex;
      }
    }

    // Secondary scale curve for spacing calculation
    calcScale2(x) {
      if (x <= 0) return 1 - (-1 / 3) * x;
      return 1 - (1 / 3) * x;
    }

    // Primary scale curve for depth effect
    calcScale(x) {
      const formula = 1 - (1 / 5) * Math.pow(x, 2);
      return formula <= 0 ? 0 : formula;
    }

    // Calculates rotation tilt based on horizontal offset
    calcTilt(x) {
      return x * 6;
    }

    // Ensures cards wrap correctly when dragged past bounds
    checkOrdering(card, x, xDist) {
      const original = parseInt(card.dataset.x);
      const rounded = Math.round(xDist);
      let newX = x;

      if (x !== x + rounded) {
        if (x + rounded > original) {
          if (x + rounded > this.centerIndex) {
            newX =
              x + rounded - 1 - this.centerIndex - rounded + -this.centerIndex;
          }
        } else if (x + rounded < original) {
          if (x + rounded < -this.centerIndex) {
            newX =
              x + rounded + 1 + this.centerIndex - rounded + this.centerIndex;
          }
        }

        this.xScale[newX + rounded] = card;
      }

      const temp = -Math.abs(newX + rounded);
      this.updateCards(card, { zIndex: temp });

      return newX;
    }

    // Handles dragging movement and release behavior
    moveCards(data) {
      let xDist;

      if (data != null) {
        // Active drag
        this.container.classList.remove("smooth-return");
        xDist = data.x / 200; // controls drag sensitivity

        // Detect true drag vs click
        if (Math.abs(data.x) > this.dragThreshold) {
          this.hasDragged = true;
        }
      } else {
        // Drag release: smoothly return cards to snapped positions
        this.container.classList.add("smooth-return");
        xDist = 0;

        for (let x in this.xScale) {
          const numX = Number(x);
          this.updateCards(this.xScale[x], {
            x: numX,
            scale: this.calcScale(numX),
            leftPos: this.calcPos(numX, this.calcScale2(numX)),
            zIndex: Math.abs(Math.abs(numX) - this.centerIndex),
            tilt: this.calcTilt(numX),
          });
        }
      }

      // Update all cards based on drag offset
      for (let i = 0; i < this.cards.length; i++) {
        const x = this.checkOrdering(
          this.cards[i],
          parseInt(this.cards[i].dataset.x),
          xDist
        );

        const scale = this.calcScale(x + xDist);
        const scale2 = this.calcScale2(x + xDist);
        const leftPos = this.calcPos(x + xDist, scale2);
        const tilt = this.calcTilt(x + xDist);

        this.updateCards(this.cards[i], {
          scale,
          leftPos,
          tilt,
        });
      }
    }
  }

  // Initializes the proposed courses carousel
  function init() {
    const cardsContainer = document.querySelector(".proposed-video-carousel");
    if (!cardsContainer) return;

    const cards = cardsContainer.querySelectorAll(".proposed-video-card");
    if (!cards.length) return;

    new CardCarousel(cardsContainer);
  }

  // Expose a minimal public API
  window.ProposedCoursesCarousel = { init };
})();
