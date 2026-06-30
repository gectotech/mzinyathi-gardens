import { readdir } from 'fs/promises';
import path from 'path';
import { getDb, schema } from '@/lib/db';
import { buildJobApplicationDocList } from '@/lib/job-application-documents';
import { parsePageSections, type GalleryImage } from '@/lib/page-sections';
import type { MediaUsage, SiteMediaItem } from '@/lib/site-media-types';

export type { MediaUsage, SiteMediaItem };
export { MEDIA_FOLDERS } from '@/lib/site-media-types';

const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov)$/i;
const PDF_EXT = /\.pdf$/i;

function resourceTypeFromPath(filePath: string): SiteMediaItem['resourceType'] {
  if (PDF_EXT.test(filePath)) return 'pdf';
  if (VIDEO_EXT.test(filePath)) return 'video';
  if (IMAGE_EXT.test(filePath)) return 'image';
  return 'raw';
}

async function listPublicFiles(subdir: string): Promise<{ url: string; name: string; folder: string }[]> {
  const dir = path.join(process.cwd(), 'public', subdir);
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile())
      .map((e) => ({
        url: `/${subdir.replace(/\\/g, '/')}/${e.name}`.replace(/\/+/g, '/'),
        name: e.name,
        folder: subdir.replace(/\\/g, '/'),
      }));
  } catch {
    return [];
  }
}

function normalizeUrl(url: string) {
  return url.split('?')[0].trim();
}

function addToMap(
  map: Map<string, SiteMediaItem>,
  url: string,
  patch: Partial<SiteMediaItem> & Pick<SiteMediaItem, 'name' | 'source' | 'sourceLabel'>
) {
  const key = normalizeUrl(url);
  if (!key) return;
  const existing = map.get(key);
  const usage = patch.usages?.[0];

  if (existing) {
    if (usage && !existing.usages.some((u) => u.label === usage.label)) {
      existing.usages.push(usage);
    }
    if (patch.source === 'upload' && existing.source !== 'upload') {
      map.set(key, { ...existing, ...patch, usages: [...existing.usages, ...(patch.usages || [])] });
    }
    return;
  }

  map.set(key, {
    id: patch.id || `ref:${key}`,
    url: key,
    name: patch.name,
    source: patch.source,
    sourceLabel: patch.sourceLabel,
    resourceType: patch.resourceType || resourceTypeFromPath(key),
    folder: patch.folder || 'website',
    caption: patch.caption ?? null,
    showInGallery: patch.showInGallery ?? false,
    editable: patch.editable ?? false,
    deletable: patch.deletable ?? false,
    publicId: patch.publicId,
    bytes: patch.bytes,
    format: patch.format,
    createdAt: patch.createdAt,
    usages: patch.usages || [],
  });
}

