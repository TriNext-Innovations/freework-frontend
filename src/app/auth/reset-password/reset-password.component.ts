import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth.service';

function confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const parent = control.parent;
  if (!parent) return null;
  return parent.get('newPassword')?.value === control.value ? null : { mismatch: true };
}

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token = '';
  loading = false;
  success = false;
  invalidToken = false;
  errorMessage = '';
  hidePassword = true;
  hideConfirm = true;

  private readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-]).+$/;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.PASSWORD_PATTERN)]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator]]
    });

    this.form.get('newPassword')?.valueChanges.subscribe(() => {
      this.form.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) this.invalidToken = true;
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading || !this.token) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.resetPassword(this.token, this.form.value.newPassword as string).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading = false;
        const msg = (err?.error?.message ?? '').toLowerCase();
        if (msg.includes('invalid') || msg.includes('expired')) {
          this.invalidToken = true;
        } else {
          this.errorMessage = 'Something went wrong. Please try again or request a new reset link.';
        }
      }
    });
  }
}
