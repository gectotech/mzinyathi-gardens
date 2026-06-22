'use client';

import { useEffect, useState } from 'react';
import { onCmsUpdated } from '@/lib/cms-events';
import { buildHtmlFromSections, parsePageSections } from '@/lib/page-sections';

type PageCmsContentProps = {
  slug: string;
};

export default function PageCmsContent({ slug }: PageCmsContentProps) {
  const [html, setHtml] = useState('');

  const load = () => {
    fetch(`/api/content/pages/${slug}?v=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => {
        const page = d.page;
        if (!page) {
          setHtml('');
          return;
        }
        const sections = parsePageSections(page.sections || {});
        const generated = buildHtmlFromSections(sections, sections.extraHtml as string | undefined);
        const legacy = page.htmlContent || '';
        setHtml(generated || legacy);
      })
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
    <div className="page-html-block" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
