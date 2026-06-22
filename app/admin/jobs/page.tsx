'use client';

import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Copy,
  ExternalLink,
  Briefcase,
  Power,
  PowerOff,
  Search,
  X,
} from 'lucide-react';
import ViewDrawer from '@/components/admin/ViewDrawer';
import StatusBadge from '@/components/admin/StatusBadge';
import { DetailSection, DetailRow } from '@/components/admin/DetailSection';

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  tagline: string;
  jobType: string;
  isActive: boolean;
  requirements: string[];
  responsibilities: string[];
  createdAt?: string;
  updatedAt?: string;
};

type JobFormData = {
  title: string;
  department: string;
  location: string;
  tagline: string;
  jobType: string;
  isActive: boolean;
  requirementsText: string;
  responsibilitiesText: string;
};

const emptyForm: JobFormData = {
  title: '',
  department: '',
  location: 'Mzinyathi Gardens',
  tagline: '',
  jobType: 'Full-time',
  isActive: true,
  requirementsText: '',
  responsibilitiesText: '',
};

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];
const DEPARTMENTS = ['Security', 'Construction', 'Administration', 'Teaching', 'Sales', 'Maintenance', 'Finance', 'Other'];

function linesToArray(text: string) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToLines(arr: string[] | null | undefined) {
  return (arr || []).join('\n');
}

function jobToForm(job: Job): JobFormData {
  return {
    title: job.title,
    department: job.department,
    location: job.location,
    tagline: job.tagline,
    jobType: job.jobType,
    isActive: job.isActive,
    requirementsText: arrayToLines(job.requirements),
    responsibilitiesText: arrayToLines(job.responsibilities),
  };
}

