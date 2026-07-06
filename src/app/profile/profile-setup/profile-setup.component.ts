import { Component, OnInit, inject } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../profile.service';
import { UpdateProfileRequest } from '../models/profile.models';
import { CanDeactivateProfileSetup } from '../../auth/auth.guard';
import { SKILLS_DATABASE } from '../../jobs/models/job.models';

@Component({
    selector: 'app-profile-setup',
    imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatSelectModule,
    MatAutocompleteModule
],
    templateUrl: './profile-setup.component.html',
    styleUrls: ['./profile-setup.component.scss']
})
export class ProfileSetupComponent implements OnInit, CanDeactivateProfileSetup {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private snackBar = inject(MatSnackBar);

  setupForm!: FormGroup;
  skillInputControl = new FormControl('');
  submitting = false;
  isSaved = false;
  skills: string[] = [];
  filteredSkills: string[] = [];

  role: 'FREELANCER' | 'CUSTOMER' | 'ADMIN' = 'FREELANCER';

  availabilityOptions = [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract / Project Based' },
  ];

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.role = user.role as 'FREELANCER' | 'CUSTOMER' | 'ADMIN';

    if (this.isFreelancer) {
      this.setupForm = this.fb.group({
        firstName: [user.firstName || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        lastName: [user.lastName || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        title: ['', [Validators.required, Validators.maxLength(100)]],
        hourlyRate: ['', [Validators.required, Validators.min(1)]],
        availability: ['FULL_TIME', [Validators.required]],
        bio: ['', [Validators.maxLength(2000)]],
        location: ['', [Validators.maxLength(255)]],
      });
    } else {
      this.setupForm = this.fb.group({
        firstName: [user.firstName || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        lastName: [user.lastName || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        company: ['', [Validators.required, Validators.maxLength(255)]],
        industry: ['', [Validators.required, Validators.maxLength(100)]],
        bio: ['', [Validators.maxLength(2000)]],
        location: ['', [Validators.maxLength(255)]],
      });
    }

    this.skillInputControl.valueChanges.subscribe(value => {
      this.filteredSkills = this.filterSkills(value || '');
    });
    this.filteredSkills = this.filterSkills('');
  }

  get isFreelancer(): boolean {
    return this.role === 'FREELANCER';
  }

  filterSkills(query: string): string[] {
    const q = query.toLowerCase();
    return SKILLS_DATABASE
      .filter(s => s.toLowerCase().includes(q) && !this.skills.includes(s))
      .slice(0, 10);
  }

  selectSkill(event: MatAutocompleteSelectedEvent): void {
    const skill = event.option.value;
    if (skill && !this.skills.includes(skill) && this.skills.length < 20) {
      this.skills.push(skill);
    }
    this.skillInputControl.setValue('');
    this.filteredSkills = this.filterSkills('');
  }

  removeSkill(skill: string): void {
    this.skills = this.skills.filter(s => s !== skill);
    this.filteredSkills = this.filterSkills(this.skillInputControl.value || '');
  }

  onSubmit(): void {
    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    if (this.isFreelancer && this.skills.length === 0) {
      this.snackBar.open('Please add at least one skill', 'Close', { duration: 3000 });
      return;
    }

    this.submitting = true;
    const values = this.setupForm.value;

    const updates: UpdateProfileRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      bio: values.bio || undefined,
      location: values.location || undefined,
    };

    if (this.isFreelancer) {
      updates.title = values.title;
      updates.hourlyRate = values.hourlyRate;
      updates.availability = values.availability;
      updates.skills = this.skills;
    } else {
      updates.company = values.company;
      updates.industry = values.industry;
    }

    this.profileService.updateProfile(updates).subscribe({
      next: () => {
        this.authService.fetchUserProfile().subscribe();
        this.isSaved = true;
        this.submitting = false;
        this.snackBar.open('Profile complete! Welcome to Freework.', 'Close', { duration: 3000 });
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        this.submitting = false;
        const msg = error.error?.message || 'Failed to save profile. Please try again.';
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      }
    });
  }

  confirmLeave(): boolean {
    return window.confirm(
      'Your profile is not complete. You must complete your profile before using Freework. Are you sure you want to leave?'
    );
  }
}
