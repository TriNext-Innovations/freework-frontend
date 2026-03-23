import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { LegalService } from '../legal/legal.service';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
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
      error: () => {}
    });
  }

  checkCanDelete(): void {
    this.legalService.canDeleteAccount().subscribe({
      next: (r) => {
        this.canDelete = r.canDelete;
        this.blockingReason = r.blockingReason || '';
      },
      error: () => {}
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

  openDeleteDialog(): void {
    const ref = this.dialog.open(DeleteAccountDialogComponent, {
      width: '500px',
      disableClose: true
    });
    ref.afterClosed().subscribe((deleted) => {
      // AuthService.logout() and navigation handled inside the dialog component
    });
  }
}
