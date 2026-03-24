import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubscriptionService } from '../subscription.service';
import { SubscriptionInfo } from '../subscription.models';

@Component({
  selector: 'app-subscription-result',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './subscription-result.component.html',
  styleUrl: './subscription-result.component.scss'
})
export class SubscriptionResultComponent implements OnInit {
  isSuccess = false;
  loading = true;
  subscription: SubscriptionInfo | null = null;

  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.isSuccess = this.route.snapshot.data['success'] === true;

    // Refresh subscription status from backend
    this.subscriptionService.loadSubscription().subscribe({
      next: (sub) => {
        this.subscription = sub;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
