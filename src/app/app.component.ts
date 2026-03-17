import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
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
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { User } from './auth/models';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Freework';
  sidenavOpened = false;
  currentUser$: Observable<User | null>;

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    public subscriptionService: SubscriptionService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    (window as any).AIChatbotConfig = { apiKey: environment.chatbotApiKey };

    // Load subscription whenever user logs in
    this.authService.currentUser$.pipe(
      filter(user => !!user),
      switchMap(() => this.subscriptionService.loadSubscription())
    ).subscribe();

    // Clear subscription on logout
    this.authService.currentUser$.pipe(
      filter(user => !user)
    ).subscribe(() => this.subscriptionService.clearSubscription());
  }

  logout(): void {
    this.authService.logout();
    this.sidenavOpened = false;
  }

  closeSidenav(): void {
    this.sidenavOpened = false;
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
