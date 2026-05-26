import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk } from '@/lib/api-utils';

export async function GET() {
  try {
    const db = getDb();
    const assets = await db
      .select()
      .from(schema.codeAssets)
      .where(eq(schema.codeAssets.status, 'published'));

    const css = assets.find((a) => a.slug === 'global-css')?.content || '';
    const js = assets.find((a) => a.slug === 'global-js')?.content || '';

    return jsonOk({ css, js });
  } catch {
    return jsonOk({ css: '', js: '' });
  }
}
