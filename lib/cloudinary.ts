import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadResult = {
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType: 'image' | 'video' | 'pdf' | 'raw';
  format: string | null;
  bytes: number;
  originalName: string;
};

function mapResourceType(
  resourceType: string,
  format: string | null
): UploadResult['resourceType'] {
  if (resourceType === 'video') return 'video';
  if (format === 'pdf') return 'pdf';
  if (resourceType === 'image') return 'image';
  return 'raw';
}

export async function uploadToCloudinary(
  file: File,
  folder = 'mzinyathi'
): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString('base64');
  const dataUri = `data:${file.type || 'application/octet-stream'};base64,${base64}`;

  const isVideo = file.type.startsWith('video/');
  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: isVideo ? 'video' : 'auto',
    use_filename: true,
    unique_filename: true,
    ...(isPdf ? { format: 'pdf' } : {}),
    ...(!isVideo && !isPdf
      ? { quality: 'auto:good', fetch_format: 'auto' }
      : {}),
    ...(isVideo ? { quality: 'auto' } : {}),
  });

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    resourceType: mapResourceType(result.resource_type, result.format ?? null),
    format: result.format ?? null,
    bytes: result.bytes,
    originalName: file.name,
  };
}

export async function deleteFromCloudinary(publicId: string, resourceType: string) {
  const type =
    resourceType === 'video' ? 'video' : resourceType === 'pdf' ? 'image' : 'image';
  await cloudinary.uploader.destroy(publicId, {
    resource_type: type === 'video' ? 'video' : 'image',
    invalidate: true,
  });
}

export { cloudinary };
