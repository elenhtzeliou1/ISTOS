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
import { catchError, switchMap, takeUntil, take, finalize } from 'rxjs/operators';
import { ApiService, Course } from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';

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
  loading = true;
  error = '';
  course: Course | null = null;

  learningGoals: LearningGoal[] = [];
  sections: CourseSection[] = [];
  lessons: Lesson[] = [];

  recommendedBooks: Array<any> = [];
  recommendedVideos: Array<any> = [];

  // Reviews
  reviews: any[] = [];
  avgRating = 0;

  myReview: any | null = null;
  reviewRating = '';
  reviewComment = '';
  canReview = false; // true only if backend allows (auth + enrolled)
  reviewError = '';
  reviewSaving = false;

  isEnrolled = false;
  enrollCheckLoading = false;

  private destroy$ = new Subject<void>();
  private uiInited = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private ui: UiInitService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    document.body.classList.add('course-detail-page');

    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(([pm, qm]) => {
          const id = pm.get('id') || qm.get('id');

          if (!id) {
            this.error = 'Missing course id.';
            this.loading = false;
            return of(null);
          }

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
        this.course = c;
        this.loading = false;

        this.learningGoals = c?.learningGoals ?? [];
        this.sections = c?.sections ?? [];

        this.loadRecommendationsFromCourse(c);

        //load all the availble reviews for this course
        const courseId = this.getCourseIdForReviews(c);
        if (courseId) {
          this.loadReviews(courseId);
          this.loadMyReviewGate(courseId);
          this.loadEnrollmentStatus(courseId);
        } else {
          this.reviews = [];
          this.avgRating = 0;
          this.canReview = false;
          this.myReview = null;
        }

        this.cdr.detectChanges();

        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          (window as any).RevealUI?.refresh?.();
          (window as any).AccordionUI?.init?.();
          (window as any).ModalUI?.init?.();
        });
      });
  }

  // ---------- Reviews helpers ----------
  private getCourseIdForReviews(c: any): string | null {
    // Prefer Mongo _id (since your backend review model references course ObjectId)
    return c?._id || c?.id || null;
  }

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

  private loadMyReviewGate(courseId: string): void {
    this.reviewError = '';

    this.api
      .getMyReview(courseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (mine: any | null) => {
          // success means authed + enrolled
          this.canReview = true;
          this.myReview = mine;

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
          // 401/403 means NOT allowed to review
          this.canReview = false;
          this.myReview = null;
          this.reviewRating = '';
          this.reviewComment = '';

          // optional message
          if (err?.status === 401) this.reviewError = 'Register first!';
          else if (err?.status === 403)
            this.reviewError = 'Enroll in this course to leave a review.';
          else this.reviewError = 'Could not load review status.';

          this.cdr.detectChanges();
        },
      });
  }

  private recomputeAvg(): void {
    const nums = (this.reviews ?? [])
      .map((r) => Number(r?.rating))
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= 5);

    const sum = nums.reduce((a, b) => a + b, 0);
    this.avgRating = nums.length ? sum / nums.length : 0;
  }

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
          // handle 401/403 and validation errors
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

        // refresh list + my review
        this.loadReviews(courseId);
        this.loadMyReviewGate(courseId);

        this.cdr.detectChanges();
      });
  }

  // ---------- Recommendations ----------
  private loadRecommendationsFromCourse(c: any): void {
    // ----- BOOKS -----
    const recBooks = c?.recommended?.books ?? [];
    const bookIds = recBooks
      .map((x: any) => Number(x.id))
      .filter((n: number) => Number.isFinite(n));

    if (bookIds.length) {
      this.api
        .getBooksByIds(bookIds)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (books: any[]) => {
            const reasonById = new Map<number, string>(
              recBooks.map((r: any) => [Number(r.id), r.reason])
            );

            this.recommendedBooks = (books ?? []).map((b: any) => ({
              ...b,
              reason: reasonById.get(Number(b.bookId)) || '',
            }));

            this.cdr.detectChanges();
            this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
              (window as any).AccordionUI?.init?.();
            });
          },
          error: () => {
            this.recommendedBooks = [];
          },
        });
    } else {
      this.recommendedBooks = [];
    }

    // ---- VIDEOS -----
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
            const reasonById = new Map<number, string>(
              recVideos.map((r: any) => [Number(r.id), r.reason])
            );

            this.recommendedVideos = (videos ?? []).map((v: any) => ({
              ...v,
              reason: reasonById.get(Number(v.videoId)) || '',
            }));

            this.cdr.detectChanges();
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
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('course-detail-page');
    this.destroy$.next();
    this.destroy$.complete();
  }

  sliceWords(text: string, maxWords = 26): string {
    const words = String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '…';
  }

  trackByIndex(i: number): number {
    return i;
  }

  // Stars helpers for template
  roundRating(v: any): number {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n);
  }

  toStarsArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  // ----- Subscribe modal state -----///
  modalOpen = false;
  modalTitle = '';
  modalDesc = '';
  modalMode: 'info' | 'subscribe-confirm' | 'go-register' = 'info';
  modalConfirmText = 'Close';
  modalBusy = false;

  openSubscribeModal(): void {
    const c = this.course;
    if (!c) return;

    // If you have availability flag in the course
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

    this.openModal({
      title: 'Confirm subscription',
      desc: `Do you want to subscribe to "${c.title}"?`,
      mode: 'subscribe-confirm',
      buttonText: 'Confirm',
    });
  }

  openModal(opts: { title: string; desc: string; mode: any; buttonText: string }): void {
    this.modalTitle = opts.title;
    this.modalDesc = opts.desc;
    this.modalMode = opts.mode;
    this.modalConfirmText = opts.buttonText || 'Close';
    this.modalOpen = true;

    // keep aria
    const modal = document.getElementById('subscribeModal');
    modal?.setAttribute('aria-hidden', 'false');
    modal?.classList.add('is-open');
  }

  closeModal(): void {
    this.modalOpen = false;

    const modal = document.getElementById('subscribeModal');
    modal?.setAttribute('aria-hidden', 'true');
    modal?.classList.remove('is-open');
  }

  onConfirmModal(): void {
    if (this.modalBusy) return;
    if (this.modalMode === 'go-register') {
      // route to register page (adjust route)
      // this.router.navigate(['/register']);
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

      // all backend enroll endpoint
      this.modalBusy = true;
      this.api
        .enroll(courseId)
        .pipe(
          catchError((err) => {
            const msg =
              err?.error?.message ||
              (err?.status === 401 ? 'Please log in first.' : 'Could not subscribe.');

            this.modalBusy = false;
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

          //enrolled instantly
          this.isEnrolled = true;

          // close modal, dont show a second one
          this.closeModal();

          //unlock review instantly (re-run gate nd fetch)
          this.loadMyReviewGate(courseId);
          this.loadReviews(courseId);

          // scroll to review form ;)
          setTimeout(() => {
            document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);

          this.modalBusy = false;
          this.cdr.detectChanges();
        });

      return;
    }

    // info mode
    this.closeModal();
  }

  //start learning modal
  onStartLearning(lesson: any): void {
    // 1) Not logged in
    const token = localStorage.getItem('token');
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

      // guide user to Subscribe button
      setTimeout(() => this.scrollToSubscribeButton(), 0);

      this.cdr.detectChanges();
      return;
    }

    // 3) Enrolled
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

  private scrollToSubscribeButton(): void {
    const el = document.getElementById('subscribeNowBtn');
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private loadEnrollmentStatus(courseId: string): void {
    // not logged in => not enrolled
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
        const set = new Set((rows || []).map((r: any) => String(r.course?._id || r.course)));

        this.isEnrolled = set.has(String(courseId));
        this.enrollCheckLoading = false;

        this.cdr.detectChanges();
      });
  }
}
