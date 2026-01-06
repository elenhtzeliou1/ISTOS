import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('categoriesAccordion') categoriesAccordion?: ElementRef<HTMLElement>;
  proposedCourses: Course[] = [];
  proposedBooks: Book[] = [];
  proposedVideos: Video[] = [];
  categoriesPreview: Category[] = [];

  private destroy$ = new Subject<void>();
  private uiInited = false;

  constructor(
    private api: ApiService,
    private ui: UiInitService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProposedBooks();
    this.loadProposedCourses();
    this.loadProposedVideos();
    this.loadCategoriesPreview();
  }

  ngAfterViewInit(): void {
    // init common UI once
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProposedCourses(): void {
    this.api.getProposedCourses(5).subscribe({
      next: (data) => {
        this.proposedCourses = data ?? [];
        this.cdr.detectChanges();

        // after Angular actually paints the ngFor cards -> init carousel
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickCarouselInit();
        });
      },
      error: () => {
        this.proposedCourses = [];
      },
    });
  }

  private kickCarouselInit(): void {
    const call = () => (window as any).ProposedCoursesCarousel?.init?.();

    this.zone.runOutsideAngular(() => {
      // multiple attempts help on hard reload / mobile layout timing
      requestAnimationFrame(() => call());
      setTimeout(() => call(), 120);
      setTimeout(() => call(), 500);

      // fonts can change widths after first paint
      const fonts: any = (document as any).fonts;
      if (fonts?.ready) {
        fonts.ready.then(() => call()).catch(() => { });
      }
    });
  }


  loadProposedBooks(): void {
    this.api.getProposedBooks(4).subscribe({
      next: (data) => {
        this.proposedBooks = data ?? [];
        this.cdr.detectChanges();

        // bind drag AFTER Angular renders the cards
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickBookCarouselDrag();
        });
      },
      error: () => {
        this.proposedBooks = [];
      },
    });
  }

  private kickBookCarouselDrag(): void {
    const call = () => (window as any).CardCarouselDrag?.init?.('#prefered-books-wrapper');

    this.zone.runOutsideAngular(() => {
      // several tries helps on hard reload/mobile layout timing
      requestAnimationFrame(() => call());
      setTimeout(() => call(), 120);
      setTimeout(() => call(), 500);

      const fonts: any = (document as any).fonts;
      if (fonts?.ready) fonts.ready.then(() => call()).catch(() => { });
    });
  }

  loadProposedVideos(): void {
    this.api.getProposedVideos(3).subscribe({
      next: (data) => {
        this.proposedVideos = data ?? [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.proposedVideos = [];
      }
    });
  }


  sliceWords(text: string, maxWords = 26): string {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '…';
  }
  trackById(_: number, item: { _id: string }): string {
    return item._id;
  }

  loadCategoriesPreview(): void {
    this.api.getCategories().subscribe({
      next: (data) => {
        // keeping same order
        this.categoriesPreview = (data ?? []).slice(0, 6);
        this.cdr.detectChanges();

          setTimeout(() => this.kickCategoriesAccordion(), 0);
        // after Angular paints -> init accordion UI
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickCategoriesAccordion();
        });
      },
      error: () => {
        this.categoriesPreview = [];
      },
    });
  }

  private kickCategoriesAccordion(): void {
    const selector = '#categories-accordion .accordion-trigger';

    const tryInit = (attempt = 0) => {
      const ui = (window as any).AccordionUI;

      const triggers = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
      if (!ui?.init || triggers.length === 0) {
        if (attempt < 80) setTimeout(() => tryInit(attempt + 1), 50); // up to ~4s
        return;
      }

      ui.init(selector);

      // verify init actually bound
      const bound = triggers.some(t => t.dataset?.['accordionBound'] === '1');
      if (!bound && attempt < 80) {
        setTimeout(() => tryInit(attempt + 1), 50);
      }
    };

    this.zone.runOutsideAngular(() => tryInit());
  }


  shortText(text: string, maxChars = 200): string {
    const t = String(text || '').trim();
    return t.length > maxChars ? t.slice(0, maxChars) + '...' : t;
  }

  trackByCategory(_: number, c: any): string {
    return c._id || c.slug || String(c.id || '');
  }

}
