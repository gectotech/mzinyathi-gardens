'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  tagline: string;
  jobType: string;
  isActive: boolean;
};

const emptyJob = {
  title: '',
  department: '',
  location: 'Mzinyathi Gardens',
  tagline: '',
  jobType: 'Full-time',
  isActive: true,
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState(emptyJob);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    fetch('/api/admin/jobs')
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs || []));
  };

  useEffect(load, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('Job created');
      setForm(emptyJob);
      setShowForm(false);
      load();
    }
  };

  const toggleActive = async (job: Job) => {
    await fetch('/api/admin/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...job, isActive: !job.isActive }),
    });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    await fetch(`/api/admin/jobs?id=${id}`, { method: 'DELETE' });
    toast.success('Job deleted');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Listings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-[#4169E1] text-white px-4 py-2 rounded-md"
        >
          <Plus size={18} /> Add Job
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4">
          <input placeholder="Title" required className="border rounded px-3 py-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Department" required className="border rounded px-3 py-2" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <input placeholder="Location" className="border rounded px-3 py-2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <input placeholder="Job Type" className="border rounded px-3 py-2" value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })} />
          <input placeholder="Tagline" required className="border rounded px-3 py-2 md:col-span-2" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded md:col-span-2">Save Job</button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Active</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t">
                <td className="px-4 py-3">{job.title}</td>
                <td className="px-4 py-3">{job.department}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(job)} className={`text-xs px-2 py-1 rounded ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => remove(job.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
