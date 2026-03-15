import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth.service';

type VerifyState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-email-verify',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './email-verify.component.html',
  styleUrl: './email-verify.component.scss'
})
export class EmailVerifyComponent implements OnInit {
  state: VerifyState = 'loading';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.state = 'error';
      this.errorMessage = 'Verification link is invalid or missing.';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.state = 'success';
        // Brief pause so the user sees the success state, then redirect
        setTimeout(() => {
          const user = this.authService.currentUserValue;
          // New users have no completed profile — send them to setup
          this.router.navigate(
            user?.profileCompleted === false ? ['/profile/setup'] : ['/jobs']
          );
        }, 1500);
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage =
          err.error?.message ||
          'This verification link is invalid or has expired.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
