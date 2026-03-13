# Profile Completion Flow Guide

## Overview

The profile completion flow ensures that new users complete their profile information before they can access core features like posting jobs, applying for jobs, or messaging.

## Features

### 1. **Profile Completion Status**
- New `profileCompleted` field in the User model
- Tracks whether a user has completed their initial profile setup
- Defaults to `false` for new registrations, `true` for existing users

### 2. **Post-Registration Flow**
When a user registers:
1. Account is created with `profileCompleted: false`
2. User is automatically redirected to `/profile/edit?firstTime=true`
3. User must complete required profile fields
4. Profile is marked as complete upon saving
5. User is redirected to the jobs page to start using the platform

### 3. **Post-Login Flow**
When a user logs in:
1. System checks `profileCompleted` status
2. If `profileCompleted: false`, redirect to `/profile/edit?firstTime=true`
3. If `profileCompleted: true`, redirect based on user role:
   - **Freelancers**: `/jobs` (browse and apply for jobs)
   - **Customers**: `/jobs` (view jobs and post new ones)

### 4. **Route Protection**
Routes that require a completed profile are protected with the `requireCompleteProfile` guard:
- Job posting (`/jobs/new`)
- Job applications (`/jobs/:id/apply`)
- Job editing (`/jobs/:id/edit`)
- My Jobs/Applications pages
- Messaging system
- Payment features

If a user tries to access these routes without a completed profile, they are redirected to `/profile/edit?firstTime=true`

## Implementation Details

### Modified Files

#### 1. **Auth Models** (`auth/models/auth.models.ts`)
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'FREELANCER' | 'ADMIN';
  profilePicture?: string;
  avatar?: string;
  profileCompleted?: boolean; // NEW FIELD
  createdAt: string;
}
```

#### 2. **Profile Completion Guard** (`profile/profile-completion.guard.ts`)
New guard that checks if user has completed their profile:
- `requireCompleteProfile` - Redirects to profile edit if incomplete
- Preserves return URL for redirecting after completion

#### 3. **Auth Service** (`auth/auth.service.ts`)
New methods:
- `getPostLoginRedirectUrl()` - Determines where to redirect after login
- `updateCurrentUser(user: User)` - Updates user state (used by profile service)

Updated methods:
- `normalizeUser()` - Includes `profileCompleted` field from API response

#### 4. **Profile Service** (`profile/profile.service.ts`)
New methods:
- `markProfileAsCompleted()` - Marks profile as complete
- `isProfileComplete(profile: Profile)` - Validates required fields
- `updateAuthUserProfile(profile: Profile)` - Syncs profile status with auth service

#### 5. **Profile Edit Component** (`profile/profile-edit/`)
New features:
- Detects `firstTime` query parameter
- Shows welcome banner for first-time users
- Hides cancel button for first-time users (must complete)
- Different button text and messaging
- Automatically marks profile complete on save
- Redirects to jobs page after completion

#### 6. **Login Component** (`auth/login/login.component.ts`)
Updated redirect logic:
- Checks `profileCompleted` status after login
- Redirects to profile edit if incomplete
- Otherwise uses role-based redirect

#### 7. **Register Component** (`auth/register/register.component.ts`)
Updated flow:
- Redirects to `/profile/edit?firstTime=true` after successful registration
- User completes profile before accessing main features

#### 8. **Routes** (`app.routes.ts`)
Added `requireCompleteProfile` guard to protected routes:
- All job posting and application routes
- Messaging routes
- Payment routes
- My Jobs/Applications routes

## Profile Completion Requirements

### For Freelancers
Required fields:
- ✅ First Name
- ✅ Last Name
- ✅ Email
- ✅ At least one skill
- ✅ Title OR Hourly Rate

Optional but recommended:
- Bio
- Location
- Experience
- Education
- Portfolio items
- Languages

### For Customers
Required fields:
- ✅ First Name
- ✅ Last Name
- ✅ Email
- ✅ Company OR Industry

Optional but recommended:
- Bio
- Location
- Company size
- Website
- Phone

## User Experience Flow

### New User Registration

```
1. User visits /register
   ↓
2. User fills out registration form
   ↓
3. Account created with profileCompleted: false
   ↓
