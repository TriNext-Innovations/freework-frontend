import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../auth/auth.service';
import { SubscriptionService } from '../subscription.service';
import { ProviderSelectDialogComponent } from '../billing/provider-select-dialog.component';
import { PaymentProvider, SubscriptionInfo } from '../subscription.models';
import { User } from '../../auth/models';
import { FREE_TIER_APPLICATION_LIMIT, FREE_TIER_JOB_LIMIT } from '../subscription.models';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent implements OnInit {
  currentUser: User | null = null;
  subscription: SubscriptionInfo | null = null;
  checkingOut = false;

  readonly FREE_APPLICATION_LIMIT = FREE_TIER_APPLICATION_LIMIT;
  readonly FREE_JOB_LIMIT = FREE_TIER_JOB_LIMIT;

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.subscriptionService.subscription$.subscribe(sub => {
      this.subscription = sub;
    });
  }

  get isPro(): boolean {
    return this.subscription?.proMember === true;
  }

  get isFreelancer(): boolean {
    return this.currentUser?.role === 'FREELANCER';
  }

  get isCustomer(): boolean {
    return this.currentUser?.role === 'CUSTOMER';
  }

  upgradeToProo(): void {
    if (!this.currentUser) {
      // Not logged in — send to register
      window.location.href = '/login';
      return;
    }

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
}
