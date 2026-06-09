import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobApplication, CreateApplicationDto, ApplicationResponse, ApplicationStatus } from './models/application.models';
import { buildApiEndpointUrl } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = buildApiEndpointUrl('/applications');

  constructor(private http: HttpClient) {}

  submitApplication(application: CreateApplicationDto): Observable<ApplicationResponse> {
    return this.http.post<ApplicationResponse>(this.apiUrl, application);
  }

  getMyApplications(status?: ApplicationStatus): Observable<JobApplication[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<JobApplication[]>(`${this.apiUrl}/my-applications`, { params });
  }

  getApplicationById(id: string): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }

  hasApplied(jobId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${jobId}`);
  }

  withdrawApplication(id: string): Observable<ApplicationResponse> {
    return this.http.put<ApplicationResponse>(`${this.apiUrl}/${id}/withdraw`, {});
  }

  getJobApplications(jobId: string): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/job/${jobId}`);
  }

  updateApplicationStatus(id: string, status: ApplicationStatus): Observable<ApplicationResponse> {
    return this.http.put<ApplicationResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  getApplicationStats(): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/stats`);
  }
}
