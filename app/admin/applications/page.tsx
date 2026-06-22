'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Briefcase, FileText, ExternalLink } from 'lucide-react';
import ExportPanel from '@/components/admin/ExportPanel';
import ViewDrawer from '@/components/admin/ViewDrawer';
import StatusBadge from '@/components/admin/StatusBadge';
import { DetailSection, DetailRow, DetailMessage } from '@/components/admin/DetailSection';

type Application = {
  id: string;
  trackingId: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  jobTitle: string;
  department: string;
  nationalId: string;
  dob: string;
  address: string;
  education: string;
  institution: string;
  fieldOfStudy: string;
  previousEmployer: string | null;
  skills: string;
  experience: string;
  interestMessage: string | null;
  resumeUrl: string | null;
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
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <p className="text-gray-600 text-sm">Review candidates and track hiring status</p>
      </div>

      <ExportPanel endpoint="/api/admin/applications" filename="job-applications.csv" />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Applicant</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Job</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tracking ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-t hover:bg-slate-50/80 transition">
                <td className="px-4 py-3 font-medium">{app.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{app.jobTitle}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{app.trackingId}</td>
                <td className="px-4 py-3">
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="border rounded-lg px-2 py-1 text-xs bg-white"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelected(app)}
                    className="inline-flex items-center gap-1.5 text-[#4169E1] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  >
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ViewDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.fullName || ''}
        subtitle={selected?.jobTitle}
        badge={selected ? <StatusBadge status={selected.status} /> : undefined}
        headerIcon={<Briefcase size={22} className="text-white" />}
        width="xl"
        footer={
          selected && (
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${selected.email}`} className="bg-[#4169E1] text-white px-4 py-2 rounded-lg text-sm font-medium">
                Email applicant
              </a>
              {selected.resumeUrl && (
                <a
                  href={selected.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  <FileText size={16} /> View resume
                </a>
              )}
            </div>
          )
        }
      >
        {selected && (
          <>
            <DetailSection title="Application">
              <DetailRow label="Tracking ID" value={selected.trackingId} mono />
              <DetailRow label="Submitted" value={new Date(selected.createdAt).toLocaleString()} />
              <DetailRow label="Position" value={selected.jobTitle} />
              <DetailRow label="Department" value={selected.department} />
            </DetailSection>

            <DetailSection title="Contact">
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Phone" value={selected.phone} />
              <DetailRow label="National ID" value={selected.nationalId} />
              <DetailRow label="Date of birth" value={selected.dob} />
              <DetailRow label="Address" value={selected.address} />
            </DetailSection>

            <DetailSection title="Education & experience">
              <DetailRow label="Education" value={selected.education} />
              <DetailRow label="Institution" value={selected.institution} />
              <DetailRow label="Field of study" value={selected.fieldOfStudy} />
              <DetailRow label="Previous employer" value={selected.previousEmployer} />
              <DetailRow label="Skills" value={selected.skills} />
            </DetailSection>

            {selected.experience && (
              <DetailSection title="Work experience">
                <DetailMessage>{selected.experience}</DetailMessage>
              </DetailSection>
            )}

            {selected.interestMessage && (
              <DetailSection title="Cover message">
                <DetailMessage>{selected.interestMessage}</DetailMessage>
              </DetailSection>
            )}

            {selected.resumeUrl && (
              <DetailSection title="Resume">
                <a
                  href={selected.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#4169E1] text-sm font-medium hover:underline"
                >
                  <ExternalLink size={14} /> Open resume / CV
                </a>
              </DetailSection>
            )}
          </>
        )}
      </ViewDrawer>
    </div>
  );
}
