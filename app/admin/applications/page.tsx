'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ExportPanel from '@/components/admin/ExportPanel';

type Application = {
  id: string;
  trackingId: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  jobTitle: string;
  nationalId: string;
  skills: string;
  experience: string;
  createdAt: string;
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);

  const load = () => {
    fetch('/api/admin/applications')
      .then((r) => r.json())
      .then((d) => setApplications(d.applications || []));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success('Status updated');
      load();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Job Applications</h1>
      <ExportPanel endpoint="/api/admin/applications" filename="job-applications.csv" />
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Applicant</th>
              <th className="px-4 py-3 text-left">Job</th>
              <th className="px-4 py-3 text-left">Tracking ID</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t">
                <td className="px-4 py-3">{app.fullName}</td>
                <td className="px-4 py-3">{app.jobTitle}</td>
                <td className="px-4 py-3 font-mono text-xs">{app.trackingId}</td>
                <td className="px-4 py-3">
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </td>
                <td className="px-4 py-3">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelected(app)} className="text-[#4169E1] hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selected.fullName}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 text-2xl">×</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <p><strong>Job:</strong> {selected.jobTitle}</p>
              <p><strong>Tracking:</strong> {selected.trackingId}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p><strong>National ID:</strong> {selected.nationalId}</p>
              <p><strong>Skills:</strong> {selected.skills}</p>
            </div>
            <p className="mt-4 text-sm"><strong>Experience:</strong></p>
            <p className="text-gray-700 whitespace-pre-wrap">{selected.experience}</p>
          </div>
        </div>
      )}
    </div>
  );
}
