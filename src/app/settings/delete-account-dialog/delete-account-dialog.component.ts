import { Component, inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { LegalService } from '../../legal/legal.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-delete-account-dialog',
    imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule
],
    templateUrl: './delete-account-dialog.component.html',
    styleUrl: './delete-account-dialog.component.scss'
})
export class DeleteAccountDialogComponent {
  private dialogRef = inject<MatDialogRef<DeleteAccountDialogComponent>>(MatDialogRef);
  private fb = inject(FormBuilder);
  private legalService = inject(LegalService);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup;
  loading = false;
  error = '';

  constructor() {
    this.form = this.fb.group({
      confirmation: ['', [Validators.required, Validators.pattern(/^DELETE$/)]]
    });
  }

  get canDelete(): boolean {
    return this.form.valid && !this.loading;
  }

  delete(): void {
    if (!this.canDelete) return;

    this.loading = true;
    this.error = '';

    this.legalService.deleteAccount('DELETE').subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Failed to delete account. Please try again.';
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
