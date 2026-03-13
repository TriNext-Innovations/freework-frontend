
7) `GET /jobs/search`
- Query: `keyword`, `page`, `size`.
- 200 Response: JobsResponse

Job Model (response)
```
{
  "id": string,
  "title": string,
  "description": string,
  "category": string,
  "budget": number,
  "budgetType": "FIXED"|"HOURLY",
  "deadline": string,              // ISO-8601
  "location": string,
  "locationType": "REMOTE"|"ONSITE"|"HYBRID",
  "skills": string[],
  "status": "OPEN"|"IN_PROGRESS"|"COMPLETED"|"CANCELLED",
  "customerId": string,
  "customerName": string,
  "customerAvatar": string,
  "applicationsCount": number,
  "createdAt": string,             // ISO-8601 (prefer camelCase)
  "updatedAt": string              // ISO-8601
}
```

Applications API
Base: `http://localhost:8080/api/applications`

1) `POST /api/applications` (Freelancer)
- Body (CreateApplicationDto):
```
{
  "jobId": string,
  "message": string,
  "portfolioLink": string?,  // URL
  "coverLetter": string,
  "proposedRate": number?,
  "estimatedDuration": string?
}
```
- 201 Response (ApplicationResponse):
```
{
  "success": true,
  "message": string,
  "application": JobApplication?
}
```

2) `GET /api/applications/my-applications` (Freelancer)
- Query: `status`? ('Pending'|'Accepted'|'Rejected'|'Withdrawn').
- 200 Response: JobApplication[]

3) `GET /api/applications/{id}`
- 200 Response: JobApplication

4) `GET /api/applications/check/{jobId}` (Freelancer)
- 200 Response: boolean

5) `PUT /api/applications/{id}/withdraw` (Freelancer)
- Body: `{}`
- 200 Response (ApplicationResponse): `{ "success": true, "message": string }`

6) `GET /api/applications/job/{jobId}` (Customer)
- 200 Response: JobApplication[]

7) `PUT /api/applications/{id}/status` (Customer)
- Body: `{ "status": "Pending"|"Accepted"|"Rejected"|"Withdrawn" }`
- 200 Response (ApplicationResponse)

8) `GET /api/applications/stats`
- 200 Response: any (counts/metrics by status; define as needed).

JobApplication Model
```
{
  "id": string?,
  "jobId": string,
  "freelancerId": string,
  "message": string,
  "portfolioLink": string?,
  "coverLetter": string,
  "proposedRate": number?,
  "estimatedDuration": string?,
  "status": "Pending"|"Accepted"|"Rejected"|"Withdrawn",
  "appliedAt": string?,   // ISO-8601
  "updatedAt": string?,   // ISO-8601
  "freelancerName": string?,
  "jobTitle": string?
}
```

Implementation Notes
- Enable CORS for `http://localhost:4200` during local development.
- Use camelCase for dates (`createdAt`, `updatedAt`, `appliedAt`) to align with frontend.
- `skills` are passed as a comma-separated list in filters; split server-side.
- Return 201 for creates, 204 for deletes, 200 otherwise.
- Validate and return 400 with `{ error: "ValidationError", message: "..." }` when inputs are invalid.

That’s all the frontend expects for Jobs and Applications. Implement these endpoints and the app will work end-to-end.
