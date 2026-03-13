import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
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
import { Observable } from 'rxjs';
import { User } from './auth/models';

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

  constructor(public authService: AuthService, public themeService: ThemeService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  get isNotFoundRoute(): boolean {
    return this.router.url === '/404';
  }

  ngOnInit(): void {
    console.log('🚀 AppComponent initialized');
    console.log('👤 Initial auth state:', {
      isAuthenticated: this.authService.isAuthenticated,
      currentUser: this.authService.currentUserValue
    });

    // Check localStorage
    const storedToken = localStorage.getItem('freework_access_token');
    const storedUser = localStorage.getItem('freework_user');
    console.log('💾 LocalStorage check:', {
      hasToken: !!storedToken,
      tokenPreview: storedToken ? storedToken.substring(0, 20) + '...' : 'NONE',
      hasUser: !!storedUser,
      userPreview: storedUser ? storedUser.substring(0, 50) + '...' : 'NONE'
    });

    // Try to parse stored user
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('👤 Parsed stored user:', parsedUser);
      } catch (e) {
        console.error('❌ Error parsing stored user:', e);
      }
    }

    // Subscribe to auth changes for debugging
    this.authService.currentUser$.subscribe(user => {
      console.log('👤 Auth state changed in navbar:', user);
    });
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
