// types/index.ts
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  size: number; // sq m
  location: string;
  image: string;
  featured?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Current' | 'Completed';
  image: string;
  progress?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract';
  requirements: string[];
  responsibilities: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'rejected';
  submittedAt: Date;
}