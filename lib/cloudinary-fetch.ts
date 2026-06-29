import { NextResponse } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export type ParsedCloudinaryUrl = {
  resourceType: string;
  publicId: string;
  format?: string;
};

/** Parse a Cloudinary secure_url into resource type, public_id, and optional format. */
export function parseCloudinaryUrl(url: string): ParsedCloudinaryUrl | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const uploadIdx = parts.indexOf('upload');
    if (uploadIdx < 1) return null;

    const resourceType = parts[uploadIdx - 1];
    let rest = parts.slice(uploadIdx + 1);

    // Skip version segment like v1782305050
    if (rest[0] && /^v\d+$/.test(rest[0])) rest = rest.slice(1);

    // Skip transformation segments (e.g. w_800,h_600,c_fill)
    while (
      rest.length > 0 &&
      /^[a-z0-9_,.-]+$/i.test(rest[0]) &&
      rest[0].includes('_') &&
      !/^v\d+$/.test(rest[0])
    ) {
      rest = rest.slice(1);
    }

    const fullPublicId = decodeURIComponent(rest.join('/'));
    if (!fullPublicId) return null;

    // For image/video, a trailing extension is usually the delivery format, not part of public_id.
    if (resourceType === 'image' || resourceType === 'video') {
      const match = fullPublicId.match(/^(.+)\.([a-z0-9]+)$/i);
      if (match) {
        const ext = match[2].toLowerCase();
        const knownFormats = new Set(['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'doc', 'docx']);
        if (knownFormats.has(ext)) {
          return { resourceType, publicId: match[1], format: ext };
        }
      }
    }

    return { resourceType, publicId: fullPublicId };
  } catch {
    return null;
  }
}

type ResolvedAsset = {
  resourceType: string;
  publicId: string;
  format: string;
  deliveryType: string;
};

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.filter((v): v is string => Boolean(v)))];
}

function formatFromFilename(filename: string): string | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext || ext === filename.toLowerCase()) return null;
  return ext;
}

/** Resolve canonical asset metadata via the Cloudinary Admin API. */
async function resolveViaAdminApi(parsed: ParsedCloudinaryUrl): Promise<ResolvedAsset | null> {
  const resourceTypes = uniqueStrings([parsed.resourceType, 'raw', 'image']);
  const publicIds = uniqueStrings([
    parsed.publicId,
    parsed.format ? `${parsed.publicId}.${parsed.format}` : null,
    parsed.publicId.replace(/\.[a-z0-9]+$/i, ''),
  ]);

  for (const resourceType of resourceTypes) {
    for (const publicId of publicIds) {
      try {
        const info = await cloudinary.api.resource(publicId, { resource_type: resourceType });
        return {
          resourceType: info.resource_type,
          publicId: info.public_id,
          format: info.format ?? parsed.format ?? 'pdf',
          deliveryType: info.type ?? 'upload',
        };
      } catch {
        // Try next combination
      }
    }
  }

  return null;
}

function buildPrivateDownloadUrl(asset: ResolvedAsset, download: boolean): string {
  const expiresAt = Math.floor(Date.now() / 1000) + 300;

  return cloudinary.utils.private_download_url(asset.publicId, asset.format, {
    resource_type: asset.resourceType as 'image' | 'raw' | 'video',
    type: asset.deliveryType as 'upload' | 'authenticated' | 'private',
    expires_at: expiresAt,
    attachment: download,
  });
}

function contentTypeForFilename(filename: string, upstreamType: string | null): string {
  if (upstreamType && upstreamType !== 'application/octet-stream') return upstreamType;

  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return upstreamType || 'application/octet-stream';
  }
}

async function tryFetch(url: string, range?: string | null): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      headers: range ? { range } : {},
    });
    if (res.ok || res.status === 206) return res;
  } catch {
    // Fall through to next strategy
  }
  return null;
}

export type CloudinaryFetchResult =
  | { ok: true; response: Response; filename: string }
  | { ok: false; error: string; status: number };

/** Fetch a Cloudinary asset server-side, trying public CDN then authenticated API download. */
export async function fetchCloudinaryAsset(
  rawUrl: string,
  options?: { range?: string | null; download?: boolean }
): Promise<CloudinaryFetchResult> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return { ok: false, error: 'Invalid URL', status: 400 };
  }

  if (!parsedUrl.hostname.endsWith('cloudinary.com')) {
    return { ok: false, error: 'Only Cloudinary URLs are allowed', status: 403 };
  }

  const pathSegments = parsedUrl.pathname.split('/');
  const filename = decodeURIComponent(pathSegments[pathSegments.length - 1] || 'file');
  const range = options?.range ?? null;
  const download = options?.download ?? false;

  // 1. Public CDN delivery (works for most images)
  const direct = await tryFetch(rawUrl, range);
  if (direct) return { ok: true, response: direct, filename };

  const parsed = parseCloudinaryUrl(rawUrl);
  if (!parsed) {
    return { ok: false, error: 'Could not parse Cloudinary URL', status: 400 };
  }

  const resolved =
    (await resolveViaAdminApi(parsed)) ??
    ({
      resourceType: parsed.resourceType,
      publicId: parsed.publicId,
      format: parsed.format ?? formatFromFilename(filename) ?? 'pdf',
      deliveryType: 'upload',
    } satisfies ResolvedAsset);

  // 2. Authenticated download via Cloudinary Admin API (required for restricted PDFs)
  const privateUrl = buildPrivateDownloadUrl(resolved, download);
  const privateRes = await tryFetch(privateUrl, range);
  if (privateRes) return { ok: true, response: privateRes, filename };

  return { ok: false, error: 'Unable to fetch asset from Cloudinary', status: 502 };
}

export function streamCloudinaryResponse(
  upstream: Response,
  filename: string,
  options?: { download?: boolean }
): Response {
  const contentType = contentTypeForFilename(
    filename,
    upstream.headers.get('content-type')
  );

  const disposition = options?.download
    ? `attachment; filename="${filename}"`
    : `inline; filename="${filename}"`;

  const headers = new Headers({
    'Content-Type': contentType,
    'Content-Disposition': disposition,
    'Cache-Control': 'private, max-age=300',
    'X-Frame-Options': 'SAMEORIGIN',
  });

  const contentLength = upstream.headers.get('content-length');
  if (contentLength) headers.set('Content-Length', contentLength);

  const acceptRanges = upstream.headers.get('accept-ranges');
  if (acceptRanges) headers.set('Accept-Ranges', acceptRanges);

  const contentRange = upstream.headers.get('content-range');
  if (contentRange) headers.set('Content-Range', contentRange);

  return new NextResponse(upstream.body, {
    status: upstream.status === 206 ? 206 : 200,
    headers,
  });
}
