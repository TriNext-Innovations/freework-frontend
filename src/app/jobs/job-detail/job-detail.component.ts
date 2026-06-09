import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { JobService } from '../job.service';
import { AuthService } from '../../auth/auth.service';
import { Job, JOB_CATEGORIES } from '../models';
import { RatingSummaryComponent } from '../../reviews/rating-summary/rating-summary.component';
import { ReviewListComponent } from '../../reviews/review-list/review-list.component';
import { ReviewDialogComponent, ReviewDialogData } from '../../reviews/review-dialog/review-dialog.component';
import { ReviewType } from '../../reviews/models';

@Component({
    selector: 'app-job-detail',
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTabsModule,
        RatingSummaryComponent,
        ReviewListComponent
    ],
    templateUrl: './job-detail.component.html',
    styleUrl: './job-detail.component.scss'
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  loading = false;
  isOwner = false;
  currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.currentUserValue?.id || null;
    const jobId = this.route.snapshot.paramMap.get('id');

    if (jobId) {
      this.loadJob(jobId);
    } else {
      this.router.navigate(['/jobs']);
    }
  }

  loadJob(id: string): void {
    this.loading = true;
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.job = job;
        this.isOwner = this.currentUserId === job.customerId;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.showError('Failed to load job details');
        this.loading = false;
        this.router.navigate(['/jobs']);
      }
    });
  }

  isJobCompleted(): boolean {
    return this.job?.status === 'COMPLETED';
  }

  canWriteReview(): boolean {
    // Allow writing reviews on completed jobs (for testing, remove currentUserId check)
    // In production, you should verify the user is authenticated
    return this.isJobCompleted();
  }

  openReviewDialog(reviewType: ReviewType): void {
    if (!this.job) return;

    // Use mock user ID if not logged in (for testing purposes)

    const dialogData: ReviewDialogData = {
      jobId: this.job.id,
      revieweeId: reviewType === ReviewType.FREELANCER_REVIEW
        ? 'freelancer1' // In real app, get from job assignment
        : (this.job.customerId || ''),
      revieweeName: reviewType === ReviewType.FREELANCER_REVIEW
        ? 'Assigned Freelancer' // In real app, get from job assignment
        : (this.job.customerName || 'Customer'),
      reviewType: reviewType,
      jobTitle: this.job.title
    };

    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: dialogData,
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showSuccess('Review submitted successfully!');
        // Refresh reviews list if needed
      }
    });
  }

  writeReviewAsCustomer(): void {
    this.openReviewDialog(ReviewType.FREELANCER_REVIEW);
  }

  writeReviewAsFreelancer(): void {
    this.openReviewDialog(ReviewType.CUSTOMER_REVIEW);
  }

  editJob(): void {
    if (this.job) {
      this.router.navigate(['/jobs', this.job.id, 'edit']);
    }
  }

  deleteJob(): void {
    if (!this.job) return;

    const confirmed = confirm('Are you sure you want to delete this job? This action cannot be undone.');
    if (confirmed) {
      this.jobService.deleteJob(this.job.id).subscribe({
        next: () => {
          this.showSuccess('Job deleted successfully');
          this.router.navigate(['/jobs']);
        },
        error: () => {
          this.showError('Failed to delete job');
        }
      });
    }
  }

  applyForJob(): void {
    if (this.job) {
      this.router.navigate(['/jobs', this.job.id, 'apply']);
    }
  }

  contactCustomer(): void {
    // TODO: Implement messaging functionality
    this.showSuccess('Messaging feature coming soon!');
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }

  getCategoryIcon(categoryId: string): string {
    const category = JOB_CATEGORIES.find(c => c.id === categoryId);
    return category?.icon || 'work';
  }

  getCategoryName(categoryId: string): string {
    const category = JOB_CATEGORIES.find(c => c.id === categoryId);
    return category?.name || categoryId;
  }

  formatBudget(job: Job): string {
    const amount = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(job.budget);

    return job.budgetType === 'HOURLY' ? `${amount}/hr` : amount;
  }

  getLocationTypeLabel(locationType: string): string {
    const labels: Record<string, string> = {
      'REMOTE': 'Remote',
      'ONSITE': 'On-site',
      'HYBRID': 'Hybrid'
    };
    return labels[locationType] || locationType;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'OPEN': 'Open',
      'IN_PROGRESS': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'OPEN': 'primary',      // Blue - for open jobs
      'IN_PROGRESS': 'accent', // Green/Teal - for active work
      'COMPLETED': 'warn',     // Orange/Amber - for finished jobs
      'CANCELLED': 'warn'      // Red - for cancelled jobs (changed from empty string)
    };
    return colors[status] || 'primary';
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
}
