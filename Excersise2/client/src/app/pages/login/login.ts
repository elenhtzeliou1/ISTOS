import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  loading = false;
  error = '';
  form = { email: '', password: '' };

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  submit(): void {
    if (this.loading) return;

    // render immediately
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.api.login(this.form).subscribe({
      next: ({ token, user }) => {
        this.zone.run(() => {
          this.auth.setSession(token, user);
          this.loading = false;
          this.cdr.detectChanges();
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.log('login error status:', err?.status, 'body:', err?.error);

          this.loading = false;
          this.error =
            err?.status === 401
              ? 'Wrong email or password!'
              : err?.error?.message || err?.message || 'Login failed.';

          this.cdr.detectChanges();
        });
      },
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn) this.router.navigate(['/']); //if user already logged in redirect him away from the login page

  }
}
