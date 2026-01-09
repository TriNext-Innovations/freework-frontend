# Freework API Specification - Implementation Guide

## Overview
This document provides a comprehensive guide for implementing the Freework backend API based on the frontend Angular application requirements.

## Base URL
- **Development**: `http://localhost:8080`
- **Production**: `https://api.freework.co.za`

## Authentication
All endpoints (except `/auth/login`, `/auth/register`, and `/auth/refresh`) require JWT Bearer token authentication.

**Header**: `Authorization: Bearer <access_token>`

## API Modules

### 1. Authentication Module (`/auth`)

#### Endpoints:
- `POST /auth/login` - User login with email/password
- `POST /auth/register` - Register new user (Customer or Freelancer)
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Invalidate session

#### Key Fields:
- **User Roles**: `CUSTOMER`, `FREELANCER`, `ADMIN`
- **Token Expiry**: 3600 seconds (1 hour)
- **Token Type**: JWT Bearer

#### Database Notes:
- Store `created_at` in snake_case (not camelCase)
- JWT should contain: `sub`, `email`, `role`, `exp`, `iat`

---

### 2. Jobs Module (`/jobs`)

#### Endpoints:
- `GET /jobs` - List all jobs (with pagination & filters)
- `POST /jobs` - Create new job (Customer only)
- `GET /jobs/{id}` - Get job details
- `PUT /jobs/{id}` - Update job (Owner only)
- `DELETE /jobs/{id}` - Delete job (Owner only)
- `GET /jobs/my-jobs` - Get current user's posted jobs
- `GET /jobs/search` - Search jobs by keyword
- `GET /jobs/category/{category}` - Filter by category
- `PATCH /jobs/{id}/status` - Update job status

#### Job Statuses:
- `OPEN` - Accepting applications
- `IN_PROGRESS` - Work in progress
- `COMPLETED` - Job finished
- `CANCELLED` - Job cancelled

#### Job Categories:
- Web Development
- Mobile Development
- Design & Creative
- Writing & Content
- Marketing
- Data Science
- DevOps & IT
- Consulting
- Other

#### Pagination:
- Default page size: 10
- Use Spring Boot Pageable pattern
- Return: `content`, `totalElements`, `totalPages`, `size`, `number`

#### Database Schema Notes:
```sql
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    budget_type VARCHAR(20) CHECK (budget_type IN ('FIXED', 'HOURLY')),
    deadline TIMESTAMP NOT NULL,
    location VARCHAR(255),
    location_type VARCHAR(20) CHECK (location_type IN ('REMOTE', 'ONSITE', 'HYBRID')),
    skills TEXT[], -- PostgreSQL array
    status VARCHAR(20) DEFAULT 'OPEN',
    posted_by_id BIGINT REFERENCES users(id),
    posted_by_email VARCHAR(255),
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3. Applications Module (`/api/applications`)

#### Endpoints:
- `POST /api/applications` - Submit application (Freelancer only)
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/{id}` - Get application details
- `GET /api/applications/check/{jobId}` - Check if already applied
- `PUT /api/applications/{id}/withdraw` - Withdraw application
- `GET /api/applications/job/{jobId}` - Get applications for job (Owner only)
- `PUT /api/applications/{id}/status` - Update status (Owner only)
- `GET /api/applications/stats` - Get application statistics

#### Application Statuses:
- `Pending` - Awaiting review
- `Accepted` - Application accepted
- `Rejected` - Application rejected
- `Withdrawn` - Freelancer withdrew

#### Business Rules:
- Freelancer can only apply once per job
- Only job owner can accept/reject applications
- Freelancer can withdraw before acceptance
- Increment job's `applications_count` on new application

---

### 4. Profiles Module (`/api/profiles`)

#### Endpoints:
- `GET /api/profiles/me` - Get current user's profile
- `PUT /api/profiles/me` - Update current user's profile
- `GET /api/profiles/user/{userId}` - Get public profile
- `POST /api/profiles/upload-picture` - Upload profile picture

#### Profile Types:
**FreelancerProfile**:
- Basic info + title, hourlyRate, skills, experience, education
- Portfolio items, certifications, languages
- Availability status, rating, completed jobs count

**CustomerProfile**:
- Basic info + company, companySize, industry
- Rating, total jobs posted, verified payment status

#### File Upload:
- Accept: image/jpeg, image/png, image/webp
- Max size: 5MB
- Store in cloud storage (AWS S3 / Cloudinary)
- Return public URL

---

### 5. Reviews Module (`/api/reviews`)

