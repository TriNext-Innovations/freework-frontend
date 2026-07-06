import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';
import { Profile, FreelancerProfile, CustomerProfile } from '../models/profile.models';

@Component({
    selector: 'app-profile-view',
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    templateUrl: './profile-view.component.html',
    styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  profile: Profile | null = null;
  isOwnProfile = false;
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
    const currentUser = this.authService.currentUserValue;

    if (!userId && currentUser) {
      // View own profile
      this.isOwnProfile = true;
      this.loadMyProfile();
    } else if (userId) {
      // View another user's profile
      this.isOwnProfile = currentUser?.id === userId;
      this.loadProfile(userId);
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadMyProfile() {
    this.isLoading = true;
    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadProfile(userId: string) {
    this.isLoading = true;
    this.profileService.getProfileByUserId(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  isFreelancer(profile: Profile): profile is FreelancerProfile {
    return profile.role === 'FREELANCER';
  }

  isCustomer(profile: Profile): profile is CustomerProfile {
    return profile.role === 'CUSTOMER';
  }

  editProfile() {
    this.router.navigate(['/profile/edit']);
  }

  getAvailabilityLabel(availability?: string): string {
    const labels: Record<string, string> = {
      'FULL_TIME': 'Full Time',
      'PART_TIME': 'Part Time',
      'CONTRACT': 'Contract',
      'NOT_AVAILABLE': 'Not Available'
    };
    return availability ? labels[availability] || availability : 'Not specified';
  }

  getProfileImage(profile: Profile): string {
    const p = profile as Profile & Record<string, unknown>;
    const image = p['profilePicture']
      || p['profilePictureUrl']
      || p['avatar']
      || p['avatarUrl']
      || p['picture'];
    return (image as string) || '';
  }

  getProficiencyLabel(proficiency: string): string {
    const labels: Record<string, string> = {
      'BASIC': 'Basic',
      'CONVERSATIONAL': 'Conversational',
      'FLUENT': 'Fluent',
      'NATIVE': 'Native'
    };
    return labels[proficiency] || proficiency;
  }
}
