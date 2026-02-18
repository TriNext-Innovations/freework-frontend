---
liquid: false
---

# Payment Integration Guide

## Overview

The Freework payment system provides secure escrow-based payments using Stripe. Clients deposit funds into escrow when hiring a freelancer, and funds are released upon job completion.

## Features

- **Escrow System** - Secure fund holding until work completion
- **Stripe Integration** - Industry-standard payment processing
- **Payment Tracking** - Complete payment history
- **Refund Support** - Handle disputes and refunds
- **Multiple Payment Methods** - Cards, bank transfers, digital wallets
- **Payment Status** - Real-time payment status updates
- **Invoice Generation** - Automatic invoice creation

## Payment Flow

```
1. Client hires freelancer
2. Client deposits payment to escrow
3. Freelancer completes work
4. Client reviews and approves
5. Payment released to freelancer
6. Review/rating exchanged
```

## Data Models

```typescript
interface Payment {
  id: string;
  jobId: string;
  clientId: string;
  freelancerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
  releasedAt?: Date;
}

type PaymentStatus = 
  | 'pending'      // Payment initiated
  | 'processing'   // Stripe processing
  | 'escrowed'     // Funds in escrow
  | 'released'     // Paid to freelancer
  | 'refunded'     // Refunded to client
  | 'failed';      // Payment failed

interface CreatePaymentRequest {
  jobId: string;
  amount: number;
  paymentMethodId: string; // Stripe payment method
}

interface ReleasePaymentRequest {
  paymentId: string;
  rating?: number;
  review?: string;
}
```

## Usage

### Initialize Stripe

```typescript
import { PaymentService } from '@app/payments/payment.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';

export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  
  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_your_publishable_key');
  }
}
```

### Creating Payment (Escrow Deposit)

```typescript
import { PaymentService } from '@app/payments/payment.service';

constructor(private paymentService: PaymentService) {}

async initiatePayment(jobId: string, amount: number) {
  try {
    // 1. Create payment intent
    const paymentIntent = await this.paymentService
      .createPaymentIntent(jobId, amount)
      .toPromise();

    // 2. Confirm with Stripe
    const result = await this.stripe!.confirmCardPayment(
      paymentIntent.clientSecret,
      {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: this.billingName
          }
        }
      }
    );

    if (result.error) {
      console.error('Payment failed:', result.error);
      return;
    }

    // 3. Confirm payment on backend
    this.paymentService.confirmPayment(paymentIntent.id).subscribe({
      next: (payment) => {
        console.log('Payment escrowed:', payment);
        this.router.navigate(['/payments', payment.id]);
      },
      error: (error) => console.error('Error:', error)
    });
  } catch (error) {
    console.error('Payment error:', error);
  }
}
```

### Viewing Payments

```typescript
// Get all payments for current user
this.paymentService.getPayments().subscribe(payments => {
  this.payments = payments;
});

// Get specific payment
this.paymentService.getPayment(paymentId).subscribe(payment => {
  this.payment = payment;
});

// Get payments by job
this.paymentService.getPaymentsByJob(jobId).subscribe(payments => {
  this.jobPayments = payments;
});

// Get payment status
this.paymentService.getPaymentStatus(paymentId).subscribe(status => {
  this.paymentStatus = status;
});
```

### Releasing Payment (Client Approves Work)

```typescript
releasePayment(paymentId: string) {
  this.paymentService.releasePayment({
    paymentId,
    rating: 5,
    review: 'Excellent work!'
  }).subscribe({
    next: (payment) => {
      console.log('Payment released:', payment);
      // Freelancer receives funds
      // Job marked as completed
    },
    error: (error) => console.error('Error:', error)
  });
}
```

### Requesting Refund

```typescript
requestRefund(paymentId: string, reason: string) {
  this.paymentService.requestRefund(paymentId, reason).subscribe({
    next: (payment) => {
      console.log('Refund requested:', payment);
    },
    error: (error) => console.error('Error:', error)
  });
}
```

### Processing Refund (Admin/System)

```typescript
processRefund(paymentId: string) {
  this.paymentService.processRefund(paymentId).subscribe({
    next: (payment) => {
      console.log('Refund processed:', payment);
      // Funds returned to client
    },
    error: (error) => console.error('Error:', error)
  });
}
```

## Components

### StripePaymentComponent
- Stripe Elements integration
- Card input form
- Payment processing
- Error handling

### PaymentEscrowComponent
- Escrow status display
- Release payment button (clients)
- Dispute handling
- Payment timeline

### PaymentListComponent
- All user payments
- Filter by status
- Download invoices
- Payment details

### PaymentStatusComponent
- Real-time payment status
- Progress indicators
- Status messages

## Stripe Setup

### 1. Install Stripe

```bash
npm install @stripe/stripe-js
```

### 2. Configure Environment

```typescript
// environment.ts
export const environment = {
  stripePublicKey: 'pk_test_...',
  apiUrl: 'http://localhost:3000/api'
};
```

### 3. Initialize in Component

```typescript
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '@env/environment';

export class StripePaymentComponent implements OnInit, AfterViewInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: any;

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublicKey);
  }

  ngAfterViewInit() {
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
          }
        }
      });
      this.cardElement.mount('#card-element');
    }
  }
}
```

## API Endpoints

```
POST   /api/payments/intent           - Create payment intent
POST   /api/payments/confirm          - Confirm payment
GET    /api/payments                  - Get user's payments
GET    /api/payments/:id              - Get specific payment
GET    /api/payments/job/:jobId       - Get payments for job
PUT    /api/payments/:id/release      - Release escrowed funds
POST   /api/payments/:id/refund       - Request refund
PUT    /api/payments/:id/process-refund - Process refund (admin)
GET    /api/payments/:id/status       - Get payment status
```

