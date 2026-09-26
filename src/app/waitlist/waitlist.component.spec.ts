import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { WaitlistComponent } from './waitlist.component';

describe('WaitlistComponent', () => {
  let fixture: ComponentFixture<WaitlistComponent>;
  let component: WaitlistComponent;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitlistComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(WaitlistComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('requires the job details for clients but not a stack', () => {
    const c = component.form.controls;
    expect(c.need.hasError('required')).toBeTrue();
    expect(c.budget.hasError('required')).toBeTrue();
    expect(c.stack.hasError('required')).toBeFalse();
  });

  it('switches required fields when a developer signs up', () => {
    component.setAudience('freelancer');
    const c = component.form.controls;
    expect(c.stack.hasError('required')).toBeTrue();
    expect(c.need.hasError('required')).toBeFalse();
    expect(c.budget.hasError('required')).toBeFalse();
  });

  it('does not post while the form is invalid', () => {
    component.submit();
    http.expectNone('/api/waitlist');
    expect(component.state()).toBe('idle');
  });

  it('posts only the client fields and shows the done state', () => {
    component.form.setValue({
      name: ' Thandi Mokoena ', email: 'thandi@example.co.za', company: 'Acme', need: 'Fix checkout',
      budget: component.budgets[1], start: component.starts[0], stack: 'ignored', github: '', consent: true, website: ''
    });
    component.submit();

    const req = http.expectOne('/api/waitlist');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.name).toBe('Thandi Mokoena');
    expect(req.request.body.audience).toBe('client');
    expect(req.request.body.stack).toBeUndefined();
    req.flush({ ok: true });

    expect(component.state()).toBe('done');
  });

  it('shows the error state when the sign-up fails', () => {
    component.setAudience('freelancer');
    component.form.patchValue({ name: 'Sipho', email: 'sipho@example.com', stack: 'Angular', consent: true });
    component.submit();

    http.expectOne('/api/waitlist').flush({ ok: false }, { status: 502, statusText: 'Bad Gateway' });
    expect(component.state()).toBe('error');
  });
});
