import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-pricing',
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
    template: `
    <div class="pricing-container">
      <h1>Pricing</h1>
      <p>Choose the plan that works for you.</p>
    </div>
  `,
    styles: [`.pricing-container { padding: 2rem; text-align: center; }`]
})
export class PricingComponent {}