#### Endpoints:
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/{reviewId}` - Get review details
- `PUT /api/reviews/{reviewId}` - Update review (Owner only)
- `DELETE /api/reviews/{reviewId}` - Delete review
- `GET /api/reviews/job/{jobId}` - Reviews for job
- `GET /api/reviews/user/{userId}` - Reviews for user (as reviewee)
- `GET /api/reviews/summary/{type}/{targetId}` - Aggregated stats
- `GET /api/reviews/stats/user/{userId}` - User review statistics
- `POST /api/reviews/{reviewId}/helpful` - Mark as helpful

#### Review Types:
- `FREELANCER_REVIEW` - Customer reviews freelancer
- `CUSTOMER_REVIEW` - Freelancer reviews customer

#### Review Statuses:
- `PENDING` - Awaiting moderation
- `APPROVED` - Approved and visible
- `REJECTED` - Rejected by moderator
- `FLAGGED` - Flagged for review

#### Business Rules:
- Can only review after job completion
- One review per user per job
- Rating: 1-5 stars
- Calculate average rating and distribution
- Support pros/cons lists
- Allow review responses

---

### 6. Payments Module (`/api/payments`)

#### Endpoints:
- `GET /api/payments` - Get user's payments
- `GET /api/payments/{paymentId}` - Get payment details
- `GET /api/payments/job/{jobId}` - Payments for job
- `POST /api/payments/intent` - Create Stripe payment intent
- `POST /api/payments/escrow` - Create escrow payment
- `POST /api/payments/release` - Release payment to freelancer
- `POST /api/payments/refund` - Refund payment
- `POST /api/payments/{paymentId}/confirm` - Confirm payment
- `POST /api/payments/milestones` - Create milestone
- `GET /api/payments/milestones/job/{jobId}` - Get job milestones

#### Payment Statuses:
- `PENDING` - Payment initiated
- `PROCESSING` - Being processed
- `COMPLETED` - Successfully completed
- `FAILED` - Payment failed
- `REFUNDED` - Refunded to customer
- `ESCROWED` - Held in escrow
- `RELEASED` - Released to freelancer
- `CANCELLED` - Cancelled

#### Payment Methods:
- `STRIPE` - Stripe payment
- `PAYPAL` - PayPal payment
- `CREDIT_CARD` - Credit card
- `DEBIT_CARD` - Debit card

#### Payment Types:
- `JOB_ESCROW` - Full job payment in escrow
- `MILESTONE` - Milestone payment
- `RELEASE` - Release from escrow
- `REFUND` - Refund to customer

#### Integration:
- **Stripe**: Use Stripe Payment Intents API
- **Currency**: ZAR (South African Rand)
- **Escrow Logic**: Hold funds until job completion
- **Release**: Requires customer approval or auto-release

---

### 7. Messaging Module (`/api/messages`)

#### Endpoints:
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversations/{conversationId}` - Get conversation
- `GET /api/messages/conversations/{conversationId}/messages` - Get messages
- `POST /api/messages/send` - Send message
- `PUT /api/messages/conversations/{conversationId}/read` - Mark as read
- `POST /api/messages/conversations/start/{userId}` - Start conversation
- `GET /api/messages/unread-count` - Get unread count
- `GET /api/messages/search` - Search messages
- `DELETE /api/messages/{messageId}` - Delete message

#### Message Types:
- `TEXT` - Text message
- `IMAGE` - Image attachment
- `FILE` - File attachment
- `SYSTEM` - System notification

#### WebSocket Integration:
**Endpoint**: `ws://localhost:8080/ws`

**Topics**:
- `/user/queue/messages` - Private messages
- `/topic/typing/{conversationId}` - Typing indicators

**Events**:
- Send message
- Mark as read
- Typing indicator
- Online/offline status

#### Real-time Features:
- New message notifications
- Unread count updates
- Typing indicators
- Message delivery status

---

## Common Response Patterns

### Success Response:
```json
{
  "data": { ... },
  "message": "Success",
  "timestamp": "2024-12-12T10:00:00Z"
}
```

### Error Response:
```json
{
  "timestamp": "2024-12-12T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for field 'email'",
  "path": "/auth/register"
}
```

### Paginated Response:
```json
{
  "content": [...],
  "totalElements": 100,
  "totalPages": 10,
  "size": 10,
  "number": 0
}
```

---

## Database Naming Conventions

### Tables: snake_case
- `users`
- `jobs`
- `job_applications`
- `freelancer_profiles`
- `customer_profiles`
- `reviews`
- `payments`
- `milestones`
- `conversations`
- `messages`

