import { inject } from '@angular/core';
import { Router, CanActivateFn, CanDeactivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Functional route guard to protect routes that require authentication
 * Usage: canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};

/**
 * Guard to check if user has a specific role
 * Usage: canActivate: [roleGuard(['CUSTOMER'])]
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (_route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    const user = authService.getCurrentUser();
    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    // User doesn't have required role
    router.navigate(['/']);
    return false;
  };
};

/**
 * Guard to prevent leaving the profile setup page without saving
 */
export interface CanDeactivateProfileSetup {
  isSaved: boolean;
  confirmLeave(): boolean;
}

export const profileSetupDeactivateGuard: CanDeactivateFn<CanDeactivateProfileSetup> = (component) => {
  if (component.isSaved) return true;
  return component.confirmLeave();
};

/**
 * Guard to redirect authenticated users away from auth pages
 * Usage on login/register routes: canActivate: [guestGuard]
 */
export const guestGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  // Already logged in, redirect to home
  router.navigate(['/']);
  return false;
};
