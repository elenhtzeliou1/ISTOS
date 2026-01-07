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
  take,
} from 'rxjs/operators';
import { ApiService, Book } from '../../services/api.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.html',
})
export class BookDetails implements OnInit, OnDestroy {
  // UI state flags
  loading = true;
  error = '';

  // Loaded book data (null until fetched or if not found)
  book: Book | null = null;

  /**
   * Used to cleanly unsubscribe from all observables when the component is destroyed.
   * Prevents memory leaks / duplicate subscriptions when navigating between routes.
   */
  private destroy$ = new Subject<void>();

  constructor(
    // Gives access to route params (e.g., /books/:id)
    private route: ActivatedRoute,
    // API layer for fetching data from the backend
    private api: ApiService,
    /**
     * NgZone ensures updates happen inside Angular's zone
     * so change detection can run correctly (useful when data might arrive
     * from code executed outside Angular).
     */
    private zone: NgZone,
    /**
     * Allows manually triggering change detection.
     * Helpful when UI is not updating automatically (e.g., external scripts or zone issues).
     */
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    /**
     * Subscribe to route param changes:
     * - When the :id changes, reset UI state and fetch the corresponding book.
     */
    this.route.paramMap
      .pipe(
        // Auto-unsubscribe when component is destroyed
        takeUntil(this.destroy$),

        // Extract the "id" route parameter
        map((pm: ParamMap) => pm.get('id')),

        // Only react if id actually changed
        distinctUntilChanged(),

        // Reset UI state before each fetch
        tap((id) => {
          console.log('route id =', id);
          this.loading = true;
          this.error = '';
          this.book = null;
        }),

        /**
         * Switch to an API request based on the id:
         * - If id is numeric -> treat as legacy "bookId"
         * - Otherwise -> treat as MongoDB "_id"
         *
         * switchMap cancels the previous request automatically if the user navigates quickly.
         */
        switchMap((id) => {
          // Guard: missing id
          if (!id) {
            this.error = 'Missing book id';
            return of(null);
          }

          // If the id is numeric, load by legacy bookId (Number)
          if (/^\d+$/.test(id)) {
            return this.api.getBookByBookId(Number(id)).pipe(
              // Convert API errors into a friendly UI error + return null instead of breaking the stream
              catchError((err) => {
                this.error = err?.error?.message || 'Cannot load book (by bookId).';
                return of(null);
              })
            );
          }

          // Otherwise, load by MongoDB document _id (string)
          return this.api.getBookById(id).pipe(
            catchError((err) => {
              this.error = err?.error?.message || 'Cannot load book (by _id).';
              return of(null);
            })
          );
        })
      )
      .subscribe((b) => {
        console.log('book received:', b);

        /**
         * Ensure UI state updates happen inside Angular so the template updates.
         * This can help when API responses or external scripts run outside the zone.
         */
        this.zone.run(() => {
          this.book = b;
          this.loading = false;

          // Force an immediate UI refresh (useful if change detection does not trigger automatically)
          this.cdr.detectChanges();
        });

        // optional: if you have UI scripts that need re-init
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          (window as any).RevealUI?.refresh?.();
          (window as any).AccordionUI?.init?.();
        });
      });
  }

  ngOnDestroy(): void {
    // Triggers completion for all streams using takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }
}
