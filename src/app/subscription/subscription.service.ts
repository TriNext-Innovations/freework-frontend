import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { buildApiEndpointUrl } from '../api.config';
import { SubscriptionInfo, CheckoutResponse, PaymentProvider } from './subscription.models';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly API_URL = buildApiEndpointUrl('/subscription');

  private subscriptionSubject = new BehaviorSubject<SubscriptionInfo | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentSubscription(): SubscriptionInfo | null {
    return this.subscriptionSubject.value;
  }

  get isProMember(): boolean {
    const sub = this.subscriptionSubject.value;
    return !!sub && sub.proMember && sub.status === 'ACTIVE';
  }

  get activeJobsCount(): number {
    return this.subscriptionSubject.value?.activeJobsCount ?? 0;
  }

  get atJobLimit(): boolean {
    const sub = this.subscriptionSubject.value;
    if (!sub || this.isProMember) return false;
    return (sub.activeJobsCount ?? 0) >= 1;
  }

  get atApplicationLimit(): boolean {
    const sub = this.subscriptionSubject.value;
    if (!sub || this.isProMember) return false;
    return (sub.applicationsThisMonth ?? 0) >= 5;
  }

  loadSubscription(): Observable<SubscriptionInfo | null> {
    return this.http.get<SubscriptionInfo>(`${this.API_URL}/current`).pipe(
      tap(sub => this.subscriptionSubject.next(sub)),
      catchError(() => {
        this.subscriptionSubject.next(null);
        return of(null);
      })
    );
  }

  createCheckout(provider: PaymentProvider): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.API_URL}/checkout`, { provider });
  }

  cancelSubscription(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/cancel`, {});
  }

  clearSubscription(): void {
    this.subscriptionSubject.next(null);
  }
}
