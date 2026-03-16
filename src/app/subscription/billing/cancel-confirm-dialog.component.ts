import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cancel-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="cancel-dialog">
      <div class="dialog-icon">
        <mat-icon>warning_amber</mat-icon>
      </div>
      <h2 mat-dialog-title>Cancel PRO subscription?</h2>
      <mat-dialog-content>
        <p>
          You'll keep PRO access until the end of your billing period
          <ng-container *ngIf="data.currentPeriodEnd">
            (<strong>{{ data.currentPeriodEnd | date:'MMM d, y' }}</strong>)
          </ng-container>.
          After that, your account reverts to the free plan and limits will apply.
        </p>
        <p class="reminder">Remember — on Freework, <strong>every cent you earn is yours</strong>. No commission, ever.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button (click)="close(false)">Keep PRO</button>
        <button mat-button color="warn" (click)="close(true)">Yes, cancel</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .cancel-dialog { padding: 8px 0; }
    .dialog-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 8px;
      mat-icon { font-size: 40px; width: 40px; height: 40px; color: #f59e0b; }
    }
    h2 { text-align: center; margin: 0 0 4px; }
    mat-dialog-content { text-align: center; }
    .reminder { margin-top: 12px; font-size: 13px; color: var(--mat-sys-on-surface-variant, #555); }
    mat-dialog-actions { padding: 16px 24px; gap: 8px; }
  `]
})
export class CancelConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CancelConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentPeriodEnd?: string }
  ) {}
  close(confirmed: boolean): void { this.dialogRef.close(confirmed); }
}
