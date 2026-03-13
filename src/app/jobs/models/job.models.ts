// Job-related models and interfaces

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType?: 'FIXED' | 'HOURLY';
  deadline: string;
  location?: string;
  locationType?: 'REMOTE' | 'ONSITE' | 'HYBRID';
  skills?: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  customerId?: string;
  customerName?: string;
  customerAvatar?: string;
  applicationsCount?: number;
  createdAt?: string;  // Frontend camelCase
  updatedAt?: string;  // Frontend camelCase
  created_at?: string; // Backend snake_case
  updated_at?: string; // Backend snake_case
  postedById?: number;
  postedByEmail?: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: 'FIXED' | 'HOURLY';
  deadline: string;
  location: string;
  locationType: 'REMOTE' | 'ONSITE' | 'HYBRID';
  skills: string[];
}

export interface UpdateJobRequest extends CreateJobRequest {
  id: string;
}

export interface JobFilters {
  category?: string;
  location?: string;
  locationType?: string;
  minBudget?: number;
  maxBudget?: number;
  budgetType?: string;
  skills?: string[];
  status?: string;
  search?: string;
  customerId?: string; // Filter by customer who posted the job
}

export interface JobsResponse {
  content: Job[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface JobCategory {
  id: string;
  name: string;
  icon: string;
}

export const JOB_CATEGORIES: JobCategory[] = [
  { id: 'web-development', name: 'Web Development', icon: 'code' },
  { id: 'mobile-development', name: 'Mobile Development', icon: 'smartphone' },
  { id: 'design', name: 'Design & Creative', icon: 'palette' },
  { id: 'writing', name: 'Writing & Content', icon: 'edit' },
  { id: 'marketing', name: 'Marketing', icon: 'trending_up' },
  { id: 'data-science', name: 'Data Science', icon: 'analytics' },
  { id: 'devops', name: 'DevOps & IT', icon: 'cloud' },
  { id: 'consulting', name: 'Consulting', icon: 'business' },
  { id: 'other', name: 'Other', icon: 'more_horiz' }
];

export const SKILLS_DATABASE: string[] = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin', 'Rust',

  // Web Technologies
  'Angular', 'React', 'Vue.js', 'Node.js', 'HTML', 'CSS', 'SCSS', 'Tailwind CSS', 'Bootstrap',

  // Backend
  'Spring Boot', 'Express.js', 'Django', 'Flask', 'Laravel', 'ASP.NET', 'Ruby on Rails',

  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server',

  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitLab CI',

  // Mobile
  'iOS', 'Android', 'React Native', 'Flutter', 'Ionic',

  // Design
  'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI/UX Design', 'Graphic Design',

  // Other
  'Machine Learning', 'Data Analysis', 'SEO', 'Content Writing', 'Copywriting', 'Social Media Marketing'
];
