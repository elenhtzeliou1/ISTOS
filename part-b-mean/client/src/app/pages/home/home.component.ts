import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService, Course, Book, Video, Category } from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Optional reference to the categories accordion container in the template.
   * This can be used if you want to scope DOM queries or check render status.
   */
  @ViewChild('categoriesAccordion') categoriesAccordion?: ElementRef<HTMLElement>;

  // Proposed/recommended content shown on the homepage
  proposedCourses: Course[] = [];
  proposedBooks: Book[] = [];
  proposedVideos: Video[] = [];

  // Small preview list of categories (top N categories)
  categoriesPreview: Category[] = [];

  /**
   * Used to stop subscriptions when the component is destroyed,
   * preventing memory leaks and duplicate event bindings.
   */
  private destroy$ = new Subject<void>();

  /**
   * Prevents initializing common UI scripts multiple times.
   */
  private uiInited = false;

  constructor(
    // Service responsible for REST API calls (backend)
    private api: ApiService,

    // Initializes shared external UI scripts (RevealUI, AccordionUI, etc.)
    private ui: UiInitService,

    /**
     * Used to control Angular zone behavior:
     * - runOutsideAngular for heavy DOM scripts (performance)
     * - onStable to wait for Angular to finish rendering
     */
    private zone: NgZone,

    /**
     * Allows manually triggering UI refresh (useful after async updates
     * or when code runs outside Angular zone).
     */
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load all homepage sections in parallel
    this.loadProposedBooks();
    this.loadProposedCourses();
    this.loadProposedVideos();
    this.loadCategoriesPreview();
  }

  ngAfterViewInit(): void {
    /**
     * Initialize common UI scripts once after view render.
     * Keeps existing template animations/interactions working.
     */
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;
    }
  }

  ngOnDestroy(): void {
    // Signal completion to any streams using takeUntil(destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads proposed/recommended courses for the homepage carousel.
   * After Angular renders the ngFor list, initializes the carousel script.
   */
  loadProposedCourses(): void {
    this.api.getProposedCourses(5).subscribe({
      next: (data) => {
        this.proposedCourses = data ?? [];
        this.cdr.detectChanges();

        // After Angular paints the cards, init the external carousel
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickCarouselInit();
        });
      },
      error: () => {
        // Fail gracefully: show empty section instead of breaking page
        this.proposedCourses = [];
      },
    });
  }

  /**
   * Initializes the proposed courses carousel (external UI script).
   * Multiple attempts help handle timing issues on:
   * - hard reload
   * - mobile layout shifts
   * - fonts loading after first paint
   */
  private kickCarouselInit(): void {
    const call = () => (window as any).ProposedCoursesCarousel?.init?.();

    // Run outside Angular to avoid triggering extra change detection
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => call());
      setTimeout(() => call(), 120);
      setTimeout(() => call(), 500);

      // Fonts can shift widths after first paint -> re-init after fonts ready
      const fonts: any = (document as any).fonts;
      if (fonts?.ready) {
        fonts.ready.then(() => call()).catch(() => {});
      }
    });
  }

  /**
   * Loads proposed/recommended books for the homepage book carousel.
   * After Angular renders the cards, binds the drag/scroll behavior.
   */
  loadProposedBooks(): void {
    this.api.getProposedBooks(4).subscribe({
      next: (data) => {
        this.proposedBooks = data ?? [];
        this.cdr.detectChanges();

        // Bind drag AFTER Angular renders the cards
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickBookCarouselDrag();
        });
      },
      error: () => {
        this.proposedBooks = [];
      },
    });
  }

  /**
   * Initializes drag behavior for the book carousel.
   * Uses repeated attempts for robustness across browsers/layout timing.
   */
  private kickBookCarouselDrag(): void {
    const call = () =>
      (window as any).CardCarouselDrag?.init?.('#prefered-books-wrapper');

    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => call());
      setTimeout(() => call(), 120);
      setTimeout(() => call(), 500);

      // Fonts can affect element widths -> retry after fonts load
      const fonts: any = (document as any).fonts;
      if (fonts?.ready) fonts.ready.then(() => call()).catch(() => {});
    });
  }

  /**
   * Loads proposed/recommended videos for the homepage.
   * No extra scripts required (plain list/grid).
   */
  loadProposedVideos(): void {
    this.api.getProposedVideos(3).subscribe({
      next: (data) => {
        this.proposedVideos = data ?? [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.proposedVideos = [];
      },
    });
  }

  // ------------------------------------------------------------------
  // Template helpers
  // ------------------------------------------------------------------

  /**
   * Limits text to a maximum number of words for card previews.
   */
  sliceWords(text: string, maxWords = 26): string {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '…';
  }

  /**
   * trackBy helper for ngFor loops using MongoDB _id.
   * Reduces DOM re-renders when lists update.
   */
  trackById(_: number, item: { _id: string }): string {
    return item._id;
  }

  /**
   * Loads a short preview list of categories (first 6).
   * After Angular renders, initializes accordion UI script for the preview list.
   */
  loadCategoriesPreview(): void {
    this.api.getCategories().subscribe({
      next: (data) => {
        // Keep same order and show only a subset on the homepage
        this.categoriesPreview = (data ?? []).slice(0, 6);
        this.cdr.detectChanges();

        /**
         * Some UI scripts need a tiny delay to ensure DOM exists,
         * especially on first load.
         */
        setTimeout(() => this.kickCategoriesAccordion(), 0);

        // After Angular paints -> init accordion UI
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickCategoriesAccordion();
        });
      },
      error: () => {
        this.categoriesPreview = [];
      },
    });
  }

  /**
   * Initializes accordion behavior for the categories preview section.
   *
   * Why retries?
   * - On hard reload, the accordion script might load before elements exist.
   * - On slower devices/layout shifts, triggers might render later.
   *
   * This function retries up to ~4 seconds until:
   * - AccordionUI is available
   * - Trigger elements exist in the DOM
   */
  private kickCategoriesAccordion(): void {
    const selector = '#categories-accordion .accordion-trigger';

    const tryInit = (attempt = 0) => {
      const ui = (window as any).AccordionUI;

      // Find accordion triggers
      const triggers = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

      // If UI script or DOM is not ready, retry
      if (!ui?.init || triggers.length === 0) {
        if (attempt < 80) setTimeout(() => tryInit(attempt + 1), 50); // up to ~4s
        return;
      }

      // Initialize accordion bindings
      ui.init(selector);

      // Verify init actually bound (based on a data attribute set by your script)
      const bound = triggers.some((t) => t.dataset?.['accordionBound'] === '1');
      if (!bound && attempt < 80) {
        setTimeout(() => tryInit(attempt + 1), 50);
      }
    };

    // Run outside Angular: avoids triggering change detection during retries
    this.zone.runOutsideAngular(() => tryInit());
  }

  /**
   * Shortens text by character count (useful for category previews).
   */
  shortText(text: string, maxChars = 200): string {
    const t = String(text || '').trim();
    return t.length > maxChars ? t.slice(0, maxChars) + '...' : t;
  }

  /**
   * trackBy helper for categories list.
   * Uses _id when available, otherwise fallback to slug or legacy id.
   */
  trackByCategory(_: number, c: any): string {
    return c._id || c.slug || String(c.id || '');
  }
}
