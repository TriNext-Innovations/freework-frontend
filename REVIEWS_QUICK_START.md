---
liquid: false
---

{% raw %}

# Reviews & Ratings System - Quick Reference

## 🚀 Quick Start

### View the Demo
Navigate to: `http://localhost:4200/reviews-demo`

This interactive demo showcases all review system components in action!

## 🔄 Bidirectional Review System

The review system supports **two-way reviews**:

### 👨‍💼 Customer Reviews Freelancer
After a job is completed, **customers can rate and review the freelancer's work**:
- Quality of work delivered
- Communication and professionalism
- Meeting deadlines
- Technical skills

```typescript
reviewType = ReviewType.FREELANCER_REVIEW;
```

### 👨‍💻 Freelancer Reviews Customer
Freelancers can also **rate and review their experience working with the customer**:
- Clear requirements and communication
- Timely payments
- Professionalism
- Reasonable expectations

```typescript
reviewType = ReviewType.CUSTOMER_REVIEW;
```

This creates **accountability and transparency** for both parties!

## 📦 Components at a Glance

### 1. Review Form (`app-review-form`)
Submit new reviews with ratings, comments, pros, and cons.

```html
<app-review-form
  [jobId]="'job123'"
  [revieweeId]="'user456'"
  [revieweeName]="'John Doe'"
  [reviewType]="ReviewType.FREELANCER_REVIEW"
  (reviewSubmitted)="handleSubmit()"
></app-review-form>
```

### 2. Rating Summary (`app-rating-summary`)
Display aggregate ratings and distribution.

```html
<app-rating-summary
  [targetId]="'job123'"
  [targetType]="'job'"
  [showTitle]="true"
></app-rating-summary>
```

### 3. Review List (`app-review-list`)
Show multiple reviews with filtering and sorting.

```html
<app-review-list
  [jobId]="'job123'"
  [showJobTitle]="false"
  [showFilters]="true"
></app-review-list>
```

### 4. Review Card (`app-review-card`)
Display individual review (used internally by review-list).

```html
<app-review-card
  [review]="reviewObject"
  [showJobTitle]="true"
  [canEdit]="true"
  (helpful)="onHelpful($event)"
></app-review-card>
```

## 🎯 Common Use Cases

### On Job Detail Page
```html
<!-- Overview Tab -->
<app-rating-summary [targetId]="jobId" [targetType]="'job'"></app-rating-summary>

<!-- Reviews Tab -->
<app-review-list [jobId]="jobId"></app-review-list>
```

### On User Profile Page
```html
<app-rating-summary [targetId]="userId" [targetType]="'user'"></app-rating-summary>
<app-review-list [userId]="userId"></app-review-list>
```

### Write Review Modal
```html
<app-review-form
  [jobId]="jobId"
  [revieweeId]="freelancerId"
  [revieweeName]="freelancerName"
  [reviewType]="ReviewType.FREELANCER_REVIEW"
  (reviewSubmitted)="closeModal()"
></app-review-form>
```

## 🔧 Service Methods

```typescript
// Inject the service
constructor(private reviewService: ReviewService) {}

// Get reviews for a job
this.reviewService.getJobReviews(jobId).subscribe(reviews => {
  console.log(reviews);
});

// Get reviews for a user
this.reviewService.getUserReviews(userId).subscribe(reviews => {
  console.log(reviews);
});

// Get rating summary
this.reviewService.getReviewSummary(jobId, 'job').subscribe(summary => {
  console.log(summary.averageRating);
});

// Create a review
const request: CreateReviewRequest = {
  jobId: 'job123',
  revieweeId: 'user456',
  reviewType: ReviewType.FREELANCER_REVIEW,
  rating: 5,
  title: 'Excellent work!',
  comment: 'Very professional and delivered on time.',
  pros: ['Great communication', 'Quality work'],
  cons: []
};
this.reviewService.createReview(request).subscribe();
```

## 🎨 Review Types

```typescript
import { ReviewType } from './reviews/models';

// For customers reviewing freelancers
reviewType = ReviewType.FREELANCER_REVIEW;

// For freelancers reviewing customers
reviewType = ReviewType.CUSTOMER_REVIEW;
```

## 📊 Mock Data

Toggle between mock and real API:

**File:** `src/app/reviews/review.service.ts`
```typescript
private useMockData = true; // Set to false for real API
```

## 🎭 Features

✅ **Review Form:**
- 5-star rating system
- Title & comment validation
- Optional pros/cons with chips
- Review guidelines

