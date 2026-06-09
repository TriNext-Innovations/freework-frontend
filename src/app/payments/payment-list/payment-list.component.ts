import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { PaymentService } from '../payment.service';
import { Payment, PaymentStatus } from '../models/payment.models';

@Component({
    selector: 'app-payment-list',
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatBadgeModule
    ],
    templateUrl: './payment-list.component.html',
    styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  loading = false;

  displayedColumns: string[] = ['job', 'amount', 'status', 'method', 'date', 'actions'];

  PaymentStatus = PaymentStatus;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.filteredPayments = payments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading = false;
      }
    });
  }

  filterByStatus(status?: PaymentStatus): void {
    if (status) {
      this.filteredPayments = this.payments.filter(p => p.status === status);
    } else {
      this.filteredPayments = this.payments;
    }
  }

  onTabChange(index: number): void {
    switch (index) {
      case 0:
        this.filterByStatus();
        break;
      case 1:
        this.filterByStatus(PaymentStatus.ESCROWED);
        break;
      case 2:
        this.filterByStatus(PaymentStatus.RELEASED);
        break;
      case 3:
        this.filterByStatus(PaymentStatus.PENDING);
        break;
    }
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

  getStatusIcon(status: PaymentStatus): string {
    const icons: Record<string, string> = {
      [PaymentStatus.PENDING]: 'schedule',
      [PaymentStatus.PROCESSING]: 'sync',
      [PaymentStatus.COMPLETED]: 'check_circle',
      [PaymentStatus.ESCROWED]: 'lock',
      [PaymentStatus.RELEASED]: 'send',
      [PaymentStatus.FAILED]: 'error',
      [PaymentStatus.REFUNDED]: 'undo',
      [PaymentStatus.CANCELLED]: 'cancel'
    };
    return icons[status] || 'info';
  }

  getTotalAmount(): number {
    return this.filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  }

  getEscrowedCount(): number {
    return this.payments.filter(p => p.status === PaymentStatus.ESCROWED).length;
  }

  getReleasedCount(): number {
    return this.payments.filter(p => p.status === PaymentStatus.RELEASED).length;
  }

  getPendingCount(): number {
    return this.payments.filter(p => p.status === PaymentStatus.PENDING).length;
  }
}
