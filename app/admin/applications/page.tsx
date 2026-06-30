'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Briefcase, FileText, ExternalLink, X, Download } from 'lucide-react';
import ExportPanel from '@/components/admin/ExportPanel';
import ViewDrawer from '@/components/admin/ViewDrawer';
import StatusBadge from '@/components/admin/StatusBadge';
import InterviewStatusControl from '@/components/admin/InterviewStatusControl';
import ApplicationBulkTools from '@/components/admin/ApplicationBulkTools';
import { DetailSection, DetailRow, DetailMessage } from '@/components/admin/DetailSection';
import DataTableShell from '@/components/ui/DataTableShell';

// ─── Types ────────────────────────────────────────────────────────────────────

type DocItem = { label: string; url: string };

type Application = {
  id: string;
  trackingId: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  interviewScheduledAt: string | null;
  jobTitle: string;
  department: string;
  nationalId: string;
  dob: string;
  gender: string;
  address: string;
  education: string;
  institution: string;
  fieldOfStudy: string;
  previousEmployer: string | null;
  skills: string;
  experience: string;
  interestMessage: string | null;
  resumeUrl: string | null;
  documents: DocItem[] | null;
  createdAt: string;
};

const STATUS_OPTIONS = [
  { value: 'submitted',    label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'shortlisted',  label: 'Shortlisted' },
  { value: 'interview',    label: 'Interview' },
  { value: 'rejected',     label: 'Rejected' },
  { value: 'hired',        label: 'Hired' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Detect file type from the URL path/extension.
 * Cloudinary stores PDFs under /image/upload/ with a .pdf extension,
 * so we must check extension FIRST before checking the upload path.
 */
function getFileType(url: string): 'pdf' | 'word' | 'image' | 'other' {
  const clean = url.split('?')[0].toLowerCase();
  // Extension takes priority
  if (clean.endsWith('.pdf'))                             return 'pdf';
  if (clean.endsWith('.doc') || clean.endsWith('.docx')) return 'word';
  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(clean)) return 'image';
  // Fallback to path hints
  if (clean.includes('/raw/upload/'))                    return 'pdf';
  if (clean.includes('/image/upload/'))                  return 'image';
  return 'other';
}

/**
 * Route ALL Cloudinary URLs through our streaming proxy.
 * This solves:
 *  - CORS issues (cross-origin iframe embedding)
 *  - CSP issues (frame-src restrictions)
 *  - 401 on private/authenticated assets
 *  - Cloudinary forcing download instead of inline display
 */
function proxyUrl(url: string, download = false): string {
  if (!url) return url;
  const base = `/api/admin/media/view?url=${encodeURIComponent(url)}`;
  return download ? `${base}&download=1` : base;
}

/** Build the full document list from structured array + legacy resumeUrl */
function buildDocList(app: Application): DocItem[] {
  const docs: DocItem[] = [];
  if (Array.isArray(app.documents)) {
    for (const d of app.documents) {
      if (d?.url) docs.push({ label: d.label || 'Document', url: d.url });
    }
  }
  if (app.resumeUrl) {
    const alreadyIn = docs.some((d) => d.url === app.resumeUrl);
    if (!alreadyIn) docs.push({ label: 'CV / Resume', url: app.resumeUrl });
  }
  return docs;
}

function FileTypeBadge({ type }: { type: ReturnType<typeof getFileType> }) {
  const styles = {
    pdf:   'bg-red-50   text-red-600   border-red-200',
    word:  'bg-blue-50  text-blue-600  border-blue-200',
    image: 'bg-green-50 text-green-700 border-green-200',
    other: 'bg-gray-100 text-gray-500  border-gray-200',
  };
  const labels = { pdf: 'PDF', word: 'DOC', image: 'IMG', other: 'FILE' };
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

// ─── Document Viewer Modal ────────────────────────────────────────────────────

function DocumentViewer({ doc, onClose }: { doc: DocItem; onClose: () => void }) {
  const type    = getFileType(doc.url);
  // All files streamed through our proxy — solves CORS + auth + inline display
  const viewUrl = proxyUrl(doc.url);
  // Word: Office Online fetches from our proxy (publicly reachable URL needed)
  // We open it directly in a new tab instead since Office Online can't reach localhost
  const openWord = () => window.open(viewUrl, '_blank');

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex flex-col" onClick={onClose}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <FileTypeBadge type={type} />
          <span className="text-sm font-semibold truncate">{doc.label}</span>
        </div>
        <div className="flex items-center gap-2 ml-4 shrink-0">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={13} /> Open in new tab
          </a>
          <a
            href={proxyUrl(doc.url, true)}
            className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={13} /> Download
          </a>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Viewer body */}
      <div className="flex-1 overflow-hidden bg-gray-200" onClick={(e) => e.stopPropagation()}>

        {/* PDF — streamed inline through proxy */}
        {type === 'pdf' && (
          <iframe
            src={viewUrl}
            className="w-full h-full border-0 bg-white"
            title={doc.label}
          />
        )}

        {/* Word — can't iframe, show download prompt */}
        {type === 'word' && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-white">
            <FileText size={64} className="text-blue-300" />
            <p className="text-base font-semibold text-gray-700">{doc.label}</p>
            <p className="text-sm text-gray-500">Word documents cannot be previewed inline.</p>
            <div className="flex gap-3">
              <button
                onClick={openWord}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                <ExternalLink size={15} /> Open in new tab
              </button>
              <a
                href={proxyUrl(doc.url, true)}
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
              >
                <Download size={15} /> Download
              </a>
            </div>
          </div>
        )}

        {/* Image */}
        {type === 'image' && (
          <div className="w-full h-full flex items-center justify-center p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={viewUrl}
              alt={doc.label}
              className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
            />
          </div>
        )}

        {/* Other */}
        {type === 'other' && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-white">
            <FileText size={64} className="text-gray-300" />
            <p className="text-sm text-gray-500 font-medium">
              This file cannot be previewed — use the buttons above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Document Gallery ─────────────────────────────────────────────────────────

function DocumentGallery({ docs }: { docs: DocItem[] }) {
  const [viewing, setViewing] = useState<DocItem | null>(null);

  if (!docs.length) {
    return <p className="text-sm text-gray-400 italic">No documents uploaded</p>;
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        {docs.map((doc, i) => {
          const type = getFileType(doc.url);
          return (
            <div
              key={i}
              className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition cursor-pointer group"
              onClick={() => setViewing(doc)}
            >
              {/* Thumbnail */}
              <div className="h-28 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                {type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={proxyUrl(doc.url)}
                    alt={doc.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : type === 'pdf' ? (
                  <div className="flex flex-col items-center gap-1.5 text-red-400">
                    <FileText size={36} />
                    <span className="text-xs font-semibold text-red-500">PDF Document</span>
                  </div>
                ) : type === 'word' ? (
                  <div className="flex flex-col items-center gap-1.5 text-blue-500">
                    <FileText size={36} />
                    <span className="text-xs font-semibold text-blue-600">Word Document</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-gray-400">
                    <FileText size={36} />
                    <span className="text-xs font-semibold text-gray-500">File</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1.5 rounded-full">
                    Click to view
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-3 py-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileTypeBadge type={type} />
                  <span className="text-xs font-medium text-gray-700 truncate">{doc.label}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setViewing(doc); }}
                  className="text-[#4169E1] text-xs flex items-center gap-1 shrink-0 hover:underline font-medium"
                >
                  <ExternalLink size={11} /> Open
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {viewing && (
        <DocumentViewer doc={viewing} onClose={() => setViewing(null)} />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selected, setSelected]         = useState<Application | null>(null);
  const [selectedIds, setSelectedIds]   = useState<string[]>([]);

  const load = () => {
    fetch('/api/admin/applications')
      .then((r) => r.json())
      .then((d) => setApplications(d.applications || []));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string, interviewScheduledAt: string | null) => {
    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, interviewScheduledAt }),
    });
    if (res.ok) {
      toast.success('Status updated');
      load();
      if (selected?.id === id) setSelected({ ...selected, status, interviewScheduledAt });
    } else {
      const data = await res.json();
      toast.error(data.error || 'Update failed');
    }
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () =>
    setSelectedIds(
      selectedIds.length === applications.length ? [] : applications.map((a) => a.id)
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <p className="text-gray-600 text-sm">Review candidates and track hiring status</p>
      </div>

      <ExportPanel endpoint="/api/admin/applications" filename="job-applications.xlsx" />

      <ApplicationBulkTools
        endpoint="/api/admin/applications"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onDeleted={load}
        totalCount={applications.length}
      />

      <div className="bg-white rounded-xl shadow-sm border">
        <DataTableShell>
        <table className="min-w-[920px] w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={applications.length > 0 && selectedIds.length === applications.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Applicant</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Job</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tracking ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 sticky right-0 bg-slate-50 shadow-[-8px_0_12px_-8px_rgba(15,23,42,0.08)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  No applications yet
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-t hover:bg-slate-50/80 transition group">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(app.id)}
                      onChange={() => toggleSelect(app.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{app.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{app.jobTitle}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{app.trackingId}</td>
                  <td className="px-4 py-3 min-w-[160px]">
                    <InterviewStatusControl
                      status={app.status}
                      interviewScheduledAt={app.interviewScheduledAt}
                      statusOptions={STATUS_OPTIONS}
                      onSave={(status, interviewScheduledAt) =>
                        updateStatus(app.id, status, interviewScheduledAt)
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 sticky right-0 bg-white group-hover:bg-slate-50/80 shadow-[-8px_0_12px_-8px_rgba(15,23,42,0.12)]">
                    <button
                      onClick={() => setSelected(app)}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#4169E1] hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-medium transition min-h-[44px]"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </DataTableShell>
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
              <a
                href={`mailto:${selected.email}`}
                className="bg-[#4169E1] text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Email applicant
              </a>
            </div>
          )
        }
      >
        {selected && (
          <>
            <DetailSection title="Application">
              <DetailRow label="Tracking ID"  value={selected.trackingId} mono />
              <DetailRow label="Submitted"    value={new Date(selected.createdAt).toLocaleString()} />
              <DetailRow label="Position"     value={selected.jobTitle} />
              <DetailRow label="Department"   value={selected.department} />
              {selected.interviewScheduledAt && (
                <DetailRow
                  label="Interview scheduled"
                  value={new Date(selected.interviewScheduledAt).toLocaleString()}
                />
              )}
            </DetailSection>

            <DetailSection title="Personal details">
              <DetailRow label="Email"         value={selected.email} />
              <DetailRow label="Phone"         value={selected.phone} />
              <DetailRow label="National ID"   value={selected.nationalId} />
              <DetailRow label="Date of birth" value={selected.dob} />
              <div className="flex items-start gap-2 py-1">
                <span className="text-xs font-semibold text-gray-500 w-36 shrink-0 pt-0.5">
                  Gender
                </span>
                {selected.gender ? (
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-white text-black border border-gray-300">
                    {selected.gender.charAt(0).toUpperCase() +
                      selected.gender.slice(1).toLowerCase()}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 italic">—</span>
                )}
              </div>
              <DetailRow label="Address" value={selected.address} />
            </DetailSection>

            <DetailSection title="Education & experience">
              <DetailRow label="Education"         value={selected.education} />
              <DetailRow label="Institution"       value={selected.institution} />
              <DetailRow label="Field of study"    value={selected.fieldOfStudy} />
              <DetailRow label="Previous employer" value={selected.previousEmployer} />
              <DetailRow label="Skills"            value={selected.skills} />
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

            <DetailSection title="Documents & uploads">
              <DocumentGallery docs={buildDocList(selected)} />
            </DetailSection>
          </>
        )}
      </ViewDrawer>
    </div>
  );
}