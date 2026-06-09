import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { ReviewService } from '../review.service';
import { Review, ReviewType } from '../models';

@Component({
    selector: 'app-review-list',
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ReviewCardComponent
    ],
    templateUrl: './review-list.component.html',
    styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit, OnChanges {
  @Input() jobId?: string;
  @Input() userId?: string;
  @Input() reviewType?: ReviewType;
  @Input() showJobTitle = false;
  @Input() limit?: number;
  @Input() showFilters = true;

  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  loading = true;
  error = false;

  // Filter options
  selectedRating = 'all';
  selectedSort = 'date-desc';

  constructor(
    private reviewService: ReviewService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobId'] || changes['userId'] || changes['reviewType']) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    this.loading = true;
    this.error = false;

    let reviewObservable;

    if (this.jobId) {
      reviewObservable = this.reviewService.getJobReviews(this.jobId);
    } else if (this.userId) {
      reviewObservable = this.reviewService.getUserReviews(this.userId);
    } else {
      reviewObservable = this.reviewService.getReviews();
    }

    reviewObservable.subscribe({
      next: (reviews) => {
        this.reviews = reviews;

        // Filter by review type if specified
        if (this.reviewType) {
          this.reviews = this.reviews.filter(r => r.reviewType === this.reviewType);
        }

        // Apply limit if specified
        if (this.limit && this.limit > 0) {
          this.reviews = this.reviews.slice(0, this.limit);
        }

        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.reviews];

    // Filter by rating
    if (this.selectedRating !== 'all') {
      const rating = parseInt(this.selectedRating);
      filtered = filtered.filter(r => r.rating === rating);
    }

    // Sort reviews
    switch (this.selectedSort) {
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
    }

    this.filteredReviews = filtered;
  }

  onRatingChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onMarkHelpful(review: Review, helpful: boolean): void {
    this.reviewService.markReviewHelpful(review.id, helpful).subscribe({
      next: (updatedReview) => {
        const index = this.reviews.findIndex(r => r.id === review.id);
        if (index !== -1) {
          this.reviews[index] = updatedReview;
          this.applyFilters();
        }
        this.showSuccess(helpful ? 'Thank you for your feedback!' : 'Feedback recorded');
      },
      error: (error) => {
        console.error('Error marking review helpful:', error);
        this.showError('Failed to record feedback');
      }
    });
  }

  retryLoad(): void {
    this.loadReviews();
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
