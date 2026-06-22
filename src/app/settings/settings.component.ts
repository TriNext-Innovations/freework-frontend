import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { LegalService } from '../legal/legal.service';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';

@Component({
    selector: 'app-settings',
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSnackBarModule
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  marketingConsented = false;
  marketingLoading = false;
  canDelete = false;
  blockingReason = '';
  exportingData = false;

  constructor(
    private legalService: LegalService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMarketingConsent();
    this.checkCanDelete();
  }

  loadMarketingConsent(): void {
    this.legalService.getMarketingConsent().subscribe({
      next: (r) => { this.marketingConsented = r.consented; },
      error: (err: HttpErrorResponse) => console.error('Failed to load marketing consent', err)
    });
  }

  checkCanDelete(): void {
    this.legalService.canDeleteAccount().subscribe({
      next: (r) => {
        this.canDelete = r.canDelete;
        this.blockingReason = r.blockingReason || '';
      },
      error: (err: HttpErrorResponse) => console.error('Failed to check delete eligibility', err)
    });
  }

  onMarketingToggle(value: boolean): void {
    this.marketingLoading = true;
    this.legalService.updateMarketingConsent(value).subscribe({
      next: (r) => {
        this.marketingLoading = false;
        this.marketingConsented = r.consented;
        this.snackBar.open(
          r.consented ? 'Marketing emails enabled.' : 'Marketing emails disabled.',
          'OK', { duration: 3000 }
        );
      },
      error: () => {
        this.marketingLoading = false;
        this.marketingConsented = !value; // revert
        this.snackBar.open('Failed to update preference.', 'OK', { duration: 3000 });
      }
    });
  }

  downloadMyData(): void {
    if (this.exportingData) return;
    this.exportingData = true;
    this.legalService.exportMyData().subscribe({
      next: (blob) => {
        this.exportingData = false;
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `freework-data-export-${new Date().toISOString().slice(0, 10)}.json`;
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Your data export has downloaded.', 'OK', { duration: 3000 });
      },
      error: () => {
        this.exportingData = false;
        this.snackBar.open('Failed to export your data. Please try again.', 'OK', { duration: 4000 });
      }
    });
  }

  openDeleteDialog(): void {
    const ref = this.dialog.open(DeleteAccountDialogComponent, {
      width: '500px',
      disableClose: true
    });
    ref.afterClosed().subscribe((_deleted) => {
      // AuthService.logout() and navigation handled inside the dialog component
    });
  }
}
