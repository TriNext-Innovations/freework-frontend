import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Job, CreateJobRequest, UpdateJobRequest, JobFilters, JobsResponse } from './models';
import { buildApiUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private http = inject(HttpClient);

  private readonly API_URL = buildApiUrl('/jobs');

  private jobsSubject = new BehaviorSubject<Job[]>([]);
  public jobs$ = this.jobsSubject.asObservable();

  getJobs(page = 0, size = 10, filters?: JobFilters): Observable<JobsResponse> {
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

  getJobById(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.API_URL}/${id}`);
  }

  createJob(jobData: CreateJobRequest): Observable<Job> {
    return this.http.post<Job>(this.API_URL, jobData);
  }

  updateJob(jobData: UpdateJobRequest): Observable<Job> {
    return this.http.put<Job>(`${this.API_URL}/${jobData.id}`, jobData);
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getMyJobs(page = 0, size = 10): Observable<JobsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<JobsResponse>(`${this.API_URL}/my-jobs`, { params });
  }

  searchJobs(keyword: string, page = 0, size = 10): Observable<JobsResponse> {
    const params = new HttpParams()
      .set('search', keyword)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<JobsResponse>(`${this.API_URL}/search`, { params });
  }

  getJobsByCategory(category: string, page = 0, size = 10): Observable<JobsResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<JobsResponse>(`${this.API_URL}/category/${category}`, { params });
  }

  updateJobStatus(id: string, status: string): Observable<Job> {
    return this.http.patch<Job>(`${this.API_URL}/${id}/status`, { status });
  }
}
