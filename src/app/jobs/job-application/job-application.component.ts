import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationService } from '../application.service';
import { JobService } from '../job.service';
import { Job } from '../models';
import { CreateApplicationDto } from '../models/application.models';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.scss']
})
export class JobApplicationComponent implements OnInit {
  applicationForm!: FormGroup;
  job: Job | null = null;
  jobId: string = '';
  loading = false;
  submitting = false;
  hasAlreadyApplied = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private jobService: JobService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.jobId) {
      this.showError('Invalid job ID');
      this.router.navigate(['/jobs']);
      return;
    }

    this.initializeForm();
    this.loadJobDetails();
    this.checkIfAlreadyApplied();
  }

  initializeForm(): void {
    this.applicationForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      coverLetter: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(2000)]],
      portfolioLink: ['', [Validators.pattern(/^https?:\/\/.+/)]],
      proposedRate: ['', [Validators.min(0)]],
      estimatedDuration: ['', [Validators.maxLength(100)]]
    });
  }

  loadJobDetails(): void {
    this.loading = true;
    this.jobService.getJobById(this.jobId).subscribe({
      next: (job) => {
        this.job = job;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job details:', error);
        this.showError('Failed to load job details');
        this.loading = false;
        this.router.navigate(['/jobs']);
      }
    });
  }

  checkIfAlreadyApplied(): void {
    this.applicationService.hasApplied(this.jobId).subscribe({
      next: (hasApplied) => {
        this.hasAlreadyApplied = hasApplied;
        if (hasApplied) {
          this.showInfo('You have already applied to this job');
        }
      },
      error: (error) => {
        console.error('Error checking application status:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      this.showError('Please fill in all required fields correctly');
      return;
    }

    if (this.hasAlreadyApplied) {
      this.showError('You have already applied to this job');
      return;
    }

    this.submitting = true;

    const application: CreateApplicationDto = {
      jobId: this.jobId,
      message: this.applicationForm.value.message.trim(),
      coverLetter: this.applicationForm.value.coverLetter.trim(),
      portfolioLink: this.applicationForm.value.portfolioLink?.trim() || undefined,
      proposedRate: this.applicationForm.value.proposedRate || undefined,
      estimatedDuration: this.applicationForm.value.estimatedDuration?.trim() || undefined
    };

    this.applicationService.submitApplication(application).subscribe({
      next: (response) => {
        this.submitting = false;
        this.showSuccess('Application submitted successfully!');
        setTimeout(() => {
          this.router.navigate(['/my-applications']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error submitting application:', error);
        this.submitting = false;
        const errorMessage = error.error?.message || 'Failed to submit application. Please try again.';
        this.showError(errorMessage);
      }
    });
  }

  getCharacterCount(fieldName: string): string {
    const value = this.applicationForm.get(fieldName)?.value || '';
    const maxLength = fieldName === 'message' ? 500 : 2000;
    return `${value.length} / ${maxLength}`;
  }

  cancel(): void {
    this.router.navigate(['/jobs', this.jobId]);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  private showInfo(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['info-snackbar']
    });
  }
}
