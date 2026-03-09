import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Review,
  ReviewSummary,
  CreateReviewRequest,
  UpdateReviewRequest,
  UserReviewStats
} from './models';
import { MockReviewService } from './mock-review.service';
import { buildApiEndpointUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = buildApiEndpointUrl('/reviews');
  private useMockData = true; // Toggle this to switch between mock and real API

  constructor(
    private http: HttpClient,
    private mockReviewService: MockReviewService
  ) {}

  /**
   * Get all reviews
   */
  getReviews(): Observable<Review[]> {
    if (this.useMockData) {
      return this.mockReviewService.getReviews();
    }
    return this.http.get<Review[]>(this.apiUrl);
  }

  /**
   * Get a specific review by ID
   */
  getReview(reviewId: string): Observable<Review> {
    if (this.useMockData) {
      return this.mockReviewService.getReview(reviewId);
    }
    return this.http.get<Review>(`${this.apiUrl}/${reviewId}`);
  }

  /**
   * Get reviews for a specific job
   */
  getJobReviews(jobId: string): Observable<Review[]> {
    if (this.useMockData) {
      return this.mockReviewService.getJobReviews(jobId);
    }
    return this.http.get<Review[]>(`${this.apiUrl}/job/${jobId}`);
  }

  /**
   * Get reviews for a specific user
   */
  getUserReviews(userId: string): Observable<Review[]> {
    if (this.useMockData) {
      return this.mockReviewService.getUserReviews(userId);
    }
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Get review summary for a job or user
   */
  getReviewSummary(targetId: string, type: 'job' | 'user'): Observable<ReviewSummary> {
    if (this.useMockData) {
      return this.mockReviewService.getReviewSummary(targetId, type);
    }
    return this.http.get<ReviewSummary>(`${this.apiUrl}/summary/${type}/${targetId}`);
  }

  /**
   * Get user review statistics
   */
  getUserReviewStats(userId: string): Observable<UserReviewStats> {
    if (this.useMockData) {
      return this.mockReviewService.getUserReviewStats(userId);
    }
    return this.http.get<UserReviewStats>(`${this.apiUrl}/stats/user/${userId}`);
  }

  /**
   * Create a new review
   */
  createReview(request: CreateReviewRequest): Observable<Review> {
    if (this.useMockData) {
      return this.mockReviewService.createReview(request);
    }
    return this.http.post<Review>(this.apiUrl, request);
  }

  /**
   * Update an existing review
   */
  updateReview(reviewId: string, request: UpdateReviewRequest): Observable<Review> {
    if (this.useMockData) {
      return this.mockReviewService.updateReview(reviewId, request);
    }
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`, request);
  }

  /**
   * Delete a review
   */
  deleteReview(reviewId: string): Observable<void> {
    if (this.useMockData) {
      return this.mockReviewService.deleteReview(reviewId);
    }
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }

  /**
   * Mark a review as helpful or not helpful
   */
  markReviewHelpful(reviewId: string, helpful: boolean): Observable<Review> {
    if (this.useMockData) {
      return this.mockReviewService.markReviewHelpful(reviewId, helpful);
    }
    return this.http.post<Review>(`${this.apiUrl}/${reviewId}/helpful`, { helpful });
  }
}
