import { Component, OnDestroy, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil, map, distinctUntilChanged, tap, take } from 'rxjs/operators';
import { ApiService, Video } from '../../services/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-details.html',
})
export class VideoDetails implements OnInit, OnDestroy {
  loading = true;
  error = '';
  video: Video | null = null;

  safeEmbedUrl: SafeResourceUrl | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
     document.body.classList.add('video-details-body-page');
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((pm: ParamMap) => pm.get('id')),
        distinctUntilChanged(),
        tap(() => {
          this.loading = true;
          this.error = '';
          this.video = null;
          this.safeEmbedUrl = null;
        }),
        switchMap((id) => {
          if (!id) {
            this.error = 'Missing video id';
            return of(null);
          }

          return this.api.getVideoById(id).pipe(
            catchError((err) => {
              this.error = err?.error?.message || 'Cannot load video.';
              return of(null);
            })
          );
        })
      )
      .subscribe((v) => {
        this.zone.run(() => {
          this.video = v;
          this.safeEmbedUrl = this.makeSafeEmbedUrl(v?.youtubeUrl ?? '');
          this.loading = false;
          this.cdr.detectChanges();
        });
      });
  }

  private makeSafeEmbedUrl(url: string): SafeResourceUrl | null {
    const id =
      url.match(/[?&]v=([^&]+)/)?.[1] ||
      url.match(/youtu\.be\/([^?]+)/)?.[1] ||
      url.match(/youtube\.com\/embed\/([^?]+)/)?.[1];

    if (!id) return null;

    const embed = `https://www.youtube.com/embed/${id}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embed);
  }

  ngOnDestroy(): void {
       document.body.classList.remove('video-details-body-page');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