### Columns: snake_case
- `created_at`, `updated_at`
- `first_name`, `last_name`
- `posted_by_id`, `posted_by_email`
- `budget_type`, `location_type`

### JSON Response: camelCase
Frontend expects camelCase, so map in DTOs:
- `created_at` → `createdAt`
- `posted_by_id` → `postedById`

---

## Security Considerations

### Authentication:
- Use BCrypt for password hashing
- JWT tokens with RS256 algorithm
- Refresh token rotation
- Token blacklist for logout

### Authorization:
- Role-based access control (RBAC)
- Resource ownership validation
- API rate limiting

### Data Protection:
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

---

## Required Dependencies (Spring Boot)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Stripe -->
    <dependency>
        <groupId>com.stripe</groupId>
        <artifactId>stripe-java</artifactId>
        <version>23.0.0</version>
    </dependency>
    
    <!-- File Upload -->
    <dependency>
        <groupId>com.amazonaws</groupId>
        <artifactId>aws-java-sdk-s3</artifactId>
        <version>1.12.500</version>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

---

## Environment Variables

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/freework
spring.datasource.username=freework_user
spring.datasource.password=${DB_PASSWORD}

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=3600000
jwt.refresh-expiration=86400000

# Stripe
stripe.api.key=${STRIPE_SECRET_KEY}
stripe.webhook.secret=${STRIPE_WEBHOOK_SECRET}

# AWS S3
aws.access.key=${AWS_ACCESS_KEY}
aws.secret.key=${AWS_SECRET_KEY}
aws.s3.bucket=freework-uploads
aws.region=af-south-1

# CORS
cors.allowed.origins=http://localhost:4200,https://freework.co.za

# Email (for notifications)
spring.mail.host=${SMTP_HOST}
spring.mail.username=${SMTP_USERNAME}
spring.mail.password=${SMTP_PASSWORD}
```

---

## Testing Checklist

### Authentication:
- [ ] User registration (Customer & Freelancer)
- [ ] Login with email/password
- [ ] Token refresh
- [ ] Logout and token invalidation

### Jobs:
- [ ] Create job (Customer only)
- [ ] List jobs with pagination
- [ ] Filter by category, location, skills
- [ ] Search jobs
- [ ] Update job (Owner only)
- [ ] Delete job (Owner only)

### Applications:
- [ ] Submit application (Freelancer only)
- [ ] Prevent duplicate applications
- [ ] List applications
- [ ] Accept/reject applications (Owner only)
- [ ] Withdraw application

### Profiles:
- [ ] Get profile
- [ ] Update profile
- [ ] Upload profile picture
- [ ] View public profiles

### Reviews:
- [ ] Create review after job completion
- [ ] Prevent duplicate reviews
- [ ] Calculate rating statistics
- [ ] Mark review as helpful

### Payments:
- [ ] Create Stripe payment intent
- [ ] Escrow payment
- [ ] Release payment
- [ ] Refund payment
- [ ] Milestone tracking

### Messaging:
- [ ] Start conversation
- [ ] Send message
- [ ] Real-time message delivery (WebSocket)
- [ ] Mark as read
- [ ] Unread count

---

## API Documentation Tools

Use the `freework-api-spec.yaml` file with:

1. **Swagger UI**: Import into Spring Boot
   ```java
   @Configuration
   @OpenAPIDefinition(info = @Info(title = "Freework API", version = "1.0"))
   public class OpenApiConfig {}
   ```

2. **Postman**: Import the OpenAPI spec file

3. **Stoplight Studio**: For API design and documentation

4. **ReDoc**: Generate beautiful documentation

---

## Support & Contact

- **API Spec File**: `freework-api-spec.yaml`
- **Domain**: freework.co.za
- **Backend Port**: 8080
- **Frontend Port**: 4200

---

## Notes for Backend Developer

1. **Database Schema**: Use snake_case for tables/columns, map to camelCase in DTOs
2. **Currency**: All amounts in ZAR (South African Rand)
3. **Timezone**: Store all timestamps in UTC
4. **File Storage**: Use AWS S3 or Cloudinary for uploads
5. **WebSocket**: Required for real-time messaging
6. **Email**: Send notifications for job applications, payments, messages
7. **Rate Limiting**: Implement on auth endpoints
8. **Logging**: Log all payment transactions and sensitive operations
9. **Audit Trail**: Track who created/updated records
10. **Data Validation**: Validate all inputs server-side

---

Generated: December 12, 2024

