// Review models for the review and rating system

export enum ReviewType {
  FREELANCER_REVIEW = 'FREELANCER_REVIEW',
  CUSTOMER_REVIEW = 'CUSTOMER_REVIEW'
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED'
}

export interface Review {
  id: string;
  jobId: string;
  jobTitle?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  revieweeId: string;
  revieweeName: string;
  reviewType: ReviewType;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  status: ReviewStatus;
  isVerified: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  response?: ReviewResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  responderId: string;
  responderName: string;
  comment: string;
  createdAt: Date;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  recentReviews: Review[];
}

export interface RatingBreakdown {
  fiveStars: number;
  fourStars: number;
  threeStars: number;
  twoStars: number;
  oneStar: number;
}

export interface UserReviewStats {
  userId: string;
  userName: string;
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: RatingBreakdown;
  badges: string[];
}

export interface CreateReviewRequest {
  jobId: string;
  revieweeId: string;
  reviewType: ReviewType;
  rating: number;
  title: string;
  comment: string;
  pros?: string[];
  cons?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
  pros?: string[];
  cons?: string[];
}

export interface ReviewFilters {
  jobId?: string;
  userId?: string;
  reviewType?: ReviewType;
  minRating?: number;
  maxRating?: number;
  status?: ReviewStatus;
  sortBy?: 'date' | 'rating' | 'helpful';
  sortOrder?: 'asc' | 'desc';
}

