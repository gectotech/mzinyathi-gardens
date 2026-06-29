import { NextRequest } from 'next/server';
import { cloudinary } from '@/lib/cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathStr = path.join('/');
    
    console.log('Proxy request path:', pathStr);
    
    // Reconstruct the full Cloudinary URL from the path
    // Expected path format: v1782379630/school-admissions/oze9a7bzpehsijmukmdy.pdf
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    
    // Try image/upload first (for legacy uploads), then raw/upload
    const urlsToTry = [
      `https://res.cloudinary.com/${cloudName}/image/upload/${pathStr}`,
      `https://res.cloudinary.com/${cloudName}/raw/upload/${pathStr}`,
    ];
    
    let response: Response | null = null;
    let lastError: string | null = null;

    for (const url of urlsToTry) {
      console.log('Trying:', url);
      try {
        response = await fetch(url);
        if (response.ok) {
          console.log('Success with URL:', url);
          break;
        }
        lastError = `HTTP ${response.status}`;
      } catch (e) {
        lastError = e instanceof Error ? e.message : 'Unknown error';
        console.error('Fetch failed for:', url, lastError);
      }
    }

    if (!response || !response.ok) {
      console.error('All attempts failed. Last error:', lastError);
      return new Response(`Failed to fetch file: ${lastError}`, { status: 500 });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const buffer = await response.arrayBuffer();

    console.log('Successfully fetched file, size:', buffer.byteLength, 'type:', contentType);

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Error fetching file', { status: 500 });
  }
}
