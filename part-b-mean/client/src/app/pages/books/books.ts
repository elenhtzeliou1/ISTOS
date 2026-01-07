import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService, Book } from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { FilterSidebarComponent } from '../../components/filter-sidebar/filter-sidebar.component';

/**
 * Simple dropdown/filter option type.
 * label = user-facing text
 * value = internal normalized value used in filtering
 */
type Option = { label: string; value: string };

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterLink, BookCardComponent, FilterSidebarComponent],
  templateUrl: './books.html',
})
export class Books implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  error = '';

  // Main list + proposed/recommended list
  books: Book[] = [];
  proposed: Book[] = [];

  /**
   * Used to unsubscribe from async streams on component destroy.
   * Helpful when you add takeUntil() to observables (prevents memory leaks).
   */
  private destroy$ = new Subject<void>();

  /**
   * Prevents running UI init multiple times (important for external UI scripts).
   */
  private uiInited = false;

  // ---------------------------
  // Filters state
  // ---------------------------

  /**
   * Selected categories (stored as normalized "slug" strings).
   * Using Set makes add/remove checks O(1).
   */
  selectedCategories = new Set<string>();

  /**
   * Selected difficulty levels (also stored as normalized "slug" strings).
   */
  selectedLevels = new Set<string>();

  /**
   * Toggle for showing only available items.
   */
  onlyAvailable = false;

  /**
   * Available category filters shown in the sidebar UI.
   * NOTE: values should match the slugified version of Book.category.
   */
  categoryOptions: Option[] = [
    { label: 'Programming', value: 'programming' },
    { label: 'Networks', value: 'networks' },
    { label: 'Cybersecurity', value: 'cybersecurity' },
    { label: 'Databases', value: 'databases' },
    { label: 'Web development', value: 'web-development' },
    { label: 'Artificial Intelligence', value: 'ai' },
  ];

  /**
   * Difficulty/level filters shown in the sidebar UI.
   * NOTE: values should match the slugified version of Book.difficulty.
   */
  levelOptions: Option[] = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  constructor(
    // Service responsible for REST API calls
    private api: ApiService,

    // Service that initializes shared UI scripts/components (non-Angular)
    private ui: UiInitService,

    /**
     * Used to run certain code inside/outside Angular for performance:
     * - inside zone: updates UI state
     * - outside zone: heavy DOM scripts (carousels, drag, etc.)
     */
    private zone: NgZone,

    /**
     * Allows forcing a UI refresh if change detection does not run automatically
     * (especially after running code outside Angular zone).
     */
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load the main list and the proposed list in parallel
    this.loadBooks();
    this.loadProposedBooks();
  }

  ngAfterViewInit(): void {
    /**
     * Initialize common UI scripts after the view is rendered.
     * This keeps existing static template UI behavior working (accordion, reveals, etc.).
     */
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;
    }
  }

  ngOnDestroy(): void {
    // Complete destroy$ so any takeUntil(destroy$) subscriptions end cleanly
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads all books from the backend REST API.
   * Updates loading/error flags for UI feedback.
   */
  loadBooks(): void {
    this.loading = true;
    this.error = '';

    this.api.getBooks().subscribe({
      next: (data) => {
        this.books = data ?? [];
        this.loading = false;

        // Ensure UI updates immediately
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = 'Cannot load books. Is the backend running?';
      },
    });
  }

  /**
   * Loads the proposed/recommended books list (carousel section).
   * After Angular renders the cards, we re-init the drag carousel behavior.
   */
  loadProposedBooks(): void {
    this.api.getProposedBooks(4).subscribe({
      next: (data) => {
        this.proposed = data ?? [];

        // Ensure the DOM updates before initializing the carousel drag script
        this.cdr.detectChanges();

        /**
         * Wait until Angular has finished rendering,
         * then initialize external carousel drag logic.
         */
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickBookCarouselDrag();
        });
      },
      error: () => {
        // Fail gracefully: proposed section becomes empty instead of breaking page
        this.proposed = [];
      },
    });
  }

  /**
   * Initializes carousel drag behavior for the proposed books section.
   * Uses multiple attempts to handle timing differences on:
   * - hard refresh
   * - mobile layout shifts
   * - slow font loading
   */
  private kickBookCarouselDrag(): void {
    const call = () => (window as any).CardCarouselDrag?.init?.('#prefered-books-wrapper');

    // Run outside Angular to avoid unnecessary change detection cycles
    this.zone.runOutsideAngular(() => {
      // Multiple tries for stability across browsers and layout timings
      requestAnimationFrame(() => call());
      setTimeout(() => call(), 120);
      setTimeout(() => call(), 500);

      // Fonts can change layout; re-init once fonts are ready (if supported)
      const fonts: any = (document as any).fonts;
      if (fonts?.ready) fonts.ready.then(() => call()).catch(() => {});
    });
  }

  /**
   * Helper: limits a description to a maximum number of words
   * (used for card previews).
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
   * Helper: normalizes text into a "slug" format for comparisons.
   * Used to match API values with filter option values.
   */
  private slug(s: string): string {
    return (s || '').toLowerCase().trim().replace(/\s+/g, '-');
  }

  /**
   * Updates selectedCategories Set when a category checkbox changes.
   */
  onCategoryChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedCategories.add(value) : this.selectedCategories.delete(value);
  }

  /**
   * Updates selectedLevels Set when a level checkbox changes.
   */
  onLevelChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedLevels.add(value) : this.selectedLevels.delete(value);
  }

  /**
   * Updates the "only available" toggle.
   */
  onAvailableChange(e: Event): void {
    this.onlyAvailable = (e.target as HTMLInputElement).checked;
  }

  /**
   * Computed property used by the template to show filtered results.
   * Filtering is done client-side based on:
   * - selectedCategories
   * - selectedLevels
   * - onlyAvailable
   */
  get filteredBooks(): Book[] {
    const noFilters =
      this.selectedCategories.size === 0 && this.selectedLevels.size === 0 && !this.onlyAvailable;

    // Fast path: return original array if no filtering is needed
    if (noFilters) return this.books;

    return this.books.filter((b) => {
      const cat = this.slug(b.category);
      const lvl = this.slug(b.difficulty);

      // Category filter
      if (this.selectedCategories.size && !this.selectedCategories.has(cat)) return false;

      // Level/difficulty filter
      if (this.selectedLevels.size && !this.selectedLevels.has(lvl)) return false;

      // Availability filter
      if (this.onlyAvailable && !b.available) return false;
      return true;
    });
  }

  /**
   * trackBy for ngFor:
   * Improves rendering performance by preventing full re-renders
   * when only list content changes.
   */
  trackById(_: number, b: Book): string {
    return b._id;
  }
}
