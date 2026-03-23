import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentProvider } from '../subscription.models';

@Component({
  selector: 'app-provider-select-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="provider-dialog">
      <h2 mat-dialog-title>Choose payment provider</h2>
      <mat-dialog-content>
        <p class="subtitle">Select how you'd like to pay for your PRO subscription.</p>
        <div class="provider-grid">
          <button class="provider-card" (click)="select('PAYFAST')">
            <mat-icon>credit_card</mat-icon>
            <span class="provider-name">PayFast</span>
            <span class="provider-desc">South African payments</span>
          </button>
          <button class="provider-card" (click)="select('PAYPAL')">
            <mat-icon>account_balance_wallet</mat-icon>
            <span class="provider-name">PayPal</span>
            <span class="provider-desc">International payments</span>
          </button>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="close()">Cancel</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .provider-dialog { padding: 8px 0; }
    h2 { margin: 0 0 4px; }
    .subtitle { margin: 0 0 20px; color: var(--mat-sys-on-surface-variant, #666); font-size: 14px; }
    .provider-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; min-width: 300px; }
    .provider-card {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 24px 16px; border: 2px solid var(--mat-sys-outline-variant, #ccc);
      border-radius: 12px; background: transparent; cursor: pointer;
      transition: border-color 0.2s, background 0.2s; width: 100%;
    }
    .provider-card:hover {
      border-color: var(--mat-sys-primary, #6200ee);
      background: var(--mat-sys-primary-container, #f3e5ff);
    }
    .provider-card mat-icon { font-size: 36px; width: 36px; height: 36px; }
    .provider-name { font-weight: 600; font-size: 15px; }
    .provider-desc { font-size: 12px; color: var(--mat-sys-on-surface-variant, #666); }
    mat-dialog-actions { padding: 8px 24px 16px; }
  `]
})
export class ProviderSelectDialogComponent {
  constructor(private dialogRef: MatDialogRef<ProviderSelectDialogComponent>) {}

  select(provider: PaymentProvider): void {
    this.dialogRef.close(provider);
  }

  close(): void {
    this.dialogRef.close(null);
  }
}
