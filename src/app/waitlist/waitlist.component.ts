import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WaitlistAudience, WaitlistService } from './waitlist.service';

type SubmitState = 'idle' | 'sending' | 'done' | 'error';

@Component({
  selector: 'app-waitlist',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.scss']
})
export class WaitlistComponent {
  private fb = inject(NonNullableFormBuilder);
  private waitlistService = inject(WaitlistService);

  readonly audience = signal<WaitlistAudience>('client');
  readonly state = signal<SubmitState>('idle');

  // Keep in sync with BUDGETS / STARTS in functions/api/waitlist.ts — the server rejects anything else
  readonly budgets = ['Under R5,000', 'R5,000 – R20,000', 'R20,000 – R50,000', 'R50,000+'];
  readonly starts = ['As soon as possible', 'Within a month', 'In 1–3 months', 'Just exploring'];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
    company: ['', [Validators.maxLength(120)]],
    need: ['', [Validators.maxLength(1000)]],
    budget: [''],
    start: [''],
    stack: ['', [Validators.maxLength(200)]],
    github: ['', [Validators.maxLength(200), Validators.pattern(/^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-]+\/?$|^$/)]],
    consent: [false, [Validators.requiredTrue]],
    website: ['']
  });

  constructor() {
    this.applyAudienceValidators('client');
  }

  setAudience(audience: WaitlistAudience): void {
    this.audience.set(audience);
    this.applyAudienceValidators(audience);
    if (this.state() === 'error') this.state.set('idle');
  }

  submit(): void {
    if (this.form.invalid || this.state() === 'sending') {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const audience = this.audience();
    this.state.set('sending');
    this.waitlistService.join({
      audience,
      name: v.name.trim(),
      email: v.email.trim(),
      consent: v.consent,
      website: v.website,
      ...(audience === 'client'
        ? { company: v.company.trim(), need: v.need.trim(), budget: v.budget, start: v.start }
        : { stack: v.stack.trim(), github: v.github.trim() })
    }).subscribe({
      next: () => this.state.set('done'),
      error: () => this.state.set('error')
    });
  }

  private applyAudienceValidators(audience: WaitlistAudience): void {
    const { need, budget, start, stack } = this.form.controls;
    const clientRequired = audience === 'client';
    need.setValidators(clientRequired ? [Validators.required, Validators.maxLength(1000)] : [Validators.maxLength(1000)]);
    budget.setValidators(clientRequired ? [Validators.required] : []);
    start.setValidators(clientRequired ? [Validators.required] : []);
    stack.setValidators(clientRequired ? [Validators.maxLength(200)] : [Validators.required, Validators.maxLength(200)]);
    [need, budget, start, stack].forEach(control => control.updateValueAndValidity());
  }
}
