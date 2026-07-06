import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { LegalService, PopiaRequestResponse } from '../legal.service';

@Component({
    selector: 'app-popia-request',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDividerModule
    ],
    templateUrl: './popia-request.component.html',
    styleUrl: './popia-request.component.scss'
})
export class PopiaRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private legalService = inject(LegalService);

  form!: FormGroup;
  loading = false;
  submitted = false;
  submittedRequest: PopiaRequestResponse | null = null;
  errorMessage = '';
  myRequests: PopiaRequestResponse[] = [];
  requestsLoading = false;

  requestTypes = [
    { value: 'access', label: 'Access my personal information' },
    { value: 'correction', label: 'Correct inaccurate information' },
    { value: 'deletion', label: 'Delete my personal information' },
    { value: 'portability', label: 'Request data portability (export)' },
    { value: 'objection', label: 'Object to processing' },
    { value: 'complaint', label: 'Lodge a complaint' },
    { value: 'other', label: 'Other' }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      requestType: ['', Validators.required],
      details: ['', [Validators.maxLength(2000)]]
    });

    this.loadMyRequests();
  }

  loadMyRequests(): void {
    this.requestsLoading = true;
    this.legalService.getMyPopiaRequests().subscribe({
      next: (requests) => {
        this.myRequests = requests;
        this.requestsLoading = false;
      },
      error: () => {
        this.requestsLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.legalService.submitPopiaRequest(this.form.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.submitted = true;
        this.submittedRequest = response;
        this.myRequests.unshift(response);
        this.form.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to submit request. Please try again.';
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'received': return 'status-received';
      case 'in_progress': return 'status-progress';
      case 'completed': return 'status-completed';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'received': return 'Received';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  }
}
