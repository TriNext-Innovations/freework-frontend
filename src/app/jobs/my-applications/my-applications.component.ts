import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApplicationService } from '../application.service';
import { JobService } from '../job.service';
import { JobApplication, ApplicationStatus } from '../models/application.models';
import { MessagingService } from '../../messaging/messaging.service';

@Component({
    selector: 'app-my-applications',
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatSnackBarModule,
        MatDialogModule
    ],
    templateUrl: './my-applications.component.html',
    styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];
  loading = false;
  selectedStatus: ApplicationStatus | 'ALL' = 'ALL';
  ApplicationStatus = ApplicationStatus;

  stats = {
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  };

  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService,
    private messagingService: MessagingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getMyApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
        this.filteredApplications = applications;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.showError('Failed to load applications');
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats = {
      total: this.applications.length,
      pending: this.applications.filter(app => app.status === ApplicationStatus.PENDING).length,
      accepted: this.applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
      rejected: this.applications.filter(app => app.status === ApplicationStatus.REJECTED).length
    };
  }

  filterByStatus(status: ApplicationStatus | 'ALL'): void {
    this.selectedStatus = status;
    if (status === 'ALL') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(app => app.status === status);
    }
  }

  getStatusIcon(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'schedule';
      case ApplicationStatus.ACCEPTED:
        return 'check_circle';
      case ApplicationStatus.REJECTED:
        return 'cancel';
      case ApplicationStatus.WITHDRAWN:
        return 'remove_circle';
      default:
        return 'help';
    }
  }

  getStatusClass(status: ApplicationStatus): string {
    return `status-${status.toLowerCase()}`;
  }

  openChat(application: JobApplication): void {
    const start = (customerId: string) => {
      this.messagingService.getOrCreateConversation(customerId, application.jobId).subscribe({
        next: (conversation) => this.router.navigate(['/messages', conversation.id]),
        error: () => this.router.navigate(['/messages'])
      });
    };

    if (application.customerId) {
      start(application.customerId);
    } else {
      this.jobService.getJobById(application.jobId).subscribe({
        next: (job) => {
          if (job.customerId) {
            start(job.customerId);
          } else {
            this.router.navigate(['/messages']);
          }
        },
        error: () => this.router.navigate(['/messages'])
      });
    }
  }

  viewJobDetails(jobId: string): void {
    this.router.navigate(['/jobs', jobId]);
  }

  viewApplicationDetails(application: JobApplication): void {
    // Navigate to a detailed view or open a dialog
    this.router.navigate(['/jobs', application.jobId]);
  }

  withdrawApplication(application: JobApplication): void {
    if (application.status !== ApplicationStatus.PENDING) {
      this.showInfo('Only pending applications can be withdrawn');
      return;
    }

    if (confirm(`Are you sure you want to withdraw your application for "${application.jobTitle}"?`)) {
      this.applicationService.withdrawApplication(application.id!).subscribe({
        next: (_response) => {
          this.showSuccess('Application withdrawn successfully');
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error withdrawing application:', error);
          this.showError('Failed to withdraw application');
        }
      });
    }
  }

  getTimeAgo(date: Date | undefined): string {
    if (!date) return 'Unknown';

    const now = new Date();
    const applicationDate = new Date(date);
    const diffMs = now.getTime() - applicationDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
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
