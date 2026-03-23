import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

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

  loadSubscription(): Observable<Subscription | null> {
    return this.http.get<Subscription>('/api/subscription/current').pipe(
      tap(sub => this.subscriptionSubject.next(sub)),
      catchError(() => {
        this.subscriptionSubject.next(null);
        return of(null);
      })
    );
  }

  clearSubscription(): void {
    this.subscriptionSubject.next(null);
  }
}
