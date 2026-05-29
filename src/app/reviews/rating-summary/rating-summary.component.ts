import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ReviewService } from '../review.service';
import { ReviewSummary } from '../models';

@Component({
    selector: 'app-rating-summary',
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatProgressBarModule,
        MatChipsModule
    ],
    templateUrl: './rating-summary.component.html',
    styleUrls: ['./rating-summary.component.scss']
})
export class RatingSummaryComponent implements OnInit, OnChanges {
  @Input() targetId!: string;
  @Input() targetType: 'job' | 'user' = 'job';
  @Input() showTitle = true;

  summary?: ReviewSummary;
  loading = true;
  error = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['targetId'] || changes['targetType']) {
      this.loadSummary();
    }
  }

  loadSummary(): void {
    if (!this.targetId) {
      return;
    }

    this.loading = true;
    this.error = false;

    this.reviewService.getReviewSummary(this.targetId, this.targetType).subscribe({
      next: (summary) => {
        this.summary = summary;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading review summary:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getStarIcon(position: number): string {
    if (!this.summary) return 'star_border';
    const rating = this.summary.averageRating;

    if (position <= Math.floor(rating)) {
      return 'star';
    } else if (position === Math.ceil(rating) && rating % 1 !== 0) {
      return 'star_half';
    }
    return 'star_border';
  }

  getRatingPercentage(stars: number): number {
    if (!this.summary || this.summary.totalReviews === 0) return 0;
    const count = this.summary.ratingDistribution[stars] || 0;
    return (count / this.summary.totalReviews) * 100;
  }

  getRatingCount(stars: number): number {
    if (!this.summary) return 0;
    return this.summary.ratingDistribution[stars] || 0;
  }

  getRatingLabel(): string {
    if (!this.summary) return 'No ratings';

    const rating = this.summary.averageRating;
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.0) return 'Good';
    if (rating >= 2.0) return 'Fair';
    return 'Poor';
  }
}
