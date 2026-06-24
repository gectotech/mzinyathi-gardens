'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BookOpen, Calendar, ClipboardList, GraduationCap } from 'lucide-react';
import { GRADE_BUCKETS } from '@/lib/school-grades';

type PortalClass = {
  id: string;
  name: string;
  grade: string;
  subject: string;
  scheduleNote: string | null;
  teacherName: string;
  learnerCount: number;
};

type Teacher = { id: string; name: string; email: string };

type Student = {
  id: string;
  studentNumber: string;
  firstName: string;
  surname: string;
  grade: string;
};

type TimetableSlot = {
  id: string;
  classId: string;
  className: string;
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  slotType: string;
};

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
];

export default function AdminSchoolAcademicsPage() {
  const [tab, setTab] = useState<'classes' | 'timetable' | 'assignments' | 'results'>('classes');
  const [classes, setClasses] = useState<PortalClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classForm, setClassForm] = useState({
    teacherAccountId: '',
    name: '',
    grade: 'Grade 4',
    subject: 'Mathematics',
    scheduleNote: '',
  });
  const [assignForm, setAssignForm] = useState({
    classId: '',
    title: '',
    description: '',
    dueDate: '',
    maxScore: '20',
  });
  const [resultForm, setResultForm] = useState({
    studentId: '',
    subject: 'Mathematics',
    scorePercent: '',
    term: 'Term 2',
    classPosition: '',
    classSize: '30',
  });
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [timetableForm, setTimetableForm] = useState({
    classId: '',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '09:00',
    subject: 'Mathematics',
    room: 'Room 1',
    slotType: 'lesson' as 'lesson' | 'exam',
    examDate: '',
    examPaper: '',
  });
  const [attendanceForm, setAttendanceForm] = useState({
    classId: '',
    studentId: '',
    status: 'present' as 'present' | 'absent' | 'late' | 'excused',
    attendanceDate: new Date().toISOString().slice(0, 10),
  });

  const loadClasses = () => {
    fetch('/api/admin/portal-classes')
      .then((r) => r.json())
      .then((d) => {
        setClasses(d.classes || []);
        setTeachers(d.teachers || []);
      });
  };

  const loadStudents = () => {
    fetch('/api/admin/students')
      .then((r) => r.json())
      .then((d) => setStudents(d.students || []));
  };

  const loadTimetable = (classId?: string) => {
    const q = classId ? `?classId=${classId}` : '';
    fetch(`/api/admin/portal-timetable${q}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots || []));
  };

  useEffect(() => {
    loadClasses();
    loadStudents();
    loadTimetable();
  }, []);

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/portal-classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(classForm),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(`Class "${data.class.name}" created`);
      setClassForm({ ...classForm, name: '', scheduleNote: '' });
      loadClasses();
    } else toast.error(data.error || 'Failed');
  };

  const createAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/portal-assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...assignForm,
        maxScore: Number(assignForm.maxScore),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(`Assignment "${data.assignment.title}" created`);
      setAssignForm({ ...assignForm, title: '', description: '' });
    } else toast.error(data.error || 'Failed');
  };

  const createTimetableSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/portal-timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...timetableForm,
        examDate: timetableForm.slotType === 'exam' ? timetableForm.examDate : undefined,
        examPaper: timetableForm.slotType === 'exam' ? timetableForm.examPaper : undefined,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(`Timetable slot added for ${data.slot.subject}`);
      loadTimetable(timetableForm.classId || undefined);
    } else toast.error(data.error || 'Failed');
  };

  const recordAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/portal-timetable', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendanceForm),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.updated ? 'Attendance updated' : 'Attendance recorded');
    } else toast.error(data.error || 'Failed');
  };

  const publishResult = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/portal-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: resultForm.studentId,
        subject: resultForm.subject,
        scorePercent: Number(resultForm.scorePercent),
        term: resultForm.term,
        classPosition: resultForm.classPosition ? Number(resultForm.classPosition) : undefined,
        classSize: resultForm.classSize ? Number(resultForm.classSize) : undefined,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.updated ? 'Result updated' : 'Result published');
    } else toast.error(data.error || 'Failed');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">School Academics</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Manage portal classes, timetable, assignments, results, and attendance.
        </p>
      </div>

      <div className="flex gap-2 border-b border-[var(--color-border-default)]">
        {[
          { id: 'classes' as const, label: 'Classes', icon: BookOpen },
          { id: 'timetable' as const, label: 'Timetable', icon: Calendar },
          { id: 'assignments' as const, label: 'Assignments', icon: ClipboardList },
          { id: 'results' as const, label: 'Results', icon: GraduationCap },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
                tab === t.id
                  ? 'border-[var(--color-nav-primary)] text-[var(--color-nav-primary)]'
                  : 'border-transparent text-[var(--color-text-muted)]'
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'classes' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={createClass} className="sms-card p-5 space-y-4">
            <h2 className="font-semibold">Create class</h2>
            <label className="block text-sm">
              Teacher
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={classForm.teacherAccountId}
                onChange={(e) => setClassForm((f) => ({ ...f, teacherAccountId: e.target.value }))}
                required
              >
                <option value="">Select teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Class name
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={classForm.name} onChange={(e) => setClassForm((f) => ({ ...f, name: e.target.value }))} placeholder="Grade 4A — Mathematics" required />
            </label>
            <label className="block text-sm">
              Grade
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={classForm.grade} onChange={(e) => setClassForm((f) => ({ ...f, grade: e.target.value }))}>
                {GRADE_BUCKETS.filter((g) => g !== 'Graduated').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Subject
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={classForm.subject} onChange={(e) => setClassForm((f) => ({ ...f, subject: e.target.value }))} required />
            </label>
            <label className="block text-sm">
              Schedule note
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={classForm.scheduleNote} onChange={(e) => setClassForm((f) => ({ ...f, scheduleNote: e.target.value }))} placeholder="Mon–Fri mornings" />
            </label>
            <button type="submit" className="sms-btn-primary w-full">Create class</button>
          </form>

          <div className="sms-card p-5">
            <h2 className="font-semibold mb-4">Active classes ({classes.length})</h2>
            <ul className="space-y-3 text-sm max-h-[480px] overflow-y-auto">
              {classes.map((c) => (
                <li key={c.id} className="p-3 rounded-lg bg-[var(--color-bg-secondary)]">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-[var(--color-text-muted)]">{c.teacherName} · {c.learnerCount} learners</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{c.scheduleNote || c.subject}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === 'timetable' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={createTimetableSlot} className="sms-card p-5 space-y-4">
            <h2 className="font-semibold">Add timetable slot</h2>
            <label className="block text-sm">
              Class
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={timetableForm.classId}
                onChange={(e) => setTimetableForm((f) => ({ ...f, classId: e.target.value }))}
                required
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Day
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={timetableForm.dayOfWeek}
                onChange={(e) => setTimetableForm((f) => ({ ...f, dayOfWeek: Number(e.target.value) }))}
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm">
                Start
                <input type="time" className="mt-1 w-full rounded-lg border px-3 py-2" value={timetableForm.startTime} onChange={(e) => setTimetableForm((f) => ({ ...f, startTime: e.target.value }))} required />
              </label>
              <label className="block text-sm">
                End
                <input type="time" className="mt-1 w-full rounded-lg border px-3 py-2" value={timetableForm.endTime} onChange={(e) => setTimetableForm((f) => ({ ...f, endTime: e.target.value }))} required />
              </label>
            </div>
            <label className="block text-sm">
              Subject
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={timetableForm.subject} onChange={(e) => setTimetableForm((f) => ({ ...f, subject: e.target.value }))} required />
            </label>
            <label className="block text-sm">
              Room
              <input className="mt-1 w-full rounded-lg border px-3 py-2" value={timetableForm.room} onChange={(e) => setTimetableForm((f) => ({ ...f, room: e.target.value }))} required />
            </label>
            <label className="block text-sm">
              Type
              <select className="mt-1 w-full rounded-lg border px-3 py-2" value={timetableForm.slotType} onChange={(e) => setTimetableForm((f) => ({ ...f, slotType: e.target.value as 'lesson' | 'exam' }))}>
                <option value="lesson">Lesson</option>
                <option value="exam">Exam</option>
              </select>
            </label>
            {timetableForm.slotType === 'exam' && (
              <>
                <label className="block text-sm">
                  Exam date
                  <input type="date" className="mt-1 w-full rounded-lg border px-3 py-2" value={timetableForm.examDate} onChange={(e) => setTimetableForm((f) => ({ ...f, examDate: e.target.value }))} />
                </label>
                <label className="block text-sm">
                  Paper
                  <input className="mt-1 w-full rounded-lg border px-3 py-2" value={timetableForm.examPaper} onChange={(e) => setTimetableForm((f) => ({ ...f, examPaper: e.target.value }))} placeholder="Paper 1" />
                </label>
              </>
            )}
            <button type="submit" className="sms-btn-primary w-full">Add slot</button>
          </form>

          <div className="space-y-6">
            <div className="sms-card p-5">
              <h2 className="font-semibold mb-4">Timetable slots ({slots.length})</h2>
              <ul className="space-y-2 text-sm max-h-[280px] overflow-y-auto">
                {slots.map((s) => (
                  <li key={s.id} className="p-3 rounded-lg bg-[var(--color-bg-secondary)]">
                    <p className="font-medium">{s.className} · {s.dayName}</p>
                    <p className="text-[var(--color-text-muted)]">{s.startTime}–{s.endTime} · {s.room}</p>
                    <p className="text-xs">{s.subject}{s.slotType === 'exam' ? ' (exam)' : ''}</p>
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={recordAttendance} className="sms-card p-5 space-y-4">
              <h2 className="font-semibold">Record attendance</h2>
              <label className="block text-sm">
                Class
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={attendanceForm.classId} onChange={(e) => setAttendanceForm((f) => ({ ...f, classId: e.target.value }))} required>
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Student
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={attendanceForm.studentId} onChange={(e) => setAttendanceForm((f) => ({ ...f, studentId: e.target.value }))} required>
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.surname} · {s.studentNumber}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Date
                <input type="date" className="mt-1 w-full rounded-lg border px-3 py-2" value={attendanceForm.attendanceDate} onChange={(e) => setAttendanceForm((f) => ({ ...f, attendanceDate: e.target.value }))} required />
              </label>
              <label className="block text-sm">
                Status
                <select className="mt-1 w-full rounded-lg border px-3 py-2" value={attendanceForm.status} onChange={(e) => setAttendanceForm((f) => ({ ...f, status: e.target.value as typeof attendanceForm.status }))}>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>
              </label>
              <button type="submit" className="sms-btn-primary w-full">Save attendance</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'assignments' && (
        <form onSubmit={createAssignment} className="sms-card p-5 space-y-4 max-w-lg">
          <h2 className="font-semibold">Create assignment</h2>
          <label className="block text-sm">
            Class
            <select className="mt-1 w-full rounded-lg border px-3 py-2" value={assignForm.classId} onChange={(e) => setAssignForm((f) => ({ ...f, classId: e.target.value }))} required>
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Title
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={assignForm.title} onChange={(e) => setAssignForm((f) => ({ ...f, title: e.target.value }))} required />
          </label>
          <label className="block text-sm">
            Description
            <textarea className="mt-1 w-full rounded-lg border px-3 py-2" rows={2} value={assignForm.description} onChange={(e) => setAssignForm((f) => ({ ...f, description: e.target.value }))} />
          </label>
          <label className="block text-sm">
            Due date
            <input type="date" className="mt-1 w-full rounded-lg border px-3 py-2" value={assignForm.dueDate} onChange={(e) => setAssignForm((f) => ({ ...f, dueDate: e.target.value }))} required />
          </label>
          <label className="block text-sm">
            Max score
            <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={assignForm.maxScore} onChange={(e) => setAssignForm((f) => ({ ...f, maxScore: e.target.value }))} />
          </label>
          <button type="submit" className="sms-btn-primary">Create & notify enrolled students</button>
        </form>
      )}

      {tab === 'results' && (
        <form onSubmit={publishResult} className="sms-card p-5 space-y-4 max-w-lg">
          <h2 className="font-semibold">Publish result</h2>
          <label className="block text-sm">
            Student
            <select className="mt-1 w-full rounded-lg border px-3 py-2" value={resultForm.studentId} onChange={(e) => setResultForm((f) => ({ ...f, studentId: e.target.value }))} required>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.firstName} {s.surname} · {s.studentNumber}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Subject
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={resultForm.subject} onChange={(e) => setResultForm((f) => ({ ...f, subject: e.target.value }))} required />
          </label>
          <label className="block text-sm">
            Score (%)
            <input type="number" min={0} max={100} className="mt-1 w-full rounded-lg border px-3 py-2" value={resultForm.scorePercent} onChange={(e) => setResultForm((f) => ({ ...f, scorePercent: e.target.value }))} required />
          </label>
          <label className="block text-sm">
            Term
            <input className="mt-1 w-full rounded-lg border px-3 py-2" value={resultForm.term} onChange={(e) => setResultForm((f) => ({ ...f, term: e.target.value }))} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              Class position
              <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={resultForm.classPosition} onChange={(e) => setResultForm((f) => ({ ...f, classPosition: e.target.value }))} />
            </label>
            <label className="block text-sm">
              Class size
              <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" value={resultForm.classSize} onChange={(e) => setResultForm((f) => ({ ...f, classSize: e.target.value }))} />
            </label>
          </div>
          <button type="submit" className="sms-btn-primary">Publish to student portal</button>
        </form>
      )}
    </div>
  );
}
