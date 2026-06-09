import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { buildApiEndpointUrl } from '../api.config';

export interface Subscription {
  plan: 'FREE' | 'GROWTH' | 'SCALE';
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  currentPeriodEnd?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private subscriptionSubject = new BehaviorSubject<Subscription | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentSubscription(): Subscription | null {
    return this.subscriptionSubject.value;
  }

  get isProMember(): boolean {
    const sub = this.subscriptionSubject.value;
    return !!sub && sub.status === 'ACTIVE' && (sub.plan === 'GROWTH' || sub.plan === 'SCALE');
  }

  activeJobsCount = 0;

  get atJobLimit(): boolean {
    return !this.isProMember && this.activeJobsCount >= 1;
  }

  readonly atApplicationLimit = false;

  loadSubscription(): Observable<Subscription | null> {
    return this.http.get<Subscription>(buildApiEndpointUrl('/subscription/current')).pipe(
      tap(sub => this.subscriptionSubject.next(sub)),
      catchError(() => {
        this.subscriptionSubject.next(null);
        return of(null);
      })
    );
  }

  checkout(provider = 'PAYFAST'): Observable<{ checkoutUrl: string }> {
    return this.http.post<{ checkoutUrl: string }>(
      buildApiEndpointUrl(`/subscriptions/checkout?provider=${provider}`), {}
    );
  }

  clearSubscription(): void {
    this.subscriptionSubject.next(null);
  }
}
