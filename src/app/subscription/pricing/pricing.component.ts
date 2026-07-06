import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { combineLatest, map, startWith } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { SubscriptionService, Subscription } from '../subscription.service';

interface PricingVm {
  user: { role?: string } | null;
  subscription: Subscription | null;
  isFreelancer: boolean;
  isCustomer: boolean;
  isPaid: boolean;
  isGrowth: boolean;
  isScale: boolean;
  loading: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent implements OnInit {
  authService = inject(AuthService);
  subscriptionService = inject(SubscriptionService);


  readonly FREE_APPLICATION_LIMIT = 10;
  readonly FREE_JOB_LIMIT = 2;
  readonly GROWTH_JOB_LIMIT = 15;

  checkingOut = false;

  vm$ = combineLatest([
    this.authService.currentUser$.pipe(startWith(this.authService.currentUserValue)),
    this.subscriptionService.subscription$.pipe(startWith(this.subscriptionService.currentSubscription))
  ]).pipe(
    map(([user, sub]): PricingVm => ({
      user,
      subscription: sub,
      isFreelancer: user?.role === 'FREELANCER',
      isCustomer: user?.role === 'CUSTOMER',
      isPaid: !!sub && sub.status === 'ACTIVE' && (sub.plan === 'GROWTH' || sub.plan === 'SCALE'),
      isGrowth: !!sub && sub.plan === 'GROWTH' && sub.status === 'ACTIVE',
      isScale: !!sub && sub.plan === 'SCALE' && sub.status === 'ACTIVE',
      loading: false
    }))
  );

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.subscriptionService.loadSubscription().subscribe();
    }
  }

  upgradeToPlan(_plan: 'GROWTH' | 'SCALE' = 'GROWTH'): void {
    this.checkingOut = true;
    this.subscriptionService.checkout('PAYFAST').subscribe({
      next: (res) => { window.location.href = res.checkoutUrl; },
      error: () => { this.checkingOut = false; }
    });
  }
}
