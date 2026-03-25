import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { CookieConsentService, CookieConsent } from '../cookie-consent.service';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatSlideToggleModule, MatDividerModule],
  templateUrl: './cookie-consent-banner.component.html',
  styleUrl: './cookie-consent-banner.component.scss'
})
export class CookieConsentBannerComponent implements OnInit {
  visible = false;
  functional = false;
  analytics = false;
  performance = false;
  marketing = false;

  constructor(private cookieConsentService: CookieConsentService) {}

  ngOnInit(): void {
    this.cookieConsentService.bannerVisible$.subscribe(visible => {
      this.visible = visible;
      if (visible) {
        const existing = this.cookieConsentService.loadConsent();
        if (existing) {
          this.functional = existing.functional;
          this.analytics = existing.analytics;
          this.performance = existing.performance;
          this.marketing = existing.marketing;
        }
      }
    });
  }

  acceptAll(): void {
    this.cookieConsentService.acceptAll();
  }

  rejectAll(): void {
    this.cookieConsentService.rejectAll();
  }

  savePreferences(): void {
    const consent: CookieConsent = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      essential: true,
      functional: this.functional,
      analytics: this.analytics,
      performance: this.performance,
      marketing: this.marketing
    };
    this.cookieConsentService.saveConsent(consent);
  }
}
