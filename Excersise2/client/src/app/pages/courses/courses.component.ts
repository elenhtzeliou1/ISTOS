import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService, Course } from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';
import { CourseCardComponent } from '../../components/course-card/course-card.component';
import { FilterSidebarComponent } from '../../components/filter-sidebar/filter-sidebar.component';
type Option = { label: string; value: string };

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink,CourseCardComponent,FilterSidebarComponent],
  templateUrl: './courses.component.html',
})

export class CoursesComponent implements OnInit, AfterViewInit, OnDestroy {
  loading = true;
  error = '';
  courses: Course[] = [];
  proposed: Course[] = [];

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
  ) { }

  ngOnInit(): void {
    this.loadCourses();
    this.loadProposed();
  }

  ngAfterViewInit(): void {
    // init once for filters etc.
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

  loadCourses(): void {
    this.loading = true;
    this.error = '';

    this.api.getCourses().subscribe({
      next: (data) => {
        this.courses = data ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = 'Cannot load courses. Is the backend running on :5000?';
      },
    });
  }

  loadProposed(): void {
    this.api.getProposedCourses(5).subscribe({
      next: (data) => {
        this.proposed = data ?? [];
        this.cdr.detectChanges();

        // After Angular renders the ngFor, init carousel.
        this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.kickCarouselInit();
        });
      },
      error: () => (this.proposed = []),
    });
  }

  private kickCarouselInit(): void {
    // Try a few times: hard reload timing varies (CSS/fonts/layout settle later)
    const call = () => (window as any).ProposedCoursesCarousel?.init?.();

    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => call());
      setTimeout(() => call(), 120);
      setTimeout(() => call(), 500);

      // Fonts can shift widths after first paint
      const fonts: any = (document as any).fonts;
      if (fonts?.ready) {
        fonts.ready.then(() => call()).catch(() => { });
      }
    });
  }

  // -----------------------------
  // Filters logic
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

  get filteredCourses(): Course[] {
    const noFilters =
      this.selectedCategories.size === 0 &&
      this.selectedLevels.size === 0 &&
      !this.onlyAvailable;

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

  trackById(_: number, c: Course): string {
  return c._id;
}
}
