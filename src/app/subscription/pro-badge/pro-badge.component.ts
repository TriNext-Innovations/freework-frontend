import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pro-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="pro-badge">PRO</span>`,
  styles: [`
    .pro-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #fff;
      vertical-align: middle;
      line-height: 1.6;
      box-shadow: 0 1px 3px rgba(217,119,6,0.35);
    }
  `]
})
export class ProBadgeComponent {}
