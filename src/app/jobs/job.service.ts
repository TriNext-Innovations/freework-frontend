import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Job, CreateJobRequest, UpdateJobRequest, JobFilters, JobsResponse } from './models';
import { MockDataService } from './mock-data.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly API_URL = 'https://freework-dev-ecs-alb-391464293.af-south-1.elb.amazonaws.com/jobs';
  private useMockData = false; // Toggle this to switch between mock and real API

  private jobsSubject = new BehaviorSubject<Job[]>([]);
  public jobs$ = this.jobsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService,
    private authService: AuthService
  ) {}

  /**
   * Get all jobs with optional filters and pagination
   */
  getJobs(page: number = 0, size: number = 10, filters?: JobFilters): Observable<JobsResponse> {
    // Use mock data for testing
    if (this.useMockData) {
      if (filters) {
        return this.mockDataService.searchJobs(filters, page, size).pipe(
          tap(response => this.jobsSubject.next(response.content))
        );
      }
      return this.mockDataService.getJobs(page, size).pipe(
        tap(response => this.jobsSubject.next(response.content))
      );
    }

    // Original API call
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.locationType) params = params.set('locationType', filters.locationType);
      if (filters.minBudget) params = params.set('minBudget', filters.minBudget.toString());
      if (filters.maxBudget) params = params.set('maxBudget', filters.maxBudget.toString());
      if (filters.budgetType) params = params.set('budgetType', filters.budgetType);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.customerId) params = params.set('customerId', filters.customerId);
      if (filters.skills && filters.skills.length > 0) {
        params = params.set('skills', filters.skills.join(','));
      }
    }

    return this.http.get<JobsResponse>(this.API_URL, { params }).pipe(
      tap(response => this.jobsSubject.next(response.content))
    );
  }

  /**
   * Get a single job by ID
   */
  getJobById(id: string): Observable<Job> {
    // Use mock data for testing
    if (this.useMockData) {
      return this.mockDataService.getJobById(id);
    }

    return this.http.get<Job>(`${this.API_URL}/${id}`);
  }

  /**
   * Create a new job (Customer only)
   */
  createJob(jobData: CreateJobRequest): Observable<Job> {
    return this.http.post<Job>(this.API_URL, jobData);
  }

  /**
   * Update an existing job (Customer only)
   */
  updateJob(jobData: UpdateJobRequest): Observable<Job> {
    return this.http.put<Job>(`${this.API_URL}/${jobData.id}`, jobData);
  }

  /**
   * Delete a job (Customer only)
   */
  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Get jobs posted by current user (Customer only)
   */
  getMyJobs(page: number = 0, size: number = 10): Observable<JobsResponse> {
    // Use mock data for testing
    if (this.useMockData) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        return this.mockDataService.getMyJobs(currentUser.id, page, size);
      }
    }

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<JobsResponse>(`${this.API_URL}/my-jobs`, { params });
  }

  /**
   * Search jobs by keyword
   */
  searchJobs(keyword: string, page: number = 0, size: number = 10): Observable<JobsResponse> {
    const params = new HttpParams()
      .set('search', keyword)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<JobsResponse>(`${this.API_URL}/search`, { params });
  }

  /**
   * Get jobs by category
   */
  getJobsByCategory(category: string, page: number = 0, size: number = 10): Observable<JobsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<JobsResponse>(`${this.API_URL}/category/${category}`, { params });
  }

  /**
   * Update job status
   */
  updateJobStatus(id: string, status: string): Observable<Job> {
    return this.http.patch<Job>(`${this.API_URL}/${id}/status`, { status });
  }
}
