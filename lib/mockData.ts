// lib/mockData.ts
import { Property, Project, Job } from '@/types';

export const properties: Property[] = [
  {
    id: '1',
    title: 'Spacious Family Stand',
    description: 'Beautiful stand with panoramic views, perfect for a family home.',
    price: 250000,
    size: 1200,
    location: 'Phase 1',
    image: '/images/property1.jpg',
    featured: true,
  },
  {
    id: '2',
    title: 'Corner Plot Premium',
    description: 'Corner stand with extra privacy and easy access.',
    price: 320000,
    size: 1500,
    location: 'Phase 2',
    image: '/images/property2.jpg',
    featured: true,
  },
  {
    id: '3',
    title: 'Garden View Stand',
    description: 'Overlooks the central park, ideal for nature lovers.',
    price: 280000,
    size: 1100,
    location: 'Phase 1',
    image: '/images/property3.jpg',
    featured: false,
  },
];

export const projects: Project[] = [
  {
    id: '1',
    name: 'Phase 1 Infrastructure',
    description: 'Tarred roads, solar lighting, and water reticulation.',
    status: 'Current',
    image: '/images/project1.jpg',
    progress: '70% complete',
  },
  {
    id: '2',
    name: 'Community Park',
    description: 'Recreational park with playgrounds and walking trails.',
    status: 'Current',
    image: '/images/project2.jpg',
    progress: '40% complete',
  },
  {
    id: '3',
    name: 'Security Gatehouse',
    description: 'Modern access control and guardhouse.',
    status: 'Completed',
    image: '/images/project3.jpg',
  },
];

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Security Officer',
    department: 'Security',
    location: 'Mzinyathi Gardens',
    jobType: 'Full-time',
    requirements: ['Valid PSIRA registration', 'Grade 12', '2+ years experience'],
    responsibilities: ['Patrol grounds', 'Monitor CCTV', 'Access control'],
  },
  {
    id: '2',
    title: 'Construction Manager',
    department: 'Construction',
    location: 'Mzinyathi Gardens',
    jobType: 'Full-time',
    requirements: ['Civil Engineering degree', '5+ years experience'],
    responsibilities: ['Oversee projects', 'Manage teams', 'Quality control'],
  },
  {
    id: '3',
    title: 'Administrative Assistant',
    department: 'Administration',
    location: 'Mzinyathi Gardens',
    jobType: 'Full-time',
    requirements: ['Diploma in Office Admin', 'MS Office proficiency'],
    responsibilities: ['Handle inquiries', 'Schedule meetings', 'Data entry'],
  },
];