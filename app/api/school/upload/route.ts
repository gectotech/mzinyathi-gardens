import { NextRequest } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
]);

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

    const type = file.type || 'application/octet-stream';
    const isPdf = type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = type.startsWith('image/');

    if (!isPdf && !isImage && !ALLOWED_TYPES.has(type)) {
      return jsonError('Only PDF, JPG, JPEG, and PNG files are allowed', 400);
    }

    const uploaded = await uploadToCloudinary(file, 'school-admissions');
    return jsonOk({ url: uploaded.secureUrl }, 201);
  } catch (error) {
    return handleAuthError(error);
  }
}
