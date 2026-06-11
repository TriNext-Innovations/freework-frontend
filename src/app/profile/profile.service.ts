import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
import { Profile, UpdateProfileRequest, FreelancerProfile, CustomerProfile } from './models/profile.models';
import { AuthService } from '../auth/auth.service';
import { buildApiEndpointUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly API_URL = buildApiEndpointUrl('/profile');
  private useMockData = false; // Toggle for testing

  private currentProfileSubject = new BehaviorSubject<Profile | null>(null);
  public currentProfile$ = this.currentProfileSubject.asObservable();

  // Mock data for testing
  private mockProfiles = new Map<string, Profile>();

  constructor() {
    // Initialize mock data
    this.initializeMockData();

    // Load profile when user logs in
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.getMyProfile().subscribe();
      } else {
        this.currentProfileSubject.next(null);
      }
    });
  }

  private initializeMockData() {
    const freelancerProfile: FreelancerProfile = {
      id: 'profile-1',
      userId: 'freelancer1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      profilePicture: 'https://i.pravatar.cc/150?img=12',
      bio: 'Full-stack developer with 5+ years of experience in building scalable web applications. Specialized in Angular, React, Node.js, and cloud technologies.',
      location: 'San Francisco, CA',
      role: 'FREELANCER',
      title: 'Full Stack Developer',
      hourlyRate: 75,
      skills: ['Angular', 'TypeScript', 'Node.js', 'Python', 'AWS', 'MongoDB', 'PostgreSQL', 'Docker'],
      experience: '5+ years',
      education: 'BS in Computer Science, Stanford University',
      availability: 'FULL_TIME',
      rating: 4.8,
      totalReviews: 24,
      completedJobs: 47,
      languages: [
        { name: 'English', proficiency: 'NATIVE' },
        { name: 'Spanish', proficiency: 'CONVERSATIONAL' }
      ],
      portfolio: [
        {
          id: 'port-1',
          title: 'E-commerce Platform',
          description: 'Built a full-featured e-commerce platform with real-time inventory management',
          imageUrl: 'https://via.placeholder.com/400x300',
          technologies: ['Angular', 'Node.js', 'MongoDB'],
          completedAt: '2024-06-15'
        },
        {
          id: 'port-2',
          title: 'Task Management App',
          description: 'Developed a collaborative task management application',
          imageUrl: 'https://via.placeholder.com/400x300',
          technologies: ['React', 'Firebase', 'Material-UI'],
          completedAt: '2024-03-20'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          issueDate: '2023-05-15',
          expiryDate: '2026-05-15',
          credentialUrl: 'https://aws.amazon.com/verification'
        }
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        website: 'https://johndoe.dev'
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-09-20T15:30:00Z'
    };

    const customerProfile: CustomerProfile = {
      id: 'profile-2',
      userId: 'emily-chen',
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'emily@example.com',
      phone: '+1 (555) 987-6543',
      profilePicture: 'https://i.pravatar.cc/150?img=20',
      bio: 'Product manager and entrepreneur looking for talented freelancers to build innovative products.',
      location: 'New York, NY',
      role: 'CUSTOMER',
      company: 'TechVentures Inc.',
      companySize: '11-50 employees',
      industry: 'Technology',
      website: 'https://techventures.example.com',
      rating: 4.9,
      totalReviews: 15,
      totalJobsPosted: 28,
      verifiedPayment: true,
      socialLinks: {
        linkedin: 'https://linkedin.com/in/emilychen',
        twitter: 'https://twitter.com/emilychen',
        website: 'https://techventures.example.com'
      },
      createdAt: '2024-03-20T14:30:00Z',
      updatedAt: '2024-09-18T10:15:00Z'
    };

    this.mockProfiles.set('freelancer1', freelancerProfile);
    this.mockProfiles.set('emily-chen', customerProfile);
  }

  /**
   * Get current user's profile
   */
  getMyProfile(): Observable<Profile> {
    const user = this.authService.currentUserValue;
    if (!user) {
      console.error('❌ Cannot get profile: No user logged in');
      return throwError(() => new Error('User not authenticated'));
    }

    console.log('🔧 Getting profile for user:', user.id, '- Mock mode:', this.useMockData);

    if (this.useMockData) {
      console.log('✅ Using mock profile data');
      return this.getMockProfile(user.id);
    }

    console.log('⚠️ Calling real API:', `${this.API_URL}`);
    return this.http.get<Profile>(`${this.API_URL}`)
      .pipe(
        tap(profile => {
          console.log('✅ Profile loaded from API:', profile);
          this.currentProfileSubject.next(profile);
        }),
        catchError(error => {
          console.error('❌ Error loading profile from API:', error);
          console.log('🔄 Falling back to mock data...');

          // Fallback to mock data
          return this.getMockProfile(user.id).pipe(
            tap(() => console.log('✅ Using mock profile as fallback'))
          );
        })
      );
  }

  /**
   * Get profile by user ID
   */
  getProfileByUserId(userId: string): Observable<Profile> {
    console.log('🔧 Getting profile by userId:', userId, '- Mock mode:', this.useMockData);

    if (this.useMockData) {
      console.log('✅ Using mock profile data');
      return this.getMockProfile(userId);
    }

    console.log('⚠️ Calling real API:', `${this.API_URL}/user/${userId}`);
    return this.http.get<Profile>(`${this.API_URL}/user/${userId}`)
      .pipe(
        tap(profile => console.log('✅ Profile loaded from API:', profile)),
        catchError(error => {
          console.error('❌ Error loading profile from API:', error);
          console.log('🔄 Falling back to mock data...');

          // Fallback to mock data
          return this.getMockProfile(userId).pipe(
            tap(() => console.log('✅ Using mock profile as fallback'))
          );
        })
      );
  }

  /**
   * Update current user's profile
   */
  updateProfile(updates: UpdateProfileRequest): Observable<Profile> {
    if (this.useMockData) {
      return this.updateMockProfile(updates);
    }

    return this.http.put<Profile>(`${this.API_URL}`, updates)
      .pipe(
        tap(profile => {
          this.currentProfileSubject.next(profile);
          // Update user in auth service if profile is now complete
          this.updateAuthUserProfile(profile);
        }),
        catchError(error => {
          console.error('Error updating profile:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Mark profile as completed
   */
  markProfileAsCompleted(): Observable<unknown> {
    if (this.useMockData) {
      return of({ success: true }).pipe(
        tap(() => {
          const user = this.authService.currentUserValue;
          if (user) {
            // Update user in auth service
            const updatedUser = { ...user, profileCompleted: true };
            this.authService.updateCurrentUser(updatedUser);
          }
        })
      );
    }

    return this.http.post(`${this.API_URL}/mark-completed`, {})
      .pipe(
        tap(() => {
          const user = this.authService.currentUserValue;
          if (user) {
            const updatedUser = { ...user, profileCompleted: true };
            this.authService.updateCurrentUser(updatedUser);
          }
        }),
        catchError(error => {
          console.error('Error marking profile as completed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Update auth service user with profile completion status
   */
  private updateAuthUserProfile(profile: Profile): void {
    const user = this.authService.currentUserValue;
    if (user) {
      const updatedUser = {
        ...user,
        profileCompleted: this.isProfileComplete(profile)
      };
      this.authService.updateCurrentUser(updatedUser);
    }
  }

  /**
   * Check if profile has required fields completed
   */
  isProfileComplete(profile: Profile): boolean {
    // Basic required fields
    const hasBasicInfo = !!(
      profile.firstName &&
      profile.lastName &&
      profile.email
    );

    if (profile.role === 'CUSTOMER') {
      const customerProfile = profile as CustomerProfile;
      // Customers need at least company or industry info
      return hasBasicInfo && !!(customerProfile.company || customerProfile.industry);
    } else {
      const freelancerProfile = profile as FreelancerProfile;
      // Freelancers need skills and at least a title or hourly rate
      return hasBasicInfo &&
             !!(freelancerProfile.skills && freelancerProfile.skills.length > 0) &&
             !!(freelancerProfile.title || freelancerProfile.hourlyRate);
    }
  }

  /**
   * Upload profile picture
   */
  uploadProfilePicture(file: File): Observable<{ url: string }> {
    if (this.useMockData) {
      // Simulate upload
      return of({ url: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70) })
        .pipe(delay(1000));
    }

    // Convert the File to a data URL, then send the URL to the backend
    return new Observable<{ url: string }>(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.http.post<{ url: string }>(`${this.API_URL}/upload-picture`, { url: dataUrl })
          .pipe(
            catchError(error => {
              console.error('Error uploading picture:', error);
              return throwError(() => error);
            })
          )
          .subscribe(observer);
      };
      reader.onerror = () => observer.error(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Load profile into the service
   */
  private loadProfile(userId: string): Observable<Profile> {
    return this.getProfileByUserId(userId)
      .pipe(
        tap(profile => this.currentProfileSubject.next(profile))
      );
  }

  /**
   * Get mock profile
   */
  private getMockProfile(userId: string): Observable<Profile> {
    return new Observable(observer => {
      setTimeout(() => {
        const profile = this.mockProfiles.get(userId);
        if (profile) {
          observer.next(profile);
          observer.complete();
        } else {
          observer.error({ message: 'Profile not found' });
        }
      }, 500);
    });
  }

  /**
   * Update mock profile
   */
  private updateMockProfile(updates: UpdateProfileRequest): Observable<Profile> {
    const user = this.authService.currentUserValue;
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    return new Observable(observer => {
      setTimeout(() => {
        const profile = this.mockProfiles.get(user.id);
        if (profile) {
          const updatedProfile = { ...profile, ...updates, updatedAt: new Date().toISOString() };
          this.mockProfiles.set(user.id, updatedProfile);
          observer.next(updatedProfile);
          observer.complete();
        } else {
          observer.error({ message: 'Profile not found' });
        }
      }, 800);
    });
  }
}
