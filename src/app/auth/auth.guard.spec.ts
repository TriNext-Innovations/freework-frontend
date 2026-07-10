import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './auth.guard';
import { AuthService } from './auth.service';

function makeState(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

const emptyRoute = {} as ActivatedRouteSnapshot;

describe('Auth Guards', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getCurrentUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });
  });

  describe('authGuard', () => {
    it('returns true when user is logged in', () => {
      authService.isLoggedIn.and.returnValue(true);
      const result = TestBed.runInInjectionContext(() => authGuard(emptyRoute, makeState('/dashboard')));
      expect(result).toBeTrue();
    });

    it('redirects to /login with returnUrl when not logged in', () => {
      authService.isLoggedIn.and.returnValue(false);
      const result = TestBed.runInInjectionContext(() => authGuard(emptyRoute, makeState('/dashboard')));
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/dashboard' } });
    });
  });

  describe('guestGuard', () => {
    it('allows access when user is NOT logged in', () => {
      authService.isLoggedIn.and.returnValue(false);
      const result = TestBed.runInInjectionContext(() => guestGuard(emptyRoute, makeState('/login')));
      expect(result).toBeTrue();
    });

    it('redirects to / when user is already logged in', () => {
      authService.isLoggedIn.and.returnValue(true);
      const result = TestBed.runInInjectionContext(() => guestGuard(emptyRoute, makeState('/login')));
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('roleGuard', () => {
    it('allows access for a user with the required role', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getCurrentUser.and.returnValue({ role: 'CUSTOMER' } as never);
      const result = TestBed.runInInjectionContext(() => roleGuard(['CUSTOMER'])(emptyRoute, makeState('/my-jobs')));
      expect(result).toBeTrue();
    });

    it('denies access and redirects to / for wrong role', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getCurrentUser.and.returnValue({ role: 'FREELANCER' } as never);
      const result = TestBed.runInInjectionContext(() => roleGuard(['CUSTOMER'])(emptyRoute, makeState('/my-jobs')));
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('redirects to /login when not authenticated', () => {
      authService.isLoggedIn.and.returnValue(false);
      const result = TestBed.runInInjectionContext(() => roleGuard(['ADMIN'])(emptyRoute, makeState('/admin')));
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/admin' } });
    });

    it('allows ADMIN when ADMIN is in allowed roles', () => {
      authService.isLoggedIn.and.returnValue(true);
      authService.getCurrentUser.and.returnValue({ role: 'ADMIN' } as never);
      const result = TestBed.runInInjectionContext(() => roleGuard(['CUSTOMER', 'ADMIN'])(emptyRoute, makeState('/admin')));
      expect(result).toBeTrue();
    });
  });
});
