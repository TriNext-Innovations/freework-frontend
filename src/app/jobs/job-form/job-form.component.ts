import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { JobService } from '../job.service';
import { CreateJobRequest, JOB_CATEGORIES, SKILLS_DATABASE } from '../models';
import { SubscriptionService } from '../../subscription/subscription.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-job-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatChipsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatAutocompleteModule
    ],
    templateUrl: './job-form.component.html',
    styleUrl: './job-form.component.scss'
})
export class JobFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private jobService = inject(JobService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  subscriptionService = inject(SubscriptionService);

  jobForm!: FormGroup;
  loading = false;
  isEditMode = false;
  jobId: string | null = null;
  atJobLimit = false;

  categories = JOB_CATEGORIES;
  availableSkills = SKILLS_DATABASE;
  selectedSkills: string[] = [];
  filteredSkills!: Observable<string[]>;

  minDate = new Date();

  ngOnInit(): void {
    this.initForm();

    // Check if editing existing job
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.isEditMode = true;
      this.loadJob(this.jobId);
    }

    // Check job post limit for new jobs (not edits)
    if (!this.jobId) {
      this.atJobLimit = this.subscriptionService.atJobLimit;
    }

    // Setup skill autocomplete
    this.filteredSkills = this.jobForm.get('skillInput')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterSkills(value || ''))
    );
  }

  initForm(): void {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(5000)]],
      category: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(1)]],
      budgetType: ['FIXED', Validators.required],
      deadline: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(100)]],
      locationType: ['REMOTE', Validators.required],
      skillInput: [''] // For autocomplete
    });
  }

  loadJob(id: string): void {
    this.loading = true;
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.jobForm.patchValue({
          title: job.title,
          description: job.description,
          category: job.category,
          budget: job.budget,
          budgetType: job.budgetType,
          deadline: new Date(job.deadline),
          location: job.location,
          locationType: job.locationType
        });
        this.selectedSkills = job.skills ? [...job.skills] : [];
        this.loading = false;
      },
      error: () => {
        this.showError('Failed to load job details');
        this.loading = false;
        this.router.navigate(['/jobs']);
      }
    });
  }

  get f() {
    return this.jobForm.controls;
  }

  onSubmit(): void {
    if (!this.isEditMode && this.atJobLimit) {
      this.showError('Active job limit reached. Upgrade to PRO to post more jobs simultaneously.');
      return;
    }

    if (this.jobForm.invalid) {
      this.markFormGroupTouched(this.jobForm);
      this.showError('Please fill in all required fields correctly');
      return;
    }

    if (this.selectedSkills.length === 0) {
      this.showError('Please add at least one skill');
      return;
    }

    this.loading = true;
    const jobData: CreateJobRequest = {
      title: this.jobForm.value.title,
      description: this.jobForm.value.description,
      category: this.jobForm.value.category,
      budget: this.jobForm.value.budget,
      budgetType: this.jobForm.value.budgetType,
      deadline: this.jobForm.value.deadline.toISOString().slice(0, 19),
      location: this.jobForm.value.location,
      locationType: this.jobForm.value.locationType,
      skills: this.selectedSkills
    };

    const request$ = this.isEditMode && this.jobId
      ? this.jobService.updateJob({ ...jobData, id: this.jobId })
      : this.jobService.createJob(jobData);

    request$.subscribe({
      next: (response) => {
        this.showSuccess(this.isEditMode ? 'Job updated successfully!' : 'Job posted successfully!');
        this.router.navigate(['/jobs', response.id]);
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 403) {
          this.atJobLimit = true;
          this.showError('Active job limit reached. Upgrade to PRO to post more jobs simultaneously.');
        } else {
          const message = error.error?.message || 'Failed to save job. Please try again.';
          this.showError(message);
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addSkill(skill: string): void {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !this.selectedSkills.includes(trimmedSkill)) {
      this.selectedSkills.push(trimmedSkill);
      this.jobForm.get('skillInput')?.setValue('');
    }
  }

  removeSkill(skill: string): void {
    const index = this.selectedSkills.indexOf(skill);
    if (index >= 0) {
      this.selectedSkills.splice(index, 1);
    }
  }

  onSkillSelected(skill: string): void {
    this.addSkill(skill);
  }

  private _filterSkills(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableSkills
      .filter(skill =>
        skill.toLowerCase().includes(filterValue) &&
        !this.selectedSkills.includes(skill)
      )
      .slice(0, 10);
  }

  cancel(): void {
    this.router.navigate(['/jobs']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
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
