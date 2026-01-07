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
  loading = false;
  error = '';
  success = '';

  isProfileMode = false;
  enrollments: any[] = [];

  //summary-modal
  modalOpen = false;
  modalTitle = 'Review Your Information';
  summaryRows: SummaryRow[] = [];

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

  //keeping the payload that will be sent after confirmation
  private pendingRegisterPayload: any = null;

  constructor(
    private api: ApiService,
    private router: Router,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isProfileMode = this.auth.isLoggedIn;

    if (this.isProfileMode) {
      // Load profile
      this.api
        .getMe()
        .pipe(
          catchError((err) => {
            // token might be expired -> logout and stay in register mode
            if (err?.status === 401) this.auth.logout();
            this.isProfileMode = false;
            return of(null);
          })
        )
        .subscribe((me: any) => {
          if (!me) return;

          this.form = {
            ...this.form,
            ...me,
            dob: me?.dob ? String(me.dob).slice(0, 10) : '',
            password: '',
            confirmPassword: '',
          };

          this.cdr.detectChanges(); //force UI update
        });

      // Load enrollments list
      this.api.getMyEnrollments().subscribe({
        next: (rows: any[]) => {
          console.log('enrollments response:', rows);
          this.enrollments = rows || [];
          this.cdr.detectChanges(); //force UI update
        },
        error: (err) => {
          console.error('getMyEnrollments failed:', err);
          this.enrollments = [];
          this.cdr.detectChanges(); //force UI update
        },
      });
    }
  }

  submit(f: any): void {
    this.error = '';
    this.success = '';
    this.modalOpen = false;

    //show error instead of silently disabling
    if (f?.invalid) {
      // if password pattern fails, show that message instead
      if (f?.controls?.password?.errors?.['pattern']) {
        this.error = 'Password must contain at least one letter and one number.';
      } else {
        this.error = 'Please complete all required fields before continuing.';
      }
      return;
    }

    // normalize DOB if present
    const dobIso = this.form.dob ? new Date(this.form.dob).toISOString() : '';

    //profile mode: no modal
    if (this.isProfileMode) {
      this.loading = true;
      // PROFILE UPDATE no passwords here
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
      timeout(8000),
      finalize(() => {
        this.loading = false;         // ✅ always stop "Updating..."
        this.cdr.detectChanges();     // ✅ update UI instantly
      })
    )
    .subscribe({
      next: (user: any) => {
        this.success = 'Profile updated successfully.';

        //update the UI form immediately with server truth
        this.form = {
          ...this.form,
          ...user,
          dob: user?.dob ? String(user.dob).slice(0, 10) : this.form.dob,
          password: '',
          confirmPassword: '',
        };

        //keep local storage in sync 
        localStorage.setItem('activeUser', JSON.stringify(user));
      },
      error: (err) => {
        this.error = this.serverMessage(err);
      },
    });

      return;
    }

    // REGISTER MODE validations
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
    //check duplicates (email / username) before opening the modal
    this.loading = true;
    //Ask server first: show conflict errors BEFORE modal
    this.api
      .checkUserAvailability(this.form.email, this.form.userName)
      .pipe(
        timeout(8000), // if server/proxy hangs, throw error after 8s
        finalize(() => {
          // ALWAYS stop spinner, even if error happens somewhere unexpected
          this.loading = false; // stop creating
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          // build payload (not submit yet)
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

          this.cdr.detectChanges(); // force UI update
        },
        error: (err) => {
          this.modalOpen = false;
          this.error = this.serverMessage(err);
        },
      });
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  confirmRegistration(): void {
    //user clicked confirm registration on modal
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
        // avoid fake logged in without a token
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.modalOpen = false;
        this.error = err?.error?.message || 'Registration failed.';
      },
    });
  }
  private serverMessage(err: any): string {
    return err?.error?.message || err?.message || 'Request failed.';
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

  // pretty methods
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
