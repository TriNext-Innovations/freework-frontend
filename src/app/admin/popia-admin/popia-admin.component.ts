import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { LegalService, PopiaRequestResponse } from '../../legal/legal.service';

@Component({
    selector: 'app-popia-admin',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatDialogModule
    ],
    templateUrl: './popia-admin.component.html',
    styleUrl: './popia-admin.component.scss'
})
export class PopiaAdminComponent implements OnInit {
  requests: PopiaRequestResponse[] = [];
  loading = true;
  selectedRequest: PopiaRequestResponse | null = null;
  updateForm!: FormGroup;
  updating = false;
  updateError = '';
  updateSuccess = '';

  displayedColumns = ['id', 'userEmail', 'requestType', 'status', 'submittedAt', 'overdue', 'actions'];

  statusOptions = [
    { value: 'received', label: 'Received' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' }
  ];

  constructor(
    private legalService: LegalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      status: [''],
      responseNotes: ['']
    });

    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.legalService.getAllPopiaRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectRequest(request: PopiaRequestResponse): void {
    this.selectedRequest = request;
    this.updateSuccess = '';
    this.updateError = '';
    this.updateForm.patchValue({
      status: request.status,
      responseNotes: request.responseNotes || ''
    });
  }

  updateStatus(): void {
    if (!this.selectedRequest) return;
    this.updating = true;
    this.updateError = '';
    this.updateSuccess = '';

    this.legalService.updatePopiaStatus(
      this.selectedRequest.id,
      this.updateForm.value.status,
      this.updateForm.value.responseNotes
    ).subscribe({
      next: (updated) => {
        this.updating = false;
        this.updateSuccess = `Request #${updated.id} updated to "${updated.status}"`;
        const idx = this.requests.findIndex(r => r.id === updated.id);
        if (idx !== -1) this.requests[idx] = updated;
        this.selectedRequest = updated;
      },
      error: () => {
        this.updating = false;
        this.updateError = 'Failed to update status.';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'received': return 'status-received';
      case 'in_progress': return 'status-progress';
      case 'completed': return 'status-completed';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  get overdueCount(): number {
    return this.requests.filter(r => r.overdue).length;
  }

  get pendingCount(): number {
    return this.requests.filter(r => r.status !== 'completed' && r.status !== 'rejected').length;
  }
}
