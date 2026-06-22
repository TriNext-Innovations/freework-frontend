import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { tokenInterceptor } from './token.interceptor';
import { AuthResponse } from './models';

describe('tokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  const mockRefreshResponse: AuthResponse = {
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
    tokenType: 'Bearer',
    expiresIn: 3600,
    user: { id: '1', email: 'test@example.com', firstName: 'T', lastName: 'U', role: 'FREELANCER', createdAt: '' }
  };

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getAccessToken', 'refreshToken', 'logout']);
    authService.getAccessToken.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        provideHttpClient(withInterceptors([tokenInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('does not add Authorization header when no token', () => {
    authService.getAccessToken.and.returnValue(null);
    http.get('/api/jobs').subscribe();

    const req = httpMock.expectOne('/api/jobs');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('adds Bearer Authorization header when token exists', () => {
    authService.getAccessToken.and.returnValue('my-access-token');
    http.get('/api/jobs').subscribe();

    const req = httpMock.expectOne('/api/jobs');
    expect(req.request.headers.get('Authorization')).toBe('Bearer my-access-token');
    req.flush({});
  });

  it('skips Authorization header for /auth/login', () => {
    authService.getAccessToken.and.returnValue('my-access-token');
    http.post('/auth/login', {}).subscribe();

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('skips Authorization header for /auth/register', () => {
    authService.getAccessToken.and.returnValue('my-access-token');
    http.post('/auth/register', {}).subscribe();

    const req = httpMock.expectOne('/auth/register');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('always sets Content-Type and Accept headers', () => {
    authService.getAccessToken.and.returnValue(null);
    http.get('/api/jobs').subscribe();

    const req = httpMock.expectOne('/api/jobs');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush({});
  });

  it('attempts token refresh on 401 and retries the request', () => {
    authService.getAccessToken.and.returnValue('expired-token');
    authService.refreshToken.and.returnValue(of(mockRefreshResponse));

    let result: unknown;
    http.get('/api/jobs').subscribe(r => { result = r; });

    const firstReq = httpMock.expectOne('/api/jobs');
    firstReq.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    const retryReq = httpMock.expectOne('/api/jobs');
    retryReq.flush([{ id: '1' }]);

    expect(authService.refreshToken).toHaveBeenCalled();
    expect(result).toEqual([{ id: '1' }]);
  });

  it('logs out when token refresh fails on 401', () => {
    authService.getAccessToken.and.returnValue('expired-token');
    authService.refreshToken.and.returnValue(throwError(() => new Error('Refresh failed')));
    authService.logout.and.stub();

    let errored = false;
    http.get('/api/jobs').subscribe({ error: () => { errored = true; } });

    const req = httpMock.expectOne('/api/jobs');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(authService.logout).toHaveBeenCalled();
    expect(errored).toBeTrue();
  });
});
