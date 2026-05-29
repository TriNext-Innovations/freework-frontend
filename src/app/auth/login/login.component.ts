import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../auth.service';
import { LoginRequest, RegisterRequest } from '../models';
import { LegalService } from '../../legal/legal.service';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatRadioModule,
        MatCheckboxModule,
        FormsModule,
        RouterLink,
        MatDividerModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  authForm!: FormGroup;

  isRegister = false;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';
  returnUrl = '/';
  registrationComplete = false;
  registeredEmail = '';

  // Consent step (register only)
  tcVersion = '1.0';
  privacyVersion = '1.0';
  termsAccepted = false;
  privacyAccepted = false;
  marketingConsented = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private legalService: LegalService
  ) {}

  get consentValid(): boolean {
    if (!this.isRegister) return true;
    return this.termsAccepted && this.privacyAccepted;
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
      return;
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Fetch current document versions for consent recording
    this.legalService.getCurrentVersion('freelancer_tcs').subscribe({ next: r => this.tcVersion = r.version, error: () => {} });

    // Single form with all controls — validators added/removed on toggle
    this.authForm = this.fb.group({
      firstName:       [''],
      lastName:        [''],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', [Validators.required]],
      confirmPassword: [''],
      role:            ['FREELANCER']
    }, { validators: this.passwordMatchValidator });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.authForm.controls;
  }

  toggleMode(): void {
    this.isRegister = !this.isRegister;
    this.errorMessage = '';
    this.authForm.reset({ role: 'FREELANCER' });
    this.hidePassword = true;
    this.hideConfirmPassword = true;
    this.termsAccepted = false;
    this.privacyAccepted = false;
    this.marketingConsented = false;

    if (this.isRegister) {
      this.f['firstName'].setValidators([Validators.required, Validators.minLength(2)]);
      this.f['lastName'].setValidators([Validators.required, Validators.minLength(2)]);
      this.f['password'].setValidators([
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]);
      this.f['confirmPassword'].setValidators([Validators.required]);
    } else {
      this.f['firstName'].clearValidators();
      this.f['lastName'].clearValidators();
      this.f['password'].setValidators([Validators.required]);
      this.f['confirmPassword'].clearValidators();
    }

    ['firstName', 'lastName', 'password', 'confirmPassword'].forEach(k => {
      this.f[k].updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      Object.keys(this.authForm.controls).forEach(k => this.authForm.get(k)?.markAsTouched());
      return;
    }

    if (this.isRegister && !this.consentValid) {
      this.errorMessage = 'You must accept the Terms and Conditions and Privacy Policy to register.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.isRegister) {
      const role = this.authForm.value.role || 'FREELANCER';
      const tcsType = role === 'CUSTOMER' ? 'business_tcs' : 'freelancer_tcs';

      const userData: RegisterRequest = {
        fullName: this.authForm.value.firstName + ' ' + this.authForm.value.lastName,
        email:    this.authForm.value.email,
        password: this.authForm.value.password,
        role,
        consents: [
          { consentType: tcsType, version: this.tcVersion, consented: this.termsAccepted },
          { consentType: 'privacy_policy', version: this.privacyVersion, consented: this.privacyAccepted },
          { consentType: 'marketing_emails', version: '1.0', consented: this.marketingConsented }
        ]
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.loading = false;
          this.registeredEmail = userData.email;
          this.registrationComplete = true;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        }
      });

    } else {
      const credentials: LoginRequest = {
        email:    this.authForm.value.email,
        password: this.authForm.value.password
      };

      this.authService.login(credentials).subscribe({
        next: () => {
          this.authService.fetchUserProfile().subscribe({
            next: (user) => {
              this.loading = false;
              this.router.navigate(user.profileCompleted === false ? ['/profile/setup'] : [this.returnUrl || '/jobs']);
            },
            error: () => {
              this.loading = false;
              this.router.navigate([this.returnUrl || '/jobs']);
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
        }
      });
    }
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const pw  = group.get('password')?.value;
    const cpw = group.get('confirmPassword')?.value;
    if (!cpw) return null;
    return pw === cpw ? null : { passwordMismatch: true };
  }
}
