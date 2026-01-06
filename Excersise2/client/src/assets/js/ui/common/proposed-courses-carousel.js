// proposed courses carousel (safe init + rebuild)
(function () {
  class DraggingEvent {
    constructor(target = undefined) {
      this.target = target;
    }

    event(callback) {
      let handler;

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

    getDistance(callback) {
      function distanceInit(e1) {
        let startingX, startingY;

        if ("touches" in e1) {
          startingX = e1.touches[0].clientX;
          startingY = e1.touches[0].clientY;
        } else {
          startingX = e1.clientX;
          startingY = e1.clientY;
        }

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

  class CardCarousel extends DraggingEvent {
    constructor(container) {
      super(container);

      this.container = container;
      this.cards = container.querySelectorAll(".proposed-video-card");
      if (!this.cards.length) return;

      this.centerIndex = (this.cards.length - 1) / 2;

      // IMPORTANT: use getBoundingClientRect (more reliable on hard reload)
      const cw = this.container.getBoundingClientRect().width || this.container.offsetWidth;
      const iw = this.cards[0].getBoundingClientRect().width || this.cards[0].offsetWidth;
      this.cardWidth = cw ? (iw / cw) * 100 : 0;

      this.xScale = {};

      this.dragThreshold = 5;
      this.hasDragged = false;

      this.container.addEventListener("mousedown", () => (this.hasDragged = false));
      this.container.addEventListener("touchstart", () => (this.hasDragged = false));

      this.container.addEventListener(
        "click",
        (e) => {
          if (this.hasDragged) {
            e.preventDefault();
            e.stopPropagation();
            this.hasDragged = false;
          }
        },
        true
      );

      window.addEventListener("resize", this.updateCardWidth.bind(this));

      this.build();
      super.getDistance(this.moveCards.bind(this));
    }

    updateCardWidth() {
      if (!this.cards.length) return;

      const cw = this.container.getBoundingClientRect().width || this.container.offsetWidth;
      const iw = this.cards[0].getBoundingClientRect().width || this.cards[0].offsetWidth;
      this.cardWidth = cw ? (iw / cw) * 100 : this.cardWidth;

      this.build();
    }

    build() {
      // reset mapping each build (important when rebuilding)
      this.xScale = {};

      for (let i = 0; i < this.cards.length; i++) {
        const x = i - this.centerIndex;
        const scale = this.calcScale(x);
        const scale2 = this.calcScale2(x);
        const zIndex = -Math.abs(i - this.centerIndex);
        const leftPos = this.calcPos(x, scale2);
        const tilt = this.calcTilt(x);

        this.xScale[x] = this.cards[i];

        this.updateCards(this.cards[i], { x, scale, leftPos, zIndex, tilt });
      }
    }

    calcPos(x, scale) {
      if (x < 0) return (scale * 100 - this.cardWidth) / 2;
      return 100 - (scale * 100 + this.cardWidth) / 2;
    }

    updateCards(card, data) {
      if (data.x || data.x === 0) card.setAttribute("data-x", data.x);

      const tilt = data.tilt !== undefined ? data.tilt : 0;

      if (data.scale || data.scale === 0) {
        card.style.transform = `translateY(-50%) scale(${data.scale}) rotate(${tilt}deg)`;
        card.style.opacity = data.scale === 0 ? 0 : 1;
      }

      if (data.leftPos !== undefined) card.style.left = `${data.leftPos}%`;

      if (data.zIndex || data.zIndex === 0) {
        if (data.zIndex === 0) card.classList.add("highlight");
        else card.classList.remove("highlight");

        card.style.zIndex = data.zIndex;
      }
    }

    calcScale2(x) {
      if (x <= 0) return 1 - (-1 / 3) * x;
      return 1 - (1 / 3) * x;
    }

    calcScale(x) {
      const formula = 1 - (1 / 5) * Math.pow(x, 2);
      return formula <= 0 ? 0 : formula;
    }

    calcTilt(x) {
      return x * 6;
    }

    checkOrdering(card, x, xDist) {
      const original = parseInt(card.dataset.x);
      const rounded = Math.round(xDist);
      let newX = x;

      if (x !== x + rounded) {
        if (x + rounded > original) {
          if (x + rounded > this.centerIndex) {
            newX = x + rounded - 1 - this.centerIndex - rounded + -this.centerIndex;
          }
        } else if (x + rounded < original) {
          if (x + rounded < -this.centerIndex) {
            newX = x + rounded + 1 + this.centerIndex - rounded + this.centerIndex;
          }
        }

        this.xScale[newX + rounded] = card;
      }

      const temp = -Math.abs(newX + rounded);
      this.updateCards(card, { zIndex: temp });

      return newX;
    }

    moveCards(data) {
      let xDist;

      if (data != null) {
        this.container.classList.remove("smooth-return");
        xDist = data.x / 200;

        if (Math.abs(data.x) > this.dragThreshold) this.hasDragged = true;
      } else {
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

      for (let i = 0; i < this.cards.length; i++) {
        const x = this.checkOrdering(this.cards[i], parseInt(this.cards[i].dataset.x), xDist);

        const scale = this.calcScale(x + xDist);
        const scale2 = this.calcScale2(x + xDist);
        const leftPos = this.calcPos(x + xDist, scale2);
        const tilt = this.calcTilt(x + xDist);

        this.updateCards(this.cards[i], { scale, leftPos, tilt });
      }
    }
  }

  function resetInlineStyles(cards) {
    cards.forEach((card) => {
      card.style.left = "";
      card.style.transform = "";
      card.style.zIndex = "";
      card.style.opacity = "";
    });
  }

  function init(tries = 0) {
    const cardsContainer = document.querySelector(".proposed-video-carousel");
    if (!cardsContainer) return;

    const cards = cardsContainer.querySelectorAll(".proposed-video-card");
    if (!cards.length) {
      // cards not rendered yet -> try a bit later
      if (tries < 60) requestAnimationFrame(() => init(tries + 1));
      return;
    }

    // Wait until CSS is applied (on hard reload this is the real problem)
    // Carousel expects absolute-positioned cards.
    const pos = getComputedStyle(cards[0]).position;
    if (pos !== "absolute") {
      if (tries < 60) requestAnimationFrame(() => init(tries + 1));
      return;
    }

    // Force layout BEFORE measuring 
    cardsContainer.getBoundingClientRect();
    cards[0].getBoundingClientRect();

    resetInlineStyles(cards);

    // Rebuild if already exists
    if (cardsContainer.__carouselInstance?.build) {
      const inst = cardsContainer.__carouselInstance;

      inst.cards = cardsContainer.querySelectorAll(".proposed-video-card");
      inst.centerIndex = (inst.cards.length - 1) / 2;

      const cw = cardsContainer.getBoundingClientRect().width || cardsContainer.offsetWidth;
      const iw = inst.cards[0].getBoundingClientRect().width || inst.cards[0].offsetWidth;
      inst.cardWidth = cw ? (iw / cw) * 100 : inst.cardWidth;

      inst.build();
      return;
    }

    cardsContainer.__carouselInstance = new CardCarousel(cardsContainer);
  }

  window.ProposedCoursesCarousel = { init };
})();
