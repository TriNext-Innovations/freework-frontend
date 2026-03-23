import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { LEGAL_CONTENT, LegalDocument, LegalSection } from '../legal-content';
import { CookieConsentService } from '../cookie-consent.service';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [
    CommonModule,
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
  document: LegalDocument | null = null;
  documentKey = '';
  language: 'en' | 'af' = 'en';
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private cookieConsentService: CookieConsentService
  ) {}

  ngOnInit(): void {
    this.documentKey = this.route.snapshot.data['documentKey'] || '';
    this.loadDocument();
  }

  loadDocument(): void {
    const docs = LEGAL_CONTENT[this.language];
    this.document = docs[this.documentKey] || null;
  }

  onLanguageChange(): void {
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
