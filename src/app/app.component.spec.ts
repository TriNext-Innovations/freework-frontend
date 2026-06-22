import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { ThemeService } from './theme.service';
import { SubscriptionService } from './subscription/subscription.service';

describe('AppComponent', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userSubject = new BehaviorSubject(null);
    authService = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: userSubject.asObservable()
    });

    const themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      theme$: of('dark')
    });

    const subscriptionServiceSpy = jasmine.createSpyObj('SubscriptionService', [
      'loadSubscription', 'clearSubscription'
    ], { subscription$: of(null) });
    subscriptionServiceSpy.loadSubscription.and.returnValue(of(null));
    subscriptionServiceSpy.clearSubscription.and.stub();

    const bpSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    bpSpy.observe.and.returnValue(of({ matches: true } as BreakpointState));

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: ThemeService, useValue: themeServiceSpy },
        { provide: SubscriptionService, useValue: subscriptionServiceSpy },
        { provide: BreakpointObserver, useValue: bpSpy },
        { provide: DOCUMENT, useValue: document }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have the Freework title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.title).toBe('Freework');
  });

  it('should call authService.logout() on logout()', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
