import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LegalService } from '../legal.service';

@Component({
  selector: 'app-unsubscribe',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './unsubscribe.component.html',
  styleUrl: './unsubscribe.component.scss'
})
export class UnsubscribeComponent implements OnInit {
  loading = true;
  success = false;
  error = false;
  email = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private legalService: LegalService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.loading = false;
      this.error = true;
      this.errorMessage = 'No unsubscribe token provided.';
      return;
    }

    this.legalService.unsubscribeByToken(token).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        this.email = response.email;
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.errorMessage = err.error?.error || 'Invalid or expired unsubscribe link.';
      }
    });
  }
}
