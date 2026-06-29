'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, GraduationCap, FileText, ExternalLink, Download, X } from 'lucide-react';
import ExportPanel from '@/components/admin/ExportPanel';
import ViewDrawer from '@/components/admin/ViewDrawer';
import StatusBadge from '@/components/admin/StatusBadge';
import InterviewStatusControl from '@/components/admin/InterviewStatusControl';
import ApplicationBulkTools from '@/components/admin/ApplicationBulkTools';
import FloatingActionBar from '@/components/admin/FloatingActionBar';
import { DetailSection, DetailRow, DetailMessage } from '@/components/admin/DetailSection';
import { Trash2 } from 'lucide-react';
import type { SchoolAdmissionDocuments } from '@/lib/school-admission';

type SchoolApplication = {
  id: string;
  trackingId: string;
  firstName: string;
  surname: string;
  gradeApplying: string;
  applicantType: string | null;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  status: string;
  interviewScheduledAt: string | null;
  source: string;
  createdAt: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  birthCertNumber: string;
  learnerPreviousSchool: string | null;
  parentRelationship: string;
  parentNationalId: string | null;
  parentAltPhone: string | null;
  parentOccupation: string | null;
  homeAddress: string;
  city: string;
  province: string;
  suburb: string;
  postalAddress: string | null;
  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyAltPhone: string | null;
  medicalConditions: string | null;
  allergies: string | null;
  disabilities: string | null;
  medications: string | null;
  doctorInfo: string | null;
  currentSchool: string | null;
  lastGradeCompleted: string;
  languagesSpoken: string | null;
  talentsInterests: string | null;
  documents: SchoolAdmissionDocuments | null;
  requiresTransport: string | null;
  pickupArea: string | null;
  parentSignature: string;
};

type EnrolmentResult = {
  created: boolean;
  studentNumber: string;
  tempPassword: string;
};

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'interview', label: 'Interview' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'rejected', label: 'Rejected' },
];

const documentLabels: Record<keyof SchoolAdmissionDocuments, string> = {
  studentPhoto: 'Student Photo',
  birthCertificate: 'Birth Certificate',
  previousReport: 'Previous School Report',
  passportPhoto: 'Passport Photo',
  parentId: 'Parent / Guardian ID',
  proofOfResidence: 'Proof of Residence',
  transferLetter: 'Transfer Letter',
  recentResults: 'Recent Results',
};

const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);

// ─── Acceptance Letter Generator ─────────────────────────────────────────────

