export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  ESCROWED = 'ESCROWED',
  RELEASED = 'RELEASED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CARD = 'CARD',
  EFT = 'EFT',
  INSTANT_EFT = 'INSTANT_EFT'
}

export enum PaymentType {
  JOB_ESCROW = 'JOB_ESCROW',
  MILESTONE = 'MILESTONE',
  RELEASE = 'RELEASE',
  REFUND = 'REFUND'
}

export interface Payment {
  id: string;
  jobId: string;
  jobTitle: string;
  customerId: string;
  customerName: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  transactionId?: string;
  escrowedAt?: Date;
  releasedAt?: Date;
  description?: string;
  metadata?: { [key: string]: any };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentCheckoutResponse {
  checkoutUrl: string;
  paymentId: string;
  approvalUrl: string;
  paymentIntentId: string;
  status: string;
}

export interface CreatePaymentRequest {
  jobId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  description?: string;
}

export interface ReleasePaymentRequest {
  paymentId: string;
  amount: number;
  reason?: string;
}

export interface RefundPaymentRequest {
  paymentId: string;
  amount: number;
  reason: string;
}

export interface PaymentStatusUpdate {
  paymentId: string;
  status: PaymentStatus;
  transactionId?: string;
  message?: string;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  jobId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID';
  paymentId?: string;
  createdAt: Date;
}

