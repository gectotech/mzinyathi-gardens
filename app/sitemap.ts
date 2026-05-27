import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import {
  getPhaseRoutes,
  getPropertyDetailRoutes,
  staticRoutes,
} from '@/lib/sitemap-routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const lastModified = new Date();

  const routes = [...staticRoutes, ...getPhaseRoutes(), ...getPropertyDetailRoutes()];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
