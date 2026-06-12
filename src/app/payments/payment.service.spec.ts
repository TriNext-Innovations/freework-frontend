import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PaymentService } from './payment.service';
import { buildApiEndpointUrl } from '../api.config';
import { PaymentMethod, PaymentType, PaymentStatus } from './models/payment.models';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  const API_URL = buildApiEndpointUrl('/payments');

  const mockPayment = {
    id: 'pay-1',
    jobId: 'job-1',
    amount: 5000,
    currency: 'ZAR',
    status: PaymentStatus.PENDING,
    createdAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPayments()', () => {
    it('GETs /payments and returns list', () => {
      let result: unknown[] = [];
      service.getPayments().subscribe(r => { result = r; });

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe('GET');
      req.flush([mockPayment]);

      expect(result.length).toBe(1);
    });
  });

  describe('getPayment()', () => {
    it('GETs /payments/:id', () => {
      let result: unknown;
      service.getPayment('pay-1').subscribe(r => { result = r; });

      const req = httpMock.expectOne(`${API_URL}/pay-1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPayment);

      expect(result).toEqual(mockPayment);
    });
  });

  describe('getJobPayments()', () => {
    it('GETs /payments/job/:jobId', () => {
      service.getJobPayments('job-1').subscribe();

      const req = httpMock.expectOne(`${API_URL}/job/job-1`);
      expect(req.request.method).toBe('GET');
      req.flush([mockPayment]);
    });
  });

  describe('createCheckout()', () => {
    it('POSTs to /payments/checkout and returns checkoutUrl', () => {
      const checkoutResponse = { checkoutUrl: 'https://www.payfast.co.za/eng/process?...' };
      let result: unknown;
      service.createCheckout({
        jobId: 'job-1',
        amount: 5000,
        currency: 'ZAR',
        paymentMethod: PaymentMethod.CARD,
        paymentType: PaymentType.JOB_ESCROW,
        description: 'Escrow for job'
      }).subscribe(r => { result = r; });

      const req = httpMock.expectOne(`${API_URL}/checkout`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.jobId).toBe('job-1');
      req.flush(checkoutResponse);

      expect(result).toEqual(checkoutResponse);
    });
  });

  describe('releasePayment()', () => {
    it('POSTs to /payments/release', () => {
      service.releasePayment({ paymentId: 'pay-1', amount: 1000 }).subscribe();

      const req = httpMock.expectOne(`${API_URL}/release`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ paymentId: 'pay-1', amount: 1000 });
      req.flush(mockPayment);
    });
  });

  describe('refundPayment()', () => {
    it('POSTs to /payments/refund', () => {
      service.refundPayment({ paymentId: 'pay-1', amount: 1000, reason: 'Customer request' }).subscribe();

      const req = httpMock.expectOne(`${API_URL}/refund`);
      expect(req.request.method).toBe('POST');
      req.flush(mockPayment);
    });
  });

  describe('updatePaymentStatus()', () => {
    it('emits updated status via paymentStatus$', () => {
      const update = { paymentId: 'pay-1', status: PaymentStatus.RELEASED, updatedAt: new Date() };
      let emitted: unknown;
      service.paymentStatus$.subscribe(s => { emitted = s; });

      service.updatePaymentStatus(update);

      expect(emitted).toEqual(update);
    });
  });
});
