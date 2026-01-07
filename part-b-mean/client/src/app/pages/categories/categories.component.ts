import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import {
  ApiService,
  Category,
  Course,
  Book,
  CategoryLabelList,
  CategoryInfoList,
} from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  // ---------------------------
  // UI state
  // ---------------------------
  loading = true;
  error = '';

  // Main data for the page
  categories: Category[] = [];

  // Cached content lists used to compute per-category recommendations
  private courses: Course[] = [];
  private books: Book[] = [];

  /**
   * Per-category recommendations.
   * key: category slug
   * value: 1 recommended course + up to 2 recommended books
   */
  recommendations: Record<string, { course: Course | null; books: Book[] }> = {};

  /**
   * Used to cleanly stop subscriptions on component destroy.
   */
  private destroy$ = new Subject<void>();

  /**
   * Prevents initializing external UI scripts multiple times.
   */
  private uiInited = false;

  /**
   * Color palette used to style "learning goal" cards (rotates by index).
   * Note: these are used for inline CSS variables in the template.
   */
  private readonly goalColors = ['#492db3', '#adadadff', '#151313', '#a1ff62'];

  /**
   * When navigating with a URL fragment (e.g. /categories#databases),
   * we store it here until the DOM has rendered the corresponding element.
   */
  private pendingFragment: string | null = null;

  // -------------------------------------------------------------------
  // Fragment scrolling helpers
  // -------------------------------------------------------------------

  /**
   * Scrolls to the pending fragment if available.
   * Uses a MutationObserver if the element is not yet in the DOM.
   */

  private scrollToFragmentIfAny(): void {
    const frag = (this.pendingFragment || '').trim().toLowerCase();
    if (!frag) return;

    const scrollNow = () => this.scrollToAnchorWithOffset(frag);
    // If it's already there, scroll immediately
    if (document.getElementById(frag)) {
      scrollNow();
      return;
    }

    /**
     * Otherwise, wait until the element appears (async render / API load).
     * We observe DOM changes and stop after ~5 seconds for safety.
     */
    const root = document.getElementById('categories-full') || document.body;

    const obs = new MutationObserver(() => {
      if (document.getElementById(frag)) {
        obs.disconnect();
        scrollNow();

        // Extra retries after UI scripts (reveal/slider) settle and layout stabilizes
        setTimeout(scrollNow, 300);
        setTimeout(scrollNow, 900);
      }
    });

    obs.observe(root, { childList: true, subtree: true });

    // Safety stop to avoid observing forever
    setTimeout(() => obs.disconnect(), 5000);
  }

  /**
   * Reads CSS variable --nav-height (if available) to compute a scroll offset,
   * so anchors don't end up hidden under the fixed navbar.
   */
  private getNavOffsetPx(): number {
    const css = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
    const n = parseFloat(css) + 50;
    return Number.isFinite(n) ? n : 0;
  }

  /**
   * Smoothly scrolls to an element id with an offset (navbar height).
   */
  private scrollToAnchorWithOffset(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = this.getNavOffsetPx();
    const y = window.scrollY + el.getBoundingClientRect().top - offset - 10; // extra 10px padding
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  // ---------------------------------------------------------------//
  // ---------------------------------------------------------------//
  // ---------------------------------------------------------------//

  constructor(
    // API service for REST calls
    private api: ApiService,

    // Initializes shared non-Angular UI behavior/scripts
    private ui: UiInitService,

    // Used to run heavy DOM scripts outside Angular for performance
    private zone: NgZone,

    // Allows manual UI refresh when needed (after async work / zone changes)
    private cdr: ChangeDetectorRef,

    // Access to URL fragments (#slug)
    private route: ActivatedRoute,

    // Angular helper for scrolling to anchors (kept as a fallback utility)
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    /**
     * Watch URL fragment changes:
     * Example: navigating to /categories#ai should scroll to the AI section.
     *
     * Works even when clicking links from footer/navbar within the SPA.
     */
    this.route.fragment.pipe(takeUntil(this.destroy$)).subscribe((frag) => {
      this.pendingFragment = frag;
      // If data is already loaded, we can scroll immediately
      if (!this.loading) this.scrollToFragmentIfAny();
    });
    // Load all required data in parallel
    this.loadAll();
  }

  ngAfterViewInit(): void {
    /**
     * Initialize common UI scripts after Angular renders the view.
     * This keeps existing reveal/accordion/slider UI behavior working.
     */
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;
    }
    // Initialize category intro sliders (needs DOM rendered)
    this.kickCategoriesIntroSlider();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads categories, courses, and books in parallel using forkJoin.
   * After loading:
   * - normalizes category structure for template
   * - builds recommendations per category
   * - performs fragment scrolling if requested
   * - refreshes external UI scripts once Angular is stable
   */
  private loadAll(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      cats: this.api.getCategories(),
      courses: this.api.getCourses(),
      books: this.api.getBooks(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ cats, courses, books }) => {
          /**
           * Normalize categories to match template expectations:
           * - slug is trimmed + lowercased
           * - label_list and info_list always become arrays of objects:
           *      {label: string} and {info: string}
           *   (because sometimes seed data can contain plain strings)
           */
          this.categories = (cats ?? []).map((c: any) => ({
            ...c,
            slug: String(c.slug || '')
              .trim()
              .toLowerCase(),
            label_list: Array.isArray(c.label_list)
              ? c.label_list.map((x: any) =>
                  typeof x === 'string' ? ({ label: x } as CategoryLabelList) : x
                )
              : [],
            info_list: Array.isArray(c.info_list)
              ? c.info_list.map((x: any) =>
                  typeof x === 'string' ? ({ info: x } as CategoryInfoList) : x
                )
              : [],
          }));

          // Store content lists for recommendation logic
          this.courses = courses ?? [];
          this.books = books ?? [];

          // Build per-category recommended items
          this.buildRecommendations();

          // Update UI state
          this.loading = false;
          this.cdr.detectChanges();

          // If we navigated with #fragment, scroll now that content exists
          this.scrollToFragmentIfAny();

          /**
           * After Angular finishes rendering (stable DOM),
           * refresh UI scripts and re-init sliders to avoid incorrect heights/layouts.
           */
          this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
            (window as any).RevealUI?.refresh?.();
            this.kickCategoriesIntroSlider();

            // Scroll again after UI scripts run (layout might shift)
            setTimeout(() => this.scrollToFragmentIfAny(), 350);
            setTimeout(() => this.scrollToFragmentIfAny(), 900);
          });
        },
        error: () => {
          this.loading = false;
          this.error = 'Cannot load categories. Is the backend running?';
        },
      });
  }

  /**
   * Builds a recommendation object for each category:
   * - Course: pick 1 available course in the same category (prefer featured)
   * - Books: pick up to 2 available books in the same category (prefer featured)
   */
  private buildRecommendations(): void {
    const rec: Record<string, { course: Course | null; books: Book[] }> = {};

    for (const cat of this.categories) {
      const slug = String(cat.slug || '')
        .trim()
        .toLowerCase();

      //pick 1 course: available in same category, prefer featured
      const courseCandidates = this.courses.filter(
        (c) => this.slug(c.category) === slug && !!c.available
      );
      const featuredCourse = courseCandidates.find((c) => !!c.featured);
      const course = featuredCourse || courseCandidates[0] || null;

      // pick 2 books: available in same category, prefer featured
      const bookCandidates = this.books.filter(
        (b) => this.slug(b.category) === slug && !!b.available
      );
      const featuredBooks = bookCandidates.filter((b) => !!b.featured);
      const nonFeaturedBooks = bookCandidates.filter((b) => !b.featured);
      const books = [...featuredBooks, ...nonFeaturedBooks].slice(0, 2);

      rec[slug] = { course, books };
    }

    this.recommendations = rec;
  }

  /**
   * Alternative fragment scrolling method using Angular's ViewportScroller.
   * Kept for reference; the primary approach uses a custom offset-aware scroll.
   */
  private scrollToFragmentAfterRender() {
    const frag = this.route.snapshot.fragment;
    if (!frag) return;

    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.viewportScroller.scrollToAnchor(frag);
    });
  }

  // -------------------------------------------------------------------
  // UI helpers (used by the template)
  // -------------------------------------------------------------------

  /**
   * Pads a number with a leading zero (e.g. 1 -> "01").
   */
  pad2(n: number): string {
    return String(n).padStart(2, '0');
  }

  /**
   * Shortens text by character count for previews.
   */
  shortText(text: string, maxChars = 100): string {
    const t = String(text || '').trim();
    return t.length > maxChars ? t.slice(0, maxChars) + '...' : t;
  }

  /**
   * Returns inline style variables for goal cards:
   * - background color cycles through goalColors
   * - text color chosen for contrast
   */
  goalItemStyle(i: number): Record<string, string> {
    const bg = this.goalColors[i % this.goalColors.length];
    return {
      '--card-color-bg': bg,
      '--pcolor': this.pickTextColor(bg),
    } as any;
  }

  /**
   * Picks black/white text based on background brightness (simple contrast heuristic).
   */
  private pickTextColor(hex: string): string {
    const h = String(hex || '')
      .replace('#', '')
      .slice(0, 6);
    const n = parseInt(h, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 140 ? '#ffffff' : '#000000';
  }

  /**
   * Limits text to a max number of words (used for card descriptions).
   */
  sliceWords(text: string, maxWords = 26): string {
    const words = String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '…';
  }

  /**
   * Normalizes strings into a slug format to match categories/difficulty fields.
   */
  private slug(s: string): string {
    return (s || '').toLowerCase().trim().replace(/\s+/g, '-');
  }

  /**
   * trackBy function for ngFor to improve rendering performance.
   */
  trackByMongoId(_: number, x: { _id: string }): string {
    return x._id;
  }

  /**
   * Initializes category intro slider UI scripts.
   * Uses multiple attempts to handle timing differences (mobile, hard refresh, fonts).
   */
  private kickCategoriesIntroSlider(): void {
    const call = () => {
      (window as any).GoalSliderHeight?.init?.('.goal-slider');
      (window as any).CategoriesIntroSlider?.init?.();
    };

    // Run outside Angular so these DOM scripts don't trigger extra change detection
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(call);
      setTimeout(call, 120);
      setTimeout(call, 500);

      // Fonts can change layout; re-init once fonts are ready (if supported)
      const fonts: any = (document as any).fonts;
      if (fonts?.ready) fonts.ready.then(call).catch(() => {});
    });
  }
}
