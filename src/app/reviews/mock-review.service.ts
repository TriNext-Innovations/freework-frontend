import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  Review,
  ReviewSummary,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewType,
  ReviewStatus,
  UserReviewStats,
  RatingBreakdown
} from './models';

@Injectable({
  providedIn: 'root'
})
export class MockReviewService {
  private mockReviews: Review[] = [
    {
      id: 'rev1',
      jobId: '1',
      jobTitle: 'Full Stack Web Developer for E-commerce Platform',
      reviewerId: 'customer1',
      reviewerName: 'John Doe',
      reviewerAvatar: 'https://i.pravatar.cc/150?img=1',
      revieweeId: 'freelancer1',
      revieweeName: 'Emily Chen',
      reviewType: ReviewType.FREELANCER_REVIEW,
      rating: 5,
      title: 'Outstanding Work and Communication',
      comment: 'Emily delivered exceptional work on our e-commerce platform. Her attention to detail and proactive communication made the entire project smooth. She went above and beyond to ensure every feature worked perfectly. Highly recommend!',
      pros: ['Excellent communication', 'High quality code', 'Met all deadlines', 'Great problem solver'],
      cons: [],
      status: ReviewStatus.APPROVED,
      isVerified: true,
      helpfulCount: 12,
      notHelpfulCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    },
    {
      id: 'rev2',
      jobId: '2',
      jobTitle: 'Mobile App Developer - iOS & Android',
      reviewerId: 'freelancer2',
      reviewerName: 'Sarah Miller',
      reviewerAvatar: 'https://i.pravatar.cc/150?img=5',
      revieweeId: 'customer1',
      revieweeName: 'John Doe',
      reviewType: ReviewType.CUSTOMER_REVIEW,
      rating: 4,
      title: 'Great Client to Work With',
      comment: 'John was very professional and had clear requirements from the start. He provided timely feedback and was always available for questions. Payment was prompt. Would work with him again.',
      pros: ['Clear requirements', 'Timely payments', 'Good communication'],
      cons: ['Some scope changes mid-project'],
      status: ReviewStatus.APPROVED,
      isVerified: true,
      helpfulCount: 8,
      notHelpfulCount: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
    },
    {
      id: 'rev3',
      jobId: '3',
      jobTitle: 'UI/UX Designer for SaaS Dashboard',
      reviewerId: 'customer2',
      reviewerName: 'Jane Smith',
      revieweeId: 'freelancer3',
      revieweeName: 'Mike Johnson',
      reviewType: ReviewType.FREELANCER_REVIEW,
      rating: 5,
      title: 'Incredible Design Skills',
      comment: 'Mike created stunning designs for our SaaS dashboard. His understanding of UX principles and modern design trends resulted in a beautiful and user-friendly interface. Very professional and creative!',
      pros: ['Creative designs', 'User-centric approach', 'Fast delivery', 'Unlimited revisions'],
      cons: [],
      status: ReviewStatus.APPROVED,
      isVerified: true,
      helpfulCount: 15,
      notHelpfulCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21)
    },
    {
      id: 'rev4',
      jobId: '1',
      jobTitle: 'Full Stack Web Developer for E-commerce Platform',
      reviewerId: 'freelancer1',
      reviewerName: 'Emily Chen',
      reviewerAvatar: 'https://i.pravatar.cc/150?img=9',
      revieweeId: 'customer1',
      revieweeName: 'John Doe',
      reviewType: ReviewType.CUSTOMER_REVIEW,
      rating: 5,
      title: 'Perfect Client Experience',
      comment: 'Working with Heinrich was a pleasure. He had a clear vision, provided excellent feedback, and was very respectful of my time and expertise. The project scope was well-defined and payment was always on time.',
      pros: ['Clear vision', 'Professional', 'On-time payments', 'Respectful'],
      cons: [],
      status: ReviewStatus.APPROVED,
      isVerified: true,
      helpfulCount: 6,
      notHelpfulCount: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6)
    },
    {
      id: 'rev5',
      jobId: '4',
      jobTitle: 'DevOps Engineer - AWS Infrastructure',
      reviewerId: 'customer3',
      reviewerName: 'Robert Williams',
      revieweeId: 'freelancer4',
      revieweeName: 'David Rodriguez',
      reviewType: ReviewType.FREELANCER_REVIEW,
      rating: 4,
      title: 'Solid DevOps Work',
      comment: 'David set up our AWS infrastructure efficiently. Good knowledge of DevOps practices and security. Communication could have been more frequent, but the final result was exactly what we needed.',
      pros: ['Technical expertise', 'Secure setup', 'Good documentation'],
      cons: ['Could communicate more frequently'],
      status: ReviewStatus.APPROVED,
      isVerified: true,
      helpfulCount: 5,
      notHelpfulCount: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
    }
  ];

  getReviews(): Observable<Review[]> {
    return of(this.mockReviews).pipe(delay(400));
  }

  getReview(reviewId: string): Observable<Review> {
    const review = this.mockReviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    return of(review).pipe(delay(300));
  }

  getJobReviews(jobId: string): Observable<Review[]> {
    const reviews = this.mockReviews.filter(r => r.jobId === jobId);
    return of(reviews).pipe(delay(400));
  }

  getUserReviews(userId: string): Observable<Review[]> {
    const reviews = this.mockReviews.filter(r => r.revieweeId === userId);
    return of(reviews).pipe(delay(400));
  }

  getReviewSummary(targetId: string, type: 'job' | 'user'): Observable<ReviewSummary> {
    let reviews: Review[];

    if (type === 'job') {
      reviews = this.mockReviews.filter(r => r.jobId === targetId);
    } else {
      reviews = this.mockReviews.filter(r => r.revieweeId === targetId);
    }

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const ratingDistribution: Record<number, number> = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    const summary: ReviewSummary = {
      totalReviews,
      averageRating,
      ratingDistribution,
      recentReviews: reviews.slice(0, 3)
    };

    return of(summary).pipe(delay(400));
  }

  getUserReviewStats(userId: string): Observable<UserReviewStats> {
    const reviews = this.mockReviews.filter(r => r.revieweeId === userId);
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const ratingBreakdown: RatingBreakdown = {
      fiveStars: reviews.filter(r => r.rating === 5).length,
      fourStars: reviews.filter(r => r.rating === 4).length,
      threeStars: reviews.filter(r => r.rating === 3).length,
      twoStars: reviews.filter(r => r.rating === 2).length,
      oneStar: reviews.filter(r => r.rating === 1).length
    };

    const stats: UserReviewStats = {
      userId,
      userName: reviews[0]?.revieweeName || 'User',
      totalReviews,
      averageRating,
      ratingBreakdown,
      badges: this.calculateBadges(averageRating, totalReviews)
    };

    return of(stats).pipe(delay(400));
  }

  createReview(request: CreateReviewRequest): Observable<Review> {
    const newReview: Review = {
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      jobId: request.jobId,
      jobTitle: 'Job Title',
      reviewerId: 'currentUser',
      reviewerName: 'Current User',
      revieweeId: request.revieweeId,
      revieweeName: 'Reviewee Name',
      reviewType: request.reviewType,
      rating: request.rating,
      title: request.title,
      comment: request.comment,
      pros: request.pros,
      cons: request.cons,
      status: ReviewStatus.APPROVED,
      isVerified: true,
      helpfulCount: 0,
      notHelpfulCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockReviews.unshift(newReview);
    return of(newReview).pipe(delay(600));
  }

  updateReview(reviewId: string, request: UpdateReviewRequest): Observable<Review> {
    const review = this.mockReviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    if (request.rating) review.rating = request.rating;
    if (request.title) review.title = request.title;
    if (request.comment) review.comment = request.comment;
    if (request.pros) review.pros = request.pros;
    if (request.cons) review.cons = request.cons;
    review.updatedAt = new Date();

    return of(review).pipe(delay(500));
  }

  deleteReview(reviewId: string): Observable<void> {
    const index = this.mockReviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      this.mockReviews.splice(index, 1);
    }
    return of(void 0).pipe(delay(400));
  }

  markReviewHelpful(reviewId: string, helpful: boolean): Observable<Review> {
    const review = this.mockReviews.find(r => r.id === reviewId);
    if (!review) {
      throw new Error('Review not found');
    }

    if (helpful) {
      review.helpfulCount++;
    } else {
      review.notHelpfulCount++;
    }

    return of(review).pipe(delay(300));
  }

  private calculateBadges(averageRating: number, totalReviews: number): string[] {
    const badges: string[] = [];

    if (averageRating >= 4.8 && totalReviews >= 10) {
      badges.push('Top Rated');
    }
    if (totalReviews >= 50) {
      badges.push('Experienced');
    }
    if (averageRating >= 4.5) {
      badges.push('Highly Recommended');
    }

    return badges;
  }
}

