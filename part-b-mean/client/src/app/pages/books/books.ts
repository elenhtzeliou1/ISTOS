import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService, Book } from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { FilterSidebarComponent } from '../../components/filter-sidebar/filter-sidebar.component';

type Option = { label: string; value: string };

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, RouterLink, BookCardComponent,FilterSidebarComponent],
  templateUrl: './books.html',
})

export class Books implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  error = '';

  books: Book[] = [];
  proposed: Book[] = [];

  private destroy$ = new Subject<void>();
  private uiInited = false;

  // Filters state
  selectedCategories = new Set<string>();
  selectedLevels = new Set<string>();
  onlyAvailable = false;

  categoryOptions: Option[] = [
    { label: 'Programming', value: 'programming' },
    { label: 'Networks', value: 'networks' },
    { label: 'Cybersecurity', value: 'cybersecurity' },
    { label: 'Databases', value: 'databases' },
    { label: 'Web development', value: 'web-development' },
    { label: 'Artificial Intelligence', value: 'ai' },
  ];

  levelOptions: Option[] = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
  ];

  constructor(
    private api: ApiService,
    private ui: UiInitService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadProposedBooks();
  }

  ngAfterViewInit(): void {
    // keep the existing filter UI working
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

  loadBooks(): void {
    this.loading = true;
    this.error = '';

    this.api.getBooks().subscribe({
      next: (data) => {
        this.books = data ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = 'Cannot load books. Is the backend running?';
      },
    });
  }

  loadProposedBooks(): void {
    this.api.getProposedBooks(4).subscribe({
      next: (data) => {
        this.proposed = data ?? [];
        this.cdr.detectChanges();

        // bind drag AFTER Angular renders the cards
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickBookCarouselDrag();
        });
      },
      error: () => {
        this.proposed = [];
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
      if (fonts?.ready) fonts.ready.then(() => call()).catch(() => {});
    });
  }

  sliceWords(text: string, maxWords = 26): string {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '…';
  }

  private slug(s: string): string {
    return (s || '').toLowerCase().trim().replace(/\s+/g, '-');
  }

  onCategoryChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedCategories.add(value) : this.selectedCategories.delete(value);
  }

  onLevelChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedLevels.add(value) : this.selectedLevels.delete(value);
  }

  onAvailableChange(e: Event): void {
    this.onlyAvailable = (e.target as HTMLInputElement).checked;
  }

  get filteredBooks(): Book[] {
    const noFilters =
      this.selectedCategories.size === 0 &&
      this.selectedLevels.size === 0 &&
      !this.onlyAvailable;

    if (noFilters) return this.books;

    return this.books.filter((b) => {
      const cat = this.slug(b.category);
      const lvl = this.slug(b.difficulty);

      if (this.selectedCategories.size && !this.selectedCategories.has(cat)) return false;
      if (this.selectedLevels.size && !this.selectedLevels.has(lvl)) return false;
      if (this.onlyAvailable && !b.available) return false;
      return true;
    });
  }

  trackById(_: number, b: Book): string {
    return b._id;
  }
}
