import { jsonOk, handleAuthError } from '@/lib/api-utils';
import { requirePortalRole } from '@/lib/portal-api-helpers';
import {
  getTeacherDashboard,
  getTeacherClasses,
  getTeacherTimetable,
  getTeacherAttendanceSummary,
  getTeacherGradeProgress,
  getTeacherResources,
} from '@/lib/portal-academics';

export async function GET(request: Request) {
  try {
    const { error, account } = await requirePortalRole('teacher');
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'dashboard';

    const teacherId = account!.id;

    if (view === 'classes') return jsonOk({ items: await getTeacherClasses(teacherId) });
    if (view === 'timetable') return jsonOk({ items: await getTeacherTimetable(teacherId) });
    if (view === 'attendance') {
      const data = await getTeacherAttendanceSummary(teacherId);
      return jsonOk({ items: data.items, weeklyAverage: data.weeklyAverage });
    }
    if (view === 'grades') return jsonOk({ items: await getTeacherGradeProgress(teacherId) });
    if (view === 'resources') return jsonOk({ items: await getTeacherResources(teacherId) });

    return jsonOk(await getTeacherDashboard(teacherId));
  } catch (err) {
    return handleAuthError(err);
  }
}
