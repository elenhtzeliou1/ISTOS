import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService, Video } from '../../services/api.service';
import { UiInitService } from '../../services/ui-init.service';

type Option = { label: string; value: string };

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './videos.html',
})

export class Videos implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoList', { static: false }) videoList?: ElementRef<HTMLElement>;

  loading = true;
  error = '';

  videos: Video[] = [];

  private destroy$ = new Subject<void>();
  private uiInited = false;

  // equalizer stat
  private rafId = 0;
  private resizeHandler = () => this.scheduleEqualize();

  //Filters state
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
    this.loadVideos();
  }
  ngAfterViewInit(): void {
    if (!this.uiInited) {
      this.ui.initCommon();
      (window as any).RevealUI?.refresh?.();
      this.uiInited = true;
    }

    // equalize height on resize
    window.addEventListener('resize', this.resizeHandler);
    window.visualViewport?.addEventListener('resize', this.resizeHandler);

    this.scheduleEqualize();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resizeHandler);
    window.visualViewport?.removeEventListener('resize', this.resizeHandler);

    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVideos(): void {
    this.loading = true;
    this.error = '';

    this.api.getVideos().subscribe({
      next: (data) => {
        this.videos = data ?? [];
        this.loading = false;
        this.cdr.detectChanges();

        // after Angular paints the ngFor -> equalize
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

  private slug(s: string): string {
    return (s || '').toLowerCase().trim().replace(/\s+/g, '-');
  }

  onCategoryChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedCategories.add(value) : this.selectedCategories.delete(value);

    // list size/layout changes -> equalize after render
    this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => this.scheduleEqualize());
  }

  onLevelChange(value: string, e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    checked ? this.selectedLevels.add(value) : this.selectedLevels.delete(value);

    this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => this.scheduleEqualize());
  }
  onAvailableChange(e: Event): void {
    this.onlyAvailable = (e.target as HTMLInputElement).checked;
    this.zone.onStable.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => this.scheduleEqualize());
  }

 private scheduleEqualize(): void {
  const run = () => this.equalizeAfterImages();

  cancelAnimationFrame(this.rafId);

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
  private equalizeAfterImages(): void {
    const host = this.videoList?.nativeElement;
    if (!host) return;

    this.equalizeNewBoxHeights(host);

    const imgs = Array.from(host.querySelectorAll('img')) as HTMLImageElement[];
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', () => this.equalizeNewBoxHeights(host), { once: true });
        img.addEventListener('error', () => this.equalizeNewBoxHeights(host), { once: true });
      }
    });
  }
  
  private equalizeNewBoxHeights(host: HTMLElement): void {
    const cards = Array.from(host.querySelectorAll('.new-box')) as HTMLElement[];
    if (!cards.length) return;

    cards.forEach((c) => (c.style.height = 'auto'));
    const maxH = Math.max(...cards.map((c) => c.getBoundingClientRect().height));
    cards.forEach((c) => (c.style.height = `${maxH}px`));
  }

  get filteredVideos(): Video[] {
    const noFilters =
      this.selectedCategories.size === 0 &&
      this.selectedLevels.size === 0 &&
      !this.onlyAvailable;

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

  sliceWords(text: string, maxWords = 26): string {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '…';
  }

  trackById(_: number, v: Video): string {
    return v._id;
  }



}
