import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    const db = getDb();
    const items = await db
      .select({
        id: schema.mediaFiles.id,
        secureUrl: schema.mediaFiles.secureUrl,
        resourceType: schema.mediaFiles.resourceType,
        caption: schema.mediaFiles.caption,
        originalName: schema.mediaFiles.originalName,
      })
      .from(schema.mediaFiles)
      .where(eq(schema.mediaFiles.showInGallery, true))
      .orderBy(desc(schema.mediaFiles.createdAt));

    return jsonOk({ items });
  } catch (error) {
    return handleAuthError(error);
  }
}
