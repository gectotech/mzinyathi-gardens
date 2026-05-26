'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { onCmsUpdated } from '@/lib/cms-events';

type Announcement = {
  enabled?: boolean;
  text?: string;
  link?: string;
  linkLabel?: string;
  style?: 'info' | 'success' | 'warning';
};

type PageSectionsBannerProps = {
  slug: string;
};

export default function PageSectionsBanner({ slug }: PageSectionsBannerProps) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [version, setVersion] = useState(0);

  const load = () => {
    fetch(`/api/content/pages/${slug}?v=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => {
        const sections = d.page?.sections as { announcement?: Announcement } | undefined;
        setAnnouncement(sections?.announcement ?? null);
        setVersion(d.page?.version ?? 0);
        setDismissed(false);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    return onCmsUpdated((detail) => {
      if (!detail?.slug || detail.slug === slug) load();
    });
  }, [slug]);

  if (!announcement?.enabled || !announcement.text || dismissed) return null;

  const styles = {
    info: 'bg-[#4169E1] text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-amber-500 text-white',
  }[announcement.style || 'info'];

  return (
    <div className={`${styles} px-4 py-2.5 text-sm relative`} data-cms-version={version}>
      <div className="container mx-auto flex items-center justify-center gap-3 pr-8 text-center">
        <span>{announcement.text}</span>
        {announcement.link && (
          <Link href={announcement.link} className="underline font-semibold whitespace-nowrap">
            {announcement.linkLabel || 'Learn more'}
          </Link>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-80"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