## Template Examples

### Payment Form

```html
<div class="payment-form">
  <h2>Secure Payment</h2>
  
  <div class="payment-details">
    <p><strong>Job:</strong> {{ job.title }}</p>
    <p><strong>Freelancer:</strong> {{ freelancer.name }}</p>
    <p><strong>Amount:</strong> ${{ amount }}</p>
  </div>

  <form [formGroup]="paymentForm" (ngSubmit)="processPayment()">
    <div class="form-group">
      <label>Cardholder Name</label>
      <input formControlName="name" placeholder="John Doe">
    </div>

    <div class="form-group">
      <label>Card Information</label>
      <div id="card-element"></div>
      <div id="card-errors" role="alert"></div>
    </div>

    <div class="escrow-notice">
      <mat-icon>security</mat-icon>
      <p>
        Funds will be held in escrow until you approve the completed work.
        Payment is processed securely through Stripe.
      </p>
    </div>

    <button 
      type="submit" 
      [disabled]="!paymentForm.valid || processing">
      {{ processing ? 'Processing...' : 'Pay $' + amount }}
    </button>
  </form>
</div>
```

### Escrow Status

```html
<div class="payment-escrow">
  <h3>Payment Status</h3>

  <div class="status-timeline">
    <div class="status-step" [class.completed]="payment.status !== 'pending'">
      <mat-icon>payment</mat-icon>
      <span>Payment Initiated</span>
    </div>

    <div class="status-step" [class.completed]="isEscrowed()">
      <mat-icon>lock</mat-icon>
      <span>Funds in Escrow</span>
    </div>

    <div class="status-step" [class.completed]="payment.status === 'released'">
      <mat-icon>check_circle</mat-icon>
      <span>Payment Released</span>
    </div>
  </div>

  @if (payment.status === 'escrowed' && isClient) {
    <div class="actions">
      <p>Review the work and release payment when satisfied.</p>
      <button (click)="openReleaseDialog()">
        Release Payment
      </button>
      <button (click)="openDisputeDialog()" class="secondary">
        Report Issue
      </button>
    </div>
  }

  @if (payment.status === 'escrowed' && isFreelancer) {
    <div class="waiting">
      <mat-icon>hourglass_empty</mat-icon>
      <p>Waiting for client approval...</p>
    </div>
  }
</div>
```

### Payment List

```html
<div class="payment-list">
  <h2>Payment History</h2>

  <div class="filters">
    <button (click)="filterStatus('all')">All</button>
    <button (click)="filterStatus('escrowed')">In Escrow</button>
    <button (click)="filterStatus('released')">Completed</button>
    <button (click)="filterStatus('refunded')">Refunded</button>
  </div>

  @for (payment of filteredPayments; track payment.id) {
    <div class="payment-card">
      <div class="payment-info">
        <h4>{{ getJobTitle(payment.jobId) }}</h4>
        <p>{{ getOtherParty(payment) }}</p>
      </div>

      <div class="payment-amount">
        <span class="amount">${{ payment.amount }}</span>
        <span class="status" [class]="payment.status">
          {{ payment.status }}
        </span>
      </div>

      <div class="payment-date">
        {{ payment.createdAt | date:'medium' }}
      </div>

      <div class="actions">
        <button routerLink="/payments/{{ payment.id }}">View</button>
        @if (canDownloadInvoice(payment)) {
          <button (click)="downloadInvoice(payment.id)">
            <mat-icon>download</mat-icon>
            Invoice
          </button>
        }
      </div>
    </div>
  }
</div>
```

## Security Best Practices

1. **Never Store Card Details** - Use Stripe Elements
2. **PCI Compliance** - Stripe handles compliance
3. **HTTPS Only** - All payment pages must use HTTPS
4. **Verify Webhook Signatures** - Validate Stripe webhooks
5. **Strong Authentication** - Use 3D Secure when required
6. **Escrow Protection** - Hold funds until work approved
7. **Audit Logging** - Log all payment actions

## Webhook Handling

### Backend Webhooks (Required)

```typescript
// Handle Stripe webhooks
POST /api/webhooks/stripe

// Events to handle:
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded
- charge.dispute.created
```

## Testing

### Test Cards (Stripe Test Mode)

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184
Insufficient Funds: 4000 0000 0000 9995
```

### Test Flow

1. Use test API keys
2. Create payment with test card
3. Verify escrow status
4. Release payment
5. Check webhook events

## Fee Structure

```typescript
interface PaymentFees {
  platformFee: number;      // 10% of job amount
  stripeFee: number;        // 2.9% + $0.30
  freelancerReceives: number; // Amount after fees
}

// Example calculation
const jobAmount = 1000;
const platformFee = jobAmount * 0.10;      // $100
const stripeFee = (jobAmount * 0.029) + 0.30; // $29.30
const freelancerReceives = jobAmount - platformFee - stripeFee; // $870.70
```

## Error Handling

Common payment errors:

- **Insufficient Funds** - Card declined
- **Card Expired** - Update card information
- **Authentication Required** - Complete 3D Secure
- **Processing Error** - Retry or use different card
- **Network Error** - Check connection and retry

## Mock Payment Service

For development without Stripe:

```typescript
// app.config.ts
providers: [
  {
    provide: PaymentService,
    useClass: MockPaymentService
  }
]
```

## Related Documentation

- [Job Management Guide](JOB_MANAGEMENT_GUIDE.md) - Job completion triggers payment
- [Reviews Guide](REVIEWS_SYSTEM_GUIDE.md) - Reviews after payment release
