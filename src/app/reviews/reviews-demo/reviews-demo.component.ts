import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { ReviewListComponent } from '../review-list/review-list.component';
import { RatingSummaryComponent } from '../rating-summary/rating-summary.component';
import { ReviewType } from '../models';

@Component({
    selector: 'app-reviews-demo',
    imports: [
        CommonModule,
        MatTabsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        ReviewFormComponent,
        ReviewListComponent,
        RatingSummaryComponent
    ],
    templateUrl: './reviews-demo.component.html',
    styleUrls: ['./reviews-demo.component.scss']
})
export class ReviewsDemoComponent {
  // Demo data
  demoJobId = '1';
  demoUserId = 'freelancer1';
  demoUserName = 'Emily Chen';
  demoCustomerId = 'customer1';
  demoCustomerName = 'John Doe';
  ReviewType = ReviewType;

  showReviewForm = false;
  reviewFormType: ReviewType = ReviewType.FREELANCER_REVIEW;

  onReviewSubmitted(): void {
    this.showReviewForm = false;
    // In a real app, this would refresh the review list
  }

  toggleReviewForm(reviewType?: ReviewType): void {
    if (reviewType) {
      this.reviewFormType = reviewType;
    }
    this.showReviewForm = !this.showReviewForm;
  }

  getRevieweeId(): string {
    return this.reviewFormType === ReviewType.FREELANCER_REVIEW
      ? this.demoUserId
      : this.demoCustomerId;
  }

  getRevieweeName(): string {
    return this.reviewFormType === ReviewType.FREELANCER_REVIEW
      ? this.demoUserName
      : this.demoCustomerName;
  }
}
