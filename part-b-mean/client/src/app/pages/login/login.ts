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
  // UI state flags
  loading = false;
  error = '';

  /**
   * Template-driven form model (ngModel binds to these fields).
   * Kept minimal: email + password.
   */
  form = { email: '', password: '' };

  constructor(
    // Handles REST API calls to the backend (POST /api/auth/login)
    private api: ApiService,

    // Stores auth session (token + user) on successful login
    private auth: AuthService,

    // Used to navigate after login (redirect to home page)
    private router: Router,

    /**
     * Used to ensure state updates happen inside Angular zone.
     * Helpful when async callbacks might run outside Angular (rare but possible).
     */
    private zone: NgZone,

    /**
     * Allows forcing UI refresh immediately (spinner/error state).
     */
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Handles login form submission:
   * - prevents double submit
   * - calls backend login endpoint
   * - on success: stores token + user and navigates to home
   * - on error: shows friendly message
   */
  submit(): void {
    // Prevent double-click submissions
    if (this.loading) return;

    // Update UI immediately (show spinner, clear previous error)
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.api.login(this.form).subscribe({
      next: ({ token, user }) => {
        // Ensure updates happen inside Angular change detection
        this.zone.run(() => {
          // Save session (typically: localStorage + in-memory user state)
          this.auth.setSession(token, user);

          // Stop spinner
          this.loading = false;
          this.cdr.detectChanges();

          // Redirect user after successful login
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        this.zone.run(() => {
          // Helpful logging during development
          console.log('login error status:', err?.status, 'body:', err?.error);

          this.loading = false;

          // Friendly message depending on status code
          this.error =
            err?.status === 401
              ? 'Wrong email or password!'
              : err?.error?.message || err?.message || 'Login failed.';

          this.cdr.detectChanges();
        });
      },
    });
  }

  /**
   * If the user is already logged in, redirect them away from the login page.
   * Prevents showing login form to authenticated users.
   */
  ngOnInit(): void {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }
}
