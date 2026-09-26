import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type WaitlistAudience = 'client' | 'freelancer';

export interface WaitlistSignup {
  audience: WaitlistAudience;
  name: string;
  email: string;
  consent: boolean;
  // Client fields
  company?: string;
  need?: string;
  budget?: string;
  start?: string;
  // Freelancer fields
  stack?: string;
  github?: string;
  // Honeypot — real users never see or fill this
  website?: string;
}

/**
 * Posts waitlist sign-ups to the same-origin Pages Function (`functions/api/waitlist.ts`),
 * which records them as Zoho CRM leads. Deliberately not the Spring API.
 */
@Injectable({ providedIn: 'root' })
export class WaitlistService {
  private http = inject(HttpClient);

  join(signup: WaitlistSignup): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>('/api/waitlist', signup);
  }
}
