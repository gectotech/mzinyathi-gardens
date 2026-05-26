'use client';

import { useEffect } from 'react';

export default function GlobalSiteAssets() {
  useEffect(() => {
    let cssEl: HTMLStyleElement | null = null;
    let jsEl: HTMLScriptElement | null = null;

    fetch('/api/content/code')
      .then((r) => r.json())
      .then((data) => {
        if (data.css) {
          cssEl = document.createElement('style');
          cssEl.setAttribute('data-global-css', 'true');
          cssEl.textContent = data.css;
          document.head.appendChild(cssEl);
        }
        if (data.js) {
          jsEl = document.createElement('script');
          jsEl.setAttribute('data-global-js', 'true');
          jsEl.textContent = data.js;
          document.body.appendChild(jsEl);
        }
      })
      .catch(() => {});

    return () => {
      cssEl?.remove();
      jsEl?.remove();
    };
  }, []);

  return null;
}
