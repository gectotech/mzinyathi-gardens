import { NextRequest } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { requireAuth, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(['admin', 'super_admin']);
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return jsonError('No file provided', 400);
    }

    const folder = (formData.get('folder') as string) || 'mzinyathi';
    const uploaded = await uploadToCloudinary(file, folder);
    const db = getDb();

    const [record] = await db
      .insert(schema.mediaFiles)
      .values({
        publicId: uploaded.publicId,
        url: uploaded.url,
        secureUrl: uploaded.secureUrl,
        resourceType: uploaded.resourceType,
        format: uploaded.format,
        bytes: uploaded.bytes,
        originalName: uploaded.originalName,
        folder,
        uploadedBy: user.id,
      })
      .returning();

    await logAudit(user.id, 'upload', 'media', record.id, { name: file.name });

    return jsonOk({ media: record }, 201);
  } catch (error) {
    return handleAuthError(error);
  }
}
