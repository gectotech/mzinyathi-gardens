// Public media proxy + upload endpoint.
// GET  /api/media?url=...  — stream a Cloudinary asset through our domain
// POST /api/media           — upload applicant documents (multipart form)

import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { fetchCloudinaryAsset, streamCloudinaryResponse } from '@/lib/cloudinary-fetch';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

const MAX_BYTES = 10 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const download = request.nextUrl.searchParams.get('download') === '1';
    const range = request.headers.get('range');
    const result = await fetchCloudinaryAsset(rawUrl, { range, download });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return streamCloudinaryResponse(result.response, result.filename, { download });
  } catch (err) {
    console.error('[media] Fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return jsonError('No file provided', 400);
    }

    if (file.size > MAX_BYTES) {
      return jsonError('File exceeds 10MB limit', 400);
    }

    const folder = (formData.get('folder') as string) || 'job-applications';
    const uploaded = await uploadToCloudinary(file, folder);

    return jsonOk(
      {
        media: {
          url: uploaded.url,
          secureUrl: uploaded.secureUrl,
          publicId: uploaded.publicId,
          resourceType: uploaded.resourceType,
          originalName: uploaded.originalName,
        },
      },
      201
    );
  } catch (error) {
    return handleAuthError(error);
  }
}