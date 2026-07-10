import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { JobService } from '../job.service';
import { Job, JobFilters, JOB_CATEGORIES } from '../models';
import { AuthService } from '../../auth/auth.service';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-job-list',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatChipsModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatBadgeModule
    ],
    templateUrl: './job-list.component.html',
    styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading = false;
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  filterForm!: FormGroup;
  categories = JOB_CATEGORIES;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.setupFilterSubscriptions();
    // Load jobs after form and subscriptions are ready
    this.loadJobs();
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      category: [''],
      locationType: [''],
      budgetType: [''],
      minBudget: [''],
      maxBudget: ['']
    });
  }

  setupFilterSubscriptions(): void {
    // Subscribe to form changes and reload jobs
    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((values) => {
        console.log('🔔 Form values changed:', values);
        this.pageIndex = 0;
        this.loadJobs();
      });
  }

  loadJobs(): void {
    // Guard against calling loadJobs before form is initialized
    if (!this.filterForm) {
      console.warn('⚠️ filterForm not initialized yet');
      return;
    }

    this.loading = true;

    // Get raw form values
    const formValues = this.filterForm.value;
    console.log('📝 Raw form values in loadJobs:', formValues);

    // Build filters object - convert empty strings to undefined
    const filters: JobFilters = {};

    if (formValues.search && formValues.search.trim() !== '') {
      filters.search = formValues.search.trim();
    }

    if (formValues.category && formValues.category !== '') {
      filters.category = formValues.category;
    }

    if (formValues.locationType && formValues.locationType !== '') {
      filters.locationType = formValues.locationType;
    }

    if (formValues.budgetType && formValues.budgetType !== '') {
      filters.budgetType = formValues.budgetType;
    }

    if (formValues.minBudget && formValues.minBudget !== '') {
      filters.minBudget = Number(formValues.minBudget);
    }

    if (formValues.maxBudget && formValues.maxBudget !== '') {
      filters.maxBudget = Number(formValues.maxBudget);
    }

    const currentUser = this.authService.currentUserValue;

    // If user is a CUSTOMER, only show their posted jobs
    if (currentUser?.role === 'CUSTOMER') {
      filters.customerId = currentUser.id;
    }

    // If user is a CUSTOMER, only show their posted jobs
    if (currentUser?.role === 'CUSTOMER') {
      filters.customerId = currentUser.id;
    }

    console.log('✅ Final filters being applied:', filters);

    this.jobService.getJobs(this.pageIndex, this.pageSize, filters).subscribe({
      next: (response) => {
        this.jobs = response.content;
        this.totalElements = response.totalElements;
        this.totalElements = response.totalElements;
        this.loading = false;
        console.log(`✅ Found ${response.totalElements} jobs matching filters`);
        console.log(`✅ Found ${response.totalElements} jobs matching filters`);
        console.log('📋 Full jobs data:', this.jobs);
        if (this.jobs.length > 0) {
          console.log('🔍 First job budget details:', {
            id: this.jobs[0].id,
            title: this.jobs[0].title,
            budget: this.jobs[0].budget,
            budgetType: this.jobs[0].budgetType
          });
        }
      },
      error: (error) => {
        console.error('❌ Error loading jobs:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadJobs();
    // The app shell scrolls inside .main-content, not the window
    document.querySelector('.main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadJobs();
  }

  viewJobDetail(jobId: string): void {
    this.router.navigate(['/jobs', jobId]);
  }

  createNewJob(): void {
    this.router.navigate(['/jobs/new']);
  }

  isCustomer(): boolean {
    return this.authService.currentUserValue?.role === 'CUSTOMER';
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.icon || 'work';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  }

  formatBudget(job: Job): string {
    console.log('💰 formatBudget called with:', { budget: job.budget, budgetType: job.budgetType });

    if (!job || !job.budget) {
      console.warn('⚠️ No budget available for job');
      return 'Not specified';
    }

    const amount = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(job.budget);

    const result = job.budgetType === 'HOURLY' ? `${amount}/hr` : amount;
    console.log('✅ Formatted budget:', result);

    return result;
  }

  getTimeSincePosted(createdAt: string | undefined): string {
    if (!createdAt) return 'Recently';

    const now = new Date();
    const posted = new Date(createdAt);
    const diffMs = now.getTime() - posted.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  getLocationTypeLabel(locationType: string): string {
    const labels: Record<string, string> = {
      'REMOTE': 'Remote',
      'ONSITE': 'On-site',
      'HYBRID': 'Hybrid'
    };
    return labels[locationType] || locationType;
  }

  getLocationTypeColor(locationType: string): string {
    const colors: Record<string, string> = {
      'REMOTE': 'primary',
      'ONSITE': 'accent',
      'HYBRID': 'warn'
    };
    return colors[locationType] || 'primary';
  }
}
