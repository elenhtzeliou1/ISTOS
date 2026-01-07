import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UiInitService } from './services/ui-init.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,

  /**
   * Root component imports:
   * - RouterOutlet: renders the active route component (SPA navigation)
   * - NavbarComponent / FooterComponent: persistent layout elements shown on all pages
   */
  imports: [RouterOutlet, NavbarComponent, FooterComponent],

  /**
   * Root layout template:
   * Typically contains:
   * - <app-navbar />
   * - <router-outlet />
   * - <app-footer />
   */
  templateUrl: './app.component.html',
})
export class AppComponent {}
