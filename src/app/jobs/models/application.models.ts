// FIX #9: ApplicationStatus values changed from title-case to ALL_CAPS to match backend enum.
// Backend returns: PENDING, ACCEPTED, REJECTED, WITHDRAWN
// Previous incorrect values were: 'Pending', 'Accepted', 'Rejected', 'Withdrawn'
export interface JobApplication {
  id?: string;
  jobId: string;
  freelancerId: string;
  message: string;
  portfolioLink?: string;
  coverLetter: string;
  proposedRate?: number;
  estimatedDuration?: string;
  status: ApplicationStatus;
  appliedAt?: Date;
  updatedAt?: Date;
  freelancerName?: string;
  jobTitle?: string;
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface CreateApplicationDto {
  jobId: string;
  message: string;
  portfolioLink?: string;
  coverLetter: string;
  proposedRate?: number;
  estimatedDuration?: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  application?: JobApplication;
}
