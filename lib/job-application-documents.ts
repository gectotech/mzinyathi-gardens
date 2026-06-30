import type { JobApplicationDocument } from '@/lib/db/schema';

export type JobDocItem = { label: string; url: string };

function normalizeDocUrl(url: string) {
  return url.split('?')[0].trim();
}

/** Merge structured documents array with legacy resumeUrl (deduped by URL). */
export function buildJobApplicationDocList(
  resumeUrl: string | null | undefined,
  documents: JobApplicationDocument[] | null | undefined
): JobDocItem[] {
  const docs: JobDocItem[] = [];
  const seen = new Set<string>();

  const add = (url: string, label: string) => {
    const key = normalizeDocUrl(url);
    if (!key || seen.has(key)) return;
    seen.add(key);
    docs.push({ label, url: key });
  };

  if (Array.isArray(documents)) {
    for (const d of documents) {
      if (d?.url) add(d.url, d.label || 'Document');
    }
  }
  if (resumeUrl) add(resumeUrl, 'CV / Resume');

  return docs;
}
