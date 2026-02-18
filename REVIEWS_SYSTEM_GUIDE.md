---
liquid: false
---

# Reviews System Guide

## Overview

The Freework reviews system enables bidirectional reviews between clients and freelancers after job completion. Both parties can rate and review each other, creating a trust-based marketplace.

## Features

- **Bidirectional Reviews** - Both clients and freelancers review each other
- **5-Star Rating System** - Standard 1-5 star ratings
- **Written Reviews** - Detailed feedback text
- **Review History** - Complete review timeline
- **Rating Aggregation** - Average ratings on profiles
- **Review Moderation** - Flag inappropriate reviews
- **Response System** - Reply to reviews received
- **Anonymous Options** - Optional anonymous reviews

## Review Flow

```
1. Job completes & payment released
2. Both parties prompted to leave review
3. Reviews submitted independently
4. Reviews become visible after both submit (or 7 days)
5. Optional: Respond to reviews
6. Ratings aggregate to profile
```

## Data Models

```typescript
interface Review {
  id: string;
  jobId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'client' | 'freelancer';
  revieweeId: string;
  revieweeName: string;
  revieweeRole: 'client' | 'freelancer';
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  response?: ReviewResponse;
  helpful: number; // Helpful votes
  reported: boolean;
}

interface ReviewResponse {
  text: string;
  createdAt: Date;
}

interface CreateReviewRequest {
  jobId: string;
  revieweeId: string;
  rating: number;
  comment: string;
}

interface ReviewSummary {
  userId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
```

## Usage

### Creating a Review

```typescript
import { ReviewService } from '@app/reviews/review.service';
import { CreateReviewRequest } from '@app/reviews/models';

constructor(private reviewService: ReviewService) {}

submitReview(jobId: string, revieweeId: string) {
  const review: CreateReviewRequest = {
    jobId,
    revieweeId,
    rating: 5,
    comment: 'Excellent freelancer! Delivered high-quality work on time.'
  };

  this.reviewService.createReview(review).subscribe({
    next: (review) => {
      console.log('Review submitted:', review);
      this.showSuccessMessage();
    },
    error: (error) => {
      console.error('Error submitting review:', error);
    }
  });
}
```

### Getting Reviews

```typescript
// Get reviews for a specific user
this.reviewService.getReviewsForUser(userId).subscribe(reviews => {
  this.reviews = reviews;
});

// Get reviews written by current user
this.reviewService.getMyReviews().subscribe(reviews => {
  this.myReviews = reviews;
});

// Get reviews for a specific job
this.reviewService.getReviewsForJob(jobId).subscribe(reviews => {
  this.jobReviews = reviews;
});

// Get a specific review
this.reviewService.getReview(reviewId).subscribe(review => {
  this.review = review;
});
```

### Getting Rating Summary

```typescript
// Get user's rating summary
this.reviewService.getRatingSummary(userId).subscribe(summary => {
  this.averageRating = summary.averageRating;
  this.totalReviews = summary.totalReviews;
  this.ratingDistribution = summary.ratingDistribution;
});
```

### Responding to a Review

