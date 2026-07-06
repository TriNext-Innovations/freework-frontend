import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-subscription-result',
    imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
    template: `
    <div class="result-container">
      <mat-card class="result-card">
        <mat-card-content>
          @if (success) {

            <mat-icon class="success-icon">check_circle</mat-icon>
            <h2>Subscription Activated</h2>
            <p>Your subscription has been successfully activated.</p>
          
}
          @if (!success) {

            <mat-icon class="cancel-icon">cancel</mat-icon>
            <h2>Subscription Cancelled</h2>
            <p>Your subscription checkout was cancelled.</p>
          
}
          <a mat-raised-button color="primary" routerLink="/pricing">View Plans</a>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .result-container { display: flex; justify-content: center; align-items: center; min-height: 60vh; }
    .result-card { text-align: center; padding: 2rem; max-width: 400px; }
    .success-icon { font-size: 4rem; width: 4rem; height: 4rem; color: #2BB88A; }
    .cancel-icon { font-size: 4rem; width: 4rem; height: 4rem; color: #f44336; }
  `]
})
export class SubscriptionResultComponent implements OnInit {
  private route = inject(ActivatedRoute);

  success = false;

  ngOnInit(): void {
    this.success = this.route.snapshot.data['success'] ?? false;
  }
}
