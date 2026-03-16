import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { buildApiEndpointUrl } from '../api.config';
import {
  SubscriptionInfo,
  CheckoutResponse,
  PaymentProvider,
  FREE_TIER_APPLICATION_LIMIT,
  FREE_TIER_JOB_LIMIT
} from './subscription.models';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly API_URL = buildApiEndpointUrl('/subscriptions');

  private subscriptionSubject = new BehaviorSubject<SubscriptionInfo | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  constructor(private http: HttpClient) {}

  get subscriptionValue(): SubscriptionInfo | null {
    return this.subscriptionSubject.value;
  }

  get isProMember(): boolean {
    return this.subscriptionSubject.value?.proMember === true;
  }

  get applicationsThisMonth(): number {
    return this.subscriptionSubject.value?.applicationsThisMonth ?? 0;
  }

  get activeJobsCount(): number {
    return this.subscriptionSubject.value?.activeJobsCount ?? 0;
  }

  get atApplicationLimit(): boolean {
    if (this.isProMember) return false;
    return this.applicationsThisMonth >= FREE_TIER_APPLICATION_LIMIT;
  }

  get atJobLimit(): boolean {
    if (this.isProMember) return false;
    return this.activeJobsCount >= FREE_TIER_JOB_LIMIT;
  }

  loadSubscription(): Observable<SubscriptionInfo> {
    return this.http.get<SubscriptionInfo>(`${this.API_URL}/me`).pipe(
      tap(info => this.subscriptionSubject.next(info)),
      catchError(error => {
        // On error (e.g. 404 for no sub), default to free
        const defaultInfo: SubscriptionInfo = { plan: 'FREE', status: 'INACTIVE', proMember: false };
        this.subscriptionSubject.next(defaultInfo);
        return of(defaultInfo);
      })
    );
  }

  startCheckout(provider: PaymentProvider): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.API_URL}/checkout`, { provider });
  }

  cancelSubscription(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/cancel`, {}).pipe(
      tap(() => {
        const current = this.subscriptionSubject.value;
        if (current) {
          this.subscriptionSubject.next({ ...current, plan: 'FREE', proMember: false, status: 'CANCELLED' });
        }
      })
    );
  }

  clearSubscription(): void {
    this.subscriptionSubject.next(null);
  }

  get applicationLimitDisplay(): string {
    const used = this.applicationsThisMonth;
    return `${used} / ${FREE_TIER_APPLICATION_LIMIT}`;
  }

  get jobLimitDisplay(): string {
    const used = this.activeJobsCount;
    return `${used} / ${FREE_TIER_JOB_LIMIT}`;
  }

  get applicationLimitPercent(): number {
    return Math.min(100, (this.applicationsThisMonth / FREE_TIER_APPLICATION_LIMIT) * 100);
  }

  get jobLimitPercent(): number {
    return Math.min(100, (this.activeJobsCount / FREE_TIER_JOB_LIMIT) * 100);
  }
}
