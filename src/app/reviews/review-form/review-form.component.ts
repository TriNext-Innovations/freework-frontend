import { Component, Input, Output, EventEmitter, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReviewService } from '../review.service';
import { CreateReviewRequest, ReviewType } from '../models';

@Component({
    selector: 'app-review-form',
    imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
],
    templateUrl: './review-form.component.html',
    styleUrls: ['./review-form.component.scss']
})
export class ReviewFormComponent {
  private reviewService = inject(ReviewService);
  private snackBar = inject(MatSnackBar);

  @Input() jobId!: string;
  @Input() revieweeId!: string;
  @Input() revieweeName!: string;
  @Input() reviewType: ReviewType = ReviewType.FREELANCER_REVIEW;
  @Output() reviewSubmitted = new EventEmitter<void>();

  rating = 0;
  hoveredRating = 0;
  title = '';
  comment = '';
  pros: string[] = [];
  cons: string[] = [];
  currentPro = '';
  currentCon = '';

  submitting = false;

  setRating(rating: number): void {
    this.rating = rating;
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHoveredRating(): void {
    this.hoveredRating = 0;
  }

  getStarIcon(starNumber: number): string {
    const displayRating = this.hoveredRating || this.rating;
    return starNumber <= displayRating ? 'star' : 'star_border';
  }

  getStarColor(starNumber: number): string {
    const displayRating = this.hoveredRating || this.rating;
    if (starNumber <= displayRating) {
      if (displayRating <= 2) return 'warn';
      if (displayRating <= 3) return 'accent';
      return 'primary';
    }
    return '';
  }

  addPro(): void {
    if (this.currentPro.trim()) {
      this.pros.push(this.currentPro.trim());
      this.currentPro = '';
    }
  }

  removePro(index: number): void {
    this.pros.splice(index, 1);
  }

  addCon(): void {
    if (this.currentCon.trim()) {
      this.cons.push(this.currentCon.trim());
      this.currentCon = '';
    }
  }

  removeCon(index: number): void {
    this.cons.splice(index, 1);
  }

  canSubmit(): boolean {
    return this.rating > 0 && this.title.trim().length > 0 && this.comment.trim().length >= 20;
  }

  getValidationMessage(): string {
    const issues: string[] = [];

    if (this.rating === 0) {
      issues.push('Select a star rating');
    }
    if (this.title.trim().length === 0) {
      issues.push('Enter a title');
    }
    if (this.comment.trim().length < 20) {
      issues.push(`Add ${20 - this.comment.trim().length} more characters to your review`);
    }

    return issues.length > 0 ? issues.join(', ') : '';
  }

  submitReview(): void {
    if (!this.canSubmit()) {
      const message = this.getValidationMessage();
      this.showError(message || 'Please complete all required fields.');
      return;
    }

    this.submitting = true;

    const request: CreateReviewRequest = {
      jobId: this.jobId,
      revieweeId: this.revieweeId,
      reviewType: this.reviewType,
      rating: this.rating,
      title: this.title.trim(),
      comment: this.comment.trim(),
      pros: this.pros.length > 0 ? this.pros : undefined,
      cons: this.cons.length > 0 ? this.cons : undefined
    };

    this.reviewService.createReview(request).subscribe({
      next: () => {
        this.showSuccess('Review submitted successfully!');
        this.resetForm();
        this.reviewSubmitted.emit();
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.showError('Failed to submit review. Please try again.');
        this.submitting = false;
      }
    });
  }

  resetForm(): void {
    this.rating = 0;
    this.hoveredRating = 0;
    this.title = '';
    this.comment = '';
    this.pros = [];
    this.cons = [];
    this.currentPro = '';
    this.currentCon = '';
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
