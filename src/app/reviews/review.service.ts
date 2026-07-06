import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Review,
  ReviewSummary,
  CreateReviewRequest,
  UpdateReviewRequest,
  UserReviewStats
} from './models';
import { buildApiEndpointUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient);

  private apiUrl = buildApiEndpointUrl('/reviews');

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  getReview(reviewId: string): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${reviewId}`);
  }

  getJobReviews(jobId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/job/${jobId}`);
  }

  getUserReviews(userId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`);
  }

  getReviewSummary(targetId: string, type: 'job' | 'user'): Observable<ReviewSummary> {
    return this.http.get<ReviewSummary>(`${this.apiUrl}/summary/${type}/${targetId}`);
  }

  getUserReviewStats(userId: string): Observable<UserReviewStats> {
    return this.http.get<UserReviewStats>(`${this.apiUrl}/stats/user/${userId}`);
  }

  createReview(request: CreateReviewRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, request);
  }

  updateReview(reviewId: string, request: UpdateReviewRequest): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${reviewId}`, request);
  }

  deleteReview(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }

  markReviewHelpful(reviewId: string, helpful: boolean): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/${reviewId}/helpful`, { helpful });
  }
}
