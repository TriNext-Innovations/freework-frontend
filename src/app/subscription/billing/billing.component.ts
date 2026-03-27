import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { SubscriptionService } from '../subscription.service';
import { ProviderSelectDialogComponent } from './provider-select-dialog.component';
import { CancelConfirmDialogComponent } from './cancel-confirm-dialog.component';
import {
  SubscriptionInfo,
  PaymentProvider,
  FREE_TIER_APPLICATION_LIMIT,
  FREE_TIER_JOB_LIMIT
} from '../subscription.models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent implements OnInit {
  readonly FREE_APPLICATION_LIMIT = FREE_TIER_APPLICATION_LIMIT;
  readonly FREE_JOB_LIMIT = FREE_TIER_JOB_LIMIT;

  subscription: SubscriptionInfo | null = null;
  loading = true;
  checkingOut = false;
  cancelling = false;

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog
  ) {}

  private readonly defaultFreePlan: SubscriptionInfo = {
    plan: 'FREE',
    status: 'ACTIVE',
    proMember: false,
    applicationsThisMonth: 0,
    activeJobsCount: 0
  };

  ngOnInit(): void {
    this.subscriptionService.loadSubscription().subscribe(sub => {
      this.subscription = sub ?? this.defaultFreePlan;
      this.loading = false;
    });
  }

  get isPro(): boolean {
    return !!this.subscription?.proMember && this.subscription?.status === 'ACTIVE';
  }

  get isFreelancer(): boolean {
    return this.authService.currentUserValue?.role === 'FREELANCER';
  }

  get isCustomer(): boolean {
    return this.authService.currentUserValue?.role === 'CUSTOMER';
  }

  get applicationLimitPercent(): number {
    const used = this.subscription?.applicationsThisMonth ?? 0;
    return Math.min((used / this.FREE_APPLICATION_LIMIT) * 100, 100);
  }

  get jobLimitPercent(): number {
    const used = this.subscription?.activeJobsCount ?? 0;
    return Math.min((used / this.FREE_JOB_LIMIT) * 100, 100);
  }

  get applicationLimitColor(): 'primary' | 'warn' {
    return this.applicationLimitPercent >= 80 ? 'warn' : 'primary';
  }

  get jobLimitColor(): 'primary' | 'warn' {
    return this.jobLimitPercent >= 80 ? 'warn' : 'primary';
  }

  upgradeToProo(): void {
    const ref = this.dialog.open(ProviderSelectDialogComponent, { width: '380px' });
    ref.afterClosed().subscribe((provider: PaymentProvider | null) => {
      if (!provider) return;
      this.checkingOut = true;
      this.subscriptionService.createCheckout(provider).subscribe({
        next: ({ checkoutUrl }) => {
          window.location.href = checkoutUrl;
        },
        error: () => {
          this.checkingOut = false;
        }
      });
    });
  }

  openCancelDialog(): void {
    const ref = this.dialog.open(CancelConfirmDialogComponent, {
      width: '440px',
      data: { currentPeriodEnd: this.subscription?.currentPeriodEnd }
    });
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.cancelling = true;
      this.subscriptionService.cancelSubscription().subscribe({
        next: () => {
          this.subscriptionService.loadSubscription().subscribe(sub => {
            this.subscription = sub;
            this.cancelling = false;
          });
        },
        error: () => {
          this.cancelling = false;
        }
      });
    });
  }
}