function generateAcceptanceLetter(
  app: SchoolApplication,
  studentNumber: string,
  tempPassword: string
): string {
  const today = new Date().toLocaleDateString('en-ZW', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const academicYear = new Date().getFullYear() + 1;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Acceptance Letter – ${app.firstName} ${app.surname}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; background: #fff; color: #1a1a1a; }
  .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 20mm 20mm 16mm 20mm; position: relative; }

  /* Header */
  .header { display: flex; align-items: center; gap: 20px; padding-bottom: 16px; border-bottom: 3px solid #1a4d2e; margin-bottom: 20px; }
  .school-crest { width: 72px; height: 72px; border-radius: 50%; background: #1a4d2e; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 28px; font-weight: 900; letter-spacing: -1px; flex-shrink: 0; }
  .school-name h1 { font-size: 20px; color: #1a4d2e; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }
  .school-name p { font-size: 11px; color: #555; margin-top: 2px; }

  /* Reference strip */
  .ref-strip { display: flex; justify-content: space-between; font-size: 11px; color: #555; margin-bottom: 28px; }

  /* Salutation */
  .letter-body { font-size: 13px; line-height: 1.8; }
  .letter-body h2 { font-size: 15px; text-align: center; margin: 14px 0 18px; color: #1a4d2e; font-variant: small-caps; letter-spacing: 1.5px; }

  /* Info box */
  .info-box { background: #f0f7f3; border: 1.5px solid #1a4d2e; border-radius: 8px; padding: 18px 22px; margin: 20px 0; }
  .info-box table { width: 100%; border-collapse: collapse; }
  .info-box td { padding: 5px 8px; font-size: 12.5px; }
  .info-box td:first-child { font-weight: 700; color: #1a4d2e; width: 46%; }
  .info-box .highlight { background: #fff3cd; border: 1.5px solid #e6b800; border-radius: 6px; padding: 10px 14px; margin-top: 12px; }
  .info-box .highlight td:first-child { color: #7a4f00; }
  .info-box .highlight-note { font-size: 11px; color: #7a4f00; margin-top: 6px; font-style: italic; }

  /* Footer */
  .sign-block { margin-top: 36px; }
  .sign-line { border-bottom: 1px solid #999; width: 200px; margin-top: 40px; margin-bottom: 4px; }
  .footer-strip { position: absolute; bottom: 14mm; left: 20mm; right: 20mm; border-top: 2px solid #1a4d2e; padding-top: 8px; display: flex; justify-content: space-between; font-size: 10px; color: #555; }

  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .page { margin: 0; padding: 16mm 16mm 14mm 16mm; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- School header -->
  <div class="header">
    <div class="school-crest">MG</div>
    <div class="school-name">
      <h1>Mzinyathi Gardens Primary School</h1>
      <p>Excellence · Integrity · Community | Mzinyathi Gardens, Harare, Zimbabwe</p>
      <p>Tel: +263 — &nbsp;|&nbsp; Email: admissions@mgps.ac.zw &nbsp;|&nbsp; www.mgps.ac.zw</p>
    </div>
  </div>

  <!-- Reference and date -->
  <div class="ref-strip">
    <span><strong>Ref:</strong> ${app.trackingId}</span>
    <span><strong>Date:</strong> ${today}</span>
  </div>

  <!-- Addressee -->
  <div class="letter-body">
    <p>Dear <strong>${app.parentName}</strong>,</p>

    <h2>★ &nbsp;Letter of Acceptance&nbsp; ★</h2>

    <p>
      On behalf of the staff, management, and the entire MGPS community, we are delighted to inform
      you that <strong>${app.firstName} ${app.surname}</strong> has been <strong>officially accepted</strong>
      into Mzinyathi Gardens Primary School for the <strong>${academicYear} Academic Year</strong>.
    </p>

    <p style="margin-top:12px;">
      After careful review of the application, we are confident that ${app.firstName} will thrive
      in our nurturing and academically stimulating environment.
    </p>

    <!-- Enrolment details box -->
    <div class="info-box">
      <table>
        <tr><td>Student Name</td><td>${app.firstName} ${app.surname}</td></tr>
        <tr><td>Grade Enrolled</td><td>${app.gradeApplying}</td></tr>
        <tr><td>Date of Birth</td><td>${app.dateOfBirth}</td></tr>
        <tr><td>Student Number</td><td><strong style="font-size:14px;color:#1a4d2e;">${studentNumber}</strong></td></tr>
        <tr><td>Academic Year</td><td>${academicYear}</td></tr>
      </table>

      <!-- Highlighted portal credentials -->
      <div class="highlight">
        <table>
          <tr><td>🔑 &nbsp;Portal Login (Student No.)</td><td><strong>${studentNumber}</strong></td></tr>
          <tr><td>🔒 &nbsp;Temporary Password</td><td><strong style="letter-spacing:2px;">${tempPassword}</strong></td></tr>
        </table>
        <p class="highlight-note">
          ⚠ &nbsp;This password is temporary. ${app.firstName} must log in to the student portal at
          <strong>portal.mgps.ac.zw</strong> and change it immediately upon first login.
        </p>
      </div>
    </div>

    <p>
      <strong>Important next steps:</strong>
    </p>
    <ol style="margin: 8px 0 12px 20px; font-size: 13px; line-height: 2;">
      <li>Report to the school administration office with this letter and original documents.</li>
      <li>Complete payment of the registration and tuition fees at the school bursar.</li>
      <li>Log in to the student portal using the credentials above and change your password.</li>
      <li>Collect the school uniform and stationery list from reception.</li>
    </ol>

    <p>
      Should you have any questions or require further assistance, please do not hesitate to
      contact our admissions office at <strong>admissions@mgps.ac.zw</strong> or visit us
      during office hours (Monday–Friday, 07:30–16:00).
    </p>

    <p style="margin-top:16px;">
      We look forward to welcoming <strong>${app.firstName}</strong> to the MGPS family.
      Together, we will nurture the leaders of tomorrow.
    </p>

    <!-- Signature block -->
    <div class="sign-block">
      <p>Yours sincerely,</p>
      <div class="sign-line"></div>
      <p><strong>The Headmaster / Headmistress</strong></p>
      <p style="font-size:11px; color:#555;">Mzinyathi Gardens Primary School</p>
      <p style="font-size:11px; color:#555;">Official Stamp</p>
    </div>
  </div>

  <!-- Page footer -->
  <div class="footer-strip">
    <span>Mzinyathi Gardens Primary School · Harare, Zimbabwe</span>
    <span>Ref: ${app.trackingId} · Student No: ${studentNumber}</span>
    <span>Confidential – Addressee Only</span>
  </div>

</div>
</body>
</html>`;
}

// ─── Acceptance Letter Modal ──────────────────────────────────────────────────

type LetterModalProps = {
  app: SchoolApplication;
  studentNumber: string;
  tempPassword: string;
  onClose: () => void;
};

function AcceptanceLetterModal({ app, studentNumber, tempPassword, onClose }: LetterModalProps) {
  const html = generateAcceptanceLetter(app, studentNumber, tempPassword);

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Acceptance_Letter_${app.firstName}_${app.surname}_${studentNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
    };
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white shrink-0">
        <span className="font-semibold text-sm">
          Acceptance Letter — {app.firstName} {app.surname}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
          >
            🖨 Print
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition"
          >
            <Download size={13} /> Download
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition">
            <X size={18} />
          </button>
        </div>
      </div>
      {/* Preview */}
      <div className="flex-1 overflow-hidden bg-gray-200">
        <iframe
          srcDoc={html}
          className="w-full h-full bg-white"
          title="Acceptance Letter Preview"
        />
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminSchoolApplicationsPage() {
  const [applications, setApplications] = useState<SchoolApplication[]>([]);
  const [selected, setSelected] = useState<SchoolApplication | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [letterData, setLetterData] = useState<{
    app: SchoolApplication;
    studentNumber: string;
    tempPassword: string;
  } | null>(null);

  const load = () => {
    fetch('/api/admin/school-applications')
      .then((r) => r.json())
      .then((d) => setApplications(d.applications || []));
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string, interviewScheduledAt: string | null) => {
    const res = await fetch('/api/admin/school-applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, interviewScheduledAt }),
    });
    if (res.ok) {
      toast.success('Status updated');
      load();
      if (selected?.id === id) {
        setSelected({ ...selected, status, interviewScheduledAt });
      }
    } else {
      const data = await res.json();
      toast.error(data.error || 'Update failed');
    }
  };

  const enrolStudent = async (app: SchoolApplication) => {
    if (!confirm(`Enrol ${app.firstName} ${app.surname}? This creates a student number and portal accounts.`)) return;
    const res = await fetch('/api/admin/school-applications/enrol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: app.id }),
    });
    const data: EnrolmentResult & { error?: string } = await res.json();
    if (res.ok) {
      toast.success(
        data.created
          ? `Enrolled as ${data.studentNumber}. Temp password: ${data.tempPassword}`
          : `Already enrolled: ${data.studentNumber}`,
        { duration: 8000 }
      );
      load();
      // ── Open the acceptance letter preview immediately ──
      setLetterData({
        app,
        studentNumber: data.studentNumber,
        tempPassword: data.tempPassword,
      });
    } else {
      toast.error(data.error || 'Enrolment failed');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === applications.length ? [] : applications.map((a) => a.id));
  };

  const docs = selected?.documents
    ? (Object.entries(selected.documents) as [keyof SchoolAdmissionDocuments, string][]).filter(([, url]) => url)
    : [];

  const bulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Delete ${selectedIds.length} application(s)?`)) return;
    const res = await fetch('/api/admin/school-applications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(`Deleted ${data.deleted} application(s)`);
      setSelectedIds([]);
      load();
    } else toast.error(data.error || 'Delete failed');
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold">School Admissions</h1>
        <p className="text-gray-600 text-sm">Student applications for the 2027 intake</p>
      </div>

      <ExportPanel endpoint="/api/admin/school-applications" filename="school-applications.xlsx" />

      <ApplicationBulkTools
        endpoint="/api/admin/school-applications"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onDeleted={load}
        totalCount={applications.length}
        hideDeleteSelected
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={applications.length > 0 && selectedIds.length === applications.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Learner</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Grade</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Parent</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tracking ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  No school applications yet
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="border-t hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(app.id)}
                      onChange={() => toggleSelect(app.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {app.firstName} {app.surname}
                  </td>
                  <td className="px-4 py-3">{app.gradeApplying}</td>
                  <td className="px-4 py-3 text-gray-600">{app.parentName}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <ViewDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.firstName} ${selected.surname}` : ''}
        subtitle={selected?.trackingId}
        badge={selected ? <StatusBadge status={selected.status} /> : undefined}
        headerIcon={<GraduationCap size={22} className="text-white" />}
        width="xl"
        footer={
          selected && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => enrolStudent(selected)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
              >
                Enrol student
              </button>
              {selected.parentEmail && (
                <a
                  href={`mailto:${selected.parentEmail}`}
                  className="bg-[#4169E1] text-white px-4 py-2 rounded-lg text-sm font-medium inline-block"
                >
                  Email parent
                </a>
              )}
            </div>
          )
        }
      >
        {selected && (
          <>
            <DetailSection title="Learner">
              <DetailRow label="Grade applying" value={selected.gradeApplying} />
              <DetailRow label="Applicant type" value={selected.applicantType} />
              <DetailRow label="Date of birth" value={selected.dateOfBirth} />
              <DetailRow label="Gender" value={selected.gender} />
              <DetailRow label="Nationality" value={selected.nationality} />
              <DetailRow label="Birth cert #" value={selected.birthCertNumber} mono />
              <DetailRow label="Current school" value={selected.currentSchool} />
              <DetailRow label="Previous school" value={selected.learnerPreviousSchool} />
              <DetailRow label="Last grade" value={selected.lastGradeCompleted} />
              <DetailRow label="Languages" value={selected.languagesSpoken} />
              <DetailRow label="Talents" value={selected.talentsInterests} />
            </DetailSection>

            <DetailSection title="Parent / guardian">
              <DetailRow label="Name" value={`${selected.parentName} (${selected.parentRelationship})`} />
              <DetailRow label="Phone" value={selected.parentPhone} />
              <DetailRow label="Alt phone" value={selected.parentAltPhone} />
              <DetailRow label="Email" value={selected.parentEmail} />
              <DetailRow label="National ID" value={selected.parentNationalId} />
              <DetailRow label="Occupation" value={selected.parentOccupation} />
              <DetailRow label="Address" value={`${selected.homeAddress}, ${selected.suburb}, ${selected.city}, ${selected.province}`} />
              <DetailRow label="Postal" value={selected.postalAddress} />
            </DetailSection>

            <DetailSection title="Emergency contact">
              <DetailRow label="Name" value={`${selected.emergencyName} (${selected.emergencyRelationship})`} />
              <DetailRow label="Phone" value={selected.emergencyPhone} />
              <DetailRow label="Alt phone" value={selected.emergencyAltPhone} />
            </DetailSection>

            {(selected.medicalConditions || selected.allergies || selected.disabilities || selected.medications) && (
              <DetailSection title="Medical">
                <DetailRow label="Conditions" value={selected.medicalConditions} />
                <DetailRow label="Allergies" value={selected.allergies} />
                <DetailRow label="Special needs" value={selected.disabilities} />
                <DetailRow label="Medication" value={selected.medications} />
                <DetailRow label="Doctor" value={selected.doctorInfo} />
              </DetailSection>
            )}

            <DetailSection title="Transport">
              <DetailRow label="Requires transport" value={selected.requiresTransport} />
              <DetailRow label="Pickup area" value={selected.pickupArea} />
            </DetailSection>

            <DetailSection title="Application">
              <DetailRow label="Source" value={selected.source} />
              <DetailRow label="Submitted" value={new Date(selected.createdAt).toLocaleString()} />
              {selected.interviewScheduledAt && (
                <DetailRow
                  label="Interview scheduled"
                  value={new Date(selected.interviewScheduledAt).toLocaleString()}
                />
              )}
              <DetailRow label="Signature" value={selected.parentSignature} />
            </DetailSection>

            {docs.length > 0 && (
              <DetailSection title="Documents">
                <div className="grid sm:grid-cols-2 gap-3">
                  {docs.map(([key, url]) => (
                    <div key={key} className="border rounded-xl overflow-hidden bg-white">
                      {isImageUrl(url) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt={documentLabels[key]} className="w-full h-32 object-cover" />
                      ) : (
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                      )}
                      <div className="p-3 flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-gray-700">{documentLabels[key]}</span>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4169E1] text-xs flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> Open
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}
          </>
        )}
      </ViewDrawer>

      <FloatingActionBar
        selectedCount={selectedIds.length}
        itemLabel="application"
        onClearSelection={() => setSelectedIds([])}
        actions={[
          {
            id: 'delete',
            label: 'Delete Selected',
            icon: <Trash2 size={14} />,
            onClick: bulkDelete,
            variant: 'danger',
          },
        ]}
      />

      {/* ── Acceptance Letter Modal ── */}
      {letterData && (
        <AcceptanceLetterModal
          app={letterData.app}
          studentNumber={letterData.studentNumber}
          tempPassword={letterData.tempPassword}
          onClose={() => setLetterData(null)}
        />
      )}
    </div>
  );
}