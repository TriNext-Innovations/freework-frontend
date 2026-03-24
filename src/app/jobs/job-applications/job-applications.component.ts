import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationService } from '../application.service';
import { JobService } from '../job.service';
import { JobApplication, ApplicationStatus } from '../models/application.models';
import { Job } from '../models';

@Component({
  selector: 'app-job-applications',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.scss'
})
export class JobApplicationsComponent implements OnInit {
  job: Job | null = null;
  applications: JobApplication[] = [];
  loading = false;
  ApplicationStatus = ApplicationStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private jobService: JobService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (!jobId) {
      this.router.navigate(['/jobs']);
      return;
    }
    this.loadJob(jobId);
    this.loadApplications(jobId);
  }

  loadJob(jobId: string): void {
    this.jobService.getJobById(jobId).subscribe({
      next: (job) => { this.job = job; },
      error: () => { this.router.navigate(['/jobs']); }
    });
  }

  loadApplications(jobId: string): void {
    this.loading = true;
    this.applicationService.getJobApplications(jobId).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading applications:', error);
        this.showError('Failed to load applications');
        this.loading = false;
      }
    });
  }

  updateStatus(application: JobApplication, status: ApplicationStatus): void {
    if (!application.id) return;
    this.applicationService.updateApplicationStatus(application.id, status).subscribe({
      next: () => {
        application.status = status;
        this.showSuccess(`Application ${status.toLowerCase()} successfully`);
      },
      error: () => { this.showError('Failed to update application status'); }
    });
  }

  getStatusColor(status: ApplicationStatus): string {
    const colors: Record<string, string> = {
      [ApplicationStatus.PENDING]: 'primary',
      [ApplicationStatus.ACCEPTED]: 'accent',
      [ApplicationStatus.REJECTED]: 'warn',
      [ApplicationStatus.WITHDRAWN]: ''
    };
    return colors[status] || '';
  }

  getStatusIcon(status: ApplicationStatus): string {
    const icons: Record<string, string> = {
      [ApplicationStatus.PENDING]: 'schedule',
      [ApplicationStatus.ACCEPTED]: 'check_circle',
      [ApplicationStatus.REJECTED]: 'cancel',
      [ApplicationStatus.WITHDRAWN]: 'remove_circle'
    };
    return icons[status] || 'help';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
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

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