4. Redirect to /profile/edit?firstTime=true
   ↓
5. User sees welcome banner
   ↓
6. User completes required profile fields
   ↓
7. User clicks "Complete Profile"
   ↓
8. Profile marked as complete
   ↓
9. Redirect to /jobs
   ↓
10. User can now access all features
```

### Returning User Login

```
1. User visits /login
   ↓
2. User enters credentials
   ↓
3. System checks profileCompleted status
   ↓
4. IF profileCompleted === false:
   → Redirect to /profile/edit?firstTime=true
   
   IF profileCompleted === true:
   → Redirect to /jobs
```

### Accessing Protected Features

```
1. User tries to access protected route (e.g., /jobs/new)
   ↓
2. requireCompleteProfile guard checks status
   ↓
3. IF profileCompleted === false:
   → Redirect to /profile/edit?firstTime=true&returnUrl=/jobs/new
   → After completion, redirect back to /jobs/new
   
   IF profileCompleted === true:
   → Allow access to route
```

## Backend API Requirements

Your backend API should support:

### 1. **User Registration Response**
```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "FREELANCER",
    "profileCompleted": false  // Important!
  }
}
```

### 2. **Profile Update Endpoint**
```
PUT /api/profile
```
Should automatically detect when required fields are filled and update `profileCompleted` status.

### 3. **Mark Profile Completed Endpoint**
```
POST /api/profile/mark-completed
```
Explicitly marks profile as completed.

### 4. **User Profile Response**
```json
{
  "id": "profile-123",
  "userId": "user-123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "role": "FREELANCER",
  "profileCompleted": true,
  // ... other profile fields
}
```

## Testing

### Test Scenarios

1. **New User Registration**
   - Register a new account
   - Verify redirect to profile edit with welcome banner
   - Try to cancel (should show error)
   - Complete profile with required fields
   - Verify redirect to jobs page

2. **Incomplete Profile Login**
   - Create user with `profileCompleted: false`
   - Login
   - Verify redirect to profile edit

3. **Complete Profile Login**
   - Create user with `profileCompleted: true`
   - Login
   - Verify redirect to jobs page

4. **Protected Route Access**
   - Login with incomplete profile
   - Try to access `/jobs/new`
   - Verify redirect to profile edit
   - Complete profile
   - Verify redirect back to `/jobs/new`

### Mock Data Testing

Set `useMockData = true` in both AuthService and ProfileService to test without backend.

Mock users in AuthService:
```typescript
{
  email: 'john@example.com',
  password: 'password',
  profileCompleted: true  // Change to false for testing
}
```

## UI/UX Features

### Profile Edit Page (First Time)

**Header:**
- "Complete Your Profile" instead of "Edit Profile"
- Welcome message with emoji 🎉

**Banner:**
- Blue info banner explaining what they need to do
- Different message for Freelancers vs Customers

**Buttons:**
- "Complete Profile" instead of "Save Changes"
- No cancel button (must complete)

**Form Validation:**
- All required fields marked clearly
- Helpful error messages
- Real-time validation feedback

## Troubleshooting

### Issue: User stuck in redirect loop
**Solution:** Check that `profileCompleted` is being set correctly in the database and returned in API responses.

### Issue: Guard not redirecting
**Solution:** Verify guards are imported correctly in `app.routes.ts` and user state is being loaded properly.

### Issue: Profile marked complete but still redirecting
**Solution:** Check that `updateCurrentUser()` is being called after profile save to sync the auth service state.

## Future Enhancements

1. **Profile Completion Progress Bar**
   - Show percentage of profile completed
   - Highlight missing optional fields

2. **Skip Optional Fields**
   - Allow users to skip optional fields and complete later
   - Reminder notifications for incomplete profiles

3. **Profile Quality Score**
   - Rate profile completeness
   - Suggest improvements

4. **Onboarding Tutorial**
   - Guide users through profile completion
   - Tooltips and help text

## Summary

The profile completion flow ensures quality user profiles while providing a smooth onboarding experience. Users are guided to complete essential information before accessing core platform features, improving match quality and user engagement.

---

**Last Updated:** March 3, 2026
**Version:** 1.0.0
