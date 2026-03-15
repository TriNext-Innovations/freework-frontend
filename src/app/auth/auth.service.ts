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
  private useMockData = false; // Toggle to switch between mock and real API

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  private refreshTokenTimeout?: number;

  // Mock users for testing
  private mockUsers: User[] = [
    {
      id: 'freelancer1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'FREELANCER',
      profilePicture: 'https://i.pravatar.cc/150?img=12',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'emily-chen',
      email: 'emily@example.com',
      firstName: 'Emily',
      lastName: 'Chen',
      role: 'CUSTOMER',
      profilePicture: 'https://i.pravatar.cc/150?img=20',
      createdAt: '2024-03-20T14:30:00Z'
    }
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Start refresh token timer if user is logged in
    if (storedUser && this.getAccessToken()) {
      this.startRefreshTokenTimer();
    }

    if (storedUser && this.getAccessToken() && !storedUser.avatar && !storedUser.profilePicture) {
      this.fetchUserProfile().subscribe({
        error: () => {
          // Ignore; fallback avatar handling stays in UI.
        }
      });
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🔧 Login called - useMockData:', this.useMockData);
    console.log('🔧 Credentials:', credentials.email);

    // Use mock authentication for testing
    if (this.useMockData) {
      console.log('✅ Using mock authentication');
      return this.mockLogin(credentials);
    }

    console.log('⚠️ Using real API authentication');

    // Safari-compatible HTTP options
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    return this.http.post<any>(`${this.API_URL}/login`, credentials, httpOptions)
      .pipe(
        tap(response => {
          console.log('📥 Raw API Response received:', response);
          console.log('📥 Response type:', typeof response);
          console.log('📥 Response keys:', Object.keys(response));
          console.log('📥 Access token:', response.accessToken || response.token || 'MISSING');
          console.log('📥 Refresh token:', response.refreshToken || 'MISSING');
          console.log('📥 User data:', response.user || response.userDetails || 'MISSING');

          // Handle different possible API response formats
          const authResponse: AuthResponse = {
            accessToken: response.accessToken || response.token,
            refreshToken: response.refreshToken || response.refresh_token || '',
            tokenType: response.tokenType || 'Bearer',
            expiresIn: response.expiresIn || response.expires_in || 3600,
            user: response.user || response.userDetails || this.extractUserFromToken(response.accessToken || response.token)
          };

          console.log('📥 Normalized auth response:', authResponse);
          this.handleAuthResponse(authResponse);
        }),
        catchError(error => {
          console.error('❌ Login error:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error message:', error.message);
          return throwError(() => error);
        })
      );
  }

  /**
   * Mock login for testing
   */
  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    // Simulate API delay
    return new Observable(observer => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.email === credentials.email);

        if (!user) {
          observer.error({ error: { message: 'Invalid email or password' } });
          return;
        }

        // For mock, accept any password with "password" or the user's first name
        const validPassword = credentials.password === 'password' ||
                            credentials.password.toLowerCase() === user.firstName.toLowerCase();

        if (!validPassword) {
          observer.error({ error: { message: 'Invalid email or password' } });
          return;
        }

        const mockToken = 'mock-jwt-token-' + user.id;
        const mockRefreshToken = 'mock-refresh-token-' + user.id;

        const response: AuthResponse = {
          accessToken: mockToken,
          refreshToken: mockRefreshToken,
          tokenType: 'Bearer',
          user: user,
          expiresIn: 3600
        };

        this.handleAuthResponse(response);
        observer.next(response);
        observer.complete();
      }, 800);
    });
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => this.handleAuthResponse(response)),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * OAuth2 login (Google, GitHub, etc.)
   */
  loginWithOAuth(provider: 'google' | 'github'): void {
    // Redirect to backend OAuth endpoint
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
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.logout();
      }
    });
  }

  /**
   * Logout user
   */
  logout(): void {
    // Call backend to invalidate tokens
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.API_URL}/logout`, { refreshToken }).subscribe();
    }

    this.clearTokens();
    this.currentUserSubject.next(null);
    this.stopRefreshTokenTimer();
    this.router.navigate(['/login']);
  }

  /**
   * Refresh access token using refresh token
   */
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
          console.error('Token refresh failed:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  /**
   * Fetch current user profile
   */
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
   * Safari-compatible localStorage wrapper
   * Handles private browsing mode where localStorage throws exceptions
   */
  private safeLocalStorageGet(key: string): string | null {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed (Safari private mode?):', error);
      return null;
    }
  }

  private safeLocalStorageSet(key: string, value: string): boolean {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed (Safari private mode?):', error);
      return false;
    }
  }

  private safeLocalStorageRemove(key: string): boolean {
    try {
      if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage.removeItem failed (Safari private mode?):', error);
      return false;
    }
  }

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return this.safeLocalStorageGet(this.TOKEN_KEY);
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return this.safeLocalStorageGet(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Set tokens in storage
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    this.safeLocalStorageSet(this.TOKEN_KEY, accessToken);
    this.safeLocalStorageSet(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Clear all tokens and user data
   */
  private clearTokens(): void {
    this.safeLocalStorageRemove(this.TOKEN_KEY);
    this.safeLocalStorageRemove(this.REFRESH_TOKEN_KEY);
    this.safeLocalStorageRemove('freework_user');
  }

  /**
   * Store user data
   */
  private storeUser(user: User): void {
    try {
      const userJson = JSON.stringify(user);
      this.safeLocalStorageSet('freework_user', userJson);
    } catch (error) {
      console.error('Error stringifying user data:', error);
    }
  }

  /**
   * Get stored user data
   */
  private getStoredUser(): User | null {
    const userStr = this.safeLocalStorageGet('freework_user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      const parsed = JSON.parse(userStr);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }
      return this.normalizeUser(parsed, this.getAccessToken() || undefined) || parsed;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  /**
   * Handle authentication response
   */
  private handleAuthResponse(response: AuthResponse): void {
    console.log('🔐 handleAuthResponse called with:', response);
    console.log('🔐 User from response:', response.user);
    console.log('🔐 Access token:', response.accessToken ? 'Present' : 'Missing');

    this.setTokens(response.accessToken, response.refreshToken);

    const normalizedUser = this.normalizeUser(response.user, response.accessToken) || response.user;
    if (!normalizedUser) {
      console.error('❌ No user data available after normalization');
      return;
    }

    this.currentUserSubject.next(normalizedUser);
    this.storeUser(normalizedUser);
    this.startRefreshTokenTimer();

    if (!this.useMockData && !normalizedUser.avatar) {
      this.fetchUserProfile().subscribe({
        error: (error) => {
          console.error('❌ Error fetching profile for avatar:', error);
        }
      });
    }

    console.log('✅ Auth response handled. Current user:', this.currentUserValue);
    console.log('✅ Is authenticated:', this.isAuthenticated);
    console.log('✅ Token in storage:', this.getAccessToken() ? 'Present' : 'Missing');
  }

  private normalizeUser(rawUser: any, token?: string): User | null {
    const tokenUser = token ? this.extractUserFromToken(token) : null;
    if (!rawUser && !tokenUser) {
      return null;
    }

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
      avatar: avatar,
      profilePicture: profilePicture,
      createdAt: rawUser?.createdAt || tokenUser?.createdAt || new Date().toISOString(),
      profileCompleted: rawUser?.profileCompleted ?? rawUser?.profile_completed
    };
  }

  /**
   * Decode JWT token (Safari-compatible)
   */
  private decodeToken(token: string): TokenPayload | null {
    try {
      if (!token || typeof token !== 'string') {
        console.error('Invalid token provided to decodeToken');
        return null;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid JWT token format');
        return null;
      }

      const payload = parts[1];

      // Safari-compatible base64 decoding
      // Replace URL-safe characters and pad if necessary
      let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      if (pad) {
        if (pad === 1) {
          console.error('Invalid base64 string');
          return null;
        }
        base64 += new Array(5 - pad).join('=');
      }

      // Check if atob is available (should be in all modern browsers including Safari)
      if (typeof atob === 'undefined') {
        console.error('atob is not available in this environment');
        return null;
      }

      // Use decodeURIComponent for better Unicode support on Safari
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const parsed = JSON.parse(jsonPayload);
      console.log('🔍 Successfully decoded token payload:', parsed);
      return parsed;
    } catch (error) {
      console.error('❌ Error decoding token:', error);
      console.error('❌ Token that failed:', token?.substring(0, 20) + '...');
      return null;
    }
  }

  /**
   * Extract user data from JWT token if user object not provided in response
   */
  private extractUserFromToken(token: string): User | null {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) return null;

      console.log('🔍 Decoded token payload:', decoded);

      // Build user object from token claims
      const user: User = {
        id: decoded.sub || decoded.userId || decoded.id || '',
        email: decoded.email || '',
        firstName: decoded.firstName || decoded.given_name || '',
        lastName: decoded.lastName || decoded.family_name || '',
        role: (decoded.role || decoded.authorities?.[0] || 'FREELANCER') as 'CUSTOMER' | 'FREELANCER' | 'ADMIN',
        avatar: decoded.avatar,
        profilePicture: decoded.profilePicture || decoded.picture,
        createdAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : new Date().toISOString()
      };

      console.log('👤 Extracted user from token:', user);
      return user;
    } catch (error) {
      console.error('Error extracting user from token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    // Mock tokens never expire
    if (this.useMockData && token.startsWith('mock-jwt-token-')) {
      return false;
    }

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate <= new Date();
  }

  /**
   * Start automatic token refresh timer
   */
  private startRefreshTokenTimer(): void {
    const token = this.getAccessToken();
    if (!token) return;

    // For mock data, don't need to refresh
    if (this.useMockData && token.startsWith('mock-jwt-token-')) {
      return;
    }

    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return;

    // Refresh token 1 minute before expiration
    const expires = new Date(decoded.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);

    // Safari-compatible timeout handling
    if (timeout > 0) {
      this.refreshTokenTimeout = window.setTimeout(() => {
        this.refreshToken().subscribe();
      }, timeout);
    }
  }

  /**
   * Stop automatic token refresh timer
   */
  private stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimeout) {
      window.clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = undefined;
    }
  }

  /**
   * Check if user is logged in (alias for isAuthenticated)
   * Used by auth guards
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Get current user (alias for currentUserValue)
   * Used by auth guards
   */
  getCurrentUser(): User | null {
    return this.currentUserValue;
  }
}
