'use client';

import { useEffect, useState } from 'react';
import { onCmsUpdated } from '@/lib/cms-events';

type PageCmsContentProps = {
  slug: string;
};

export default function PageCmsContent({ slug }: PageCmsContentProps) {
  const [html, setHtml] = useState('');

  const load = () => {
    fetch(`/api/content/pages/${slug}?v=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => setHtml(d.page?.htmlContent || ''))
      .catch(() => {});
  };

  useEffect(() => {
    load();
    return onCmsUpdated((detail) => {
      if (!detail?.slug || detail.slug === slug) load();
    });
  }, [slug]);

  if (!html) return null;

  return (
    <div className="page-html-block container mx-auto px-4 py-8" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
