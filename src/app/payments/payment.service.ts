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
import { MockPaymentService } from './mock-payment.service';
import { buildApiEndpointUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = buildApiEndpointUrl('/payments');
  private useMockData = false; // Toggle this to switch between mock and real API

  private paymentStatusSubject = new BehaviorSubject<PaymentStatusUpdate | null>(null);
  public paymentStatus$ = this.paymentStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private mockPaymentService: MockPaymentService
  ) {}

  /**
   * Get all payments for the current user
   */
  getPayments(): Observable<Payment[]> {
    if (this.useMockData) {
      return this.mockPaymentService.getPayments();
    }
    return this.http.get<Payment[]>(this.apiUrl);
  }

  /**
   * Get payment by ID
   */
  getPayment(paymentId: string): Observable<Payment> {
    if (this.useMockData) {
      return this.mockPaymentService.getPayment(paymentId);
    }
    return this.http.get<Payment>(`${this.apiUrl}/${paymentId}`);
  }

  /**
   * Get payments for a specific job
   */
  getJobPayments(jobId: string): Observable<Payment[]> {
    if (this.useMockData) {
      return this.mockPaymentService.getJobPayments(jobId);
    }
    return this.http.get<Payment[]>(`${this.apiUrl}/job/${jobId}`);
  }

  /**
   * Initiate a checkout session — backend returns a redirect URL
   */
  createCheckout(request: CreatePaymentRequest): Observable<PaymentCheckoutResponse> {
    return this.http.post<PaymentCheckoutResponse>(`${this.apiUrl}/initiate`, request);
  }

  /**
   * Create escrow payment for a job
   */
  createEscrowPayment(request: CreatePaymentRequest): Observable<Payment> {
    if (this.useMockData) {
      return this.mockPaymentService.createEscrowPayment(request);
    }
    return this.http.post<Payment>(`${this.apiUrl}/escrow`, request);
  }

  /**
   * Release payment from escrow to freelancer
   */
  releasePayment(request: ReleasePaymentRequest): Observable<Payment> {
    if (this.useMockData) {
      return this.mockPaymentService.releasePayment(request);
    }
    return this.http.post<Payment>(`${this.apiUrl}/release`, request);
  }

  /**
   * Refund a payment
   */
  refundPayment(request: RefundPaymentRequest): Observable<Payment> {
    if (this.useMockData) {
      return this.mockPaymentService.refundPayment(request);
    }
    return this.http.post<Payment>(`${this.apiUrl}/refund`, request);
  }


  /**
   * Get milestones for a job
   */
  getMilestones(jobId: string): Observable<Milestone[]> {
    if (this.useMockData) {
      return this.mockPaymentService.getMilestones(jobId);
    }
    return this.http.get<Milestone[]>(`${this.apiUrl}/milestones/job/${jobId}`);
  }

  /**
   * Create a milestone
   */
  createMilestone(milestone: Partial<Milestone>): Observable<Milestone> {
    if (this.useMockData) {
      return this.mockPaymentService.createMilestone(milestone);
    }
    return this.http.post<Milestone>(`${this.apiUrl}/milestones`, milestone);
  }

  /**
   * Update payment status (for real-time updates)
   */
  updatePaymentStatus(status: PaymentStatusUpdate): void {
    this.paymentStatusSubject.next(status);
  }

}
