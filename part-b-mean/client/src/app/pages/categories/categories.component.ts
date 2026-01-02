import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import {
  ApiService,
  Category,
  Course,
  Book,
  CategoryLabelList,
  CategoryInfoList,
} from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
})

export class CategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  error = '';

  categories: Category[] = [];
  private courses: Course[] = [];
  private books: Book[] = [];

  // key: slug
  recommendations: Record<string, { course: Course | null; books: Book[] }> = {};

  private destroy$ = new Subject<void>();
  private uiInited = false;

  private readonly goalColors = ['#492db3', '#adadadff', '#151313', '#a1ff62'];

  // scroll to a specific category #slug (specifc part of the category page)
  private pendingFragment: string | null = null;

  private scrollToFragmentIfAny(): void {
    const frag = (this.pendingFragment || '').trim();
    if (!frag) return;

    const doScroll = () => {
      const el = document.getElementById(frag);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // 1) after Angular renders
    this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
      doScroll();

      // 2) after your slider scripts change layout
      setTimeout(doScroll, 250);
      setTimeout(doScroll, 700);
    });
  }
  // ---------------------------------------------------------------//
  // ---------------------------------------------------------------//
  // ---------------------------------------------------------------//



  constructor(
    private api: ApiService,
    private ui: UiInitService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // watch #fragment changes (works even when navigating from footer)
    this.route.fragment
      .pipe(takeUntil(this.destroy$))
      .subscribe((frag) => {
        this.pendingFragment = frag;
        // if already loaded, scroll now
        if (!this.loading) this.scrollToFragmentIfAny();
      });

    this.loadAll();
  }

  ngAfterViewInit(): void {
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;
    }

    this.kickCategoriesIntroSlider();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAll(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      cats: this.api.getCategories(),
      courses: this.api.getCourses(),
      books: this.api.getBooks(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ cats, courses, books }) => {
          // normalize categories to always match your template (objects with {label}/{info})
          this.categories = (cats ?? []).map((c: any) => ({
            ...c,
            slug: String(c.slug || '').trim().toLowerCase(),
            label_list: Array.isArray(c.label_list)
              ? c.label_list.map((x: any) =>
                typeof x === 'string' ? ({ label: x } as CategoryLabelList) : x
              )
              : [],
            info_list: Array.isArray(c.info_list)
              ? c.info_list.map((x: any) =>
                typeof x === 'string' ? ({ info: x } as CategoryInfoList) : x
              )
              : [],
          }));

          this.courses = courses ?? [];
          this.books = books ?? [];

          this.buildRecommendations();

          this.loading = false;
          this.cdr.detectChanges();
          this.scrollToFragmentIfAny();

          // after Angular paints: refresh reveal + run slider init agai
          this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
            (window as any).RevealUI?.refresh?.();
            this.kickCategoriesIntroSlider();

            // scroll again after UI scripts
            setTimeout(() => this.scrollToFragmentIfAny(), 350);
            setTimeout(() => this.scrollToFragmentIfAny(), 900);
          });
        },
        error: () => {
          this.loading = false;
          this.error = 'Cannot load categories. Is the backend running?';
        },
      });
  }

  private buildRecommendations(): void {
    const rec: Record<string, { course: Course | null; books: Book[] }> = {};

    for (const cat of this.categories) {
      const slug = String(cat.slug || '').trim().toLowerCase();

      // 1 course: available in same category, prefer featured
      const courseCandidates = this.courses.filter(
        (c) => this.slug(c.category) === slug && !!c.available
      );
      const featuredCourse = courseCandidates.find((c) => !!c.featured);
      const course = featuredCourse || courseCandidates[0] || null;

      // 2 books: available in same category, prefer featured
      const bookCandidates = this.books.filter(
        (b) => this.slug(b.category) === slug && !!b.available
      );
      const featuredBooks = bookCandidates.filter((b) => !!b.featured);
      const nonFeaturedBooks = bookCandidates.filter((b) => !b.featured);
      const books = [...featuredBooks, ...nonFeaturedBooks].slice(0, 2);

      rec[slug] = { course, books };
    }

    this.recommendations = rec;
  }

  // --- UI helpers ---
  pad2(n: number): string {
    return String(n).padStart(2, '0');
  }

  shortText(text: string, maxChars = 100): string {
    const t = String(text || '').trim();
    return t.length > maxChars ? t.slice(0, maxChars) + '...' : t;
  }

  goalItemStyle(i: number): Record<string, string> {
    const bg = this.goalColors[i % this.goalColors.length];
    return {
      '--card-color-bg': bg,
      '--pcolor': this.pickTextColor(bg),
    } as any;
  }

  private pickTextColor(hex: string): string {
    const h = String(hex || '').replace('#', '').slice(0, 6);
    const n = parseInt(h, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 140 ? '#ffffff' : '#000000';
  }

  sliceWords(text: string, maxWords = 26): string {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '…';
  }

  private slug(s: string): string {
    return (s || '').toLowerCase().trim().replace(/\s+/g, '-');
  }

  trackByMongoId(_: number, x: { _id: string }): string {
    return x._id;
  }

  private kickCategoriesIntroSlider(): void {
    const call = () => {
      (window as any).GoalSliderHeight?.init?.('.goal-slider');
      (window as any).CategoriesIntroSlider?.init?.();
    };

    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(call);
      setTimeout(call, 120);
      setTimeout(call, 500);

      const fonts: any = (document as any).fonts;
      if (fonts?.ready) fonts.ready.then(call).catch(() => { });
    });
  }
}
