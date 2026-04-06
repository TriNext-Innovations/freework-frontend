import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, User, RefreshTokenRequest, TokenPayload } from './models';
import { buildApiEndpointUrl, buildApiUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = buildApiUrl('/auth');
  private readonly PROFILE_API_URL = buildApiEndpointUrl('/profile');
  private readonly TOKEN_KEY = 'freework_access_token';
  private readonly REFRESH_TOKEN_KEY = 'freework_refresh_token';

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  private refreshTokenTimeout?: number;
  private authChannel = new BroadcastChannel('freework_auth');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    if (storedUser && this.getAccessToken()) {
      this.startRefreshTokenTimer();
    }

    if (storedUser && this.getAccessToken() && !storedUser.avatar && !storedUser.profilePicture) {
      this.fetchUserProfile().subscribe({
        error: () => { /* fallback avatar handling stays in UI */ }
      });
    }

    // Sync auth state across tabs (e.g. email verification opens a new tab)
    this.authChannel.onmessage = (event) => {
      if (event.data?.type === 'LOGIN') {
        this.currentUserSubject.next(event.data.user);
        this.router.navigate([event.data.redirectTo ?? '/jobs']);
      } else if (event.data?.type === 'LOGOUT') {
        this.currentUserSubject.next(null);
      }
    };
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    return this.http.post<any>(`${this.API_URL}/login`, credentials, httpOptions)
      .pipe(
        tap(response => {
          const authResponse: AuthResponse = {
            accessToken: response.accessToken || response.token,
            refreshToken: response.refreshToken || response.refresh_token || '',
            tokenType: response.tokenType || 'Bearer',
            expiresIn: response.expiresIn || response.expires_in || 3600,
            user: response.user || response.userDetails || this.extractUserFromToken(response.accessToken || response.token)
          };
          this.handleAuthResponse(authResponse);
        }),
        catchError(error => throwError(() => error))
      );
  }

  /**
   * Register new user — backend sends verification email; no auto-login here.
   */
  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/register`, userData)
      .pipe(
        catchError(error => throwError(() => error))
      );
  }

  /**
   * Verify email address via token from verification email.
   * On success the backend returns a JWT so we auto-login the user.
   */
  verifyEmail(token: string): Observable<AuthResponse> {
    return this.http.get<any>(`${this.API_URL}/verify`, { params: { token } })
      .pipe(
        tap(response => {
          const authResponse: AuthResponse = {
            accessToken: response.accessToken || response.token,
            refreshToken: response.refreshToken || response.refresh_token || '',
            tokenType: response.tokenType || 'Bearer',
            expiresIn: response.expiresIn || response.expires_in || 3600,
            user: response.user || response.userDetails ||
              this.extractUserFromToken(response.accessToken || response.token)
          };
          this.handleAuthResponse(authResponse);
        }),
        catchError(error => throwError(() => error))
      );
  }

  /**
   * OAuth2 login (Google, GitHub, etc.)
   */
  loginWithOAuth(provider: 'google' | 'github'): void {
    window.location.href = `${this.API_URL}/oauth2/authorize/${provider}`;
  }

  /**
   * Handle OAuth callback
   */
  handleOAuthCallback(token: string, refreshToken: string): void {
    this.setTokens(token, refreshToken);
    this.fetchUserProfile().subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        this.storeUser(user);
        this.startRefreshTokenTimer();
        this.router.navigate(['/dashboard']);
      },
      error: () => this.logout()
    });
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, { refreshToken }).subscribe();
    }

    this.clearTokens();
    this.currentUserSubject.next(null);
    this.stopRefreshTokenTimer();
    try { this.authChannel.postMessage({ type: 'LOGOUT' }); } catch { /* ignore */ }
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, request)
      .pipe(
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.startRefreshTokenTimer();
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  fetchUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.PROFILE_API_URL}`)
      .pipe(
        map(user => this.normalizeUser(user, this.getAccessToken() || undefined) || user),
        tap(user => {
          this.currentUserSubject.next(user);
          this.storeUser(user);
        })
      );
  }

  /**
   * Safari-compatible localStorage wrapper.
   * Handles private browsing mode where localStorage throws exceptions.
   */
  private safeLocalStorageGet(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private safeLocalStorageSet(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  private safeLocalStorageRemove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  getAccessToken(): string | null {
    return this.safeLocalStorageGet(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.safeLocalStorageGet(this.REFRESH_TOKEN_KEY);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.safeLocalStorageSet(this.TOKEN_KEY, accessToken);
    this.safeLocalStorageSet(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private clearTokens(): void {
    this.safeLocalStorageRemove(this.TOKEN_KEY);
    this.safeLocalStorageRemove(this.REFRESH_TOKEN_KEY);
    this.safeLocalStorageRemove('freework_user');
  }

  private storeUser(user: User): void {
    try {
      this.safeLocalStorageSet('freework_user', JSON.stringify(user));
    } catch {
      /* ignore serialisation errors */
    }
  }

  private getStoredUser(): User | null {
    const userStr = this.safeLocalStorageGet('freework_user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      const parsed = JSON.parse(userStr);
      if (!parsed || typeof parsed !== 'object') return null;
      return this.normalizeUser(parsed, this.getAccessToken() || undefined) || parsed;
    } catch {
      return null;
    }
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.setTokens(response.accessToken, response.refreshToken);

    const normalizedUser = this.normalizeUser(response.user, response.accessToken) || response.user;
    if (!normalizedUser) return;

    this.currentUserSubject.next(normalizedUser);
    this.storeUser(normalizedUser);
    this.startRefreshTokenTimer();

    // Notify other open tabs so they pick up the new auth state
    try {
      const redirectTo = normalizedUser.profileCompleted === false ? '/profile/setup' : '/jobs';
      this.authChannel.postMessage({ type: 'LOGIN', user: normalizedUser, redirectTo });
    } catch { /* BroadcastChannel unavailable */ }

    this.fetchUserProfile().subscribe({ error: () => { /* ignore — avatar fetch is best-effort */ } });
  }

  private normalizeUser(rawUser: any, token?: string): User | null {
    const tokenUser = token ? this.extractUserFromToken(token) : null;
    if (!rawUser && !tokenUser) return null;

    const profilePicture =
      rawUser?.profilePicture ||
      rawUser?.profilePictureUrl ||
      rawUser?.picture ||
      tokenUser?.profilePicture;

    const avatar =
      rawUser?.avatar ||
      rawUser?.avatarUrl ||
      rawUser?.imageUrl ||
      rawUser?.photoUrl ||
      profilePicture ||
      tokenUser?.avatar;

    return {
      id: String(rawUser?.id || rawUser?.userId || tokenUser?.id || ''),
      email: rawUser?.email || tokenUser?.email || '',
      firstName: rawUser?.firstName || rawUser?.given_name || tokenUser?.firstName || '',
      lastName: rawUser?.lastName || rawUser?.family_name || tokenUser?.lastName || '',
      role: (rawUser?.role || tokenUser?.role || 'FREELANCER') as 'CUSTOMER' | 'FREELANCER' | 'ADMIN',
      avatar,
      profilePicture,
      createdAt: rawUser?.createdAt || tokenUser?.createdAt || new Date().toISOString(),
      profileCompleted: rawUser?.profileCompleted ?? rawUser?.profile_completed
    };
  }

  /**
   * Decode JWT token — Safari-compatible base64 decoding.
   */
  private decodeToken(token: string): TokenPayload | null {
    try {
      if (!token || typeof token !== 'string') return null;

      const parts = token.split('.');
      if (parts.length !== 3) return null;

      let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      if (pad === 1) return null;
      if (pad) base64 += new Array(5 - pad).join('=');

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  private extractUserFromToken(token: string): User | null {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) return null;

      return {
        id: decoded.sub || decoded.userId || decoded.id || '',
        email: decoded.email || '',
        firstName: decoded.firstName || decoded.given_name || '',
        lastName: decoded.lastName || decoded.family_name || '',
        role: (decoded.role || decoded.authorities?.[0] || 'FREELANCER') as 'CUSTOMER' | 'FREELANCER' | 'ADMIN',
        avatar: decoded.avatar,
        profilePicture: decoded.profilePicture || decoded.picture,
        createdAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : new Date().toISOString()
      };
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return new Date(decoded.exp * 1000) <= new Date();
  }

  private startRefreshTokenTimer(): void {
    const token = this.getAccessToken();
    if (!token) return;

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return;

    // Refresh 1 minute before expiry
    const timeout = new Date(decoded.exp * 1000).getTime() - Date.now() - 60_000;
    if (timeout > 0) {
      this.refreshTokenTimeout = window.setTimeout(() => {
        this.refreshToken().subscribe();
      }, timeout);
    }
  }

  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      window.clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = undefined;
    }
  }

  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.storeUser(user);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }
}
