import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { ReviewType } from '../models';

export interface ReviewDialogData {
  jobId: string;
  revieweeId: string;
  revieweeName: string;
  reviewType: ReviewType;
  jobTitle: string;
}

@Component({
    selector: 'app-review-dialog',
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        ReviewFormComponent
    ],
    template: `
    <div class="review-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>rate_review</mat-icon>
          Write a Review
        </h2>
        <button mat-icon-button mat-dialog-close class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <div class="job-info">
          <mat-icon>work</mat-icon>
          <div class="job-details">
            <span class="label">Job:</span>
            <span class="value">{{ data.jobTitle }}</span>
          </div>
        </div>

        <app-review-form
          [jobId]="data.jobId"
          [revieweeId]="data.revieweeId"
          [revieweeName]="data.revieweeName"
          [reviewType]="data.reviewType"
          (reviewSubmitted)="onReviewSubmitted()"
        ></app-review-form>
      </mat-dialog-content>
    </div>
  `,
    styles: [`
    .review-dialog {
      min-width: 600px;
      max-width: 800px;

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e2e8f0;

        h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 1.5rem;
          color: #1a202c;

          mat-icon {
            color: #667eea;
          }
        }

        .close-button {
          &:hover {
            background: #f5f5f5;
          }
        }
      }

      mat-dialog-content {
        padding: 1.5rem;
        max-height: 80vh;
        overflow-y: auto;

        .job-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 8px;
          margin-bottom: 1.5rem;

          mat-icon {
            color: #667eea;
            font-size: 2rem;
            width: 2rem;
            height: 2rem;
          }

          .job-details {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            .label {
              font-size: 0.75rem;
              color: #718096;
              text-transform: uppercase;
              font-weight: 600;
            }

            .value {
              font-size: 1rem;
              color: #1a202c;
              font-weight: 500;
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .review-dialog {
        min-width: 100%;
      }
    }
  `]
})
export class ReviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData
  ) {}

  onReviewSubmitted(): void {
    this.dialogRef.close(true);
  }
}

