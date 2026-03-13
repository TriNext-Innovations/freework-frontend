import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Guard to check if user has completed their profile
 * Redirects to profile edit page if profile is incomplete
 * Usage: canActivate: [profileCompletionGuard]
 */
export const profileCompletionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUserValue;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // If profile is not completed, redirect to profile edit
  if (user.profileCompleted === false) {
    router.navigate(['/profile/edit'], {
      queryParams: { firstTime: true }
    });
    return false;
  }

  return true;
};

/**
 * Guard to ensure user completes profile before accessing certain features
 * Use on routes that require a completed profile (like job posting, applications, etc.)
 */
export const requireCompleteProfile: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUserValue;

  if (!user) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (user.profileCompleted === false) {
    router.navigate(['/profile/edit'], {
      queryParams: {
        firstTime: true,
        returnUrl: state.url
      }
    });
    return false;
  }

  return true;
};
