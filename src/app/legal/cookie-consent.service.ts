import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface CookieConsent {
  version: string;
  timestamp: string;
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
}

@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly COOKIE_NAME = 'fw_cookieconsent';
  private readonly COOKIE_MAX_AGE = 31536000; // 12 months in seconds
  private readonly platformId = inject(PLATFORM_ID);

  private consentSubject = new BehaviorSubject<CookieConsent | null>(this.loadConsent());
  consent$ = this.consentSubject.asObservable();

  private bannerVisibleSubject = new BehaviorSubject<boolean>(!this.hasConsent());
  bannerVisible$ = this.bannerVisibleSubject.asObservable();

  hasConsent(): boolean {
    return this.loadConsent() !== null;
  }

  loadConsent(): CookieConsent | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const cookieValue = this.getCookieValue(this.COOKIE_NAME);
    if (!cookieValue) return null;
    try {
      return JSON.parse(decodeURIComponent(cookieValue));
    } catch {
      return null;
    }
  }

  acceptAll(): void {
    this.saveConsent({
      version: '1.0',
      timestamp: new Date().toISOString(),
      essential: true,
      functional: true,
      analytics: true,
      performance: true,
      marketing: true
    });
  }

  rejectAll(): void {
    this.saveConsent({
      version: '1.0',
      timestamp: new Date().toISOString(),
      essential: true,
      functional: false,
      analytics: false,
      performance: false,
      marketing: false
    });
  }

  saveConsent(consent: CookieConsent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const encoded = encodeURIComponent(JSON.stringify(consent));
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${this.COOKIE_NAME}=${encoded}; max-age=${this.COOKIE_MAX_AGE}; path=/; SameSite=Strict${secure}`;
    this.consentSubject.next(consent);
    this.bannerVisibleSubject.next(false);
    this.applyConsent(consent);
  }

  openBanner(): void {
    this.bannerVisibleSubject.next(true);
  }

  closeBanner(): void {
    this.bannerVisibleSubject.next(false);
  }

  private applyConsent(consent: CookieConsent): void {
    if (consent.analytics) {
      this.loadGoogleAnalytics();
    }
  }

  private loadGoogleAnalytics(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const win = window as unknown as Record<string, unknown>;
    if (!win['gtag']) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(script);
      win['dataLayer'] = (win['dataLayer'] as unknown[]) || [];
      const dataLayer = win['dataLayer'] as unknown[];
      win['gtag'] = function(...args: unknown[]) { dataLayer.push(args); };
      (win['gtag'] as (...args: unknown[]) => void)('js', new Date());
      (win['gtag'] as (...args: unknown[]) => void)('config', 'GA_MEASUREMENT_ID');
    }
  }

  private getCookieValue(name: string): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const match = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
    return match ? match[2] : null;
  }
}
