import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="billing-container">
      <h1>Billing</h1>
      <p>Manage your subscription and billing details.</p>
      <a mat-button routerLink="/pricing">View Plans</a>
    </div>
  `,
  styles: [`.billing-container { padding: 2rem; }`]
})
export class BillingComponent {}
