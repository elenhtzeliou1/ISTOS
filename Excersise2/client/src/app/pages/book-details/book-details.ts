import { Component, OnDestroy, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil, map, distinctUntilChanged, tap, take } from 'rxjs/operators';
import { ApiService, Book } from '../../services/api.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.html',
})
export class BookDetails implements OnInit, OnDestroy {
  loading = true;
  error = '';
  book: Book | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((pm: ParamMap) => pm.get('id')),
        distinctUntilChanged(),
        tap((id) => {
          console.log('route id =', id);
          this.loading = true;
          this.error = '';
          this.book = null;
        }),
        switchMap((id) => {
          if (!id) {
            this.error = 'Missing book id';
            return of(null);
          }

          if (/^\d+$/.test(id)) {
            return this.api.getBookByBookId(Number(id)).pipe(
              catchError((err) => {
                this.error = err?.error?.message || 'Cannot load book (by bookId).';
                return of(null);
              })
            );
          }

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

        // force state updates inside Angular
        this.zone.run(() => {
          this.book = b;
          this.loading = false;
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
