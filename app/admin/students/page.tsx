'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Rocket, Trash2, UserPlus, Eye, Wallet } from 'lucide-react';
import VirtualDataTable, { type VirtualColumn } from '@/components/admin/VirtualDataTable';
import FloatingActionBar from '@/components/admin/FloatingActionBar';
import StatusBadge from '@/components/admin/StatusBadge';
import { GRADE_BUCKETS, type GradeBucket } from '@/lib/school-grades';

type Student = {
  id: string;
  studentNumber: string;
  firstName: string;
  surname: string;
  gender: string;
  grade: string;
  status: string;
  graduatedYear: number | null;
  parentPhone: string | null;
  createdAt: string;
};

export default function AdminStudentsPage() {
  const [gradeFilter, setGradeFilter] = useState<GradeBucket>('Grade 4');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [feeForm, setFeeForm] = useState({ description: '', amount: '', dueDate: '' });

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/students?grade=${encodeURIComponent(gradeFilter)}`)
      .then((r) => r.json())
      .then((d) => setStudents(d.students || []))
      .finally(() => setLoading(false));
  }, [gradeFilter]);

  useEffect(() => {
    load();
    setSelectedIds([]);
  }, [load]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const bulkPromote = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Promote ${selectedIds.length} selected student(s)? Student numbers will not change.`)) return;
    const res = await fetch('/api/admin/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'promote', ids: selectedIds }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(`Promoted ${data.promoted}, graduated ${data.graduated}`);
      load();
      setSelectedIds([]);
    } else toast.error(data.error || 'Promotion failed');
  };

  const promoteEntireGrade = async () => {
    if (!confirm(`Promote entire ${gradeFilter} cohort to the next grade?`)) return;
    const res = await fetch('/api/admin/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'promote_grade', ids: [], grade: gradeFilter }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(`Grade promotion complete: ${data.promoted} promoted, ${data.graduated} graduated`);
      load();
    } else toast.error(data.error || 'Promotion failed');
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} student record(s)?`)) return;
    const res = await fetch('/api/admin/students', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(`Deleted ${data.deleted} record(s)`);
      load();
      setSelectedIds([]);
    } else toast.error(data.error || 'Delete failed');
  };

  const selectedStudent = selectedIds.length === 1 ? students.find((s) => s.id === selectedIds[0]) : null;

  const issueFeeInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const amountCents = Math.round(parseFloat(feeForm.amount) * 100);
    if (!feeForm.description || !amountCents) {
      toast.error('Description and amount are required');
      return;
    }
    const res = await fetch('/api/admin/fee-invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: selectedStudent.id,
        description: feeForm.description,
        amountCents,
        dueDate: feeForm.dueDate || undefined,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(`Invoice ${data.invoice.reference} created (${data.invoice.amount})`);
      setFeeModalOpen(false);
      setFeeForm({ description: '', amount: '', dueDate: '' });
    } else {
      toast.error(data.error || 'Failed to create invoice');
    }
  };

  const columns: VirtualColumn<Student>[] = [
    {
      key: 'select',
      header: '',
      width: '48px',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => toggleSelect(row.id)}
          aria-label={`Select ${row.firstName}`}
        />
      ),
    },
    {
      key: 'studentNumber',
      header: 'Student Number',
      width: '140px',
      render: (row) => <span className="font-mono text-xs">{row.studentNumber}</span>,
    },
    {
      key: 'name',
      header: 'Full Name',
      width: '1.5fr',
      render: (row) => (
        <span className="font-medium">
          {row.firstName} {row.surname}
        </span>
      ),
    },
    {
      key: 'gender',
      header: 'Gender',
      width: '100px',
      render: (row) => row.gender,
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '160px',
      render: () => (
        <span className="inline-flex gap-2 text-xs text-[var(--color-nav-primary)]">
          <Eye size={14} /> View
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Student Roster</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Grade buckets · virtualized grid · bulk promotion (R6–R11)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={promoteEntireGrade} className="sms-btn-secondary inline-flex items-center gap-2">
            <Rocket size={16} /> Promote Entire Grade
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-nav-primary)] hover:bg-[var(--color-bg-secondary)]"
          >
            <UserPlus size={16} /> Add Student
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Grade sidebar */}
        <aside className="lg:w-52 shrink-0 sms-card p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] px-2 mb-2">
            Grades
          </p>
          <nav className="space-y-0.5">
            {GRADE_BUCKETS.map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setGradeFilter(grade)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  gradeFilter === grade
                    ? 'bg-[var(--color-nav-primary)] text-white font-medium'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                }`}
              >
                {grade}
              </button>
            ))}
          </nav>
        </aside>

        {/* Virtual data grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[var(--color-text-primary)]">{gradeFilter}</h2>
            <span className="text-xs text-[var(--color-text-muted)]">
              {loading ? 'Loading…' : `${students.length} students`}
            </span>
          </div>
          <VirtualDataTable
            rows={students}
            columns={columns}
            getRowKey={(r) => r.id}
            maxHeight={560}
            emptyMessage={`No students in ${gradeFilter} yet. Enrol from accepted admissions.`}
          />
        </div>
      </div>

      <FloatingActionBar
        selectedCount={selectedIds.length}
        itemLabel="student"
        onClearSelection={() => setSelectedIds([])}
        actions={[
          ...(selectedStudent
            ? [
                {
                  id: 'invoice',
                  label: 'Issue Fee Invoice',
                  icon: <Wallet size={14} />,
                  onClick: () => setFeeModalOpen(true),
                  variant: 'primary' as const,
                },
              ]
            : []),
          {
            id: 'promote',
            label: 'Bulk Promote',
            icon: <Rocket size={14} />,
            onClick: bulkPromote,
            variant: 'primary',
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: <Trash2 size={14} />,
            onClick: bulkDelete,
            variant: 'danger',
          },
        ]}
      />

      {feeModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={issueFeeInvoice}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4"
          >
            <h3 className="text-lg font-bold">Issue fee invoice</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {selectedStudent.firstName} {selectedStudent.surname} · {selectedStudent.studentNumber}
            </p>
            <label className="block text-sm">
              <span className="font-medium">Description</span>
              <input
                className="mt-1 w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
                value={feeForm.description}
                onChange={(e) => setFeeForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Term 3 tuition"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Amount (USD)</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="mt-1 w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
                value={feeForm.amount}
                onChange={(e) => setFeeForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="120.00"
                required
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Due date (optional)</span>
              <input
                type="date"
                className="mt-1 w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
                value={feeForm.dueDate}
                onChange={(e) => setFeeForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFeeModalOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border border-[var(--color-border-default)]"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-[var(--color-nav-primary)] text-white">
                Create invoice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
