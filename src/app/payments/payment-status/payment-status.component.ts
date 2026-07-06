import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PaymentService } from '../payment.service';
import { PaymentStatus, PaymentStatusUpdate } from '../models/payment.models';

@Component({
    selector: 'app-payment-status',
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatProgressBarModule
    ],
    templateUrl: './payment-status.component.html',
    styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {
  private paymentService = inject(PaymentService);

  @Input() paymentId?: string;
  @Input() showRealTimeUpdates = true;

  currentStatus?: PaymentStatus;
  statusMessage?: string;
  lastUpdated?: Date;

  PaymentStatus = PaymentStatus;

  statusSteps = [
    { status: PaymentStatus.PENDING, label: 'Pending', icon: 'schedule' },
    { status: PaymentStatus.PROCESSING, label: 'Processing', icon: 'sync' },
    { status: PaymentStatus.ESCROWED, label: 'Escrowed', icon: 'lock' },
    { status: PaymentStatus.RELEASED, label: 'Released', icon: 'check_circle' }
  ];

  ngOnInit(): void {
    if (this.paymentId) {
      this.loadPaymentStatus();
    }

    if (this.showRealTimeUpdates) {
      this.subscribeToStatusUpdates();
    }
  }

  loadPaymentStatus(): void {
    if (!this.paymentId) return;

    this.paymentService.getPayment(this.paymentId).subscribe({
      next: (payment) => {
        this.currentStatus = payment.status;
        this.lastUpdated = payment.updatedAt;
      },
      error: (error) => {
        console.error('Error loading payment status:', error);
      }
    });
  }

  subscribeToStatusUpdates(): void {
    this.paymentService.paymentStatus$.subscribe({
      next: (update: PaymentStatusUpdate | null) => {
        if (update && (!this.paymentId || update.paymentId === this.paymentId)) {
          this.currentStatus = update.status;
          this.statusMessage = update.message;
          this.lastUpdated = update.updatedAt;
        }
      }
    });
  }

  /** Brand status-pill class (custom span pill, not mat-chip). */
  getStatusClass(status: PaymentStatus | undefined): string {
    return 'pstatus-' + (status || '').toString().toLowerCase();
  }

  getStatusColor(status: PaymentStatus): string {
    const colors: Record<string, string> = {
      [PaymentStatus.PENDING]: 'warn',
      [PaymentStatus.PROCESSING]: 'accent',
      [PaymentStatus.COMPLETED]: 'primary',
      [PaymentStatus.ESCROWED]: 'accent',
      [PaymentStatus.RELEASED]: 'primary',
      [PaymentStatus.FAILED]: 'warn',
      [PaymentStatus.REFUNDED]: 'warn',
      [PaymentStatus.CANCELLED]: 'warn'
    };
    return colors[status] || 'primary';
  }

  getCurrentStep(): number {
    if (!this.currentStatus) return 0;
    const stepIndex = this.statusSteps.findIndex(step => step.status === this.currentStatus);
    return stepIndex >= 0 ? stepIndex : 0;
  }

  isStepCompleted(index: number): boolean {
    return index <= this.getCurrentStep();
  }

  isStepActive(index: number): boolean {
    return index === this.getCurrentStep();
  }

  getProgressPercentage(): number {
    const currentStep = this.getCurrentStep();
    return ((currentStep + 1) / this.statusSteps.length) * 100;
  }
}
