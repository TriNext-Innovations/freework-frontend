---
liquid: false
---

# Job Application Guide

## Overview

The job application system allows freelancers to apply to jobs and clients to review and manage applications. This includes proposal submission, application tracking, and status management.

## Features

- **Submit Applications** - Freelancers can apply with proposals
- **Track Applications** - View application status
- **Manage Applications** - Clients can review and accept/reject
- **Proposal System** - Include cover letter and rate
- **Application History** - Complete application timeline

## Application Lifecycle

```
PENDING → ACCEPTED → HIRED
  ↓
REJECTED
```

- **PENDING** - Application submitted, awaiting review
- **ACCEPTED** - Client interested, negotiations may begin
- **REJECTED** - Application not selected
- **HIRED** - Freelancer awarded the job

## Data Models

```typescript
interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  freelancerId: string;
  freelancerName: string;
  freelancerEmail: string;
  coverLetter: string;
  proposedRate: number;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  freelancerSkills?: string[];
  freelancerRating?: number;
}

type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'hired';

interface CreateApplicationRequest {
  jobId: string;
  coverLetter: string;
  proposedRate: number;
}
```

## Usage

### Applying to a Job (Freelancer Only)

```typescript
import { ApplicationService } from '@app/jobs/application.service';
import { CreateApplicationRequest } from '@app/jobs/models';

constructor(private applicationService: ApplicationService) {}

applyToJob(jobId: string) {
  const application: CreateApplicationRequest = {
    jobId,
    coverLetter: 'I am a perfect fit for this job because...',
    proposedRate: 75
  };

  this.applicationService.createApplication(application).subscribe({
    next: (app) => {
      console.log('Application submitted:', app);
      this.router.navigate(['/my-applications']);
    },
    error: (error) => {
      console.error('Error submitting application:', error);
    }
  });
}
```

### Viewing Applications

```typescript
// Get all applications for a job (Client only)
this.applicationService.getApplicationsForJob(jobId).subscribe(apps => {
  this.applications = apps;
});

// Get freelancer's own applications
this.applicationService.getMyApplications().subscribe(apps => {
  this.myApplications = apps;
});

// Get applications by status
this.applicationService.getMyApplications('pending').subscribe(apps => {
  this.pendingApplications = apps;
});
```

### Managing Applications (Client Only)

```typescript
// Accept an application
this.applicationService.updateApplicationStatus(
  applicationId,
  'accepted'
).subscribe({
  next: () => console.log('Application accepted'),
  error: (error) => console.error('Error:', error)
});

// Reject an application
this.applicationService.updateApplicationStatus(
  applicationId,
  'rejected'
).subscribe({
  next: () => console.log('Application rejected'),
  error: (error) => console.error('Error:', error)
});

// Hire a freelancer (awards the job)
this.applicationService.updateApplicationStatus(
  applicationId,
  'hired'
).subscribe({
  next: () => {
    console.log('Freelancer hired');
    // This also updates the job status to 'in-progress'
  },
  error: (error) => console.error('Error:', error)
});
```

### Checking Application Status

```typescript
// Check if user has already applied to a job
this.applicationService.hasApplied(jobId).subscribe(hasApplied => {
  if (hasApplied) {
    this.showApplyButton = false;
  }
});

// Get specific application
this.applicationService.getApplication(applicationId).subscribe(app => {
  this.application = app;
});
```

### Withdrawing an Application

```typescript
this.applicationService.deleteApplication(applicationId).subscribe({
  next: () => console.log('Application withdrawn'),
  error: (error) => console.error('Error:', error)
});
```

## Components

### JobApplicationComponent
- Application form for freelancers
- Cover letter input
- Proposed rate input
- Form validation
- Submit functionality

### MyApplicationsComponent
- List of freelancer's applications
- Filter by status
- View application details
- Withdraw option

### ApplicationListComponent (in JobDetailComponent)
- Shows all applications for a job (client view)
- Freelancer profile preview
- Accept/reject buttons
- Sort and filter options

## Validation Rules

- **Cover Letter**: Required, minimum 100 characters
- **Proposed Rate**: Required, must be greater than 0
- **No Duplicate Applications**: Can only apply once per job
- **Job Must Be Open**: Cannot apply to closed/in-progress jobs
- **Freelancers Only**: Only freelancer role can apply

## API Endpoints

```
POST   /api/applications              - Create application (freelancer only)
GET    /api/applications/my           - Get freelancer's applications
GET    /api/applications/job/:jobId   - Get applications for job (client only)
GET    /api/applications/:id          - Get single application
PUT    /api/applications/:id/status   - Update application status (client only)
DELETE /api/applications/:id          - Delete application (withdraw)
GET    /api/applications/check/:jobId - Check if already applied
```

## Template Examples

### Application Form

