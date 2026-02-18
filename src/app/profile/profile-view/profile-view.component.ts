import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';
import { Profile, FreelancerProfile, CustomerProfile } from '../models/profile.models';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {
  profile: Profile | null = null;
  isOwnProfile = false;
  isLoading = true;
  error: string | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
    const labels: { [key: string]: string } = {
      'FULL_TIME': 'Full Time',
      'PART_TIME': 'Part Time',
      'CONTRACT': 'Contract',
      'NOT_AVAILABLE': 'Not Available'
    };
    return availability ? labels[availability] || availability : 'Not specified';
  }

  getProficiencyLabel(proficiency: string): string {
    const labels: { [key: string]: string } = {
      'BASIC': 'Basic',
      'CONVERSATIONAL': 'Conversational',
      'FLUENT': 'Fluent',
      'NATIVE': 'Native'
    };
    return labels[proficiency] || proficiency;
  }
}

