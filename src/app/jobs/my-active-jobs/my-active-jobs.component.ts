import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationService } from '../application.service';
import { JobService } from '../job.service';
import { AuthService } from '../../auth/auth.service';
import { MessagingService } from '../../messaging/messaging.service';
import { JobApplication, ApplicationStatus } from '../models/application.models';
import { Job } from '../models';
import { ReviewDialogComponent, ReviewDialogData } from '../../reviews/review-dialog/review-dialog.component';
import { ReviewType } from '../../reviews/models';

interface ActiveJob {
  application: JobApplication;
  job: Job;
}

@Component({
    selector: 'app-my-active-jobs',
    imports: [
        CommonModule,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatBadgeModule,
        MatDialogModule,
        MatSnackBarModule
    ],
    templateUrl: './my-active-jobs.component.html',
    styleUrl: './my-active-jobs.component.scss'
})
export class MyActiveJobsComponent implements OnInit {
  activeJobs: ActiveJob[] = [];
  customerJobs: Job[] = [];
  loading = false;
  error: string | null = null;
  isCustomer = false;

  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService,
    private authService: AuthService,
    private messagingService: MessagingService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    this.isCustomer = currentUser?.role === 'CUSTOMER';

    if (this.isCustomer) {
      this.loadCustomerActiveJobs();
    } else {
      this.loadFreelancerActiveJobs();
    }
  }

  loadCustomerActiveJobs(): void {
    this.loading = true;
    this.error = null;

    // Show ALL jobs the customer has posted — a freshly-posted OPEN job with no
    // applications yet must still appear here, otherwise the owner loses track of it (#168).
    this.jobService.getMyJobs().subscribe({
      next: (response) => {
        this.customerJobs = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading customer jobs:', error);
        this.error = 'Failed to load your active jobs. Please try again.';
        this.loading = false;
      }
    });
  }

  loadFreelancerActiveJobs(): void {
    this.loading = true;
    this.error = null;

    // Get only accepted applications
    this.applicationService.getMyApplications(ApplicationStatus.ACCEPTED).subscribe({
      next: (applications) => {
        // Fetch full job details for each accepted application
        const jobRequests = applications.map(app =>
          this.jobService.getJobById(app.jobId)
        );

        // Wait for all job details to load
        if (jobRequests.length === 0) {
          this.activeJobs = [];
          this.loading = false;
          return;
        }

        // Combine applications with their job details
        let completedRequests = 0;
        this.activeJobs = [];

        jobRequests.forEach((request, index) => {
          request.subscribe({
            next: (job) => {
              this.activeJobs.push({
                application: applications[index],
                job: job
              });
              completedRequests++;
              if (completedRequests === jobRequests.length) {
                // Sort by applied date (most recent first)
                this.activeJobs.sort((a, b) => {
                  const dateA = new Date(a.application.appliedAt || 0).getTime();
                  const dateB = new Date(b.application.appliedAt || 0).getTime();
                  return dateB - dateA;
                });
                this.loading = false;
              }
            },
            error: (error) => {
              console.error('Error loading job details:', error);
              completedRequests++;
              if (completedRequests === jobRequests.length) {
                this.loading = false;
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.error = 'Failed to load your active jobs. Please try again.';
        this.loading = false;
      }
    });
  }

  loadActiveJobs(): void {
    if (this.isCustomer) {
      this.loadCustomerActiveJobs();
    } else {
      this.loadFreelancerActiveJobs();
    }
  }

  viewJobDetails(jobId: string): void {
    this.router.navigate(['/jobs', jobId]);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'OPEN': 'primary',
      'IN_PROGRESS': 'accent',
      'REVIEW': 'accent',
      'COMPLETED': 'warn',
      'CANCELLED': ''
    };
    return colors[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'OPEN': 'Open',
      'IN_PROGRESS': 'In Progress',
      'REVIEW': 'In Review',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    };
    return labels[status] || status;
  }

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      'OPEN': 'radio_button_unchecked',
      'IN_PROGRESS': 'pending',
      'REVIEW': 'rate_review',
      'COMPLETED': 'check_circle',
      'CANCELLED': 'cancel'
    };
    return icons[status] || 'help';
  }

  formatBudget(job: Job): string {
    const amount = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(job.budget);

    return job.budgetType === 'HOURLY' ? `${amount}/hr` : amount;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  calculateDaysUntilDeadline(deadline: string): number {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDeadlineWarning(deadline: string): 'urgent' | 'warning' | 'normal' {
    const days = this.calculateDaysUntilDeadline(deadline);
    if (days < 7) return 'urgent';
    if (days < 30) return 'warning';
    return 'normal';
  }

  messageClient(customerId: string, jobId: string): void {
    this.messagingService.getOrCreateConversation(customerId, jobId).subscribe({
      next: (conversation) => this.router.navigate(['/messages', conversation.id]),
      error: () => this.router.navigate(['/messages'])
    });
  }

  writeReview(activeJob: ActiveJob): void {
    const dialogData: ReviewDialogData = {
      jobId: activeJob.job.id,
      revieweeId: activeJob.job.customerId || '',
      revieweeName: activeJob.job.customerName || 'Customer',
      reviewType: ReviewType.CUSTOMER_REVIEW,
      jobTitle: activeJob.job.title
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
        this.showSuccess('Review submitted successfully! Thank you for your feedback.');
        this.loadActiveJobs();
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}