{% raw %}
```html
<form [formGroup]="applicationForm" (ngSubmit)="onSubmit()">
  <h2>Apply to {{ job?.title }}</h2>
  
  <div class="form-group">
    <label>Cover Letter</label>
    <textarea 
      formControlName="coverLetter"
      placeholder="Explain why you're the best fit..."
      rows="10">
    </textarea>
    @if (applicationForm.get('coverLetter')?.invalid && 
         applicationForm.get('coverLetter')?.touched) {
      <span class="error">Cover letter must be at least 100 characters</span>
    }
  </div>

  <div class="form-group">
    <label>Proposed Rate (per hour)</label>
    <input 
      type="number" 
      formControlName="proposedRate"
      placeholder="Your hourly rate">
    @if (applicationForm.get('proposedRate')?.invalid && 
         applicationForm.get('proposedRate')?.touched) {
      <span class="error">Please enter a valid rate</span>
    }
  </div>

  <button 
    type="submit" 
    [disabled]="!applicationForm.valid || isSubmitting">
    {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
  </button>
</form>
```
{% endraw %}

### Application List (Client View)

{% raw %}
```html
<div class="applications">
  <h3>Applications ({{ applications.length }})</h3>
  
  @for (app of applications; track app.id) {
    <div class="application-card">
      <div class="freelancer-info">
        <h4>{{ app.freelancerName }}</h4>
        <p>{{ app.freelancerEmail }}</p>
        @if (app.freelancerRating) {
          <div class="rating">⭐ {{ app.freelancerRating }}/5</div>
        }
      </div>

      <div class="proposal">
        <p><strong>Proposed Rate:</strong> ${{ app.proposedRate }}/hr</p>
        <p><strong>Cover Letter:</strong></p>
        <p>{{ app.coverLetter }}</p>
      </div>

      <div class="status">
        <span class="badge" [class]="app.status">{{ app.status }}</span>
      </div>

      @if (app.status === 'pending') {
        <div class="actions">
          <button (click)="acceptApplication(app.id)">Accept</button>
          <button (click)="rejectApplication(app.id)">Reject</button>
          <button (click)="hireFreelancer(app.id)" class="primary">
            Hire
          </button>
        </div>
      }
    </div>
  }

  @if (applications.length === 0) {
    <p class="no-applications">No applications yet</p>
  }
</div>
```
{% endraw %}

### My Applications (Freelancer View)

{% raw %}
```html
<div class="my-applications">
  <h2>My Applications</h2>

  <div class="filters">
    <button (click)="filterByStatus('all')">All</button>
    <button (click)="filterByStatus('pending')">Pending</button>
    <button (click)="filterByStatus('accepted')">Accepted</button>
    <button (click)="filterByStatus('rejected')">Rejected</button>
  </div>

  @for (app of filteredApplications; track app.id) {
    <div class="application-card">
      <h3>{{ app.jobTitle }}</h3>
      <p><strong>Applied:</strong> {{ app.createdAt | date }}</p>
      <p><strong>Status:</strong> 
        <span class="badge" [class]="app.status">{{ app.status }}</span>
      </p>
      <p><strong>Proposed Rate:</strong> ${{ app.proposedRate }}/hr</p>
      
      <div class="actions">
        <button routerLink="/jobs/{{ app.jobId }}">View Job</button>
        @if (app.status === 'pending') {
          <button (click)="withdrawApplication(app.id)">Withdraw</button>
        }
      </div>
    </div>
  }
</div>
```
{% endraw %}

## Notifications

When application status changes:
- Freelancer receives notification when accepted/rejected/hired
- Client receives notification when new application submitted

## Best Practices

### For Freelancers
1. **Personalize Cover Letters**: Reference specific job requirements
2. **Be Professional**: Use proper grammar and formatting
3. **Set Competitive Rates**: Research market rates
4. **Highlight Relevant Skills**: Match job requirements
5. **Be Responsive**: Check application status regularly

### For Clients
1. **Review Thoroughly**: Check freelancer profiles and ratings
2. **Communicate Clearly**: Ask questions before hiring
3. **Be Timely**: Review applications within 48 hours
4. **Give Feedback**: Even for rejected applications
5. **One Hire Per Job**: Only hire one freelancer per job

## Common Workflows

### Freelancer Application Flow
1. Browse jobs
2. Find suitable job
3. Click "Apply"
4. Write personalized cover letter
5. Set proposed rate
6. Submit application
7. Monitor status in "My Applications"
8. Respond if accepted

### Client Review Flow
1. Create job posting
2. Receive application notifications
3. Review applications in job details
4. Compare freelancer profiles
5. Accept promising candidates
6. Interview/negotiate if needed
7. Hire selected freelancer
8. Job status changes to "in-progress"

## Related Documentation

- [Job Management Guide](JOB_MANAGEMENT_GUIDE.md) - Creating and managing jobs
- [Messaging Guide](MESSAGING_SYSTEM_GUIDE.md) - Communicating with applicants