✅ **Review Display:**
- Verified badges
- Time ago display
- Helpful voting
- Response support

✅ **Rating Summary:**
- Overall score
- Star distribution
- Progress bars
- Beautiful gradient design

✅ **Review List:**
- Filter by rating
- Sort by date/rating/helpful
- Empty & error states
- Responsive design

## 🔗 Integration Points

### Job Detail Page
Already integrated! Check `src/app/jobs/job-detail/`

### User Profile (Future)
```html
<app-rating-summary [targetId]="user.id" [targetType]="'user'"></app-rating-summary>
<app-review-list [userId]="user.id"></app-review-list>
```

## 🐛 Troubleshooting

**Reviews not showing?**
- Check that `useMockData = true` in review.service.ts
- Verify mock data exists for your jobId/userId

**Form not submitting?**
- Ensure rating is selected (1-5 stars)
- Comment must be at least 20 characters
- Title is required

**Styling issues?**
- Ensure Angular Material is properly imported
- Check that component styles are loading

## 📚 Documentation

- **Complete Guide:** `REVIEWS_SYSTEM_GUIDE.md`
- **Demo Page:** `http://localhost:4200/reviews-demo`
- **Components:** `src/app/reviews/`

## 🚀 Next Steps

1. Test the demo page: `/reviews-demo`
2. View reviews on job detail pages
3. Integrate into user profiles
4. Connect to real backend API
5. Add review notifications
6. Implement review responses

---

**Need Help?** Check the complete guide in `REVIEWS_SYSTEM_GUIDE.md`

# Reviews Quick Start

## Quick Implementation Guide

### 1. Import Review Service

```typescript
import { ReviewService } from '@app/reviews/review.service';
import { Review, ReviewSummary } from '@app/reviews/models';
```

### 2. Submit a Review

```typescript
export class ReviewComponent {
  constructor(private reviewService: ReviewService) {}

  submitReview(jobId: string, revieweeId: string, rating: number, comment: string) {
    this.reviewService.createReview({
      jobId,
      revieweeId,
      rating,
      comment
    }).subscribe({
      next: () => console.log('Review submitted!'),
      error: (err) => console.error('Error:', err)
    });
  }
}
```

### 3. Display Star Rating

```html
<div class="rating">
  @for (star of [1,2,3,4,5]; track star) {
    <mat-icon [class.filled]="star <= rating">
      {{ star <= rating ? 'star' : 'star_border' }}
    </mat-icon>
  }
  <span>{{ rating }}/5</span>
</div>
```

### 4. Show User's Rating Summary

```typescript
loadRatingSummary(userId: string) {
  this.reviewService.getRatingSummary(userId).subscribe(summary => {
    this.averageRating = summary.averageRating;
    this.totalReviews = summary.totalReviews;
  });
}
```

```html
<div class="user-rating">
  <span class="rating">⭐ {{ averageRating | number:'1.1-1' }}</span>
  <span class="count">({{ totalReviews }} reviews)</span>
</div>
```

### 5. List Reviews

```typescript
getReviews(userId: string) {
  this.reviewService.getReviewsForUser(userId).subscribe(reviews => {
    this.reviews = reviews;
  });
}
```

```html
@for (review of reviews; track review.id) {
  <div class="review-card">
    <h4>{{ review.reviewerName }}</h4>
    <div class="stars">{{ '⭐'.repeat(review.rating) }}</div>
    <p>{{ review.comment }}</p>
    <small>{{ review.createdAt | date }}</small>
  </div>
}
```

## Complete Minimal Example

```typescript
import { Component, OnInit } from '@angular/core';
import { ReviewService } from '@app/reviews/review.service';

@Component({
  selector: 'app-reviews',
  template: `
    <div class="reviews">
      <h2>Reviews ({{ (reviews$ | async)?.length || 0 }})</h2>
      
      @for (review of reviews$ | async; track review.id) {
        <div class="review">
          <div class="header">
            <strong>{{ review.reviewerName }}</strong>
            <span>{{ '⭐'.repeat(review.rating) }}</span>
          </div>
          <p>{{ review.comment }}</p>
          <small>{{ review.createdAt | date:'short' }}</small>
        </div>
      }
    </div>
  `
})
export class ReviewsComponent implements OnInit {
  reviews$ = this.reviewService.getReviewsForUser(this.userId);

  constructor(private reviewService: ReviewService) {}
}
```

Done! Your review system is ready to use.

{% endraw %}
