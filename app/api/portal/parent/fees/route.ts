import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { getFeesForStudents, summarizeFees } from '@/lib/portal-fees';
import { loadParentChildren } from '@/lib/portal-service';
import { getPortalSession } from '@/lib/portal-session';

export async function GET() {
  try {
    const session = await getPortalSession();
    if (!session || session.role !== 'parent') {
      return jsonError('Unauthorized', 401);
    }

    const children = await loadParentChildren(session.email);
    const studentIds = children.map((c) => c.studentId);
    const items = await getFeesForStudents(studentIds);
    const summary = summarizeFees(items);

    return jsonOk({ items, summary, children });
  } catch (error) {
    return handleAuthError(error);
  }
}
