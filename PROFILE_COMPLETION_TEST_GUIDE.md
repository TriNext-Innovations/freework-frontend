# Testing Profile Completion Flow

## Quick Start Testing Guide

### Prerequisites
1. Start the Angular application: `ng serve`
2. Backend API should be running OR enable mock data mode

## Enable Mock Data Mode (No Backend Required)

To test without a backend, enable mock data:

### Step 1: Enable Mock Data in AuthService
File: `src/app/auth/auth.service.ts`

```typescript
private useMockData = true; // Change from false to true
```

### Step 2: Enable Mock Data in ProfileService
File: `src/app/profile/profile.service.ts`

```typescript
private useMockData = true; // Change from false to true
```

## Test Scenarios

### Scenario 1: Test New User Registration with Profile Completion

#### Create a Test User with Incomplete Profile

1. **Modify AuthService mock users** to add a new test user:

```typescript
// In auth.service.ts, add to mockUsers array:
{
  id: 'newuser1',
  email: 'newuser@example.com',
  firstName: 'New',
  lastName: 'User',
  role: 'FREELANCER',
  profileCompleted: false, // THIS IS KEY
  createdAt: '2024-03-01T10:00:00Z'
}
```

2. **Modify ProfileService mock profiles** to add corresponding profile:

```typescript
// In profile.service.ts, add to initializeMockData():
const newUserProfile: FreelancerProfile = {
  id: 'profile-new',
  userId: 'newuser1',
  firstName: 'New',
  lastName: 'User',
  email: 'newuser@example.com',
  phone: '',
  profilePicture: '',
  bio: '',
  location: '',
  role: 'FREELANCER',
  title: '',
  hourlyRate: undefined,
  skills: [], // Empty - profile incomplete
  experience: '',
  education: '',
  availability: 'FULL_TIME',
  createdAt: '2024-03-01T10:00:00Z',
  updatedAt: '2024-03-01T10:00:00Z'
};

this.mockProfiles.set('newuser1', newUserProfile);
```

#### Testing Steps

1. **Navigate to Login Page**
   - Go to `http://localhost:4200/login`

