import { Component, OnDestroy, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, of } from 'rxjs';
import {
  catchError,
  switchMap,
  takeUntil,
  map,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { ApiService, Video } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-details.html',
})
export class VideoDetails implements OnInit, OnDestroy {
  // ---------------------------
  // UI state
  // ---------------------------
  loading = true;
  error = '';

  // Loaded video object (null until fetched)
  video: Video | null = null;

  /**
   * Sanitized YouTube embed URL for binding inside an iframe.
   * Angular requires SafeResourceUrl for [src] on iframe to avoid XSS.
   */
  safeEmbedUrl: SafeResourceUrl | null = null;

  /**
   * Used to stop subscriptions when the component is destroyed
   * (prevents memory leaks and duplicate requests).
   */
  private destroy$ = new Subject<void>();

  constructor(
    // Used to read route params (e.g., /videos/:id)
    private route: ActivatedRoute,

    // REST API service (GET /api/videos/:id)
    private api: ApiService,

    /**
     * Ensures state updates run inside Angular change detection.
     * Useful when async callbacks could happen outside zone.
     */
    private zone: NgZone,

    // Allows forcing UI update immediately after async changes
    private cdr: ChangeDetectorRef,

    /**
     * Sanitizer is used to mark dynamic iframe URLs as trusted
     * (required by Angular security model).
     */
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    /**
     * Add a page-specific body class so CSS can target this page only.
     */
    document.body.classList.add('video-details-body-page');

    /**
     * Subscribe to changes of the :id route parameter:
     * - when id changes, reset state and fetch the correct video.
     */
    this.route.paramMap
      .pipe(
        // Auto-unsubscribe on destroy
        takeUntil(this.destroy$),

        // Extract "id" param from the route
        map((pm: ParamMap) => pm.get('id')),

        // Avoid re-fetch if id is the same
        distinctUntilChanged(),

        // Reset UI state before each request
        tap(() => {
          this.loading = true;
          this.error = '';
          this.video = null;
          this.safeEmbedUrl = null;
        }),

        /**
         * Switch to the API request.
         * switchMap cancels the previous request if the user navigates fast.
         */
        switchMap((id) => {
          if (!id) {
            this.error = 'Missing video id';
            return of(null);
          }

          return this.api.getVideoById(id).pipe(
            // Convert API errors into UI state instead of breaking the stream
            catchError((err) => {
              this.error = err?.error?.message || 'Cannot load video.';
              return of(null);
            })
          );
        })
      )
      .subscribe((v) => {
        /**
         * Ensure assignment happens inside Angular zone so template updates.
         */
        this.zone.run(() => {
          this.video = v;

          // Build and sanitize YouTube embed URL (for iframe)
          this.safeEmbedUrl = this.makeSafeEmbedUrl(v?.youtubeUrl ?? '');

          this.loading = false;
          this.cdr.detectChanges();
        });
      });
  }

  /**
   * Converts a YouTube URL into an embeddable URL and returns it as SafeResourceUrl.
   * Supports typical YouTube URL formats:
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID
   * - https://www.youtube.com/embed/VIDEO_ID
   */
  private makeSafeEmbedUrl(url: string): SafeResourceUrl | null {
    // Extract YouTube video id from different URL styles
    const id =
      url.match(/[?&]v=([^&]+)/)?.[1] ||
      url.match(/youtu\.be\/([^?]+)/)?.[1] ||
      url.match(/youtube\.com\/embed\/([^?]+)/)?.[1];

    // If we can't parse a video id, do not render iframe
    if (!id) return null;

    // Standard embed URL format
    const embed = `https://www.youtube.com/embed/${id}`;

    /**
     * Mark embed URL as trusted.
     * This is safe here because we:
     * - parse and whitelist only the YouTube video id
     * - construct the embed URL ourselves (not directly using user-provided HTML)
     */
    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  }

  ngOnDestroy(): void {
    /**
     * Remove page-specific body class to avoid affecting other pages.
     */
    document.body.classList.remove('video-details-body-page');

    // Cleanup subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
