'use client';

import { useCallback, useEffect } from 'react';
import { onCmsUpdated } from '@/lib/cms-events';

export default function GlobalSiteAssets() {
  const applyAssets = useCallback(() => {
    document.querySelectorAll('[data-global-css],[data-global-js]').forEach((el) => el.remove());

    fetch(`/api/content/code?v=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.css) {
          const cssEl = document.createElement('style');
          cssEl.setAttribute('data-global-css', 'true');
          cssEl.textContent = data.css;
          document.head.appendChild(cssEl);
        }
        if (data.js) {
          const jsEl = document.createElement('script');
          jsEl.setAttribute('data-global-js', 'true');
          jsEl.textContent = data.js;
          document.body.appendChild(jsEl);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    applyAssets();
    return onCmsUpdated((detail) => {
      if (!detail?.type || detail.type === 'code') applyAssets();
    });
  }, [applyAssets]);

  return null;
}
