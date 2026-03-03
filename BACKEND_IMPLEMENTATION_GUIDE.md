# Backend Implementation Guide for Profile Completion Flow

## 🎯 Overview

This document provides **everything your backend needs** to support the profile completion flow in the Freework frontend application.

---

## 📋 Database Schema Changes

### 1. Add `profileCompleted` Field to User Entity

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    private Role role; // FREELANCER, CUSTOMER, ADMIN
    
    private String profilePicture;
    
    // ⭐ ADD THIS FIELD
    @Column(name = "profile_completed", nullable = false)
    private Boolean profileCompleted = false; // Default to false for new users
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Getters and setters
    public Boolean getProfileCompleted() {
        return profileCompleted;
    }
    
    public void setProfileCompleted(Boolean profileCompleted) {
        this.profileCompleted = profileCompleted;
    }
}
```

### 2. Database Migration (SQL)

```sql
-- Add profile_completed column to users table
ALTER TABLE users 
ADD COLUMN profile_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Set existing users to have completed profiles (assuming they're already active)
UPDATE users 
SET profile_completed = TRUE 
WHERE created_at < NOW();

-- For MySQL/MariaDB
ALTER TABLE users 
ADD COLUMN profile_completed TINYINT(1) NOT NULL DEFAULT 0;
```

---

## 🔐 Authentication Endpoints

### 1. Login Endpoint - Include `profileCompleted`

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** ⭐ **MUST include `profileCompleted` in user object**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "FREELANCER",
    "profilePicture": "https://example.com/avatar.jpg",
    "profileCompleted": false,  // ⭐ CRITICAL FIELD
    "createdAt": "2024-03-01T10:00:00Z"
  }
}
```

**Java Implementation:**
```java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    // Authenticate user
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
    );
    
    SecurityContextHolder.getContext().setAuthentication(authentication);
    
    // Get user details
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Generate tokens
    String accessToken = jwtTokenProvider.generateToken(authentication);
    String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);
    
    // Build response with profileCompleted
    UserDTO userDTO = UserDTO.builder()
        .id(user.getId())
        .email(user.getEmail())
        .firstName(user.getFirstName())
        .lastName(user.getLastName())
        .role(user.getRole())
        .profilePicture(user.getProfilePicture())
        .profileCompleted(user.getProfileCompleted()) // ⭐ Include this
        .createdAt(user.getCreatedAt())
        .build();
    
    AuthResponse response = AuthResponse.builder()
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .tokenType("Bearer")
        .expiresIn(3600)
        .user(userDTO)
        .build();
    
    return ResponseEntity.ok(response);
}
```

### 2. Registration Endpoint - Set `profileCompleted = false`

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "FREELANCER"
}
```

**Response:**
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user-124",
    "email": "newuser@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "FREELANCER",
    "profileCompleted": false,  // ⭐ New users always false
    "createdAt": "2024-03-03T15:30:00Z"
  }
}
```

**Java Implementation:**
```java
@PostMapping("/register")
public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
    // Check if user exists
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already exists");
    }
    
    // Parse full name
    String[] nameParts = request.getFullName().split(" ", 2);
    String firstName = nameParts[0];
    String lastName = nameParts.length > 1 ? nameParts[1] : "";
    
    // Create new user
    User user = User.builder()
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .firstName(firstName)
        .lastName(lastName)
        .role(request.getRole())
        .profileCompleted(false) // ⭐ New users need to complete profile
        .createdAt(LocalDateTime.now())
        .build();
    
    userRepository.save(user);
    
    // Generate tokens and return response
    // ... (similar to login)
}
```

---

## 👤 Profile Endpoints

### 1. Get Current User's Profile

**Endpoint:** `GET /api/profile`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "id": "profile-123",
  "userId": "user-123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "profilePicture": "https://example.com/avatar.jpg",
  "bio": "Experienced developer...",
  "location": "San Francisco, CA",
  "role": "FREELANCER",
  
  // Freelancer-specific fields
  "title": "Full Stack Developer",
  "hourlyRate": 75.00,
  "skills": ["Angular", "Node.js", "TypeScript"],
  "experience": "5+ years...",
  "education": "BS Computer Science",
  "availability": "FULL_TIME",
  "portfolio": [...],
  "certifications": [...],
  "languages": [...],
  
  "rating": 4.8,
  "totalReviews": 15,
  "completedJobs": 47,
  "profileCompleted": true,  // ⭐ Include this
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-03-01T10:00:00Z"
}
```

**Java Implementation:**
```java
@GetMapping("/api/profile")
public ResponseEntity<ProfileDTO> getCurrentUserProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
    Profile profile = profileRepository.findByUserId(currentUser.getId())
        .orElseThrow(() -> new RuntimeException("Profile not found"));
    
    User user = userRepository.findById(currentUser.getId())
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    ProfileDTO profileDTO = mapToDTO(profile, user);
    profileDTO.setProfileCompleted(user.getProfileCompleted()); // ⭐ Include from User entity
    
    return ResponseEntity.ok(profileDTO);
}
```

### 2. Get Profile by User ID

**Endpoint:** `GET /api/profile/user/{userId}`

**Response:** Same as above

### 3. Update Profile

**Endpoint:** `PUT /api/profile`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Updated bio...",
  "location": "New York, NY",
  "title": "Senior Full Stack Developer",
  "hourlyRate": 85.00,
  "skills": ["Angular", "React", "Node.js", "TypeScript"],
  "experience": "7+ years...",
  "education": "MS Computer Science",
  "availability": "FULL_TIME"
}
```

