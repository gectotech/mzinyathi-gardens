export const CMS_UPDATED_EVENT = 'mg-cms-updated';

export function notifyCmsUpdated(detail?: { slug?: string; type?: 'page' | 'code' }) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CMS_UPDATED_EVENT, { detail }));
  }
}

export function onCmsUpdated(callback: (detail?: { slug?: string; type?: 'page' | 'code' }) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    callback((e as CustomEvent).detail);
  };
  window.addEventListener(CMS_UPDATED_EVENT, handler);
  return () => window.removeEventListener(CMS_UPDATED_EVENT, handler);
}
