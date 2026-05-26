'use client';

import { useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { onCmsUpdated } from '@/lib/cms-events';

type DynamicPageAssetsProps = {
  slug: string;
};

export default function DynamicPageAssets({ slug }: DynamicPageAssetsProps) {
  const pathname = usePathname();

  const applyAssets = useCallback(() => {
    document.querySelectorAll(`[data-page-css="${slug}"],[data-page-js="${slug}"]`).forEach((el) => el.remove());

    fetch(`/api/content/pages/${slug}?v=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        const page = data.page;
        if (!page) return;

        if (page.customCss) {
          const cssEl = document.createElement('style');
          cssEl.setAttribute('data-page-css', slug);
          cssEl.textContent = page.customCss;
          document.head.appendChild(cssEl);
        }

        if (page.customJs) {
          const jsEl = document.createElement('script');
          jsEl.setAttribute('data-page-js', slug);
          jsEl.textContent = page.customJs;
          document.body.appendChild(jsEl);
        }
      })
      .catch(() => {});
  }, [slug]);

  useEffect(() => {
    applyAssets();
    return onCmsUpdated((detail) => {
      if (!detail?.slug || detail.slug === slug) applyAssets();
    });
  }, [slug, pathname, applyAssets]);

  return null;
}