**Response:** Updated profile with `profileCompleted` status

**Java Implementation:**
```java
@PutMapping("/api/profile")
public ResponseEntity<ProfileDTO> updateProfile(
    @AuthenticationPrincipal UserPrincipal currentUser,
    @RequestBody UpdateProfileRequest request
) {
    Profile profile = profileRepository.findByUserId(currentUser.getId())
        .orElseThrow(() -> new RuntimeException("Profile not found"));
    
    User user = userRepository.findById(currentUser.getId())
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Update profile fields
    profile.setFirstName(request.getFirstName());
    profile.setLastName(request.getLastName());
    profile.setPhone(request.getPhone());
    profile.setBio(request.getBio());
    profile.setLocation(request.getLocation());
    
    if (user.getRole() == Role.FREELANCER) {
        profile.setTitle(request.getTitle());
        profile.setHourlyRate(request.getHourlyRate());
        profile.setSkills(request.getSkills());
        profile.setExperience(request.getExperience());
        profile.setEducation(request.getEducation());
        profile.setAvailability(request.getAvailability());
    } else if (user.getRole() == Role.CUSTOMER) {
        profile.setCompany(request.getCompany());
        profile.setCompanySize(request.getCompanySize());
        profile.setIndustry(request.getIndustry());
        profile.setWebsite(request.getWebsite());
    }
    
    profile.setUpdatedAt(LocalDateTime.now());
    profileRepository.save(profile);
    
    // ⭐ Check if profile is now complete and update user
    boolean isComplete = checkProfileCompletion(profile, user.getRole());
    if (isComplete && !user.getProfileCompleted()) {
        user.setProfileCompleted(true);
        userRepository.save(user);
    }
    
    ProfileDTO profileDTO = mapToDTO(profile, user);
    profileDTO.setProfileCompleted(user.getProfileCompleted());
    
    return ResponseEntity.ok(profileDTO);
}

// Helper method to check if profile is complete
private boolean checkProfileCompletion(Profile profile, Role role) {
    // Basic required fields
    boolean hasBasicInfo = profile.getFirstName() != null && !profile.getFirstName().isEmpty()
        && profile.getLastName() != null && !profile.getLastName().isEmpty()
        && profile.getEmail() != null && !profile.getEmail().isEmpty();
    
    if (role == Role.FREELANCER) {
        // Freelancers need: skills, and (title OR hourlyRate)
        return hasBasicInfo 
            && profile.getSkills() != null && !profile.getSkills().isEmpty()
            && (profile.getTitle() != null || profile.getHourlyRate() != null);
    } else if (role == Role.CUSTOMER) {
        // Customers need: company OR industry
        return hasBasicInfo 
            && (profile.getCompany() != null || profile.getIndustry() != null);
    }
    
    return hasBasicInfo;
}
```

### 4. Mark Profile as Completed (Explicit)

**Endpoint:** `POST /api/profile/mark-completed`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile marked as completed",
  "profileCompleted": true
}
```

**Java Implementation:**
```java
@PostMapping("/api/profile/mark-completed")
public ResponseEntity<Map<String, Object>> markProfileCompleted(
    @AuthenticationPrincipal UserPrincipal currentUser
) {
    User user = userRepository.findById(currentUser.getId())
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    Profile profile = profileRepository.findByUserId(currentUser.getId())
        .orElseThrow(() -> new RuntimeException("Profile not found"));
    
    // Verify profile is actually complete
    boolean isComplete = checkProfileCompletion(profile, user.getRole());
    
    if (!isComplete) {
        throw new RuntimeException("Profile does not meet completion requirements");
    }
    
    user.setProfileCompleted(true);
    userRepository.save(user);
    
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("message", "Profile marked as completed");
    response.put("profileCompleted", true);
    
    return ResponseEntity.ok(response);
}
```

---

## 📦 DTOs (Data Transfer Objects)

### AuthResponse DTO
```java
@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Integer expiresIn;
    private UserDTO user; // ⭐ Must include profileCompleted
}
```

### UserDTO
```java
@Data
@Builder
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private String profilePicture;
    private Boolean profileCompleted; // ⭐ Required field
    private LocalDateTime createdAt;
}
```

### ProfileDTO
```java
@Data
@Builder
public class ProfileDTO {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String profilePicture;
    private String bio;
    private String location;
    private Role role;
    
    // Freelancer fields
    private String title;
    private Double hourlyRate;
    private List<String> skills;
    private String experience;
    private String education;
    private String availability;
    private List<PortfolioItem> portfolio;
    private List<Certification> certifications;
    private List<Language> languages;
    
