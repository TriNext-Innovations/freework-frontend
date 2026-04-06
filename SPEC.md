# Frontend Specification — Freework

API contract, route map, auth flow, and data models for the Freework Angular application.

---

## API Connection

The frontend connects to the Freework backend REST API.

| Environment | API Base URL |
|-------------|-------------|
| Development | `http://localhost:8080` |
| Production | `https://api.freework.co.za` |

All API calls go through `buildApiUrl()` / `buildApiEndpointUrl()` from `api.config.ts`:

```typescript
buildApiUrl('/auth')           // → {apiUrl}/auth
buildApiEndpointUrl('/profile') // → {apiUrl}/api/profile
```

---

## Authentication Contract

### POST `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (expected by frontend):**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "42",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "FREELANCER",
    "profileCompleted": false
  }
}
```

> **Note:** `profileCompleted` is required. If `false`, the user is redirected to `/profile/setup`.

The frontend also handles `token` (legacy) as an alias for `accessToken`.

---

### POST `/auth/register`

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "Password123!",
  "role": "FREELANCER"
}
```

**Response:** Same shape as login. `profileCompleted` should be `false` for new users.

---

### GET `/auth/verify?token=<verification-token>`

On success, returns a JWT and auto-logs the user in (same response shape as login).

---

### Token usage

The `token.interceptor.ts` attaches the Bearer token to every non-auth request:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
Accept: application/json
```

Skipped for: `/auth/login`, `/auth/register`, `/auth/verify`, `/auth/refresh`

---

### Token refresh

Interceptor catches `401` responses and calls `POST /auth/refresh`:

```json
Request: { "refreshToken": "eyJ..." }
Response: { "accessToken": "eyJ...", "refreshToken": "eyJ..." }
```

If refresh fails, the user is logged out.

> **Note:** The backend `/auth/refresh` endpoint is expected but not yet implemented. This is a known gap tracked in [PRODUCTION_READY.md](./PRODUCTION_READY.md).

---

## Profile Contract

### GET `/api/profile` *(auth required)*

**Response (expected fields):**
```json
{
  "id": "profile-123",
  "userId": "42",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "FREELANCER",
  "title": "Full Stack Developer",
  "bio": "...",
  "skills": ["Angular", "Java"],
  "hourlyRate": 75.00,
  "profileCompleted": true,
  "profilePictureUrl": "https://...",
  "createdAt": "2025-01-01T00:00:00",
  "updatedAt": "2025-01-15T00:00:00"
}
```

Profile completion rules:
- **Freelancer:** `firstName`, `lastName`, `email`, `skills[]`, and (`title` or `hourlyRate`) must be set
- **Customer:** `firstName`, `lastName`, `email`, and (`company` or `industry`) must be set

---

### PUT `/api/profile` *(auth required)*

Updates profile fields. Should auto-detect completion and return updated `profileCompleted` value.

---

### POST `/api/profile/mark-completed` *(auth required)*

Explicitly marks profile as complete.

**Response:** `{ "success": true, "profileCompleted": true }`

---

## Job Contract

### GET `/jobs` *(public)*

Query params: `category`, `minBudget`, `maxBudget`, `deadlineBefore`, `status`, `title`, `page`, `size`, `sort`

**Response:** Spring `Page<JobResponse>` with `content[]`, `totalElements`, `totalPages`

### GET `/jobs/:id` *(public)*

### POST `/jobs` *(auth required)*

### PUT `/jobs/:id` *(auth required — owner or ADMIN)*

### DELETE `/jobs/:id` *(auth required — owner or ADMIN)*

---

## Application Contract

### POST `/jobs/:jobId/apply` *(auth required)*

```json
{ "proposal": "I can deliver in 5 days." }
```

### GET `/jobs/:jobId/applications` *(auth required — job owner or ADMIN)*

### PUT `/applications/:applicationId` *(auth required — job owner or ADMIN)*

```json
{ "status": "ACCEPTED" }
```

---

## Messaging Contract

### POST `/messages` *(auth required)*

```json
{ "receiverId": 42, "content": "Are you available?" }
```

### GET `/messages?userId=:otherUserId` *(auth required)*

Returns conversation ordered by timestamp ascending.

---

## Application Routes

| Path | Guard | Component |
|------|-------|-----------|
| `/` | — | Redirects to `/jobs` |
| `/jobs` | — | Job listing |
| `/jobs/:id` | — | Job detail |
| `/jobs/new` | Auth + ProfileComplete | Post job |
| `/login` | — | Login |
| `/register` | — | Register |
| `/verify-email` | — | Email verification |
| `/profile/setup` | Auth | Profile setup wizard (first time) |
| `/profile` | Auth | Profile view/edit |
| `/applications` | Auth | My applications |
| `/messages` | Auth | Messages inbox |
| `/messages/:userId` | Auth | Conversation |
| `/subscription` | Auth | Subscription management |
| `/subscription/success` | — | Payment success |
| `/subscription/cancel` | — | Payment cancelled |
| `/admin` | Auth + ADMIN | Admin panel |
| `/settings` | Auth | Account settings |
| `/404` | — | Not found |
| `/**` | — | Redirects to `/404` |

---

## Data Models (TypeScript)

### User

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'FREELANCER' | 'ADMIN';
  avatar?: string;
  profilePicture?: string;
  profileCompleted?: boolean;
  createdAt: string;
}
```

### AuthResponse

```typescript
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}
```

### TokenPayload (JWT claims)

```typescript
interface TokenPayload {
  sub: string;         // email
  roles: string;       // e.g. "ROLE_FREELANCER"
  profileCompleted: boolean;
  iat: number;
  exp: number;
  // Optional extended claims
  email?: string;
  firstName?: string;
  lastName?: string;
}
```

---

## State Management

Auth state is managed in `AuthService` via `BehaviorSubject<User | null>`:

```typescript
authService.currentUser$     // Observable<User | null>
authService.isAuthenticated  // boolean (checks token expiry)
authService.currentUserValue // User | null (sync)
```

Cross-tab sync via `BroadcastChannel('freework_auth')`:
- `LOGIN` event: updates state and redirects
- `LOGOUT` event: clears state

---

## Profile Completion Flow

```
Register / Login
       ↓
profileCompleted === false?
       ↓ Yes               ↓ No
/profile/setup          /jobs (full access)
       ↓
Complete required fields
       ↓
PUT /api/profile
POST /api/profile/mark-completed
       ↓
/jobs (full access)
```

---

## Error Handling

The token interceptor propagates HTTP errors as `HttpErrorResponse`. Components handle:

| Status | Handling |
|--------|---------|
| `401` | Token refresh → retry, or logout |
| `403` | Display forbidden message |
| `404` | Navigate to `/404` |
| `400` | Display validation errors from `ApiError.message` |
| `500` | Display generic error message |

Backend error shape:
```json
{
  "timestamp": "...",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already in use"
}
```
