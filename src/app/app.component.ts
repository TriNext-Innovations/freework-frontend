import { Component, OnInit, OnDestroy, Inject, DOCUMENT } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AuthService } from './auth/auth.service';
import { ThemeService } from './theme.service';
import { SubscriptionService } from './subscription/subscription.service';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { User } from './auth/models';
import { environment } from '../environments/environment';
import { CookieConsentBannerComponent } from './legal/cookie-consent-banner/cookie-consent-banner.component';
import { FooterComponent } from './shared/footer/footer.component';

const DESKTOP_BREAKPOINT = '(min-width: 1024px)';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatBadgeModule,
        MatDividerModule,
        MatSidenavModule,
        MatListModule,
        CookieConsentBannerComponent,
        FooterComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Freework';
  sidenavOpened = false;
  isDesktop = false;
  currentUser$: Observable<User | null>;

  private bpSub?: Subscription;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    public subscriptionService: SubscriptionService,
    private breakpointObserver: BreakpointObserver,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    (window as unknown as Record<string, unknown>)['AIChatbotConfig'] = { apiKey: environment.chatbotApiKey };

    this.bpSub = this.breakpointObserver.observe(DESKTOP_BREAKPOINT).subscribe(state => {
      this.isDesktop = state.matches;
      this.sidenavOpened = state.matches;
    });

    this.authService.currentUser$.pipe(
      filter(user => !!user),
      switchMap(() => this.subscriptionService.loadSubscription())
    ).subscribe();

    this.authService.currentUser$.pipe(
      filter(user => !user)
    ).subscribe(() => this.subscriptionService.clearSubscription());
  }

  ngOnDestroy(): void {
    this.bpSub?.unsubscribe();
  }

  get sidenavMode(): 'side' | 'over' {
    return this.isDesktop ? 'side' : 'over';
  }

  logout(): void {
    this.authService.logout();
    if (!this.isDesktop) this.sidenavOpened = false;
  }

  closeSidenav(): void {
    if (!this.isDesktop) this.sidenavOpened = false;
  }

  getAvatarUrl(user: User): string {
    return user.avatar || user.profilePicture || '';
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.removeAttribute('src');
    }
  }
}