    // Customer fields
    private String company;
    private String companySize;
    private String industry;
    private String website;
    
    // Common
    private Double rating;
    private Integer totalReviews;
    private Integer completedJobs;
    private Boolean profileCompleted; // ⭐ Required field
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

---

## 🔒 JWT Token - Include `profileCompleted`

### Option 1: Include in JWT Claims (Recommended)

```java
public String generateToken(Authentication authentication) {
    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
    
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);
    
    User user = userRepository.findById(userPrincipal.getId())
        .orElseThrow(() -> new RuntimeException("User not found"));
    
    return Jwts.builder()
        .setSubject(Long.toString(user.getId()))
        .claim("email", user.getEmail())
        .claim("firstName", user.getFirstName())
        .claim("lastName", user.getLastName())
        .claim("role", user.getRole().name())
        .claim("profileCompleted", user.getProfileCompleted()) // ⭐ Add to token
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS512, jwtSecret)
        .compact();
}
```

This way, the frontend can extract `profileCompleted` from the token even if the user object isn't in the response.

---

## ✅ Profile Completion Requirements

### For FREELANCER Role
**Required fields:**
- ✅ firstName (not empty)
- ✅ lastName (not empty)
- ✅ email (not empty)
- ✅ skills (list with at least 1 item)
- ✅ title OR hourlyRate (at least one must be set)

### For CUSTOMER Role
**Required fields:**
- ✅ firstName (not empty)
- ✅ lastName (not empty)
- ✅ email (not empty)
- ✅ company OR industry (at least one must be set)

---

## 🔄 Complete Flow Example

### 1. User Registers
```
POST /auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "FREELANCER"
}

Response:
{
  "accessToken": "...",
  "user": {
    "id": "user-125",
    "profileCompleted": false  ← New user
  }
}
```

### 2. Frontend Checks Profile Status
```javascript
// Frontend automatically redirects to /profile/edit?firstTime=true
```

### 3. User Completes Profile
```
PUT /api/profile
Authorization: Bearer {token}
{
  "firstName": "John",
  "lastName": "Doe",
  "title": "Full Stack Developer",
  "skills": ["Angular", "Node.js"],
  "hourlyRate": 75.00
}

Response:
{
  "id": "profile-125",
  "profileCompleted": true  ← Now complete!
}
```

### 4. Frontend Marks as Complete
```
POST /api/profile/mark-completed
Authorization: Bearer {token}

Response:
{
  "success": true,
  "profileCompleted": true
}
```

### 5. User Can Now Access All Features
```
Frontend redirects to /jobs
All protected routes now accessible
```

---

## 🚀 Quick Implementation Checklist

### Database
- [ ] Add `profile_completed` column to `users` table
- [ ] Set default value to `FALSE`
- [ ] Update existing users if needed

### User Entity
- [ ] Add `profileCompleted` field (Boolean)
- [ ] Add getter/setter methods
- [ ] Update constructors/builders

### Authentication
- [ ] Include `profileCompleted` in login response
- [ ] Set `profileCompleted = false` on registration
- [ ] Add to JWT token claims (optional but recommended)

### Profile Service
- [ ] Return `profileCompleted` in GET /api/profile
- [ ] Auto-detect completion on PUT /api/profile
- [ ] Implement POST /api/profile/mark-completed
- [ ] Add validation logic for completion

### DTOs
- [ ] Add `profileCompleted` to UserDTO
- [ ] Add `profileCompleted` to ProfileDTO
- [ ] Update all mappers

### Testing
- [ ] Test registration (profileCompleted = false)
- [ ] Test login (includes profileCompleted)
- [ ] Test profile update (auto-completion)
- [ ] Test mark-completed endpoint
- [ ] Test with incomplete vs complete profiles

---

## 📝 Testing Endpoints

### Test with cURL

**Login:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Profile:**
```bash
curl -X GET http://localhost:8080/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Update Profile:**
```bash
curl -X PUT http://localhost:8080/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "title": "Full Stack Developer",
    "skills": ["Angular", "Node.js", "TypeScript"],
    "hourlyRate": 75.00
  }'
```

**Mark Complete:**
```bash
curl -X POST http://localhost:8080/api/profile/mark-completed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Summary

**Critical Points:**
1. ✅ Add `profileCompleted` boolean field to User entity
2. ✅ Return it in all auth responses (login, register)
3. ✅ Return it in all profile endpoints
4. ✅ Auto-detect completion on profile update
5. ✅ Provide explicit mark-completed endpoint
6. ✅ Include in JWT token (recommended)

**Frontend is now configured to:**
- Call real backend API (mock data disabled)
- Redirect incomplete profiles to /profile/edit
- Mark profile as complete after first save
- Protect routes based on profile completion

**Your backend must:**
- Store and return `profileCompleted` field
- Validate completion requirements
- Update status automatically or on request

---

**Need help implementing? Use the code examples above or ask for specific clarification!**
