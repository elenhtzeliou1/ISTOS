import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, AfterViewInit {
  mobileOpen = false;
  accountText = 'Register';

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    // close mobile menu when route changes
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }
  ngAfterViewInit(): void {
    const links = Array.from(document.querySelectorAll('.group-link > a'));

    links.forEach(a => {
      a.addEventListener('mouseenter', () => {
        a.classList.remove('line-out');
        a.classList.add('line-in');
      });

      a.addEventListener('mouseleave', () => {
        a.classList.remove('line-in');
        a.classList.add('line-out');
      });
    });
  }

  toggleMenu(): void {
    this.mobileOpen = !this.mobileOpen;
    document.body.classList.toggle('no-scroll', this.mobileOpen);
  }

  closeMenu(): void {
    this.mobileOpen = false;
    document.body.classList.remove('no-scroll');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}

