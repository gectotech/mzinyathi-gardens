const DEFAULT_SITE_URL = 'https://www.mzinyathigardens.co.zw';

/** Canonical site origin for metadata, sitemap, and robots. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;

  return DEFAULT_SITE_URL;
}
