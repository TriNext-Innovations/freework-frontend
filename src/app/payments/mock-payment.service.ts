import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Payment,
  CreatePaymentRequest,
  ReleasePaymentRequest,
  RefundPaymentRequest,
  PaymentStatus,
  PaymentMethod,
  PaymentType,
  Milestone
} from './models/payment.models';

@Injectable({
  providedIn: 'root'
})
export class MockPaymentService {
  private mockPayments: Payment[] = [
    {
      id: 'pay1',
      jobId: '1',
      jobTitle: 'Full Stack Web Developer for E-commerce Platform',
      customerId: 'customer1',
      customerName: 'John Doe',
      freelancerId: 'freelancer1',
      freelancerName: 'Emily Chen',
      amount: 5000.00,
      currency: 'ZAR',
      status: PaymentStatus.ESCROWED,
      paymentMethod: PaymentMethod.CARD,
      paymentType: PaymentType.JOB_ESCROW,
      transactionId: 'txn_1234567890',
      escrowedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      description: 'Full payment for e-commerce platform development',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
    },
    {
      id: 'pay2',
      jobId: '2',
      jobTitle: 'Mobile App Developer - iOS & Android',
      customerId: 'customer1',
      customerName: 'John Doe',
      freelancerId: 'freelancer2',
      freelancerName: 'Sarah Miller',
      amount: 3000.00,
      currency: 'ZAR',
      status: PaymentStatus.RELEASED,
      paymentMethod: PaymentMethod.CARD,
      paymentType: PaymentType.MILESTONE,
      transactionId: 'txn_0987654321',
      escrowedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      releasedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      description: 'Milestone 1: UI Design Completion',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
    },
    {
      id: 'pay3',
      jobId: '3',
      jobTitle: 'UI/UX Designer for SaaS Dashboard',
      customerId: 'customer2',
      customerName: 'Jane Smith',
      freelancerId: 'freelancer3',
      freelancerName: 'Mike Johnson',
      amount: 2500.00,
      currency: 'ZAR',
      status: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.INSTANT_EFT,
      paymentType: PaymentType.JOB_ESCROW,
      description: 'Full payment for SaaS dashboard design',
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30)
    }
  ];

  private mockMilestones: Milestone[] = [
    {
      id: 'mile1',
      jobId: '1',
      title: 'Initial Setup & Planning',
      description: 'Project setup, requirement analysis, and architecture design',
      amount: 1000.00,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      status: 'COMPLETED',
      paymentId: 'pay1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    },
    {
      id: 'mile2',
      jobId: '1',
      title: 'Frontend Development',
      description: 'Complete frontend implementation',
      amount: 2000.00,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      status: 'IN_PROGRESS',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    },
    {
      id: 'mile3',
      jobId: '1',
      title: 'Backend API Development',
      description: 'Build REST APIs and database integration',
      amount: 1500.00,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    }
  ];

  getPayments(): Observable<Payment[]> {
    return of(this.mockPayments).pipe(delay(500));
  }

  getPayment(paymentId: string): Observable<Payment> {
    const payment = this.mockPayments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');
    return of(payment).pipe(delay(300));
  }

  getJobPayments(jobId: string): Observable<Payment[]> {
    return of(this.mockPayments.filter(p => p.jobId === jobId)).pipe(delay(400));
  }

  createEscrowPayment(request: CreatePaymentRequest): Observable<Payment> {
    const newPayment: Payment = {
      id: 'pay_' + Math.random().toString(36).substr(2, 9),
      jobId: request.jobId,
      jobTitle: 'New Job',
      customerId: 'currentUser',
      customerName: 'Current User',
      freelancerId: 'freelancer_id',
      freelancerName: 'Freelancer Name',
      amount: request.amount,
      currency: request.currency,
      status: PaymentStatus.ESCROWED,
      paymentMethod: request.paymentMethod,
      paymentType: request.paymentType,
      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9),
      escrowedAt: new Date(),
      description: request.description,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.mockPayments.unshift(newPayment);
    return of(newPayment).pipe(delay(800));
  }

  releasePayment(request: ReleasePaymentRequest): Observable<Payment> {
    const payment = this.mockPayments.find(p => p.id === request.paymentId);
    if (!payment) throw new Error('Payment not found');
    payment.status = PaymentStatus.RELEASED;
    payment.releasedAt = new Date();
    payment.updatedAt = new Date();
    return of(payment).pipe(delay(600));
  }

  refundPayment(request: RefundPaymentRequest): Observable<Payment> {
    const payment = this.mockPayments.find(p => p.id === request.paymentId);
    if (!payment) throw new Error('Payment not found');
    payment.status = PaymentStatus.REFUNDED;
    payment.updatedAt = new Date();
    return of(payment).pipe(delay(700));
  }

  getMilestones(jobId: string): Observable<Milestone[]> {
    return of(this.mockMilestones.filter(m => m.jobId === jobId)).pipe(delay(400));
  }

  createMilestone(milestone: Partial<Milestone>): Observable<Milestone> {
    const newMilestone: Milestone = {
      id: 'mile_' + Math.random().toString(36).substr(2, 9),
      jobId: milestone.jobId!,
      title: milestone.title!,
      description: milestone.description!,
      amount: milestone.amount!,
      dueDate: milestone.dueDate!,
      status: 'PENDING',
      createdAt: new Date()
    };
    this.mockMilestones.push(newMilestone);
    return of(newMilestone).pipe(delay(500));
  }
}
