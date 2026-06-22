import { NextRequest } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { collectSiteMedia } from '@/lib/site-media-index';

export async function GET(request: NextRequest) {
  try {
    await requirePermission('media');
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view');

    if (view === 'all') {
      const items = await collectSiteMedia();
      const uploads = await getDb()
        .select()
        .from(schema.mediaFiles)
        .orderBy(desc(schema.mediaFiles.createdAt));
      return jsonOk({ items, uploads });
    }

    const db = getDb();
    const media = await db.select().from(schema.mediaFiles).orderBy(desc(schema.mediaFiles.createdAt));
    return jsonOk({ media });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('media', true);
    const body = await request.json();

    if (body.action === 'register' && body.url) {
      const url = String(body.url).trim();
      const db = getDb();
      const existing = await db
        .select()
        .from(schema.mediaFiles)
        .where(eq(schema.mediaFiles.secureUrl, url))
        .limit(1);
      if (existing.length) {
        return jsonOk({ media: existing[0], alreadyRegistered: true });
      }

      const name = body.name || url.split('/').pop() || 'site-asset';
      const [created] = await db
        .insert(schema.mediaFiles)
        .values({
          publicId: `site-asset:${url.replace(/^\//, '')}`,
          url: url.startsWith('http') ? url : url,
          secureUrl: url,
          resourceType: body.resourceType || 'image',
          originalName: name,
          folder: body.folder || 'website',
          caption: body.caption || null,
          showInGallery: body.showInGallery ?? false,
          uploadedBy: user.id,
        })
        .returning();

      await logAudit(user.id, 'register', 'media', created.id, { url });
      return jsonOk({ media: created }, 201);
    }

    return jsonError('Invalid action');
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requirePermission('media', true);
    const body = await request.json();
    if (!body.id) return jsonError('Missing id');

    const db = getDb();
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (body.caption !== undefined) updates.caption = body.caption;
    if (body.showInGallery !== undefined) updates.showInGallery = body.showInGallery;
    if (body.folder !== undefined) updates.folder = body.folder;
    if (body.originalName !== undefined) updates.originalName = body.originalName;

    const [updated] = await db
      .update(schema.mediaFiles)
      .set(updates)
      .where(eq(schema.mediaFiles.id, body.id))
      .returning();

    if (!updated) return jsonError('Not found', 404);

    await logAudit(user.id, 'update', 'media', body.id, updates);
    return jsonOk({ media: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requirePermission('media', true);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return jsonError('Missing id');

    const db = getDb();
    const [file] = await db.select().from(schema.mediaFiles).where(eq(schema.mediaFiles.id, id)).limit(1);

    if (!file) return jsonError('Not found', 404);

    if (!file.publicId.startsWith('site-asset:')) {
      await deleteFromCloudinary(file.publicId, file.resourceType);
    }

    await db.delete(schema.mediaFiles).where(eq(schema.mediaFiles.id, id));
    await logAudit(user.id, 'delete', 'media', id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
