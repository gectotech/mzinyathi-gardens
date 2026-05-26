import { NextRequest } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { requireAuth, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAuth(['admin', 'super_admin']);
    const db = getDb();
    const media = await db
      .select()
      .from(schema.mediaFiles)
      .orderBy(desc(schema.mediaFiles.createdAt));
    return jsonOk({ media });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(['admin', 'super_admin']);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return jsonError('Missing id');

    const db = getDb();
    const [file] = await db
      .select()
      .from(schema.mediaFiles)
      .where(eq(schema.mediaFiles.id, id))
      .limit(1);

    if (file) {
      await deleteFromCloudinary(file.publicId, file.resourceType);
      await db.delete(schema.mediaFiles).where(eq(schema.mediaFiles.id, id));
      await logAudit(user.id, 'delete', 'media', id);
    }

    return jsonOk({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
