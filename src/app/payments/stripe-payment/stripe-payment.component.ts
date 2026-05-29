import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentService } from '../payment.service';
import { JobService } from '../../jobs/job.service';
import { PaymentMethod, PaymentType } from '../models/payment.models';
import { Job } from '../../jobs/models';

@Component({
    selector: 'app-stripe-payment',
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatSnackBarModule
    ],
    templateUrl: './stripe-payment.component.html',
    styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  redirecting = false;
  jobId = '';
  currency = 'ZAR';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private jobService: JobService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('jobId') || '';
    if (!this.jobId) {
      this.router.navigate(['/payments']);
      return;
    }
    this.jobService.getJobById(this.jobId).subscribe({
      next: job => { this.job = job; this.loading = false; },
      error: () => { this.router.navigate(['/payments']); }
    });
  }

  proceedToPayment(): void {
    if (!this.job) return;
    this.redirecting = true;

    this.paymentService.createCheckout({
      jobId: this.jobId,
      amount: this.job.budget,
      currency: this.currency,
      paymentMethod: PaymentMethod.CARD,
      paymentType: PaymentType.JOB_ESCROW,
      description: `Escrow payment for: ${this.job.title}`
    }).subscribe({
      next: res => { window.location.href = res.checkoutUrl; },
      error: () => {
        this.redirecting = false;
        this.snackBar.open('Failed to start payment. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: this.currency }).format(amount);
  }
}
