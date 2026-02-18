import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';
import { Profile, FreelancerProfile, CustomerProfile, UpdateProfileRequest, Language } from '../models/profile.models';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  profileForm!: FormGroup;
  profile: Profile | null = null;
  isLoading = true;
  isSaving = false;
  error: string | null = null;
  successMessage: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  availabilityOptions = [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'NOT_AVAILABLE', label: 'Not Available' }
  ];

  proficiencyOptions = [
    { value: 'BASIC', label: 'Basic' },
    { value: 'CONVERSATIONAL', label: 'Conversational' },
    { value: 'FLUENT', label: 'Fluent' },
    { value: 'NATIVE', label: 'Native' }
  ];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.error = null;
    console.log('🔧 Loading profile for edit...');

    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        console.log('✅ Profile loaded successfully:', profile);
        this.profile = profile;
        this.initializeForm(profile);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load profile:', err);
        this.error = 'Failed to load profile. Please try again.';
        this.isLoading = false;
      }
    });
  }

  initializeForm(profile: Profile) {
    if (profile.role === 'FREELANCER') {
      this.initializeFreelancerForm(profile as FreelancerProfile);
    } else {
      this.initializeCustomerForm(profile as CustomerProfile);
    }
  }

  initializeFreelancerForm(profile: FreelancerProfile) {
    this.profileForm = this.fb.group({
      firstName: [profile.firstName, Validators.required],
      lastName: [profile.lastName, Validators.required],
      email: [{ value: profile.email, disabled: true }],
      phone: [profile.phone],
      location: [profile.location],
      title: [profile.title],
      hourlyRate: [profile.hourlyRate, [Validators.min(0)]],
      bio: [profile.bio, [Validators.maxLength(1000)]],
      skills: [profile.skills?.join(', ') || ''],
      experience: [profile.experience],
      education: [profile.education],
      availability: [profile.availability || 'FULL_TIME'],
      languages: this.fb.array(profile.languages?.map(lang => this.createLanguageGroup(lang)) || []),
      socialLinks: this.fb.group({
        linkedin: [profile.socialLinks?.linkedin],
        github: [profile.socialLinks?.github],
        twitter: [profile.socialLinks?.twitter],
        website: [profile.socialLinks?.website],
        behance: [profile.socialLinks?.behance],
        dribbble: [profile.socialLinks?.dribbble]
      })
    });
  }

  initializeCustomerForm(profile: CustomerProfile) {
    this.profileForm = this.fb.group({
      firstName: [profile.firstName, Validators.required],
      lastName: [profile.lastName, Validators.required],
      email: [{ value: profile.email, disabled: true }],
      phone: [profile.phone],
      location: [profile.location],
      company: [profile.company],
      companySize: [profile.companySize],
      industry: [profile.industry],
      website: [profile.website],
      bio: [profile.bio, [Validators.maxLength(1000)]],
      socialLinks: this.fb.group({
        linkedin: [profile.socialLinks?.linkedin],
        twitter: [profile.socialLinks?.twitter],
        website: [profile.socialLinks?.website]
      })
    });
  }

  createLanguageGroup(language?: Language): FormGroup {
    return this.fb.group({
      name: [language?.name || '', Validators.required],
      proficiency: [language?.proficiency || 'BASIC', Validators.required]
    });
  }

  get languages(): FormArray {
    return this.profileForm.get('languages') as FormArray;
  }

  addLanguage() {
    this.languages.push(this.createLanguageGroup());
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  isFreelancer(): boolean {
    return this.profile?.role === 'FREELANCER';
  }

  isCustomer(): boolean {
    return this.profile?.role === 'CUSTOMER';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select an image file';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size should be less than 5MB';
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture() {
    if (!this.selectedFile) return;

    this.isSaving = true;
    this.profileService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (response) => {
        this.successMessage = 'Profile picture updated successfully!';
        this.selectedFile = null;
        this.previewUrl = null;
        if (this.profile) {
          this.profile.profilePicture = response.url;
        }
        this.isSaving = false;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.error = 'Failed to upload profile picture';
        this.isSaving = false;
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isSaving = true;
    this.error = null;
    this.successMessage = null;

    const formValue = this.profileForm.getRawValue();
    const updateRequest: UpdateProfileRequest = {
      ...formValue
    };

    // Convert skills string to array for freelancers
    if (this.isFreelancer() && formValue.skills) {
      updateRequest.skills = formValue.skills
        .split(',')
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill.length > 0);
    }

    this.profileService.updateProfile(updateRequest).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.successMessage = 'Profile updated successfully!';
        this.isSaving = false;

        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 1500);
      },
      error: (err) => {
        this.error = 'Failed to update profile';
        this.isSaving = false;
        console.error(err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/profile']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (field?.hasError('min')) {
      return 'Value must be greater than 0';
    }
    if (field?.hasError('maxlength')) {
      return 'Maximum length exceeded';
    }
    return '';
  }
}
