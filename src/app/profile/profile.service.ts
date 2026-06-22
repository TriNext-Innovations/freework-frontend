import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Profile, UpdateProfileRequest, FreelancerProfile, CustomerProfile } from './models/profile.models';
import { AuthService } from '../auth/auth.service';
import { buildApiEndpointUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = buildApiEndpointUrl('/profile');

  private currentProfileSubject = new BehaviorSubject<Profile | null>(null);
  public currentProfile$ = this.currentProfileSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.getMyProfile().subscribe();
      } else {
        this.currentProfileSubject.next(null);
      }
    });
  }

  getMyProfile(): Observable<Profile> {
    const user = this.authService.currentUserValue;
    if (!user) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<Profile>(`${this.API_URL}`)
      .pipe(
        tap(profile => this.currentProfileSubject.next(profile)),
        catchError(error => throwError(() => error))
      );
  }

  getProfileByUserId(userId: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.API_URL}/user/${userId}`)
      .pipe(
        catchError(error => throwError(() => error))
      );
  }

  updateProfile(updates: UpdateProfileRequest): Observable<Profile> {
    return this.http.put<Profile>(`${this.API_URL}`, updates)
      .pipe(
        tap(profile => {
          this.currentProfileSubject.next(profile);
          this.updateAuthUserProfile(profile);
        }),
        catchError(error => throwError(() => error))
      );
  }

  markProfileAsCompleted(): Observable<unknown> {
    return this.http.post(`${this.API_URL}/mark-completed`, {})
      .pipe(
        tap(() => {
          const user = this.authService.currentUserValue;
          if (user) {
            this.authService.updateCurrentUser({ ...user, profileCompleted: true });
          }
        }),
        catchError(error => throwError(() => error))
      );
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    return new Observable<{ url: string }>(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.http.post<{ url: string }>(`${this.API_URL}/upload-picture`, { url: dataUrl })
          .pipe(catchError(error => throwError(() => error)))
          .subscribe(observer);
      };
      reader.onerror = () => observer.error(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  isProfileComplete(profile: Profile): boolean {
    const hasBasicInfo = !!(profile.firstName && profile.lastName && profile.email);

    if (profile.role === 'CUSTOMER') {
      const customerProfile = profile as CustomerProfile;
      return hasBasicInfo && !!(customerProfile.company || customerProfile.industry);
    } else {
      const freelancerProfile = profile as FreelancerProfile;
      return hasBasicInfo &&
             !!(freelancerProfile.skills && freelancerProfile.skills.length > 0) &&
             !!(freelancerProfile.title || freelancerProfile.hourlyRate);
    }
  }

  private updateAuthUserProfile(profile: Profile): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.authService.updateCurrentUser({
        ...user,
        profileCompleted: this.isProfileComplete(profile)
      });
    }
  }
}