function formToPayload(form: JobFormData, id?: string) {
  return {
    ...(id ? { id } : {}),
    title: form.title.trim(),
    department: form.department.trim(),
    location: form.location.trim() || 'Mzinyathi Gardens',
    tagline: form.tagline.trim(),
    jobType: form.jobType,
    isActive: form.isActive,
    requirements: linesToArray(form.requirementsText),
    responsibilities: linesToArray(form.responsibilitiesText),
  };
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<JobFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const load = () => {
    fetch('/api/admin/jobs')
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      if (filter === 'active' && !job.isActive) return false;
      if (filter === 'inactive' && job.isActive) return false;
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    });
  }, [jobs, search, filter]);

  const stats = useMemo(
    () => ({
      total: jobs.length,
      active: jobs.filter((j) => j.isActive).length,
      inactive: jobs.filter((j) => !j.isActive).length,
    }),
    [jobs]
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (job: Job) => {
    setEditingId(job.id);
    setForm(jobToForm(job));
    setShowForm(true);
    setViewing(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = formToPayload(form, editingId || undefined);
    const res = await fetch('/api/admin/jobs', {
      method: editingId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(editingId ? 'Job updated' : 'Job created');
      cancelForm();
      load();
    } else {
      const d = await res.json();
      toast.error(d.error || 'Save failed');
    }
  };

  const toggleActive = async (job: Job) => {
    const res = await fetch('/api/admin/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...job, isActive: !job.isActive }),
    });
    if (res.ok) {
      toast.success(job.isActive ? 'Job hidden from careers page' : 'Job published');
      load();
      if (viewing?.id === job.id) {
        setViewing({ ...job, isActive: !job.isActive });
      }
    }
  };

  const duplicate = async (job: Job) => {
    const res = await fetch('/api/admin/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `${job.title} (Copy)`,
        department: job.department,
        location: job.location,
        tagline: job.tagline,
        jobType: job.jobType,
        requirements: job.requirements || [],
        responsibilities: job.responsibilities || [],
        isActive: false,
      }),
    });
    if (res.ok) {
      toast.success('Job duplicated as draft');
      load();
    }
  };

  const remove = async (job: Job) => {
    if (!confirm(`Delete "${job.title}"? Applications linked to this job may be affected.`)) return;
    const res = await fetch(`/api/admin/jobs?id=${job.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Job deleted');
      if (viewing?.id === job.id) setViewing(null);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">Job Listings</h1>
          <p className="text-gray-600 text-sm">Create, edit, publish, and manage careers page positions</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-[#4169E1] text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} /> Add Job
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-lg">
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total jobs</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center border-green-200">
          <p className="text-2xl font-bold text-green-700">{stats.active}</p>
          <p className="text-xs text-gray-500">Published</p>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
          <p className="text-xs text-gray-500">Draft / hidden</p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">{editingId ? 'Edit job' : 'New job listing'}</h2>
            <button type="button" onClick={cancelForm} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Job title *"
              required
              className="border rounded-lg px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              list="departments"
              placeholder="Department *"
              required
              className="border rounded-lg px-3 py-2"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <datalist id="departments">
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
            <input
              placeholder="Location"
              className="border rounded-lg px-3 py-2"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <select
              className="border rounded-lg px-3 py-2"
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              placeholder="Tagline / short description *"
              required
              className="border rounded-lg px-3 py-2 md:col-span-2"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
            <textarea
              className="border rounded-lg px-3 py-2 md:col-span-2 min-h-[100px]"
              placeholder="Requirements (one per line)"
              value={form.requirementsText}
              onChange={(e) => setForm({ ...form, requirementsText: e.target.value })}
            />
            <textarea
              className="border rounded-lg px-3 py-2 md:col-span-2 min-h-[100px]"
              placeholder="Responsibilities (one per line)"
              value={form.responsibilitiesText}
              onChange={(e) => setForm({ ...form, responsibilitiesText: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              Publish on careers page immediately
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium">
              {editingId ? 'Save changes' : 'Create job'}
            </button>
            <button type="button" onClick={cancelForm} className="border px-5 py-2 rounded-lg text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
        >
          <option value="all">All jobs</option>
          <option value="active">Published only</option>
          <option value="inactive">Hidden only</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Department</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Location</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  {jobs.length === 0 ? 'No jobs yet — click Add Job to create one.' : 'No jobs match your search.'}
                </td>
              </tr>
            ) : (
              filtered.map((job) => (
                <tr key={job.id} className="border-t hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 max-w-xs">{job.tagline}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{job.department}</td>
                  <td className="px-4 py-3 text-gray-600">{job.jobType}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{job.location}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={job.isActive ? 'published' : 'draft'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <ActionBtn icon={<Eye size={13} />} label="View" onClick={() => setViewing(job)} />
                      <ActionBtn icon={<Pencil size={13} />} label="Edit" onClick={() => openEdit(job)} />
                      <ActionBtn
                        icon={job.isActive ? <PowerOff size={13} /> : <Power size={13} />}
                        label={job.isActive ? 'Hide' : 'Publish'}
                        onClick={() => toggleActive(job)}
                      />
                      <ActionBtn icon={<Copy size={13} />} label="Copy" onClick={() => duplicate(job)} />
                      <ActionBtn
                        icon={<Trash2 size={13} />}
                        label="Delete"
                        onClick={() => remove(job)}
                        danger
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ViewDrawer
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.title || ''}
        subtitle={viewing?.department}
        badge={viewing ? <StatusBadge status={viewing.isActive ? 'published' : 'draft'} /> : undefined}
        headerIcon={<Briefcase size={22} className="text-white" />}
        width="lg"
        footer={
          viewing && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openEdit(viewing)}
                className="inline-flex items-center gap-2 bg-[#4169E1] text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Pencil size={14} /> Edit job
              </button>
              <button
                type="button"
                onClick={() => toggleActive(viewing)}
                className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                {viewing.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                {viewing.isActive ? 'Unpublish' : 'Publish'}
              </button>
              <button
                type="button"
                onClick={() => duplicate(viewing)}
                className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
              >
                <Copy size={14} /> Duplicate
              </button>
              {viewing.isActive && (
                <Link
                  href="/careers"
                  target="_blank"
                  className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  <ExternalLink size={14} /> View on site
                </Link>
              )}
              <button
                type="button"
                onClick={() => remove(viewing)}
                className="inline-flex items-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-50 ml-auto"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )
        }
      >
        {viewing && (
          <>
            <DetailSection title="Overview">
              <DetailRow label="Tagline" value={viewing.tagline} />
              <DetailRow label="Location" value={viewing.location} />
              <DetailRow label="Job type" value={viewing.jobType} />
              <DetailRow label="Status" value={viewing.isActive ? 'Live on /careers' : 'Hidden (draft)'} />
              {viewing.createdAt && (
                <DetailRow label="Created" value={new Date(viewing.createdAt).toLocaleString()} />
              )}
              {viewing.updatedAt && (
                <DetailRow label="Last updated" value={new Date(viewing.updatedAt).toLocaleString()} />
              )}
            </DetailSection>

            {viewing.requirements?.length > 0 && (
              <DetailSection title="Requirements">
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5">
                  {viewing.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </DetailSection>
            )}

            {viewing.responsibilities?.length > 0 && (
              <DetailSection title="Responsibilities">
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5">
                  {viewing.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </DetailSection>
            )}

            {!viewing.requirements?.length && !viewing.responsibilities?.length && (
              <p className="text-sm text-gray-500 italic">No requirements or responsibilities added yet. Click Edit to add them.</p>
            )}
          </>
        )}
      </ViewDrawer>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition ${
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-gray-700 hover:bg-slate-100 border border-transparent hover:border-slate-200'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