export async function collectSiteMedia(): Promise<SiteMediaItem[]> {
  const db = getDb();
  const map = new Map<string, SiteMediaItem>();

  const uploads = await db.select().from(schema.mediaFiles);
  for (const file of uploads) {
    addToMap(map, file.secureUrl, {
      id: file.id,
      name: file.originalName,
      source: 'upload',
      sourceLabel: 'Media library upload',
      resourceType: file.resourceType as SiteMediaItem['resourceType'],
      folder: file.folder || 'mzinyathi',
      caption: file.caption,
      showInGallery: file.showInGallery,
      editable: true,
      deletable: true,
      publicId: file.publicId,
      bytes: file.bytes,
      format: file.format,
      createdAt: file.createdAt?.toISOString(),
      usages: [{ type: 'library', label: 'Uploaded to media library' }],
    });
  }

  const staticDirs = ['images', 'school'];
  for (const dir of staticDirs) {
    const files = await listPublicFiles(dir);
    for (const file of files) {
      addToMap(map, file.url, {
        name: file.name,
        source: 'static',
        sourceLabel: 'Static site file',
        folder: file.folder,
        editable: false,
        deletable: false,
        usages: [{ type: 'static', label: `Public folder: /${file.folder}` }],
      });
    }
  }

  const phases = await db.select().from(schema.phases);
  for (const phase of phases) {
    if (phase.image) {
      addToMap(map, phase.image, {
        name: `${phase.name} cover`,
        source: 'property',
        sourceLabel: 'Property phase',
        folder: 'properties',
        usages: [
          {
            type: 'phase',
            label: `Phase: ${phase.name}`,
            href: `/admin/properties`,
          },
        ],
      });
    }
  }

  const houses = await db.select().from(schema.houses);
  for (const house of houses) {
    if (house.image) {
      addToMap(map, house.image, {
        name: `${house.title} main`,
        source: 'property',
        sourceLabel: 'Property listing',
        folder: 'properties',
        usages: [
          {
            type: 'house',
            label: `House: ${house.title}`,
            href: `/admin/properties`,
          },
        ],
      });
    }
    for (const img of house.images || []) {
      addToMap(map, img, {
        name: `${house.title} gallery`,
        source: 'property',
        sourceLabel: 'Property listing',
        folder: 'properties',
        usages: [{ type: 'house', label: `House: ${house.title}`, href: `/admin/properties` }],
      });
    }
  }

  const posts = await db.select().from(schema.schoolPosts);
  for (const post of posts) {
    if (post.imageUrl) {
      addToMap(map, post.imageUrl, {
        name: post.title,
        source: 'school',
        sourceLabel: 'School news / activity',
        folder: 'school',
        usages: [
          {
            type: 'school_post',
            label: `School post: ${post.title}`,
            href: `/admin/school-content`,
          },
        ],
      });
    }
  }

  const pages = await db.select().from(schema.sitePages);
  for (const page of pages) {
    const sections = parsePageSections((page.sections as Record<string, unknown>) || {});
    const gallery = sections.gallery?.images || [];
    gallery.forEach((img: GalleryImage, i: number) => {
      if (!img.url) return;
      addToMap(map, img.url, {
        name: img.caption || `${page.title} gallery ${i + 1}`,
        source: 'cms',
        sourceLabel: 'Page CMS gallery',
        folder: 'cms',
        caption: img.caption || null,
        usages: [
          {
            type: 'cms',
            label: `Page: ${page.title}`,
            href: `/admin/super/pages/${page.slug}`,
          },
        ],
      });
    });
  }

  const schoolApps = await db
    .select({ documents: schema.schoolApplications.documents })
    .from(schema.schoolApplications)
    .limit(200);
  for (const app of schoolApps) {
    const docs = app.documents as Record<string, string> | null;
    if (!docs) continue;
    for (const [key, url] of Object.entries(docs)) {
      if (!url) continue;
      addToMap(map, url, {
        name: `Admission document: ${key}`,
        source: 'application',
        sourceLabel: 'School admission upload',
        folder: 'admissions',
        usages: [{ type: 'admission', label: 'School application document', href: `/admin/school-applications` }],
      });
    }
  }

  const jobApps = await db
    .select({
      resumeUrl: schema.jobApplications.resumeUrl,
      documents: schema.jobApplications.documents,
      fullName: schema.jobApplications.fullName,
      trackingId: schema.jobApplications.trackingId,
    })
    .from(schema.jobApplications)
    .limit(500);
  for (const app of jobApps) {
    const docList = buildJobApplicationDocList(app.resumeUrl, app.documents);
    for (const doc of docList) {
      addToMap(map, doc.url, {
        name: `${doc.label}: ${app.fullName}`,
        source: 'application',
        sourceLabel: 'Job application',
        folder: 'applications',
        usages: [
          {
            type: 'job_app',
            label: `${app.fullName} (${app.trackingId})`,
            href: `/admin/applications`,
          },
        ],
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.source === 'upload' && b.source !== 'upload') return -1;
    if (b.source === 'upload' && a.source !== 'upload') return 1;
    return a.name.localeCompare(b.name);
  });
}
