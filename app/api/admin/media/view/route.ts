import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/auth';
import { handleAuthError } from '@/lib/api-utils';
import { fetchCloudinaryAsset, streamCloudinaryResponse } from '@/lib/cloudinary-fetch';

export async function GET(request: NextRequest) {
  try {
    await requirePermission('job_applications');

    const rawUrl = request.nextUrl.searchParams.get('url');
    if (!rawUrl) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    const download = request.nextUrl.searchParams.get('download') === '1';
    const range = request.headers.get('range');

    const result = await fetchCloudinaryAsset(rawUrl, { range, download });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return streamCloudinaryResponse(result.response, result.filename, { download });
  } catch (error) {
    return handleAuthError(error);
  }
}
