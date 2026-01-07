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
import { ApiService, Course } from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { FilterSidebarComponent } from '../../components/filter-sidebar/filter-sidebar.component';

/**
 * Simple option type used by filter UI.
 * label: display text
 * value: normalized internal value (slug)
 */
type Option = { label: string; value: string };

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, CourseCardComponent, FilterSidebarComponent],
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit, AfterViewInit, OnDestroy {
  // ---------------------------
  // UI state
  // ---------------------------
  loading = true;
  error = '';

  // Main course list + proposed/recommended list
  courses: Course[] = [];
  proposed: Course[] = [];

  /**
   * Used to cleanly unsubscribe from observables when component is destroyed.
   * Helps prevent memory leaks / duplicated subscriptions when navigating.
   */
  private destroy$ = new Subject<void>();

  /**
   * Prevents initializing external UI scripts multiple times.
   */
  private uiInited = false;

  // ---------------------------
  // Filters state (client-side filtering)
  // ---------------------------

  /**
   * Selected category slugs (stored in a Set for O(1) membership checks).
   */
  selectedCategories = new Set<string>();

  /**
   * Selected difficulty/level slugs.
   */
  selectedLevels = new Set<string>();

  /**
   * Toggle for filtering only available courses.
   */
  onlyAvailable = false;

  /**
   * Filter options shown in the sidebar.
   * Values should match the slugified version of Course.category.
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
   * Difficulty/level options shown in the sidebar.
   * Values should match the slugified version of Course.difficulty.
   */
  levelOptions: Option[] = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  constructor(
    // Service responsible for calling backend REST endpoints
    private api: ApiService,

    // Service for initializing shared UI behavior (accordion/reveal/etc.)
    private ui: UiInitService,

    /**
     * Used to run heavy DOM scripts outside Angular to avoid extra change detection.
     * Also used to wait for zone stability before initializing carousels.
     */
    private zone: NgZone,

    /**
     * Allows manually triggering a UI update when needed
     * (useful after external scripts or async work).
     */
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load main list + proposed list in parallel
    this.loadCourses();
    this.loadProposed();
  }

  ngAfterViewInit(): void {
    /**
     * Initialize shared UI scripts once (filters, reveal effects, etc.).
     * Keeps existing template UI working after Angular renders.
     */
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;
    }
  }

  ngOnDestroy(): void {
    // Signal completion for any takeUntil(destroy$) streams
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads all courses from the backend.
   * Updates loading/error state for user feedback.
   */
  loadCourses(): void {
    this.loading = true;
    this.error = '';

    this.api.getCourses().subscribe({
      next: (data) => {
        this.courses = data ?? [];
        this.loading = false;

        // Ensure template updates immediately
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = 'Cannot load courses. Is the backend running on :5000?';
      },
    });
  }

  /**
   * Loads the "proposed/recommended" courses list.
   * After Angular renders the cards, initializes the carousel script.
   */
  loadProposed(): void {
    this.api.getProposedCourses(5).subscribe({
      next: (data) => {
        this.proposed = data ?? [];
        this.cdr.detectChanges();

        /**
         * Wait until Angular finishes rendering (ngFor DOM exists),
         * then initialize the carousel script.
         */
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickCarouselInit();
        });
      },
      error: () => (this.proposed = []),
    });
  }

  /**
   * Initializes the proposed courses carousel (external UI script).
   * We try multiple times because layout/fonts can change after first paint,
   * especially on hard reload or mobile.
   */
  private kickCarouselInit(): void {
    const call = () => (window as any).ProposedCoursesCarousel?.init?.();

    // Run outside Angular to avoid triggering change detection repeatedly
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => call());
      setTimeout(() => call(), 120);
      setTimeout(() => call(), 500);

      // Fonts may load after paint and change element widths -> re-init
      const fonts: any = (document as any).fonts;
      if (fonts?.ready) {
        fonts.ready.then(() => call()).catch(() => {});
      }
    });
  }

  // -----------------------------
  // Filters logic (client-side)
  // -----------------------------

  /**
   * Normalizes a string into a slug for consistent comparisons.
   * Used to compare API fields (category/difficulty) with filter option values.
   */
  private slug(s: string): string {
    return (s || '').toLowerCase().trim().replace(/\s+/g, '-');
  }

  /**
   * Updates selectedCategories when a category checkbox changes.
   */
  onCategoryChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedCategories.add(value) : this.selectedCategories.delete(value);
  }

  /**
   * Updates selectedLevels when a difficulty checkbox changes.
   */
  onLevelChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedLevels.add(value) : this.selectedLevels.delete(value);
  }

  /**
   * Updates "only available" toggle.
   */
  onAvailableChange(e: Event): void {
    this.onlyAvailable = (e.target as HTMLInputElement).checked;
  }

  /**
   * Computed list shown in the template.
   * Filters courses by selected categories, selected difficulty levels, and availability.
   */
  get filteredCourses(): Course[] {
    const noFilters =
      this.selectedCategories.size === 0 && this.selectedLevels.size === 0 && !this.onlyAvailable;

    // Fast path: return original list when no filters are active
    if (noFilters) return this.courses;

    return this.courses.filter((c) => {
      const cat = this.slug(c.category);
      const lvl = this.slug(c.difficulty);

      if (this.selectedCategories.size && !this.selectedCategories.has(cat)) return false;
      if (this.selectedLevels.size && !this.selectedLevels.has(lvl)) return false;
      if (this.onlyAvailable && !c.available) return false;
      return true;
    });
  }

  /**
   * trackBy function for ngFor loops.
   * Improves performance by preventing full DOM re-render when list updates.
   */
  trackById(_: number, c: Course): string {
    return c._id;
  }
}
