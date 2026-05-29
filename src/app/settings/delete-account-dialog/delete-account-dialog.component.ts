import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
        CommonModule,
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
  form: FormGroup;
  loading = false;
  error = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    private fb: FormBuilder,
    private legalService: LegalService,
    private authService: AuthService,
    private router: Router
  ) {
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
