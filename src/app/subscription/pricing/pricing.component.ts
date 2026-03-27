import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { SubscriptionService } from '../subscription.service';
import { ProviderSelectDialogComponent } from '../billing/provider-select-dialog.component';
import { FREE_TIER_APPLICATION_LIMIT, FREE_TIER_JOB_LIMIT, PaymentProvider } from '../subscription.models';
import { User } from '../../auth/models';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent implements OnInit {
  readonly FREE_APPLICATION_LIMIT = FREE_TIER_APPLICATION_LIMIT;
  readonly FREE_JOB_LIMIT = FREE_TIER_JOB_LIMIT;

  currentUser: User | null = null;
  checkingOut = false;

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser) {
      this.subscriptionService.loadSubscription().subscribe();
    }
  }

  get isPro(): boolean {
    return this.subscriptionService.isProMember;
  }

  get isFreelancer(): boolean {
    return this.currentUser?.role === 'FREELANCER';
  }

  get isCustomer(): boolean {
    return this.currentUser?.role === 'CUSTOMER';
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
}
