import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requirePermission('settings');
    const db = getDb();
    const settings = await db.select().from(schema.siteSettings);
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return jsonOk({ settings: map });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requirePermission('settings', true);
    const body = await request.json();

    if (body.settings) {
      const db = getDb();
      for (const [key, value] of Object.entries(body.settings)) {
        const existing = await db
          .select()
          .from(schema.siteSettings)
          .where(eq(schema.siteSettings.key, key))
          .limit(1);

        if (existing.length) {
          await db
            .update(schema.siteSettings)
            .set({ value, updatedAt: new Date(), updatedBy: user.id })
            .where(eq(schema.siteSettings.key, key));
        } else {
          await db.insert(schema.siteSettings).values({ key, value, updatedBy: user.id });
        }
      }
      await logAudit(user.id, 'update', 'settings', 'bulk');
      return jsonOk({ success: true });
    }

    return jsonError('Invalid payload');
  } catch (error) {
    return handleAuthError(error);
  }
}
