import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService, Category } from '../../services/api.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit, AfterViewInit {
  categories: Category[] = [];

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  get accountLabel(): string {
    return this.auth.isLoggedIn ? 'Profile' : 'Register';
  }

  get accountRoute(): any[] {
    return ['/register'];
  }

  ngOnInit(): void {
    this.api.getCategories().pipe(
      catchError(() => of([]))
    ).subscribe((cats: any[]) => {
      this.categories = (cats || []).map((c) => ({
        ...c,
        slug: String(c.slug || '').trim().toLowerCase(),
      }));
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    // If your old Accordion UI expects DOM readiness
    this.zone.runOutsideAngular(() => {
      setTimeout(() => (window as any).AccordionUI?.init?.(), 0);
      setTimeout(() => (window as any).AccordionUI?.init?.(), 120);
    });
  }

  // Minimal accordion toggle (works even if AccordionUI fails)
  toggleAccordion(panelId: string, ev: Event): void {
    ev.preventDefault();

    const panel = document.getElementById(panelId);
    if (!panel) return;

    const isHidden = panel.hasAttribute('hidden');
    if (isHidden) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');

    // keep aria-expanded in sync
    const btn = ev.currentTarget as HTMLElement | null;
    if (btn) btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
  }
}
