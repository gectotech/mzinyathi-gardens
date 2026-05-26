import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk, handleAuthError } from '@/lib/api-utils';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = getDb();
    const [page] = await db
      .select()
      .from(schema.sitePages)
      .where(eq(schema.sitePages.slug, slug))
      .limit(1);

    if (!page || page.status !== 'published') {
      return jsonOk({ page: null });
    }

    return jsonOk({
      page: {
        slug: page.slug,
        title: page.title,
        metaDescription: page.metaDescription,
        sections: page.sections,
        customCss: page.customCss,
        customJs: page.customJs,
        htmlContent: page.htmlContent,
      },
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
