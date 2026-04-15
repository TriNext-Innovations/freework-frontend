import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * Landing page for the email-verification redirect from the backend.
 *
 * Flow:
 * 1. User clicks the verification link in their email
 * 2. Browser hits GET /auth/verify?token=<uuid> on the backend
 * 3. Backend validates and issues a one-time exchange code (5-min TTL)
 * 4. Backend redirects the browser here: /auth/verified?code=<uuid>
 * 5. This component POSTs the code to /auth/exchange-code → receives JWT
 * 6. AuthService stores the JWT and navigates to the appropriate next page
 *
 * The JWT never appears in the URL, preventing exposure in browser history,
 * server access logs, and Referer headers.
 */
@Component({
  selector: 'app-email-verified',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  template: `
    <div class="verify-container">
      <mat-card class="verify-card">
        <mat-card-content>
          <ng-container *ngIf="loading">
            <mat-spinner diameter="48"></mat-spinner>
            <p>Verifying your email...</p>
          </ng-container>

          <ng-container *ngIf="!loading && success">
            <mat-icon class="success-icon">check_circle</mat-icon>
            <h2>Email Verified!</h2>
            <p>Your account has been verified. Signing you in...</p>
          </ng-container>

          <ng-container *ngIf="!loading && !success">
            <mat-icon class="error-icon">error</mat-icon>
            <h2>Verification Failed</h2>
            <p>{{ errorMessage }}</p>
            <div class="actions">
              <a mat-raised-button color="primary" routerLink="/login">Sign In</a>
              <a mat-stroked-button routerLink="/register">Register Again</a>
            </div>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .verify-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    .verify-card {
      text-align: center;
      padding: 2rem;
      max-width: 420px;
      width: 100%;
    }
    mat-spinner { margin: 0 auto 1rem; }
    .success-icon { font-size: 4rem; width: 4rem; height: 4rem; color: #2BB88A; }
    .error-icon  { font-size: 4rem; width: 4rem; height: 4rem; color: #f44336; }
    h2 { margin: 0.5rem 0; }
    .actions { display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem; flex-wrap: wrap; }
  `]
})
export class EmailVerifiedComponent implements OnInit {
  loading = true;
  success = false;
  errorMessage = 'The verification link is invalid or has expired. Please register again or request a new verification email.';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (error) {
      this.loading = false;
      this.errorMessage = error === 'expired'
        ? 'Your verification link has expired. Please register again to receive a new one.'
        : 'The verification link is invalid or has already been used.';
      return;
    }

    if (!code) {
      this.loading = false;
      return;
    }

    this.authService.exchangeCode(code).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        // AuthService.handleAuthResponse() already navigated based on profileCompleted.
        // Give the user a moment to see the success message before the navigation kicks in.
        setTimeout(() => {
          const user = this.authService.currentUserValue;
          this.router.navigate([user?.profileCompleted === false ? '/profile/setup' : '/jobs']);
        }, 1500);
      },
      error: () => {
        this.loading = false;
        this.success = false;
      }
    });
  }
}
