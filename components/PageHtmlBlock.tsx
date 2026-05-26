'use client';

import { useEffect, useState } from 'react';

type PageHtmlBlockProps = {
  slug: string;
};

export default function PageHtmlBlock({ slug }: PageHtmlBlockProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    fetch(`/api/content/pages/${slug}`)
      .then((r) => r.json())
      .then((d) => setHtml(d.page?.htmlContent || ''))
      .catch(() => {});
  }, [slug]);

  if (!html) return null;

  return <div className="page-html-block" dangerouslySetInnerHTML={{ __html: html }} />;
}
