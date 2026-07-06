import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ConsentItem {
  consentType: string;
  version: string;
  consented: boolean;
}

export interface ConsentRecord {
  consents: ConsentItem[];
}

export interface ReconsentCheck {
  reconsentRequired: boolean;
  documentType?: string;
  currentVersion?: string;
  userConsentedVersion?: string;
}

export interface PopiaRequest {
  requestType: string;
  details?: string;
}

export interface PopiaRequestResponse {
  id: number;
  requestType: string;
  status: string;
  submittedAt: string;
  userEmail?: string;
  details?: string;
  responseNotes?: string;
  completedAt?: string;
  overdue?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LegalService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  recordConsents(consents: ConsentItem[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/consent/record`, { consents });
  }

  checkReconsent(): Observable<ReconsentCheck> {
    return this.http.get<ReconsentCheck>(`${this.apiUrl}/api/consent/check-reconsent`);
  }

  getCurrentVersion(documentType: string): Observable<{ version: string; documentType: string }> {
    return this.http.get<{ version: string; documentType: string }>(
      `${this.apiUrl}/api/consent/current-version/${documentType}`
    );
  }

  submitPopiaRequest(request: PopiaRequest): Observable<PopiaRequestResponse> {
    return this.http.post<PopiaRequestResponse>(`${this.apiUrl}/api/popia/request`, request);
  }

  getMyPopiaRequests(): Observable<PopiaRequestResponse[]> {
    return this.http.get<PopiaRequestResponse[]>(`${this.apiUrl}/api/popia/my-requests`);
  }

  getAllPopiaRequests(): Observable<PopiaRequestResponse[]> {
    return this.http.get<PopiaRequestResponse[]>(`${this.apiUrl}/api/popia/admin/all`);
  }

  updatePopiaStatus(id: number, status: string, responseNotes?: string): Observable<PopiaRequestResponse> {
    return this.http.put<PopiaRequestResponse>(`${this.apiUrl}/api/popia/admin/${id}/status`, { status, responseNotes });
  }

  getMarketingConsent(): Observable<{ consented: boolean }> {
    return this.http.get<{ consented: boolean }>(`${this.apiUrl}/api/marketing/consent`);
  }

  updateMarketingConsent(consented: boolean): Observable<{ consented: boolean }> {
    return this.http.put<{ consented: boolean }>(`${this.apiUrl}/api/marketing/consent`, { consented });
  }

  unsubscribeByToken(token: string): Observable<{ message: string; email: string }> {
    return this.http.post<{ message: string; email: string }>(
      `${this.apiUrl}/api/marketing/unsubscribe?token=${token}`, {}
    );
  }

  canDeleteAccount(): Observable<{ canDelete: boolean; blockingReason: string }> {
    return this.http.get<{ canDelete: boolean; blockingReason: string }>(
      `${this.apiUrl}/api/account/can-delete`
    );
  }

  deleteAccount(confirmation: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/api/account/delete`, {
      body: { confirmation }
    });
  }

  /**
   * POPIA right of access / data portability — downloads all personal data the backend
   * holds about the current user as a JSON blob.
   */
  exportMyData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/account/export`, { responseType: 'blob' });
  }
}
