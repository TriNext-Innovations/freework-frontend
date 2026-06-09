import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobApplication, CreateApplicationDto, ApplicationResponse, ApplicationStatus } from './models/application.models';
import { MockDataService } from './mock-data.service';
import { buildApiEndpointUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = buildApiEndpointUrl('/applications');
  private useMockData = false; // Toggle this to switch between mock and real API

  constructor(
    private http: HttpClient,
    private mockDataService: MockDataService
  ) {}

  /**
   * Submit a new job application
   */
  submitApplication(application: CreateApplicationDto): Observable<ApplicationResponse> {
    if (this.useMockData) {
      return this.mockDataService.submitApplication(application);
    }
    return this.http.post<ApplicationResponse>(this.apiUrl, application);
  }

  /**
   * Get all applications for the current freelancer
   */
  getMyApplications(status?: ApplicationStatus): Observable<JobApplication[]> {
    if (this.useMockData) {
      return this.mockDataService.getMyApplications(status);
    }

    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<JobApplication[]>(`${this.apiUrl}/my-applications`, { params });
  }

  /**
   * Get application by ID
   */
  getApplicationById(id: string): Observable<JobApplication> {
    if (this.useMockData) {
      return this.mockDataService.getApplicationById(id);
    }
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }

  /**
   * Check if user has already applied to a job
   */
  hasApplied(jobId: string): Observable<boolean> {
    if (this.useMockData) {
      return this.mockDataService.hasApplied(jobId);
    }
    return this.http.get<boolean>(`${this.apiUrl}/check/${jobId}`);
  }

  /**
   * Withdraw an application
   */
  withdrawApplication(id: string): Observable<ApplicationResponse> {
    if (this.useMockData) {
      return this.mockDataService.withdrawApplication(id);
    }
    return this.http.put<ApplicationResponse>(`${this.apiUrl}/${id}/withdraw`, {});
  }

  /**
   * Get applications for a specific job (for job owners)
   */
  getJobApplications(jobId: string): Observable<JobApplication[]> {
    if (this.useMockData) {
      return this.mockDataService.getJobApplications(jobId);
    }
    return this.http.get<JobApplication[]>(`${this.apiUrl}/job/${jobId}`);
  }

  /**
   * Update application status (for job owners)
   */
  updateApplicationStatus(id: string, status: ApplicationStatus): Observable<ApplicationResponse> {
    if (this.useMockData) {
      return this.mockDataService.updateApplicationStatus(id, status);
    }
    return this.http.put<ApplicationResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Get application statistics
   */
  getApplicationStats(): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/stats`);
  }
}
