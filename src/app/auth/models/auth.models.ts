// Authentication request/response models

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  //lastName: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'FREELANCER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'FREELANCER' | 'ADMIN';
  profilePicture?: string;
  avatar?: string;
  createdAt: string;
  profileCompleted?: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  // Optional fields that might be in the token
  userId?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  given_name?: string;
  family_name?: string;
  profilePicture?: string;
  picture?: string;
  avatar?: string;
  authorities?: string[];
}
