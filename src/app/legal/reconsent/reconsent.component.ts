import { Component, OnInit, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { LegalService, ReconsentCheck } from '../legal.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-reconsent',
    imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule
],
    templateUrl: './reconsent.component.html',
    styleUrl: './reconsent.component.scss'
})
export class ReconsentComponent implements OnInit {
  private legalService = inject(LegalService);
  private authService = inject(AuthService);
  private router = inject(Router);

  reconsentCheck: ReconsentCheck | null = null;
  loading = true;
  accepting = false;
  accepted = false;
  termsAccepted = false;
  error = '';

  ngOnInit(): void {
    this.legalService.checkReconsent().subscribe({
      next: (check) => {
        this.reconsentCheck = check;
        this.loading = false;
        if (!check.reconsentRequired) {
          this.router.navigate(['/jobs']);
        }
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/jobs']);
      }
    });
  }

  accept(): void {
    if (!this.termsAccepted || !this.reconsentCheck) return;

    this.accepting = true;
    this.error = '';

    const consentItems = [
      {
        consentType: this.reconsentCheck.documentType!,
        version: this.reconsentCheck.currentVersion!,
        consented: true
      }
    ];

    this.legalService.recordConsents(consentItems).subscribe({
      next: () => {
        this.accepting = false;
        this.accepted = true;
        setTimeout(() => this.router.navigate(['/jobs']), 1500);
      },
      error: () => {
        this.accepting = false;
        this.error = 'Failed to record consent. Please try again.';
      }
    });
  }

  getDocumentLabel(docType: string): string {
    switch (docType) {
      case 'freelancer_tcs': return 'Freelancer Terms and Conditions';
      case 'business_tcs': return 'Business Terms and Conditions';
      case 'privacy_policy': return 'Privacy Policy';
      default: return docType;
    }
  }

  getDocumentRoute(docType: string): string {
    switch (docType) {
      case 'freelancer_tcs': return '/legal/freelancer-terms';
      case 'business_tcs': return '/legal/business-terms';
      case 'privacy_policy': return '/legal/privacy-policy';
      default: return '/legal/privacy-policy';
    }
  }
}
