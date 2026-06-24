import { jsonOk, handleAuthError } from '@/lib/api-utils';
import { requirePortalRole, getStudentForAccount } from '@/lib/portal-api-helpers';
import {
  getStudentDashboard,
  getStudentAssignments,
  getStudentResults,
  getStudentTimetable,
} from '@/lib/portal-academics';

export async function GET(request: Request) {
  try {
    const { error, account } = await requirePortalRole('student');
    if (error) return error;

    const student = await getStudentForAccount(account!);
    if (!student) return jsonOk({ items: [], exams: [] });

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'dashboard';

    if (view === 'assignments') {
      return jsonOk({ items: await getStudentAssignments(student.id) });
    }
    if (view === 'results') {
      const data = await getStudentResults(student.id);
      return jsonOk(data);
    }
    if (view === 'timetable') {
      return jsonOk(await getStudentTimetable(student.id));
    }

    return jsonOk(await getStudentDashboard(student.id, student.grade));
  } catch (err) {
    return handleAuthError(err);
  }
}
