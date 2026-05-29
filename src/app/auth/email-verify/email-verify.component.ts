import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-email-verify',
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
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
            <p>Your account has been verified. You can now sign in.</p>
            <a mat-raised-button color="primary" routerLink="/login">Sign In</a>
          </ng-container>
          <ng-container *ngIf="!loading && !success">
            <mat-icon class="error-icon">error</mat-icon>
            <h2>Verification Failed</h2>
            <p>{{ errorMessage }}</p>
            <a mat-raised-button routerLink="/login">Back to Login</a>
          </ng-container>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .verify-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .verify-card { text-align: center; padding: 2rem; max-width: 400px; }
    .success-icon { font-size: 4rem; width: 4rem; height: 4rem; color: #2BB88A; }
    .error-icon { font-size: 4rem; width: 4rem; height: 4rem; color: #f44336; }
  `]
})
export class EmailVerifyComponent implements OnInit {
  loading = true;
  success = false;
  errorMessage = 'The verification link is invalid or has expired.';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading = false;
      return;
    }
    this.http.get(`/api/auth/verify-email?token=${token}`).subscribe({
      next: () => { this.loading = false; this.success = true; },
      error: () => { this.loading = false; }
    });
  }
}
