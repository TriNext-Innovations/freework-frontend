import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { PaymentService } from '../payment.service';
import { Payment, PaymentMethod, PaymentType, Milestone } from '../models/payment.models';

@Component({
  selector: 'app-payment-escrow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './payment-escrow.component.html',
  styleUrls: ['./payment-escrow.component.scss']
})
export class PaymentEscrowComponent implements OnInit {
  @Input() jobId!: string;
  @Input() jobTitle!: string;
  @Input() jobAmount!: number;

  payments: Payment[] = [];
  milestones: Milestone[] = [];
  loading = false;
  processing = false;

  // Payment form
  amount = 0;
  currency = 'ZAR';
  paymentMethod = PaymentMethod.CARD;
  paymentType = PaymentType.JOB_ESCROW;
  description = '';

  // Milestone form
  showMilestoneForm = false;
  milestoneTitle = '';
  milestoneDescription = '';
  milestoneAmount = 0;
  milestoneDueDate = '';

  PaymentMethod = PaymentMethod;
  PaymentType = PaymentType;

  constructor(
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.jobAmount) {
      this.amount = this.jobAmount;
    }
    this.loadPayments();
    this.loadMilestones();
  }

  loadPayments(): void {
    if (!this.jobId) return;

    this.loading = true;
    this.paymentService.getJobPayments(this.jobId).subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.showError('Failed to load payments');
        this.loading = false;
      }
    });
  }

  loadMilestones(): void {
    if (!this.jobId) return;

    this.paymentService.getMilestones(this.jobId).subscribe({
      next: (milestones) => {
        this.milestones = milestones;
      },
      error: (error) => {
        console.error('Error loading milestones:', error);
      }
    });
  }

  createEscrowPayment(): void {
    if (!this.jobId || !this.amount || this.amount <= 0) {
      this.showError('Please enter a valid amount');
      return;
    }
    // Navigate to the checkout page — backend redirects to payment provider
    this.router.navigate(['/payments/create', this.jobId]);
  }

  processEscrowPayment(): void {
    this.processing = true;

    const request = {
      jobId: this.jobId,
      amount: this.amount,
      currency: this.currency,
      paymentMethod: this.paymentMethod,
      paymentType: this.paymentType,
      description: this.description || `Escrow payment for ${this.jobTitle}`
    };

    this.paymentService.createEscrowPayment(request).subscribe({
      next: (payment) => {
        this.showSuccess('Payment escrowed successfully!');
        this.payments.unshift(payment);
        this.processing = false;
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating escrow payment:', error);
        this.showError('Failed to create escrow payment');
        this.processing = false;
      }
    });
  }

  releasePayment(payment: Payment): void {
    if (payment.status !== 'ESCROWED') {
      this.showError('Only escrowed payments can be released');
      return;
    }

    if (!confirm(`Are you sure you want to release $${payment.amount} to the freelancer?`)) {
      return;
    }

    this.processing = true;

    this.paymentService.releasePayment({
      paymentId: payment.id,
      amount: payment.amount,
      reason: 'Work completed successfully'
    }).subscribe({
      next: (updatedPayment) => {
        this.showSuccess('Payment released successfully!');
        const index = this.payments.findIndex(p => p.id === payment.id);
        if (index !== -1) {
          this.payments[index] = updatedPayment;
        }
        this.processing = false;
      },
      error: (error) => {
        console.error('Error releasing payment:', error);
        this.showError('Failed to release payment');
        this.processing = false;
      }
    });
  }

  refundPayment(payment: Payment): void {
    const reason = prompt('Please provide a reason for the refund:');
    if (!reason) return;

    this.processing = true;

    this.paymentService.refundPayment({
      paymentId: payment.id,
      amount: payment.amount,
      reason: reason
    }).subscribe({
      next: (updatedPayment) => {
        this.showSuccess('Payment refunded successfully!');
        const index = this.payments.findIndex(p => p.id === payment.id);
        if (index !== -1) {
          this.payments[index] = updatedPayment;
        }
        this.processing = false;
      },
      error: (error) => {
        console.error('Error refunding payment:', error);
        this.showError('Failed to refund payment');
        this.processing = false;
      }
    });
  }

  createMilestone(): void {
    if (!this.milestoneTitle || !this.milestoneAmount || !this.milestoneDueDate) {
      this.showError('Please fill in all milestone fields');
      return;
    }

    this.processing = true;

    const milestone: Partial<Milestone> = {
      jobId: this.jobId,
      title: this.milestoneTitle,
      description: this.milestoneDescription,
      amount: this.milestoneAmount,
      dueDate: new Date(this.milestoneDueDate)
    };

    this.paymentService.createMilestone(milestone).subscribe({
      next: (newMilestone) => {
        this.showSuccess('Milestone created successfully!');
        this.milestones.push(newMilestone);
        this.processing = false;
        this.resetMilestoneForm();
      },
      error: (error) => {
        console.error('Error creating milestone:', error);
        this.showError('Failed to create milestone');
        this.processing = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'warn',
      'PROCESSING': 'accent',
      'COMPLETED': 'primary',
      'ESCROWED': 'accent',
      'RELEASED': 'primary',
      'FAILED': 'warn',
      'REFUNDED': 'warn',
      'CANCELLED': 'warn'
    };
    return colors[status] || 'primary';
  }

  getMilestoneStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'default',
      'IN_PROGRESS': 'accent',
      'COMPLETED': 'primary',
      'PAID': 'primary'
    };
    return colors[status] || 'default';
  }

  getTotalEscrowed(): number {
    return this.payments
      .filter(p => p.status === 'ESCROWED')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  getTotalReleased(): number {
    return this.payments
      .filter(p => p.status === 'RELEASED')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  resetForm(): void {
    this.description = '';
  }

  resetMilestoneForm(): void {
    this.milestoneTitle = '';
    this.milestoneDescription = '';
    this.milestoneAmount = 0;
    this.milestoneDueDate = '';
    this.showMilestoneForm = false;
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
