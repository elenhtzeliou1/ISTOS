import { Injectable } from '@angular/core';

/**
 * Extend the global Window interface so TypeScript knows about
 * the custom UI scripts you attach to window (likely loaded from static JS files).
 *
 * This prevents TypeScript errors like:
 * "Property 'AccordionUI' does not exist on type 'Window'."
 */
declare global {
  interface Window {
    // Accordion controller (optional selector to scope init)
    AccordionUI?: { init: (selector?: string) => void };

    // Drag-to-scroll carousel helper (optional selector)
    CardCarouselDrag?: { init: (selector?: string) => void };

    // Hero/intro slider script for homepage/sections
    IntroSlider?: { init: () => void };

    // "Reveal on scroll" for course items/cards
    CourseItemsReveal?: { init: (selector?: string, visibleClass?: string) => void };

    // Proposed courses carousel (homepage / courses page)
    ProposedCoursesCarousel?: { init: () => void };

    // Generic reveal/animation utility (some versions also provide refresh)
    RevealUI?: { init: () => void; refresh?: () => void };

    // Filtering UI helper (returns instance or something depending on implementation)
    FilterUI?: { init: (opts?: any) => any };

    // Modal initialization script
    Modals?: { init: () => void };
  }
}

/**
 * UiInitService
 *
 * Central place to initialize all external (non-Angular) UI scripts.
 * This is useful because:
 * - Angular re-renders DOM dynamically (ngFor, routing, etc.)
 * - external scripts often need to bind event listeners AFTER DOM exists
 *
 * You call initCommon() in ngAfterViewInit (or after data loads) to re-bind.
 */
@Injectable({ providedIn: 'root' })
export class UiInitService {
  /**
   * Initializes commonly used UI scripts.
   *
   * Uses requestAnimationFrame to run after the browser has a chance to paint,
   * improving the chance that the DOM elements exist before scripts bind.
   *
   * Each script is optional (?.) so the app won't crash if a script
   * isn't loaded on a specific page.
   */
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
