import { Injectable } from '@angular/core';

declare global {
  interface Window {
    AccordionUI?: { init: (selector?: string) => void };
    CardCarouselDrag?: { init: (selector?: string) => void };
    IntroSlider?: { init: () => void };
    CourseItemsReveal?: { init: (selector?: string, visibleClass?: string) => void };
    ProposedCoursesCarousel?: { init: () => void };
    RevealUI?: { init: () => void; refresh?: () => void };
    FilterUI?: { init: (opts?: any) => any };
    Modals?: { init: () => void };
  }
}

@Injectable({ providedIn: 'root' })
export class UiInitService {
  initCommon(): void {
    requestAnimationFrame(() => {
      window.IntroSlider?.init();
      window.RevealUI?.init();
      window.AccordionUI?.init();
      window.CardCarouselDrag?.init();
      window.CourseItemsReveal?.init();
      window.ProposedCoursesCarousel?.init();
      window.FilterUI?.init?.();
      window.Modals?.init?.();
    });
  }
}
