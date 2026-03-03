# Copilot Prompt for Backend Implementation

Copy and paste this prompt to GitHub Copilot or Claude for your backend implementation:

---

## PROMPT FOR BACKEND COPILOT:

I need to implement a profile completion feature for my Spring Boot backend. Here are the requirements:

### 1. Database Schema
Add a `profile_completed` column to the `users` table:
- Type: BOOLEAN
- Default value: FALSE (new users need to complete profile)
- Not null

### 2. User Entity Updates
Update the User entity to include:
```java
@Column(name = "profile_completed", nullable = false)
private Boolean profileCompleted = false;
```

### 3. Authentication Responses Must Include `profileCompleted`

**Login Response (`POST /auth/login`):**
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "...",
    "email": "...",
    "firstName": "...",
    "lastName": "...",
    "role": "FREELANCER",
    "profileCompleted": false
  }
}
```

**Registration Response (`POST /auth/register`):**
- New users should have `profileCompleted = false`
- Response should include the user object with `profileCompleted` field

### 4. Profile Endpoints

**GET `/api/profile`** - Get current user's profile
- Must include `profileCompleted` field in response
- Requires JWT authentication

**PUT `/api/profile`** - Update profile
- Should auto-detect if profile is now complete
- Update User.profileCompleted to true if requirements are met
- Return updated profile with profileCompleted status

**POST `/api/profile/mark-completed`** - Explicitly mark profile as complete
- Validates that profile meets requirements
- Sets User.profileCompleted = true
- Returns success response

### 5. Profile Completion Requirements

**For FREELANCER role, profile is complete when:**
- firstName is not empty
- lastName is not empty
- email is not empty
- skills array has at least 1 item
- title OR hourlyRate is set (at least one)

**For CUSTOMER role, profile is complete when:**
- firstName is not empty
- lastName is not empty
- email is not empty
- company OR industry is set (at least one)

### 6. JWT Token (Optional but Recommended)
Include `profileCompleted` as a claim in the JWT token:
```java
.claim("profileCompleted", user.getProfileCompleted())
```

### 7. DTOs to Update

**UserDTO:**
```java
private Boolean profileCompleted;
```

**ProfileDTO:**
```java
private Boolean profileCompleted;
```

**AuthResponse:**
```java
private UserDTO user; // Must include profileCompleted
```

---

## ENDPOINTS SUMMARY:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/login | Login (include profileCompleted in response) | No |
| POST | /auth/register | Register (set profileCompleted = false) | No |
| GET | /api/profile | Get current user profile | Yes |
| GET | /api/profile/user/{userId} | Get profile by user ID | No |
| PUT | /api/profile | Update profile (auto-detect completion) | Yes |
| POST | /api/profile/mark-completed | Mark profile as completed | Yes |

---

## VALIDATION LOGIC:

Create a method to check profile completion:
```java
private boolean checkProfileCompletion(Profile profile, Role role) {
    boolean hasBasicInfo = isNotEmpty(profile.getFirstName()) 
        && isNotEmpty(profile.getLastName())
        && isNotEmpty(profile.getEmail());
    
    if (role == Role.FREELANCER) {
        return hasBasicInfo 
            && profile.getSkills() != null && !profile.getSkills().isEmpty()
            && (isNotEmpty(profile.getTitle()) || profile.getHourlyRate() != null);
    } else if (role == Role.CUSTOMER) {
        return hasBasicInfo 
            && (isNotEmpty(profile.getCompany()) || isNotEmpty(profile.getIndustry()));
    }
    
    return hasBasicInfo;
}
```

---

## MIGRATION SQL:

```sql
-- For PostgreSQL
ALTER TABLE users 
ADD COLUMN profile_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- For MySQL
ALTER TABLE users 
ADD COLUMN profile_completed TINYINT(1) NOT NULL DEFAULT 0;

-- Set existing users to completed (optional)
UPDATE users SET profile_completed = TRUE WHERE created_at < NOW();
```

---

## EXPECTED BEHAVIOR:

1. New user registers → profileCompleted = false
2. User logs in → Response includes profileCompleted status
3. Frontend redirects to profile edit if profileCompleted = false
4. User updates profile → Backend checks if now complete
5. If complete → Set profileCompleted = true automatically
6. OR user can call /mark-completed endpoint explicitly
7. User can now access all features

---

Please implement these changes in my Spring Boot backend. Make sure all authentication and profile endpoints return the `profileCompleted` field, and that new users default to `profileCompleted = false`.