```typescript
respondToReview(reviewId: string, responseText: string) {
  this.reviewService.respondToReview(reviewId, responseText).subscribe({
    next: (review) => {
      console.log('Response added:', review);
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

### Marking Review as Helpful

```typescript
markHelpful(reviewId: string) {
  this.reviewService.markHelpful(reviewId).subscribe({
    next: (review) => {
      console.log('Marked as helpful');
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

### Reporting a Review

```typescript
reportReview(reviewId: string, reason: string) {
  this.reviewService.reportReview(reviewId, reason).subscribe({
    next: () => {
      console.log('Review reported');
      this.showReportedMessage();
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

### Checking Review Status

```typescript
// Check if user has reviewed a job
this.reviewService.hasReviewedJob(jobId).subscribe(hasReviewed => {
  this.canReview = !hasReviewed;
});

// Check if both parties have reviewed
this.reviewService.areBothReviewsComplete(jobId).subscribe(complete => {
  this.reviewsComplete = complete;
});
```

## Components

### ReviewFormComponent
- Rating stars input
- Comment textarea
- Form validation
- Submit review

### ReviewListComponent
- Display list of reviews
- Filter and sort options
- Pagination
- Helpful votes

### ReviewCardComponent
- Single review display
- Star rating visual
- Review text
- Response section
- Report/helpful buttons

### RatingSummaryComponent
- Average rating display
- Total review count
- Rating distribution chart
- Star breakdown

### ReviewDialogComponent
- Modal for submitting review
- Appears after job completion
- Dual-sided review form

## Template Examples

### Review Form

```html
<div class="review-form">
  <h2>Review {{ reviewee.name }}</h2>
  <p>Job: {{ job.title }}</p>

  <form [formGroup]="reviewForm" (ngSubmit)="submitReview()">
    <div class="rating-input">
      <label>Rating *</label>
      <div class="stars">
        @for (star of [1,2,3,4,5]; track star) {
          <button
            type="button"
            (click)="setRating(star)"
            [class.filled]="star <= rating">
            <mat-icon>{{ star <= rating ? 'star' : 'star_border' }}</mat-icon>
          </button>
        }
      </div>
      <span class="rating-text">{{ getRatingText() }}</span>
    </div>

    <div class="form-group">
      <label>Your Review *</label>
      <textarea
        formControlName="comment"
        rows="6"
        placeholder="Share your experience working with {{ reviewee.name }}...">
      </textarea>
      @if (reviewForm.get('comment')?.invalid && 
           reviewForm.get('comment')?.touched) {
        <span class="error">Review must be at least 50 characters</span>
      }
    </div>

    <div class="review-tips">
      <h4>Tips for a helpful review:</h4>
      <ul>
        <li>Be specific about what went well or could improve</li>
        <li>Mention communication and professionalism</li>
        <li>Describe the quality of work</li>
        <li>Keep it constructive and respectful</li>
      </ul>
    </div>

    <button 
      type="submit" 
      [disabled]="!reviewForm.valid || rating === 0">
      Submit Review
    </button>
  </form>
</div>
```

### Review Card

```html
<div class="review-card">
  <div class="review-header">
    <div class="reviewer-info">
      <div class="avatar">{{ getInitials(review.reviewerName) }}</div>
      <div>
        <h4>{{ review.reviewerName }}</h4>
        <span class="role">{{ review.reviewerRole }}</span>
      </div>
    </div>
    <div class="review-meta">
      <div class="rating">
        @for (star of [1,2,3,4,5]; track star) {
          <mat-icon [class.filled]="star <= review.rating">
            {{ star <= review.rating ? 'star' : 'star_border' }}
          </mat-icon>
        }
        <span>{{ review.rating }}/5</span>
      </div>
      <span class="date">{{ review.createdAt | date:'mediumDate' }}</span>
    </div>
  </div>

  <div class="review-body">
    <p>{{ review.comment }}</p>
  </div>

  @if (review.response) {
    <div class="review-response">
      <strong>Response from {{ review.revieweeName }}:</strong>
      <p>{{ review.response.text }}</p>
      <span class="date">{{ review.response.createdAt | date:'short' }}</span>
    </div>
  }

  <div class="review-actions">
    <button (click)="markHelpful(review.id)">
      <mat-icon>thumb_up</mat-icon>
      Helpful ({{ review.helpful }})
    </button>
    
    @if (canRespond(review)) {
      <button (click)="openResponseDialog(review)">
        <mat-icon>reply</mat-icon>
        Respond
      </button>
    }
    
    <button (click)="reportReview(review.id)">
      <mat-icon>flag</mat-icon>
      Report
    </button>
  </div>
</div>
```

### Rating Summary

```html
<div class="rating-summary">
  <div class="overall-rating">
    <div class="rating-number">{{ summary.averageRating | number:'1.1-1' }}</div>
    <div class="stars">
      @for (star of [1,2,3,4,5]; track star) {
        <mat-icon [class.filled]="star <= summary.averageRating">
          {{ star <= summary.averageRating ? 'star' : 'star_border' }}
        </mat-icon>
      }
    </div>
    <div class="review-count">{{ summary.totalReviews }} reviews</div>
  </div>

  <div class="rating-breakdown">
    @for (rating of [5,4,3,2,1]; track rating) {
      <div class="rating-row">
        <span class="label">{{ rating }} star</span>
        <div class="bar-container">
          <div 
            class="bar" 
            [style.width.%]="getPercentage(rating)">
          </div>
        </div>
        <span class="count">{{ summary.ratingDistribution[rating] }}</span>
      </div>
    }
  </div>
</div>
```

### Review List

```html
<div class="review-list">
  <div class="list-header">
    <h2>Reviews ({{ reviews.length }})</h2>
    
    <div class="filters">
      <select [(ngModel)]="filterRating" (change)="applyFilter()">
        <option value="all">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="4">4 Stars</option>
        <option value="3">3 Stars</option>
        <option value="2">2 Stars</option>
        <option value="1">1 Star</option>
      </select>

      <select [(ngModel)]="sortBy" (change)="applySorting()">
        <option value="recent">Most Recent</option>
        <option value="highest">Highest Rating</option>
        <option value="lowest">Lowest Rating</option>
        <option value="helpful">Most Helpful</option>
      </select>
    </div>
  </div>

  @for (review of filteredReviews; track review.id) {
    <app-review-card [review]="review"></app-review-card>
  }

  @if (reviews.length === 0) {
    <div class="empty-state">
      <mat-icon>rate_review</mat-icon>
      <p>No reviews yet</p>
    </div>
  }
</div>
```

## API Endpoints

```
POST   /api/reviews                    - Create review
GET    /api/reviews/user/:userId       - Get reviews for user
GET    /api/reviews/my-reviews         - Get current user's reviews
GET    /api/reviews/job/:jobId         - Get reviews for job
GET    /api/reviews/:id                - Get specific review
PUT    /api/reviews/:id/respond        - Add response to review
PUT    /api/reviews/:id/helpful        - Mark review as helpful
POST   /api/reviews/:id/report         - Report review
GET    /api/reviews/summary/:userId    - Get rating summary
GET    /api/reviews/check/:jobId       - Check if reviewed
```

## Validation Rules

- **Rating**: Required, 1-5 stars
- **Comment**: Required, 50-1000 characters
- **One Review Per Job**: Each user can only review once per job
- **Job Must Be Completed**: Can only review completed jobs
- **No Self-Reviews**: Cannot review yourself

## Review Visibility

Reviews become visible:
- After both parties submit reviews, OR
- 7 days after job completion (to prevent review blackmail)

## Best Practices

### For Reviewers
1. **Be Honest**: Provide truthful feedback
2. **Be Specific**: Include details about the experience
3. **Be Constructive**: Focus on actionable feedback
4. **Be Professional**: Avoid personal attacks
5. **Be Timely**: Review soon after job completion

### For Reviewees
1. **Accept Feedback**: Learn from criticism
2. **Respond Professionally**: Thank reviewers
3. **Address Issues**: Explain your perspective calmly
4. **Don't Argue**: Keep responses brief and courteous
5. **Use for Improvement**: Apply feedback to future work

## Review Guidelines

### Prohibited Content
- Personal information (phone, email, address)
- Offensive language or threats
- Discriminatory remarks
- Spam or promotional content
- False or misleading information

### Quality Reviews Include
- Specific examples of work quality
- Communication effectiveness
- Timeliness and reliability
- Professionalism
- Overall experience

## Component Example

```typescript
import { Component, OnInit } from '@angular/core';
import { ReviewService } from '@app/reviews/review.service';
import { Review, ReviewSummary } from '@app/reviews/models';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html'
})
export class ReviewFormComponent implements OnInit {
  reviewForm = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]]
  });

  rating = 0;

  constructor(
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) {}

  setRating(stars: number) {
    this.rating = stars;
    this.reviewForm.patchValue({ rating: stars });
  }

  getRatingText(): string {
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[this.rating] || '';
  }

  submitReview() {
    if (!this.reviewForm.valid) return;

    const review = {
      jobId: this.jobId,
      revieweeId: this.revieweeId,
      ...this.reviewForm.value
    };

    this.reviewService.createReview(review).subscribe({
      next: () => {
        this.showSuccess('Review submitted successfully!');
        this.closeDialog();
      },
      error: (error) => {
        this.showError('Failed to submit review');
      }
    });
  }
}
```

## Related Documentation

- [Bidirectional Reviews Guide](BIDIRECTIONAL_REVIEWS.md) - Detailed two-way review system
- [Reviews Quick Start](REVIEWS_QUICK_START.md) - Quick implementation
- [Reviews Functionality Guide](REVIEWS_FUNCTIONALITY_GUIDE.md) - Complete feature list
- [Payment Integration](PAYMENT_INTEGRATION_GUIDE.md) - Reviews after payment release
