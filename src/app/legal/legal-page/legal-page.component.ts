import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { LEGAL_CONTENT, LegalDocument } from '../legal-content';
import { CookieConsentService } from '../cookie-consent.service';

@Component({
    selector: 'app-legal-page',
    imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatButtonToggleModule,
    FormsModule
],
    templateUrl: './legal-page.component.html',
    styleUrl: './legal-page.component.scss'
})
export class LegalPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cookieConsentService = inject(CookieConsentService);

  document: LegalDocument | null = null;
  documentKey = '';
  language: 'en' | 'af' = 'en';
  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.documentKey = this.route.snapshot.data['documentKey'] || '';
    const langParam = this.route.snapshot.queryParamMap.get('lang');
    if (langParam === 'af' || langParam === 'en') {
      this.language = langParam;
    }
    this.loadDocument();
  }

  loadDocument(): void {
    const docs = LEGAL_CONTENT[this.language];
    this.document = docs[this.documentKey] || null;
  }

  onLanguageChange(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.language === 'en' ? {} : { lang: this.language },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    this.loadDocument();
  }

  printDocument(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  openCookieSettings(): void {
    this.cookieConsentService.openBanner();
  }

  scrollToSection(id: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  get isCookiePolicy(): boolean {
    return this.documentKey === 'cookie-policy';
  }
}
