'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type DynamicPageAssetsProps = {
  slug: string;
};

export default function DynamicPageAssets({ slug }: DynamicPageAssetsProps) {
  const pathname = usePathname();

  useEffect(() => {
    let cssEl: HTMLStyleElement | null = null;
    let jsEl: HTMLScriptElement | null = null;

    async function loadAssets() {
      try {
        const res = await fetch(`/api/content/pages/${slug}`);
        const data = await res.json();
        const page = data.page;
        if (!page) return;

        if (page.customCss) {
          cssEl = document.createElement('style');
          cssEl.setAttribute('data-page-css', slug);
          cssEl.textContent = page.customCss;
          document.head.appendChild(cssEl);
        }

        if (page.customJs) {
          jsEl = document.createElement('script');
          jsEl.setAttribute('data-page-js', slug);
          jsEl.textContent = page.customJs;
          document.body.appendChild(jsEl);
        }
      } catch {
        // Fallback silently to static UI
      }
    }

    loadAssets();

    return () => {
      cssEl?.remove();
      jsEl?.remove();
    };
  }, [slug, pathname]);

  return null;
}
