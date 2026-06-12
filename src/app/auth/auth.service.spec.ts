import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { buildApiUrl, buildApiEndpointUrl } from '../api.config';

function makeJwt(payload: object): string {
  const enc = (obj: object) => btoa(JSON.stringify(obj)).replace(/=/g, '');
  return `${enc({ alg: 'HS256' })}.${enc({ exp: Math.floor(Date.now() / 1000) + 3600, ...payload })}.sig`;
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const AUTH_URL = buildApiUrl('/auth');
  const PROFILE_URL = buildApiEndpointUrl('/profile');

  const accessToken = makeJwt({ sub: '1', email: 'test@example.com', role: 'FREELANCER', firstName: 'Test', lastName: 'User' });
  const refreshToken = makeJwt({ sub: '1', type: 'refresh' });

  const mockUser = {
    id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User',
    role: 'FREELANCER' as const, createdAt: '2024-01-01T00:00:00Z', profileCompleted: true
  };

  const mockAuthResponse = { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: 3600, user: mockUser };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.match(() => true); // drain any constructor-time requests
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('stores tokens and emits user on success', () => {
      let result = false;
      service.login({ email: 'test@example.com', password: 'Password1!' }).subscribe(() => { result = true; });

      httpMock.expectOne(`${AUTH_URL}/login`).flush(mockAuthResponse);
      httpMock.expectOne(PROFILE_URL).flush(mockUser); // fetchUserProfile after login

      expect(result).toBeTrue();
      expect(service.getAccessToken()).toBe(accessToken);
    });

    it('propagates error on 401', () => {
      let errored = false;
      service.login({ email: 'x@x.com', password: 'wrong' }).subscribe({ error: () => { errored = true; } });

      httpMock.expectOne(`${AUTH_URL}/login`).flush({ message: 'Invalid' }, { status: 401, statusText: 'Unauthorized' });

      expect(errored).toBeTrue();
    });
  });

  describe('register()', () => {
    it('POSTs to /register and completes', () => {
      let done = false;
      service.register({ fullName: 'A B', email: 'a@b.com', password: 'Password1!', role: 'FREELANCER' })
        .subscribe(() => { done = true; });

      const req = httpMock.expectOne(`${AUTH_URL}/register`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Registration successful' }, { status: 202, statusText: 'Accepted' });

      expect(done).toBeTrue();
    });
  });

  describe('logout()', () => {
    it('clears tokens and navigates to /login', () => {
      service['safeLocalStorageSet']('freework_access_token', accessToken);
      service['safeLocalStorageSet']('freework_refresh_token', refreshToken);

      service.logout();

      httpMock.expectOne(`${AUTH_URL}/logout`).flush({ message: 'ok' });

      expect(service.getAccessToken()).toBeNull();
      expect(service.currentUserValue).toBeNull();
    });
  });

  describe('forgotPassword()', () => {
    it('POSTs email and returns message', () => {
      let msg = '';
      service.forgotPassword('test@example.com').subscribe(r => { msg = r.message; });

      const req = httpMock.expectOne(`${AUTH_URL}/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'test@example.com' });
      req.flush({ message: 'If that email is registered, a password reset link has been sent.' });

      expect(msg).toContain('password reset link');
    });
  });

  describe('resetPassword()', () => {
    it('POSTs token and newPassword', () => {
      let msg = '';
      service.resetPassword('uuid-token', 'NewPass1!').subscribe(r => { msg = r.message; });

      const req = httpMock.expectOne(`${AUTH_URL}/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token: 'uuid-token', newPassword: 'NewPass1!' });
      req.flush({ message: 'Password reset successfully.' });

      expect(msg).toContain('Password reset successfully');
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when localStorage has no token', () => {
      expect(service.isAuthenticated).toBeFalse();
    });

    it('returns true when a non-expired token is stored', () => {
      localStorage.setItem('freework_access_token', accessToken);
      expect(service.isAuthenticated).toBeTrue();
    });
  });

  describe('resendVerification()', () => {
    it('POSTs email to /resend-verification', () => {
      let done = false;
      service.resendVerification('test@example.com').subscribe(() => { done = true; });

      const req = httpMock.expectOne(`${AUTH_URL}/resend-verification`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Sent' });

      expect(done).toBeTrue();
    });
  });
});
