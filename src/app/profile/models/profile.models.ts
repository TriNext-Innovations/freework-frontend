// Profile models for freelancers and customers

export interface BaseProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FreelancerProfile extends BaseProfile {
  role: 'FREELANCER';
  title?: string;
  hourlyRate?: number;
  skills: string[];
  experience?: string;
  education?: string;
  portfolio?: PortfolioItem[];
  languages?: Language[];
  availability?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'NOT_AVAILABLE';
  rating?: number;
  totalReviews?: number;
  completedJobs?: number;
  certifications?: Certification[];
  socialLinks?: SocialLinks;
}

export interface CustomerProfile extends BaseProfile {
  role: 'CUSTOMER';
  company?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  rating?: number;
  totalReviews?: number;
  totalJobsPosted?: number;
  verifiedPayment?: boolean;
  socialLinks?: SocialLinks;
}

export interface AdminProfile extends BaseProfile {
  role: 'ADMIN';
  title?: string;
  rating?: number;
  totalReviews?: number;
  completedJobs?: number;
  skills?: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  technologies?: string[];
  completedAt?: string;
}

export interface Language {
  name: string;
  proficiency: 'BASIC' | 'CONVERSATIONAL' | 'FLUENT' | 'NATIVE';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  behance?: string;
  dribbble?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  // Freelancer specific
  title?: string;
  hourlyRate?: number;
  skills?: string[];
  experience?: string;
  education?: string;
  availability?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'NOT_AVAILABLE';
  languages?: Language[];
  certifications?: Certification[];
  // Customer specific
  company?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  // Common
  socialLinks?: SocialLinks;
}

export type Profile = FreelancerProfile | CustomerProfile | AdminProfile;
