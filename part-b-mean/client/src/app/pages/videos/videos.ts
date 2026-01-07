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
import { ApiService, Video } from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { FilterSidebarComponent } from '../../components/filter-sidebar/filter-sidebar.component';

/**
 * Simple option type used by filter UI.
 * label: display text
 * value: normalized internal value (slug)
 */
type Option = { label: string; value: string };

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, RouterLink, VideoCardComponent, FilterSidebarComponent],
  templateUrl: './videos.html',
})
export class Videos implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Reference to the container that holds the video cards.
   * We use this to query .new-box elements and equalize their heights.
   */
  @ViewChild('videoList', { static: false }) videoList?: ElementRef<HTMLElement>;

  // ---------------------------
  // UI state
  // ---------------------------
  loading = true;
  error = '';

  // Raw videos list loaded from backend
  videos: Video[] = [];

  /**
   * Used to stop subscriptions on component destroy.
   */
  private destroy$ = new Subject<void>();

  /**
   * Prevents initializing shared UI scripts multiple times.
   */
  private uiInited = false;

  // ---------------------------
  // Equalizer state (card height equalization)
  // ---------------------------

  /**
   * requestAnimationFrame id used so we can cancel previous scheduled equalizations.
   */
  private rafId = 0;

  /**
   * Cached resize handler reference so we can properly remove it in ngOnDestroy.
   * We schedule equalization rather than running it immediately to avoid heavy layout thrashing.
   */
  private resizeHandler = () => this.scheduleEqualize();

  // ---------------------------
  // Filters state (client-side filtering)
  // ---------------------------
  selectedCategories = new Set<string>();
  selectedLevels = new Set<string>();
  onlyAvailable = false;

  /**
   * Category filter options shown in sidebar.
   * Values should match slugified version of Video.category.
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
   * Difficulty/level options shown in sidebar.
   * Values should match slugified version of Video.difficulty.
   */
  levelOptions: Option[] = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  constructor(
    // REST API service for fetching videos
    private api: ApiService,

    // Initializes shared UI scripts (reveal/accordion/etc.)
    private ui: UiInitService,

    /**
     * Used to run heavy DOM logic outside Angular (performance),
     * and to wait for Angular stability before DOM measurements.
     */
    private zone: NgZone,

    // Allows forcing UI update after async work
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load videos on component mount
    this.loadVideos();
  }

  ngAfterViewInit(): void {
    /**
     * Initialize common UI scripts once after view is rendered.
     * Keeps existing reveal/filter UI behavior working.
     */
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;
    }

    /**
     * Equalize card heights when viewport size changes:
     * - window resize covers most cases
     * - visualViewport resize helps on mobile when address bar shows/hides
     */
    window.addEventListener('resize', this.resizeHandler);
    window.visualViewport?.addEventListener('resize', this.resizeHandler);

    // Initial equalization pass
    this.scheduleEqualize();
  }

  ngOnDestroy(): void {
    // Stop any scheduled frame callback
    cancelAnimationFrame(this.rafId);

    // Remove listeners added in ngAfterViewInit
    window.removeEventListener('resize', this.resizeHandler);
    window.visualViewport?.removeEventListener('resize', this.resizeHandler);

    // Cleanup subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads videos from backend REST API.
   * After Angular renders the list, we equalize card heights.
   */
  loadVideos(): void {
    this.loading = true;
    this.error = '';

    this.api.getVideos().subscribe({
      next: (data) => {
        this.videos = data ?? [];
        this.loading = false;

        // Ensure template updates
        this.cdr.detectChanges();

        // After Angular paints the ngFor cards, equalize heights
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.scheduleEqualize();
        });
      },
      error: () => {
        this.loading = false;
        this.error = 'Cannot load videos. Is backend running?';
      },
    });
  }

  /**
   * Normalizes a string into a slug for consistent comparisons.
   * Used to compare API fields with filter option values.
   */
  private slug(s: string): string {
    return (s || '').toLowerCase().trim().replace(/\s+/g, '-');
  }

  /**
   * Updates selectedCategories when category filter changes.
   * Then schedules equalization because the list layout may change.
   */
  onCategoryChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedCategories.add(value) : this.selectedCategories.delete(value);

    // List size/layout changes -> equalize after render
    this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
      this.scheduleEqualize();
    });
  }

  /**
   * Updates selectedLevels when difficulty filter changes.
   * Schedules equalization because the list layout may change.
   */
  onLevelChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedLevels.add(value) : this.selectedLevels.delete(value);

    this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
      this.scheduleEqualize();
    });
  }

  /**
   * Updates availability filter and schedules equalization after UI updates.
   */
  onAvailableChange(e: Event): void {
    this.onlyAvailable = (e.target as HTMLInputElement).checked;

    this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
      this.scheduleEqualize();
    });
  }

  /**
   * Schedules height equalization using requestAnimationFrame + timeouts.
   * Why multiple passes?
   * - first frame: after DOM paint
   * - later timeouts: after CSS/layout settle
   * - fonts.ready: fonts can change measurements after first render
   */
  private scheduleEqualize(): void {
    const run = () => this.equalizeAfterImages();

    // Cancel previous scheduled equalization (avoid stacking)
    cancelAnimationFrame(this.rafId);

    // Run outside Angular to avoid triggering change detection repeatedly
    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(run);
      setTimeout(run, 120);
      setTimeout(run, 500);

      const fonts: any = (document as any).fonts;
      if (fonts?.ready) {
        fonts.ready.then(run).catch(() => {});
      }
    });
  }

  /**
   * Equalizes card heights and re-runs after images load.
   * Images can change card height after load, so we listen for image events.
   */
  private equalizeAfterImages(): void {
    const host = this.videoList?.nativeElement;
    if (!host) return;

    // First equalization pass
    this.equalizeNewBoxHeights(host);

    // If images are still loading, re-run when they finish
    const imgs = Array.from(host.querySelectorAll('img')) as HTMLImageElement[];
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', () => this.equalizeNewBoxHeights(host), {
          once: true,
        });
        img.addEventListener('error', () => this.equalizeNewBoxHeights(host), {
          once: true,
        });
      }
    });
  }

  /**
   * Makes all ".new-box" cards in the container have the same height.
   * This keeps grid cards aligned visually even if content lengths differ.
   */
  private equalizeNewBoxHeights(host: HTMLElement): void {
    const cards = Array.from(host.querySelectorAll('.new-box')) as HTMLElement[];
    if (!cards.length) return;

    // Reset heights first so we measure natural height
    cards.forEach((c) => (c.style.height = 'auto'));

    // Find the maximum height across cards
    const maxH = Math.max(...cards.map((c) => c.getBoundingClientRect().height));

    // Apply max height to all cards
    cards.forEach((c) => (c.style.height = `${maxH}px`));
  }

  /**
   * Computed list used by the template.
   * Filters videos by category, difficulty, and availability.
   */
  get filteredVideos(): Video[] {
    const noFilters =
      this.selectedCategories.size === 0 &&
      this.selectedLevels.size === 0 &&
      !this.onlyAvailable;

    // Fast path: return original list if no filters active
    if (noFilters) return this.videos;

    return this.videos.filter((v) => {
      const cat = this.slug(v.category);
      const lvl = this.slug(v.difficulty);

      if (this.selectedCategories.size && !this.selectedCategories.has(cat)) return false;
      if (this.selectedLevels.size && !this.selectedLevels.has(lvl)) return false;
      if (this.onlyAvailable && !v.available) return false;
      return true;
    });
  }

  /**
   * Limits text to a maximum number of words for preview cards.
   */
  sliceWords(text: string, maxWords = 26): string {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '…';
  }

  /**
   * trackBy for ngFor:
   * Improves performance by preventing full DOM re-render when list updates.
   */
  trackById(_: number, v: Video): string {
    return v._id;
  }
}
