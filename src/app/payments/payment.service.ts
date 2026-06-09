import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  Payment,
  PaymentCheckoutResponse,
  CreatePaymentRequest,
  ReleasePaymentRequest,
  RefundPaymentRequest,
  PaymentStatusUpdate,
  Milestone
} from './models/payment.models';
import { buildApiEndpointUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = buildApiEndpointUrl('/payments');

  private paymentStatusSubject = new BehaviorSubject<PaymentStatusUpdate | null>(null);
  public paymentStatus$ = this.paymentStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPayment(paymentId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${paymentId}`);
  }

  getJobPayments(jobId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/job/${jobId}`);
  }

  createCheckout(request: CreatePaymentRequest): Observable<PaymentCheckoutResponse> {
    return this.http.post<PaymentCheckoutResponse>(`${this.apiUrl}/checkout`, request);
  }

  createEscrowPayment(request: CreatePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/escrow`, request);
  }

  releasePayment(request: ReleasePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/release`, request);
  }

  refundPayment(request: RefundPaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/refund`, request);
  }

  getMilestones(jobId: string): Observable<Milestone[]> {
    return this.http.get<Milestone[]>(`${this.apiUrl}/milestones/job/${jobId}`);
  }

  createMilestone(milestone: Partial<Milestone>): Observable<Milestone> {
    return this.http.post<Milestone>(`${this.apiUrl}/milestones`, milestone);
  }

  updatePaymentStatus(status: PaymentStatusUpdate): void {
    this.paymentStatusSubject.next(status);
  }
}
