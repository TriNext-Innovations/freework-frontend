import { Component, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CookieConsentService } from '../../legal/cookie-consent.service';

@Component({
    selector: 'app-footer',
    imports: [RouterLink, MatButtonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  private cookieConsentService = inject(CookieConsentService);

  openCookieSettings(): void {
    this.cookieConsentService.openBanner();
  }
}
