'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CodeEditor from '@/components/admin/CodeEditor';
import LivePreviewPanel from '@/components/admin/LivePreviewPanel';
import PageTextForm from '@/components/admin/PageTextForm';
import GalleryEditor from '@/components/admin/GalleryEditor';
import AnnouncementForm from '@/components/admin/AnnouncementForm';
import { notifyCmsUpdated } from '@/lib/cms-events';
import {
  parsePageSections,
  buildHtmlFromSections,
  emptyPageText,
  emptyAnnouncement,
  type PageTextContent,
  type AnnouncementSection,
  type GalleryImage,
} from '@/lib/page-sections';
import { Save, Upload, Globe, ExternalLink, Clock, Type, Images, Megaphone, Code2 } from 'lucide-react';

type Tab = 'text' | 'gallery' | 'announcement' | 'advanced';

type PageMeta = {
  status: string;
  version: number;
  updatedAt?: string;
};

export default function SuperPageEditor() {
  const params = useParams();
  const slug = params.slug as string;
  const [tab, setTab] = useState<Tab>('text');
  const [title, setTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [pageText, setPageText] = useState<PageTextContent>(emptyPageText);
  const [announcement, setAnnouncement] = useState<AnnouncementSection>(emptyAnnouncement);
  const [galleryEnabled, setGalleryEnabled] = useState(false);
  const [galleryHeading, setGalleryHeading] = useState('Gallery');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [extraHtml, setExtraHtml] = useState('');
  const [advancedJson, setAdvancedJson] = useState('{}');
  const [customCss, setCustomCss] = useState('');
  const [customJs, setCustomJs] = useState('');
  const [meta, setMeta] = useState<PageMeta>({ status: 'draft', version: 1 });
  const [savedSnapshot, setSavedSnapshot] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const buildSections = useCallback(
    () => ({
      ...parsePageSections(advancedJson),
      announcement,
      pageText,
      gallery: { enabled: galleryEnabled, heading: galleryHeading, images: galleryImages },
      extraHtml,
    }),
    [advancedJson, announcement, pageText, galleryEnabled, galleryHeading, galleryImages, extraHtml]
  );

  const snapshot = useCallback(
    () =>
      JSON.stringify({
        title,
        metaDescription,
        pageText,
        announcement,
        galleryEnabled,
        galleryHeading,
        galleryImages,
        extraHtml,
        advancedJson,
        customCss,
        customJs,
      }),
    [title, metaDescription, pageText, announcement, galleryEnabled, galleryHeading, galleryImages, extraHtml, advancedJson, customCss, customJs]
  );

  useEffect(() => {
    fetch(`/api/super/pages?slug=${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load page');
        return r.json();
      })
      .then((d) => {
        const page = d.page;
        const sections = parsePageSections(page?.sections || {});
        const { announcement: ann, pageText: pt, gallery, extraHtml: extra, ...rest } = sections;

        const nextTitle = page?.title || slug.charAt(0).toUpperCase() + slug.slice(1);
        const nextMeta = page?.metaDescription || '';
        const nextPageText = { ...emptyPageText, ...pt };
        const nextAnnouncement = { ...emptyAnnouncement, ...ann };
        const nextGalleryEnabled = !!gallery?.enabled;
        const nextGalleryHeading = gallery?.heading || 'Gallery';
        const nextGalleryImages = gallery?.images || [];
        const nextExtra = extra || '';
        const nextAdvanced = JSON.stringify(rest, null, 2);
        const nextCss = page?.customCss || '';
        const nextJs = page?.customJs || '';

        setTitle(nextTitle);
        setMetaDescription(nextMeta);
        setPageText(nextPageText);
        setAnnouncement(nextAnnouncement);
        setGalleryEnabled(nextGalleryEnabled);
        setGalleryHeading(nextGalleryHeading);
        setGalleryImages(nextGalleryImages);
        setExtraHtml(typeof nextExtra === 'string' ? nextExtra : '');
        setAdvancedJson(nextAdvanced);
        setCustomCss(nextCss);
        setCustomJs(nextJs);

        if (page) {
          setMeta({
            status: page.status || 'draft',
            version: page.version || 1,
            updatedAt: page.updatedAt,
          });
        }

        setSavedSnapshot(
          JSON.stringify({
            title: nextTitle,
            metaDescription: nextMeta,
            pageText: nextPageText,
            announcement: nextAnnouncement,
            galleryEnabled: nextGalleryEnabled,
            galleryHeading: nextGalleryHeading,
            galleryImages: nextGalleryImages,
            extraHtml: nextExtra,
            advancedJson: nextAdvanced,
            customCss: nextCss,
            customJs: nextJs,
          })
        );
      })
      .catch(() => toast.error('Could not load page data'));
  }, [slug]);

  const isDirty = snapshot() !== savedSnapshot;

  const buildPayload = (action: 'draft' | 'publish') => {
    const sections = buildSections();
    const htmlContent = buildHtmlFromSections(sections, extraHtml);
    return {
      slug,
      title,
      metaDescription,
      sections,
      customCss,
      customJs,
      htmlContent,
      action,
    };
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/super/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload('draft')),
      });
      if (res.ok) {
        const d = await res.json();
        setMeta({ status: d.page.status, version: d.page.version, updatedAt: d.page.updatedAt });
        setSavedSnapshot(snapshot());
        toast.success('Draft saved');
      } else {
        const d = await res.json();
        toast.error(d.error || 'Save failed');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/super/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload('publish')),
      });
      if (res.ok) {
        const d = await res.json();
        setMeta({ status: d.page.status, version: d.page.version, updatedAt: d.page.updatedAt });
        setSavedSnapshot(snapshot());
        notifyCmsUpdated({ slug, type: 'page' });
        toast.success('Published — live on site now');
      } else {
        const d = await res.json();
        toast.error(d.error || 'Publish failed');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Publish failed');
    } finally {
      setPublishing(false);
    }
  };

  const previewHtml = buildHtmlFromSections(buildSections(), extraHtml);

  const publicUrl = slug === 'home' ? '/' : `/${slug}`;

  const openPreview = () => {
    sessionStorage.setItem(
      `cms-preview-${slug}`,
      JSON.stringify({
        customCss,
        customJs,
        htmlContent: previewHtml,
        sections: buildSections(),
      })
    );
    window.open(`/admin/super/preview/${slug}`, '_blank');
  };

  const tabs: { id: Tab; label: string; icon: typeof Type }[] = [
    { id: 'text', label: 'Page Text', icon: Type },
    { id: 'gallery', label: 'Gallery', icon: Images },
    { id: 'announcement', label: 'Announcement', icon: Megaphone },
    { id: 'advanced', label: 'Advanced', icon: Code2 },
  ];

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit: {title || slug}</h1>
          <p className="text-sm text-gray-600">Edit page text and gallery visually — no coding required</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className={`px-2 py-0.5 rounded-full ${meta.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {meta.status}
            </span>
            <span>v{meta.version}</span>
            {meta.updatedAt && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {new Date(meta.updatedAt).toLocaleString()}
              </span>
            )}
            {isDirty && <span className="text-amber-600 font-medium">Unsaved changes</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={openPreview} className="inline-flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-50">
            <Globe size={16} /> Preview
          </button>
          <Link href={publicUrl} target="_blank" className="inline-flex items-center gap-2 border px-4 py-2 rounded-md text-sm hover:bg-gray-50">
            <ExternalLink size={16} /> Live Site
          </Link>
          <button onClick={saveDraft} disabled={saving || !isDirty} className="inline-flex items-center gap-2 border px-4 py-2 rounded-md text-sm disabled:opacity-40">
            <Save size={16} /> {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button onClick={publish} disabled={publishing} className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50">
            <Upload size={16} /> {publishing ? 'Publishing…' : 'Publish Live'}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <input className="border rounded-lg px-3 py-2" placeholder="Page title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border rounded-lg px-3 py-2 md:col-span-3" placeholder="Meta description (SEO)" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
      </div>

      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px whitespace-nowrap ${
              tab === t.id ? 'border-[#4169E1] text-[#4169E1] font-medium' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-[480px] grid lg:grid-cols-2 gap-4 overflow-hidden">
        <div className="h-full min-h-[480px] overflow-hidden rounded-xl border bg-white p-4">
          {tab === 'text' && <PageTextForm value={pageText} onChange={setPageText} />}
          {tab === 'gallery' && (
            <GalleryEditor
              enabled={galleryEnabled}
              heading={galleryHeading}
              images={galleryImages}
              onChange={(patch) => {
                if (patch.enabled !== undefined) setGalleryEnabled(patch.enabled);
                if (patch.heading !== undefined) setGalleryHeading(patch.heading);
                if (patch.images !== undefined) setGalleryImages(patch.images);
              }}
            />
          )}
          {tab === 'announcement' && <AnnouncementForm value={announcement} onChange={setAnnouncement} />}
          {tab === 'advanced' && (
            <div className="space-y-4 h-full flex flex-col">
              <p className="text-xs text-gray-500">Extra HTML, custom CSS/JS, and raw JSON for developers.</p>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm min-h-[80px]"
                placeholder="Extra HTML blocks (appended after page text)"
                value={extraHtml}
                onChange={(e) => setExtraHtml(e.target.value)}
              />
              <div className="flex-1 min-h-[200px]">
                <CodeEditor value={customCss} onChange={setCustomCss} language="css" />
              </div>
            </div>
          )}
        </div>
        <div className="h-full min-h-[480px] overflow-hidden rounded-xl border">
          <LivePreviewPanel
            type={tab === 'advanced' ? 'css' : 'html'}
            content={tab === 'advanced' ? customCss : previewHtml || '<p class="text-gray-400 p-8 text-center">Start typing in Page Text to see a live preview here.</p>'}
            title="Live Preview"
          />
        </div>
      </div>
    </div>
  );
}
