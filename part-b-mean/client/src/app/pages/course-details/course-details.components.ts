import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, of, combineLatest } from 'rxjs';
import { catchError, switchMap, takeUntil, take } from 'rxjs/operators';
import { ApiService, Course } from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';

/**
 * Local view-model types used by the template.
 * These mirror (or simplify) the structures stored in the Course model.
 */
type CourseSection = {
  title?: string;
  summary?: string;
  lessons?: Lesson[];
};

type LearningGoal = {
  title: string;
  text: string;
};

type Lesson = {
  id: string;
  title: string;
  summary?: string;
  minutes: number;
};

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './course-details.components.html',
})
export class CourseDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  // ---------------------------
  // Main UI state
  // ---------------------------
  loading = true;
  error = '';
  course: Course | null = null;

  // Course content shown in the page
  learningGoals: LearningGoal[] = [];
  sections: CourseSection[] = [];
  lessons: Lesson[] = [];

  // Recommended content (loaded via course.recommended ids)
  recommendedBooks: Array<any> = [];
  recommendedVideos: Array<any> = [];

  // ---------------------------
  // Reviews state
  // ---------------------------
  reviews: any[] = [];
  avgRating = 0;

  // Logged-in user's own review (if allowed/available)
  myReview: any | null = null;

  // Form bindings (ngModel)
  reviewRating = '';
  reviewComment = '';

  /**
   * True only when the backend confirms user is allowed to review:
   * - user is authenticated (JWT)
   * - user is enrolled in the course
   */
  canReview = false;

  // Review form UI state
  reviewError = '';
  reviewSaving = false;

  // ---------------------------
  // Enrollment state
  // ---------------------------
  isEnrolled = false;
  enrollCheckLoading = false;

  /**
   * Used to unsubscribe from all active observable streams
   * when the component is destroyed (prevents memory leaks).
   */
  private destroy$ = new Subject<void>();

  /**
   * Avoid re-initializing external UI scripts multiple times.
   */
  private uiInited = false;

  constructor(
    // Gives access to route params (e.g., /courses/:id)
    private route: ActivatedRoute,

    // REST API service for backend calls
    private api: ApiService,

    // Initializes shared UI scripts (reveal/accordion/modal etc.)
    private ui: UiInitService,

    // Controls whether code runs inside/outside Angular change detection
    private zone: NgZone,

    // Allows manually triggering change detection
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    /**
     * Adds a page-specific body class so CSS can target this page only.
     */
    document.body.classList.add('course-detail-page');

    /**
     * Listen for BOTH:
     * - route param changes (/courses/:id)
     * - query param changes (/course?id=...)
     *
     * This makes the component robust to different navigation styles.
     */
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        takeUntil(this.destroy$),

        /**
         * For each route change:
         * - extract course id
         * - fetch course from backend
         */
        switchMap(([pm, qm]) => {
          const id = pm.get('id') || qm.get('id');

          // Guard: missing id
          if (!id) {
            this.error = 'Missing course id.';
            this.loading = false;
            return of(null);
          }

          // Reset UI state before request
          this.loading = true;
          this.error = '';

          return this.api.getCourseById(id).pipe(
            catchError(() => {
              this.error = 'Cannot load course. Is the backend running?';
              return of(null);
            })
          );
        })
      )
      .subscribe((c) => {
        // Store course and update UI flags
        this.course = c;
        this.loading = false;

        // Pull structured fields (safe fallbacks)
        this.learningGoals = c?.learningGoals ?? [];
        this.sections = c?.sections ?? [];

        // Load recommended books/videos based on course.recommended
        this.loadRecommendationsFromCourse(c);

        /**
         * Reviews/Enrollment logic needs a course ObjectId
         * because backend stores reviews/enrollments by course reference.
         */
        const courseId = this.getCourseIdForReviews(c);
        if (courseId) {
          // Load public reviews for this course
          this.loadReviews(courseId);

          // Check if logged-in user is allowed to review (auth + enrolled)
          this.loadMyReviewGate(courseId);

          // Check enrollment status for "subscribe/start learning" UX
          this.loadEnrollmentStatus(courseId);
        } else {
          // If courseId missing, disable all review/enrollment features safely
          this.reviews = [];
          this.avgRating = 0;
          this.canReview = false;
          this.myReview = null;
        }

        // Ensure template updates
        this.cdr.detectChanges();

        /**
         * After Angular finishes rendering, re-init external UI scripts
         * that depend on the DOM being ready.
         */
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          (window as any).RevealUI?.refresh?.();
          (window as any).ModalUI?.init?.();
          this.initQuestionsAccordionWhenReady();
        });
      });
  }

  // ------------------------------------------------------------------
  // Reviews helpers
  // ------------------------------------------------------------------

  /**
   * Returns the best identifier to use for review/enrollment endpoints.
   * Prefer MongoDB _id since backend stores course as ObjectId reference.
   */
  private getCourseIdForReviews(c: any): string | null {
    return c?._id || c?.id || null;
  }

  /**
   * Loads all public reviews for a course.
   * Also recalculates the average rating.
   */
  private loadReviews(courseId: string): void {
    this.api
      .getCourseReviews(courseId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of([]))
      )
      .subscribe((revs: any[]) => {
        this.reviews = Array.isArray(revs) ? revs : [];
        this.recomputeAvg();
        this.cdr.detectChanges();
      });
  }

  /**
   * Attempts to load the logged-in user's review.
   *
   * Important:
   * - If this call succeeds => user is authenticated AND enrolled => canReview = true
   * - If it fails with 401/403 => user cannot review
   */
  private loadMyReviewGate(courseId: string): void {
    this.reviewError = '';

    this.api
      .getMyReview(courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (mine: any | null) => {
          // Success means user is allowed to review (auth + enrolled)
          this.canReview = true;
          this.myReview = mine;

          // If review exists, preload the form fields
          if (mine) {
            this.reviewRating = String(mine.rating ?? '');
            this.reviewComment = String(mine.comment ?? '');
          } else {
            this.reviewRating = '';
            this.reviewComment = '';
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          // Not allowed to review
          this.canReview = false;
          this.myReview = null;
          this.reviewRating = '';
          this.reviewComment = '';

          // Friendly UI message depending on status code
          if (err?.status === 401) this.reviewError = 'Register first!';
          else if (err?.status === 403)
            this.reviewError = 'Enroll in this course to leave a review.';
          else this.reviewError = 'Could not load review status.';

          this.cdr.detectChanges();
        },
      });
  }

  /**
   * Computes average rating (1–5) from loaded review list.
   * Ignores invalid or missing ratings.
   */
  private recomputeAvg(): void {
    const nums = (this.reviews ?? [])
      .map((r) => Number(r?.rating))
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= 5);

    const sum = nums.reduce((a, b) => a + b, 0);
    this.avgRating = nums.length ? sum / nums.length : 0;
  }

  /**
   * Submit review form:
   * - validates client-side
   * - calls backend PUT upsert endpoint
   * - refreshes review list + my review state
   */
  submitReview(): void {
    this.reviewError = '';

    const courseId = this.getCourseIdForReviews(this.course);
    if (!courseId) {
      this.reviewError = 'Missing course id.';
      return;
    }

    if (!this.canReview) {
      this.reviewError = 'You must be logged in and enrolled to review.';
      return;
    }

    // Normalize and validate input
    const rating = Number(this.reviewRating);
    const comment = String(this.reviewComment || '').trim();

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      this.reviewError = 'Rating must be between 1 and 5.';
      return;
    }
    if (!comment) {
      this.reviewError = 'Comment is required.';
      return;
    }

    this.reviewSaving = true;

    this.api
      .upsertMyReview(courseId, { rating, comment })
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          // Handle 401/403 and validation errors from backend
          const msg =
            err?.error?.message ||
            (err?.status === 401
              ? 'Please log in to leave a review.'
              : err?.status === 403
              ? 'You must be enrolled to leave a review.'
              : 'Could not save review.');

          this.reviewError = msg;
          this.reviewSaving = false;
          this.cdr.detectChanges();
          return of(null);
        })
      )
      .subscribe((saved) => {
        this.reviewSaving = false;
        if (!saved) return;

        // Refresh list + review gate state after successful save
        this.loadReviews(courseId);
        this.loadMyReviewGate(courseId);

        this.cdr.detectChanges();
      });
  }

  // ------------------------------------------------------------------
  // Recommended content (books/videos)
  // ------------------------------------------------------------------

  /**
   * Loads recommended books and videos from the `course.recommended` object.
   * The course stores only ids + reasons, so we fetch full details via API.
   */
  private loadRecommendationsFromCourse(c: any): void {
    // ----- BOOKS -----
    const recBooks = c?.recommended?.books ?? [];

    // Extract numeric ids
    const bookIds = recBooks
      .map((x: any) => Number(x.id))
      .filter((n: number) => Number.isFinite(n));

    if (bookIds.length) {
      this.api
        .getBooksByIds(bookIds)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (books: any[]) => {
            // Create id -> reason map so we can attach reasons to fetched book objects
            const reasonById = new Map<number, string>(
              recBooks.map((r: any) => [Number(r.id), r.reason])
            );

            this.recommendedBooks = (books ?? []).map((b: any) => ({
              ...b,
              reason: reasonById.get(Number(b.bookId)) || '',
            }));

            this.cdr.detectChanges();

            // Re-init accordion after DOM update
            this.initQuestionsAccordionWhenReady();
          },
          error: () => {
            this.recommendedBooks = [];
          },
        });
    } else {
      this.recommendedBooks = [];
    }

    // ----- VIDEOS -----
    const recVideos = c?.recommended?.videos ?? [];
    const videoIds = recVideos
      .map((x: any) => Number(x.id))
      .filter((n: number) => Number.isFinite(n));

    if (videoIds.length) {
      this.api
        .getVideosByIds(videoIds)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (videos: any[]) => {
            // id -> reason mapping
            const reasonById = new Map<number, string>(
              recVideos.map((r: any) => [Number(r.id), r.reason])
            );

            this.recommendedVideos = (videos ?? []).map((v: any) => ({
              ...v,
              reason: reasonById.get(Number(v.videoId)) || '',
            }));

            this.cdr.detectChanges();

            // Re-init accordion after DOM update
            this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
              (window as any).AccordionUI?.init?.();
            });
          },
          error: () => {
            this.recommendedVideos = [];
          },
        });
    } else {
      this.recommendedVideos = [];
    }
  }

  ngAfterViewInit(): void {
    /**
     * Initialize common UI scripts after the view is rendered once.
     */
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;

      this.initQuestionsAccordionWhenReady();
    }
  }

  ngOnDestroy(): void {
    // Remove page-specific body class
    document.body.classList.remove('course-detail-page');

    // Cleanup subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initQuestionsAccordionWhenReady(): void {
    const selector = '.courses-detail-accordion .accordion-trigger';
    const maxFrames = 120; // 2 seconds at 60fps
    let frame = 0;

    const tryInit = () => {
      frame++;

      const hasUI = typeof (window as any).AccordionUI?.init === 'function';
      const hasTriggers = document.querySelectorAll(selector).length > 0;

      if (hasUI && hasTriggers) {
        // scope init ONLY to Q&A accordion
        (window as any).AccordionUI.init(selector);
        return;
      }

      if (frame < maxFrames) {
        requestAnimationFrame(tryInit);
      }
    };

    requestAnimationFrame(tryInit);
  }

  // ------------------------------------------------------------------
  // Template helpers
  // ------------------------------------------------------------------

  /**
   * Limits text to a fixed number of words for previews.
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
   * trackBy helper for ngFor loops using index.
   */
  trackByIndex(i: number): number {
    return i;
  }

  // Stars helpers for template rendering (1–5)
  roundRating(v: any): number {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n);
  }

  toStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  // ------------------------------------------------------------------
  // Subscribe / modal state
  // ------------------------------------------------------------------

  modalOpen = false;
  modalTitle = '';
  modalDesc = '';
  modalMode: 'info' | 'subscribe-confirm' | 'go-register' = 'info';
  modalConfirmText = 'Close';
  modalBusy = false;

  /**
   * Opens the subscription flow modal:
   * - If course unavailable -> info modal
   * - If user not logged in -> go-register modal
   * - Otherwise -> confirmation modal for enrollment
   */
  openSubscribeModal(): void {
    const c = this.course;
    if (!c) return;

    const isAvailable = (c as any).available !== false;

    if (!isAvailable) {
      this.openModal({
        title: 'Course unavailable',
        desc: `"${c.title}" is currently unavailable. Please check back later.`,
        mode: 'info',
        buttonText: 'Close',
      });
      return;
    }

    // If no JWT token, user must register/login first
    const token = localStorage.getItem('token');
    if (!token) {
      this.openModal({
        title: 'Account required',
        desc: 'To subscribe to a course, please log in or register first.',
        mode: 'go-register',
        buttonText: 'Go to Register',
      });
      return;
    }

    // Logged in -> ask for enrollment confirmation
    this.openModal({
      title: 'Confirm subscription',
      desc: `Do you want to subscribe to "${c.title}"?`,
      mode: 'subscribe-confirm',
      buttonText: 'Confirm',
    });
  }

  /**
   * Generic modal open handler.
   * Also updates aria attributes for accessibility.
   */
  openModal(opts: { title: string; desc: string; mode: any; buttonText: string }): void {
    this.modalTitle = opts.title;
    this.modalDesc = opts.desc;
    this.modalMode = opts.mode;
    this.modalConfirmText = opts.buttonText || 'Close';
    this.modalOpen = true;

    // Keep aria attributes in sync
    const modal = document.getElementById('subscribeModal');
    modal?.setAttribute('aria-hidden', 'false');
    modal?.classList.add('is-open');
  }

  /**
   * Closes modal and restores aria attributes.
   */
  closeModal(): void {
    this.modalOpen = false;

    const modal = document.getElementById('subscribeModal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.classList.remove('is-open');
  }

  /**
   * Handles "Confirm" button in the modal:
   * - go-register: navigates user to register page
   * - subscribe-confirm: performs enrollment via backend
   * - info: just closes
   */
  onConfirmModal(): void {
    if (this.modalBusy) return;

    if (this.modalMode === 'go-register') {
      // You can replace this with Angular router navigation if preferred
      window.location.href = '/register';
      return;
    }

    if (this.modalMode === 'subscribe-confirm') {
      const courseId = (this.course as any)?._id;

      if (!courseId) {
        this.openModal({
          title: 'Missing course id',
          desc: 'Cannot enroll right now.',
          mode: 'info',
          buttonText: 'Close',
        });
        return;
      }

      // Call backend enroll endpoint
      this.modalBusy = true;

      this.api
        .enroll(courseId)
        .pipe(
          catchError((err) => {
            const msg =
              err?.error?.message ||
              (err?.status === 401 ? 'Please log in first.' : 'Could not subscribe.');

            this.modalBusy = false;

            // Show friendly error modal
            this.openModal({
              title: 'Subscription failed',
              desc: msg,
              mode: 'info',
              buttonText: 'Close',
            });

            this.cdr.detectChanges();
            return of(null);
          })
        )
        .subscribe((res) => {
          if (!res) return;

          // Enrollment successful
          this.isEnrolled = true;

          // Close modal
          this.closeModal();

          // Unlock reviews immediately (re-check gate + refresh reviews)
          this.loadMyReviewGate(courseId);
          this.loadReviews(courseId);

          // Scroll user down to reviews section for convenience
          setTimeout(() => {
            document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);

          this.modalBusy = false;
          this.cdr.detectChanges();
        });

      return;
    }

    // Default: info mode
    this.closeModal();
  }

  // ------------------------------------------------------------------
  // Start learning modal (lesson access control)
  // ------------------------------------------------------------------

  /**
   * Checks access to lessons:
   * 1) Not logged in -> ask user to register
   * 2) Logged in but not enrolled -> prompt subscription
   * 3) Enrolled -> show info modal (lesson details)
   */
  onStartLearning(lesson: any): void {
    const token = localStorage.getItem('token');

    // 1) Not logged in
    if (!token) {
      this.openModal({
        title: 'Account required',
        desc: 'To access lessons, please register first.',
        mode: 'go-register',
        buttonText: 'Go to Register',
      });
      this.cdr.detectChanges();
      return;
    }

    // 2) Logged in but not enrolled
    if (!this.isEnrolled) {
      this.openModal({
        title: 'Enrollment required',
        desc: 'To start learning this course, you must subscribe first.',
        mode: 'subscribe-confirm',
        buttonText: 'Subscribe',
      });

      // Guide user to the Subscribe button
      setTimeout(() => this.scrollToSubscribeButton(), 0);

      this.cdr.detectChanges();
      return;
    }

    // 3) Enrolled -> allow lesson start (here it's informational)
    this.openModal({
      title: 'Hey!',
      desc: `You can start learning: Lesson: "${lesson?.title}".  Duration: ${
        lesson?.minutes ?? 0
      } min`,
      mode: 'info',
      buttonText: 'Close',
    });

    this.cdr.detectChanges();
  }

  /**
   * Scroll helper to bring the Subscribe button into view.
   */
  private scrollToSubscribeButton(): void {
    const el = document.getElementById('subscribeNowBtn');
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ------------------------------------------------------------------
  // Enrollment status check
  // ------------------------------------------------------------------

  /**
   * Checks whether the current logged-in user is enrolled in this course.
   * Uses:
   * - GET /api/enrollments/me/enrollments
   * and then checks if courseId exists in the returned rows.
   */
  private loadEnrollmentStatus(courseId: string): void {
    // Not logged in => not enrolled
    const token = localStorage.getItem('token');
    if (!token) {
      this.isEnrolled = false;
      this.cdr.detectChanges();
      return;
    }

    this.enrollCheckLoading = true;

    this.api
      .getMyEnrollments()
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of([]))
      )
      .subscribe((rows: any[]) => {
        // Create a set of enrolled course ids for O(1) membership checks
        const set = new Set((rows || []).map((r: any) => String(r.course?._id || r.course)));

        this.isEnrolled = set.has(String(courseId));
        this.enrollCheckLoading = false;

        this.cdr.detectChanges();
      });
  }
}
