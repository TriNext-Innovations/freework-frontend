import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../auth.service';
import { RegisterRequest, ConsentItemData } from '../models';

@Component({
    selector: 'app-register',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatRadioModule,
        MatCheckboxModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', [Validators.required]],
      role: ['FREELANCER', [Validators.required]],
      // Freelancer-specific consents
      freelancerTcsAccepted: [false],
      freelancerPrivacyAccepted: [false],
      freelancerTaxAccepted: [false],
      freelancerAgeConfirmed: [false],
      // Business-specific consents
      businessTcsAccepted: [false],
      businessPrivacyAccepted: [false],
      businessContractorAcknowledged: [false],
      businessAuthorityConfirmed: [false],
      businessAgeConfirmed: [false],
      // Common optional
      marketingEmails: [false]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  get selectedRole(): string {
    return this.registerForm.get('role')?.value || 'FREELANCER';
  }

  get isFreelancer(): boolean {
    return this.selectedRole === 'FREELANCER';
  }

  get requiredConsentsSatisfied(): boolean {
    const v = this.registerForm.value;
    if (this.isFreelancer) {
      return v.freelancerTcsAccepted && v.freelancerPrivacyAccepted &&
             v.freelancerTaxAccepted && v.freelancerAgeConfirmed;
    } else {
      return v.businessTcsAccepted && v.businessPrivacyAccepted &&
             v.businessContractorAcknowledged && v.businessAuthorityConfirmed &&
             v.businessAgeConfirmed;
    }
  }

  passwordMatchValidator(group: FormGroup): Record<string, boolean> | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    if (!this.requiredConsentsSatisfied) {
      this.showError('Please accept all required terms and conditions to continue.');
      return;
    }

    this.loading = true;
    const v = this.registerForm.value;

    const userData: RegisterRequest = {
      fullName: v.firstName + ' ' + v.lastName,
      email: v.email,
      password: v.password,
      role: v.role,
      consents: this.buildConsents()
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.showSuccess('Registration successful! Please check your email to verify your account.');
        this.router.navigate(['/verify']);
      },
      error: (error) => {
        this.loading = false;
        const message = error.error?.message || 'Registration failed. Please try again.';
        this.showError(message);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private buildConsents(): ConsentItemData[] {
    const v = this.registerForm.value;
    const consents: ConsentItemData[] = [];

    if (this.isFreelancer) {
      consents.push({ consentType: 'freelancer_tcs', version: '1.0', consented: v.freelancerTcsAccepted });
      consents.push({ consentType: 'privacy_policy', version: '1.0', consented: v.freelancerPrivacyAccepted });
      consents.push({ consentType: 'tax_acknowledgement', version: '1.0', consented: v.freelancerTaxAccepted });
      consents.push({ consentType: 'age_confirmation', version: '1.0', consented: v.freelancerAgeConfirmed });
    } else {
      consents.push({ consentType: 'business_tcs', version: '1.0', consented: v.businessTcsAccepted });
      consents.push({ consentType: 'privacy_policy', version: '1.0', consented: v.businessPrivacyAccepted });
      consents.push({ consentType: 'contractor_acknowledgement', version: '1.0', consented: v.businessContractorAcknowledged });
      consents.push({ consentType: 'authority_confirmation', version: '1.0', consented: v.businessAuthorityConfirmed });
      consents.push({ consentType: 'age_confirmation', version: '1.0', consented: v.businessAgeConfirmed });
    }

    consents.push({ consentType: 'marketing_emails', version: '1.0', consented: v.marketingEmails });
    return consents;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