2. **Login with Test Credentials**
   - Email: `newuser@example.com`
   - Password: `password` (or user's first name: `new`)

3. **Expected Behavior:**
   - ✅ Should automatically redirect to `/profile/edit?firstTime=true`
   - ✅ Should see welcome banner: "Welcome to Freework! 🎉"
   - ✅ Header should say "Complete Your Profile"
   - ✅ Cancel button should be hidden
   - ✅ Submit button should say "Complete Profile"

4. **Complete the Profile**
   - Fill in required fields:
     - First Name: Already filled
     - Last Name: Already filled
     - Title: "Full Stack Developer"
     - Skills: "Angular, TypeScript, Node.js"
   - Click "Complete Profile"

5. **Expected Behavior:**
   - ✅ Success message appears
   - ✅ After 1.5 seconds, redirect to `/jobs`
   - ✅ User can now access all features

6. **Test Protected Routes**
   - Try navigating to `/jobs/new` (post a job)
   - ✅ Should work now (no redirect to profile edit)

---

### Scenario 2: Test Existing User with Complete Profile

#### Use Existing Mock Users

**Freelancer:**
- Email: `john@example.com`
- Password: `password` or `john`

**Customer:**
- Email: `emily@example.com`
- Password: `password` or `emily`

#### Testing Steps

1. **Navigate to Login Page**
   - Go to `http://localhost:4200/login`

2. **Login**
   - Email: `john@example.com`
   - Password: `password`

3. **Expected Behavior:**
   - ✅ Should redirect directly to `/jobs` (NOT profile edit)
   - ✅ Can access all features immediately

---

### Scenario 3: Test Protected Route Redirect

#### Setup
Use the "newuser@example.com" account (with incomplete profile)

#### Testing Steps

1. **Login as new user**
   - Email: `newuser@example.com`
   - Password: `password`

2. **You'll be on profile edit page**
   - Don't complete the profile yet

3. **Manually navigate to a protected route**
   - Type in URL bar: `http://localhost:4200/jobs/new`

4. **Expected Behavior:**
   - ✅ Should immediately redirect back to `/profile/edit?firstTime=true`
   - ✅ Shows message to complete profile

5. **Complete the Profile**
   - Fill required fields and save

6. **Try accessing protected route again**
   - Navigate to `http://localhost:4200/jobs/new`
   - ✅ Should now have access

---

### Scenario 4: Test Registration Flow

⚠️ **Note:** Mock registration doesn't create new users. To test full registration:

1. Either implement backend API, or
2. Manually test the redirect logic by checking the register component code

**Current Registration Flow:**
```
Register → Profile Edit (firstTime=true) → Complete Profile → Jobs Page
```

---

## Quick Mock Data Setup (Copy & Paste)

### For AuthService (auth.service.ts)

Add to `mockUsers` array around line 24:

```typescript
{
  id: 'testuser1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'FREELANCER',
  profilePicture: 'https://i.pravatar.cc/150?img=30',
  profileCompleted: false, // INCOMPLETE PROFILE
  createdAt: '2024-03-01T10:00:00Z'
},
{
  id: 'testcustomer1',
  email: 'testclient@example.com',
  firstName: 'Test',
  lastName: 'Client',
  role: 'CUSTOMER',
  profilePicture: 'https://i.pravatar.cc/150?img=31',
  profileCompleted: false, // INCOMPLETE PROFILE
  createdAt: '2024-03-01T10:00:00Z'
}
```

### For ProfileService (profile.service.ts)

Add to `initializeMockData()` method around line 41:

```typescript
// Incomplete freelancer profile for testing
const testFreelancerProfile: FreelancerProfile = {
  id: 'profile-test1',
  userId: 'testuser1',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '',
  profilePicture: 'https://i.pravatar.cc/150?img=30',
  bio: '',
  location: '',
  role: 'FREELANCER',
  title: '',
  hourlyRate: undefined,
  skills: [], // Empty - needs completion
  experience: '',
  education: '',
  availability: 'FULL_TIME',
  rating: 0,
  totalReviews: 0,
  completedJobs: 0,
  portfolio: [],
  certifications: [],
  languages: [],
  socialLinks: {},
  createdAt: '2024-03-01T10:00:00Z',
  updatedAt: '2024-03-01T10:00:00Z'
};

// Incomplete customer profile for testing
const testCustomerProfile: CustomerProfile = {
  id: 'profile-test2',
  userId: 'testcustomer1',
  firstName: 'Test',
  lastName: 'Client',
  email: 'testclient@example.com',
  phone: '',
  profilePicture: 'https://i.pravatar.cc/150?img=31',
  bio: '',
  location: '',
  role: 'CUSTOMER',
  company: '', // Empty - needs completion
  companySize: '',
  industry: '', // Empty - needs completion
  website: '',
  rating: 0,
  totalReviews: 0,
  totalJobsPosted: 0,
  verifiedPayment: false,
  socialLinks: {},
  createdAt: '2024-03-01T10:00:00Z',
  updatedAt: '2024-03-01T10:00:00Z'
};

this.mockProfiles.set('testuser1', testFreelancerProfile);
this.mockProfiles.set('testcustomer1', testCustomerProfile);
```

## Test Credentials Summary

| Email | Password | Role | Profile Status | Expected Flow |
|-------|----------|------|----------------|---------------|
| `john@example.com` | `password` or `john` | Freelancer | Complete | Direct to /jobs |
| `emily@example.com` | `password` or `emily` | Customer | Complete | Direct to /jobs |
| `test@example.com` | `password` or `test` | Freelancer | **Incomplete** | Force profile completion |
| `testclient@example.com` | `password` or `testclient` | Customer | **Incomplete** | Force profile completion |

## Verification Checklist

### ✅ Profile Completion Flow Works
- [ ] New user redirected to profile edit after login
- [ ] Welcome banner shows for first-time users
- [ ] Cancel button hidden for first-time users
- [ ] Required fields are enforced
- [ ] Profile marked as complete after saving
- [ ] Redirect to jobs page after completion

### ✅ Protected Routes Work
- [ ] Can't access /jobs/new without complete profile
- [ ] Can't access /jobs/:id/apply without complete profile
- [ ] Can't access /messages without complete profile
- [ ] Can access these routes after profile completion

### ✅ Existing Users Not Affected
- [ ] Users with complete profiles redirect normally
- [ ] No forced profile edit for existing users
- [ ] All existing functionality works

## Troubleshooting

### Issue: "Not redirecting to profile edit"
**Check:**
1. `useMockData = true` in both services
2. Mock user has `profileCompleted: false`
3. Browser cache cleared (Ctrl+Shift+Delete)

### Issue: "Profile stays incomplete after saving"
**Check:**
1. Required fields are filled (title or hourly rate for freelancers)
2. Skills array is not empty for freelancers
3. Company or industry filled for customers

### Issue: "Can't see changes"
**Solution:**
1. Stop ng serve (Ctrl+C)
2. Clear browser cache
3. Run `ng serve` again

### Issue: "TypeScript errors"
**Solution:**
Run: `ng build --configuration development`

## Next Steps After Testing

Once testing is complete:

1. **Integrate with Backend API**
   - Set `useMockData = false` in both services
   - Ensure backend returns `profileCompleted` field
   - Implement `/api/profile/mark-completed` endpoint

2. **Add Analytics**
   - Track profile completion rate
   - Monitor time to complete profile
   - Identify drop-off points

3. **Enhance UX**
   - Add progress indicator
   - Add profile completion percentage
   - Add profile quality score

---

**Happy Testing! 🚀**
