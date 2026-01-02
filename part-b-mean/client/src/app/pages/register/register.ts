import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register implements OnInit {
  loading = false;
  error = '';
  success = '';

  isProfileMode = false;
  enrollments: any[] = [];

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

  constructor(
    private api: ApiService,
    private router: Router,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.isProfileMode = this.auth.isLoggedIn;

    if (this.isProfileMode) {
      // Load profile
      this.api.getMe().pipe(
        catchError((err) => {
          // token might be expired -> logout and stay in register mode
          if (err?.status === 401) this.auth.logout();
          this.isProfileMode = false;
          return of(null);
        })
      ).subscribe((me: any) => {
        if (!me) return;

        this.form = {
          ...this.form,
          ...me,
          dob: me?.dob ? String(me.dob).slice(0, 10) : '',
          password: '',
          confirmPassword: '',
        };

        this.cdr.detectChanges(); //  force UI update
      });

      // Load enrollments list
      this.api.getMyEnrollments().subscribe({
        next: (rows: any[]) => {
          console.log('enrollments response:', rows);
          this.enrollments = rows || [];
          this.cdr.detectChanges(); // force UI update
        },
        error: (err) => {
          console.error('getMyEnrollments failed:', err);
          this.enrollments = [];
          this.cdr.detectChanges(); // force UI update
        }
      });
    }
  }

  submit(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    // normalize DOB if present
    const dobIso = this.form.dob ? new Date(this.form.dob).toISOString() : '';

    if (this.isProfileMode) {
      // PROFILE UPDATE (no passwords here)
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

      this.api.updateMe(payload).subscribe({
        next: (user: any) => {
          this.loading = false;
          this.success = 'Profile updated successfully.';

          // keep local storage in sync
          localStorage.setItem('activeUser', JSON.stringify(user));
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Update failed.';
        },
      });

      return;
    }

    // REGISTER MODE
    if (!this.isAtLeast18(this.form.dob)) {
      this.loading = false;
      this.error = 'You must be at least 18 years old to register.';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.loading = false;
      this.error = 'Passwords do not match.';
      return;
    }

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
      password: this.form.password,
    };

    this.api.registerUser(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful! Please log in.';
        // don't fake logged in without a token
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed.';
      },
    });
  }

  private isAtLeast18(dob: string): boolean {
    const d = new Date(dob);
    if (isNaN(d.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age >= 18;
  }
  
  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
