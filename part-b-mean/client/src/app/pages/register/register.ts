import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { finalize, timeout } from 'rxjs/operators';
import {
  SummaryModalComponent,
  SummaryRow,
} from '../../components/summary-modal/summary-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SummaryModalComponent],
  templateUrl: './register.html',
})
export class Register implements OnInit {
  // ---------------------------
  // UI state
  // ---------------------------
  loading = false; // shows "Creating..." / "Updating..." spinner states
  error = '';      // shows error message in UI
  success = '';    // shows success message in UI

  /**
   * When true, this page acts as "Profile" page instead of registration:
   * - loads /me
   * - allows updating profile info (PUT /me)
   * - shows user enrollments
   */
  isProfileMode = false;

  // User enrollments shown only in profile mode
  enrollments: any[] = [];

  // ---------------------------
  // Summary modal state (used in register mode)
  // ---------------------------
  modalOpen = false;
  modalTitle = 'Review Your Information';
  summaryRows: SummaryRow[] = [];

  /**
   * Template-driven form model (ngModel binds to these fields).
   * Includes extra UI-only fields:
   * - confirmPassword (client-side validation only)
   */
  form = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    dob: '',
    interest: '',
    level: '',
    goal: '',
    newsletter: false,
    password: '',
    confirmPassword: '',
  };

  /**
   * Stores the payload that will be sent to the backend after user confirms
   * the summary modal. This prevents sending data before the final confirmation.
   */
  private pendingRegisterPayload: any = null;

  constructor(
    // Service for REST API calls
    private api: ApiService,

    // For navigation (redirects after register/login/logout)
    private router: Router,

    // Auth/session state (token + active user)
    public auth: AuthService,

    // Helps force UI refresh after async operations
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // If user is logged in, this page becomes "Profile" mode
    this.isProfileMode = this.auth.isLoggedIn;

    if (this.isProfileMode) {
      /**
       * PROFILE MODE:
       * 1) Load current user profile (/me)
       * 2) Load user enrollments list
       */

      // Load profile
      this.api
        .getMe()
        .pipe(
          catchError((err) => {
            /**
             * If token is expired/invalid, backend returns 401.
             * In that case log out and fall back to registration mode.
             */
            if (err?.status === 401) this.auth.logout();
            this.isProfileMode = false;
            return of(null);
          })
        )
        .subscribe((me: any) => {
          if (!me) return;

          // Fill form with server profile data (password fields remain empty)
          this.form = {
            ...this.form,
            ...me,
            dob: me?.dob ? String(me.dob).slice(0, 10) : '',
            password: '',
            confirmPassword: '',
          };

          // Force UI update (template-driven forms sometimes benefit from this)
          this.cdr.detectChanges();
        });

      // Load enrollments list (GET /api/enrollments/me/enrollments)
      this.api.getMyEnrollments().subscribe({
        next: (rows: any[]) => {
          console.log('enrollments response:', rows);
          this.enrollments = rows || [];
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('getMyEnrollments failed:', err);
          this.enrollments = [];
          this.cdr.detectChanges();
        },
      });
    }
  }

  /**
   * Handles form submit for BOTH modes:
   * - Profile mode: updates user profile (PUT /me) with no confirmation modal
   * - Register mode: validates -> checks availability -> shows summary modal
   */
  submit(f: any): void {
    this.error = '';
    this.success = '';
    this.modalOpen = false;

    // If the Angular form is invalid, show an explicit message
    if (f?.invalid) {
      // If password fails the pattern validator, show a specific hint
      if (f?.controls?.password?.errors?.['pattern']) {
        this.error = 'Password must contain at least one letter and one number.';
      } else {
        this.error = 'Please complete all required fields before continuing.';
      }
      return;
    }

    // Normalize DOB to ISO string if present (backend expects a date)
    const dobIso = this.form.dob ? new Date(this.form.dob).toISOString() : '';

    // ---------------------------
    // PROFILE MODE (UPDATE /me)
    // ---------------------------
    if (this.isProfileMode) {
      this.loading = true;

      // Build payload excluding password fields (profile update only)
      const payload = {
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        userName: this.form.userName,
        email: this.form.email,
        dob: dobIso,
        interest: this.form.interest,
        level: this.form.level,
        goal: this.form.goal,
        newsletter: this.form.newsletter,
      };

      this.api
        .updateMe(payload)
        .pipe(
          // If server/proxy hangs, throw error after 8s
          timeout(8000),

          /**
           * finalize runs for both success and error:
           * ensures spinner always stops and UI refreshes.
           */
          finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({
          next: (user: any) => {
            this.success = 'Profile updated successfully.';

            // Update form immediately with server "source of truth"
            this.form = {
              ...this.form,
              ...user,
              dob: user?.dob ? String(user.dob).slice(0, 10) : this.form.dob,
              password: '',
              confirmPassword: '',
            };

            // Keep localStorage user profile in sync
            localStorage.setItem('activeUser', JSON.stringify(user));
          },
          error: (err) => {
            this.error = this.serverMessage(err);
          },
        });

      return;
    }

    // ---------------------------
    // REGISTER MODE (validations + modal confirmation)
    // ---------------------------

    // Age validation before server request
    if (!this.isAtLeast18(this.form.dob)) {
      this.loading = false;
      this.error = 'You must be at least 18 years old to register.';
      return;
    }

    // Password confirmation validation
    if (this.form.password !== this.form.confirmPassword) {
      this.loading = false;
      this.error = 'Passwords do not match.';
      return;
    }

    /**
     * Before opening the modal, check username/email availability
     * so we can show conflicts early (better UX).
     */
    this.loading = true;

    this.api
      .checkUserAvailability(this.form.email, this.form.userName)
      .pipe(
        timeout(8000),
        finalize(() => {
          // Stop spinner no matter what happens
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          // Build payload but DO NOT submit yet (wait for modal confirmation)
          this.pendingRegisterPayload = {
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            userName: this.form.userName,
            email: this.form.email,
            dob: dobIso,
            interest: this.form.interest,
            level: this.form.level,
            goal: this.form.goal,
            newsletter: this.form.newsletter,
            password: this.form.password,
          };

          // Build summary rows shown in the confirmation modal
          const fullName = `${this.form.firstName} ${this.form.lastName}`.trim();
          this.summaryRows = [
            { label: 'Name', value: fullName },
            { label: 'Username', value: this.form.userName },
            { label: 'Email', value: this.form.email },
            { label: 'Preferred Category', value: this.form.interest },
            { label: 'Experience Level', value: this.form.level },
            { label: 'Learning Goal', value: this.prettyGoal(this.form.goal) },
            { label: 'Newsletter', value: this.form.newsletter ? 'Yes' : 'No' },
          ];

          this.modalTitle = 'Review Your Information';
          this.modalOpen = true;

          this.cdr.detectChanges();
        },
        error: (err) => {
          // If availability check fails, do not open modal
          this.modalOpen = false;
          this.error = this.serverMessage(err);
        },
      });
  }

  /**
   * Closes the confirmation modal without submitting.
   */
  closeModal(): void {
    this.modalOpen = false;
  }

  /**
   * Called when user confirms registration inside the summary modal.
   * Actually sends POST /api/users with pendingRegisterPayload.
   */
  confirmRegistration(): void {
    if (!this.pendingRegisterPayload) {
      this.modalOpen = false;
      return;
    }

    this.modalOpen = false;
    this.loading = true;
    this.error = '';
    this.success = '';

    this.api.registerUser(this.pendingRegisterPayload).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful! Please log in.';
        this.pendingRegisterPayload = null;

        // Redirect to login page (no token is created by register)
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.modalOpen = false;
        this.error = err?.error?.message || 'Registration failed.';
      },
    });
  }

  /**
   * Extracts a friendly message from different error shapes.
   */
  private serverMessage(err: any): string {
    return err?.error?.message || err?.message || 'Request failed.';
  }

  /**
   * Returns true if the given DOB is at least 18 years ago.
   */
  private isAtLeast18(dob: string): boolean {
    const d = new Date(dob);
    if (isNaN(d.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age >= 18;
  }

  /**
   * Logs out user and redirects to home.
   */
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  // ---------------------------
  // Pretty/Display helpers
  // ---------------------------

  /**
   * Converts goal codes (stored in form) into a user-friendly label.
   */
  private prettyGoal(v: string): string {
    switch (v) {
      case 'exam-prep':
        return 'Exam preparation';
      case 'portfolio':
        return 'Build a portfolio';
      case 'career':
        return 'Career growth';
      case 'curiosity':
        return 'Learn out of curiosity';
      default:
        return '—';
    }
  }
}
