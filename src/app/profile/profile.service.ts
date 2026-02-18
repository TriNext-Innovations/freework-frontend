import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
import { Profile, UpdateProfileRequest, FreelancerProfile, CustomerProfile } from './models/profile.models';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = 'http://localhost:8080/api/profiles';
  private useMockData = true; // Toggle for testing

  private currentProfileSubject = new BehaviorSubject<Profile | null>(null);
  public currentProfile$ = this.currentProfileSubject.asObservable();

  // Mock data for testing
  private mockProfiles = new Map<string, Profile>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Initialize mock data
    this.initializeMockData();

    // Load profile when user logs in
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadProfile(user.id).subscribe();
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
      return throwError(() => new Error('User not authenticated'));
    }

    if (this.useMockData) {
      return this.getMockProfile(user.id);
    }

    return this.http.get<Profile>(`${this.API_URL}/me`)
      .pipe(
        tap(profile => this.currentProfileSubject.next(profile)),
        catchError(error => {
          console.error('Error loading profile:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get profile by user ID
   */
  getProfileByUserId(userId: string): Observable<Profile> {
    if (this.useMockData) {
      return this.getMockProfile(userId);
    }

    return this.http.get<Profile>(`${this.API_URL}/user/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error loading profile:', error);
          return throwError(() => error);
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

    return this.http.put<Profile>(`${this.API_URL}/me`, updates)
      .pipe(
        tap(profile => this.currentProfileSubject.next(profile)),
        catchError(error => {
          console.error('Error updating profile:', error);
          return throwError(() => error);
        })
      );
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

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(`${this.API_URL}/upload-picture`, formData)
      .pipe(
        catchError(error => {
          console.error('Error uploading picture:', error);
          return throwError(() => error);
        })
      );
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

