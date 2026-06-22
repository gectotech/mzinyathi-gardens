import { phasesData } from '@/lib/housesData';

/** Public marketing pages (excludes admin). */
export const staticRoutes = [
  { path: '/', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/properties', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/projects', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/careers', priority: 0.6, changeFrequency: 'weekly' as const },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/school', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/school/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/school/admissions', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/school/what-we-offer', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/school/news', priority: 0.6, changeFrequency: 'weekly' as const },
  { path: '/school/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/school/careers', priority: 0.6, changeFrequency: 'weekly' as const },
  { path: '/school/track-application', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/school/gallery', priority: 0.6, changeFrequency: 'weekly' as const },
];

/** Property detail slugs defined in app/properties/[id]/page.tsx */
export const propertyDetailIds = [
  'phase-i-house-1',
  'phase-i-house-2',
  'phase-vii-house-1',
  'phase-xi-house-1',
];

export function getPhaseRoutes() {
  return Object.keys(phasesData).map((phaseId) => ({
    path: `/properties/phase/${phaseId}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));
}

export function getPropertyDetailRoutes() {
  return propertyDetailIds.map((id) => ({
    path: `/properties/${id}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));
}
