import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionInfo, FREE_TIER_APPLICATION_LIMIT, FREE_TIER_JOB_LIMIT } from '../subscription.models';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/models';
import { CancelConfirmDialogComponent } from './cancel-confirm-dialog.component';
import { ProviderSelectDialogComponent } from './provider-select-dialog.component';
import { PaymentProvider } from '../subscription.models';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss'
})
export class BillingComponent implements OnInit, OnDestroy {
  subscription: SubscriptionInfo | null = null;
  currentUser: User | null = null;
  loading = false;
  checkingOut = false;
  cancelling = false;

  readonly FREE_APPLICATION_LIMIT = FREE_TIER_APPLICATION_LIMIT;
  readonly FREE_JOB_LIMIT = FREE_TIER_JOB_LIMIT;

  private subs = new Subscription();

  constructor(
    public subscriptionService: SubscriptionService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    this.subs.add(
      this.subscriptionService.subscription$.subscribe(sub => {
        this.subscription = sub;
      })
    );

    if (!this.subscription) {
      this.loading = true;
      this.subscriptionService.loadSubscription().subscribe({
        complete: () => { this.loading = false; }
      });
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get isFreelancer(): boolean {
    return this.currentUser?.role === 'FREELANCER';
  }

  get isCustomer(): boolean {
    return this.currentUser?.role === 'CUSTOMER';
  }

  get isPro(): boolean {
    return this.subscription?.proMember === true;
  }

  get applicationLimitPercent(): number {
    const used = this.subscription?.applicationsThisMonth ?? 0;
    return Math.min(100, (used / this.FREE_APPLICATION_LIMIT) * 100);
  }

  get jobLimitPercent(): number {
    const used = this.subscription?.activeJobsCount ?? 0;
    return Math.min(100, (used / this.FREE_JOB_LIMIT) * 100);
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
      this.subscriptionService.startCheckout(provider).subscribe({
        next: (res) => {
          window.location.href = res.checkoutUrl;
        },
        error: () => {
          this.checkingOut = false;
          this.snackBar.open('Failed to start checkout. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    });
  }

  openCancelDialog(): void {
    const ref = this.dialog.open(CancelConfirmDialogComponent, {
      width: '420px',
      data: { currentPeriodEnd: this.subscription?.currentPeriodEnd }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.cancelSubscription();
      }
    });
  }

  private cancelSubscription(): void {
    this.cancelling = true;
    this.subscriptionService.cancelSubscription().subscribe({
      next: () => {
        this.cancelling = false;
        this.snackBar.open('Your PRO subscription has been cancelled.', 'Close', {
          duration: 5000
        });
      },
      error: () => {
        this.cancelling = false;
        this.snackBar.open('Failed to cancel subscription. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
