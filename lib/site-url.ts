const DEFAULT_SITE_URL = 'https://mzinyathigardens.co.zw';

/** Canonical site origin for metadata, sitemap, and robots. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  return DEFAULT_SITE_URL;
}
